"""
Unit & Integration Tests for Universal Mandi Registry & Real-Time Pricing Architecture
(MANDI_REGISTRY_SPEC.md)
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import pytest
from datetime import date, timedelta
from services.market_registry.db import init_registry_tables, get_db_connection, haversine_distance_km
from services.market_registry.seeder import seed_universal_registry
from services.market_registry.outlier_gate import sanitize_and_validate_price, get_timestamp_honesty_badge
from services.market_registry.price_engine import resolve_mandi_price, is_market_open_on_date
from services.market_registry.arbitrage import calculate_universal_arbitrage
from services.market_registry.models import UniversalArbitrageRequest
from services.market_registry.ingestion import get_canonical_mandi_id

@pytest.fixture(scope="module", autouse=True)
def setup_database():
    """Initializes and seeds the Universal Mandi Registry before running tests."""
    seed_universal_registry()

def test_haversine_distance():
    """Tests great-circle distance accuracy between Ambejogai and Parli (~23 km)."""
    dist = haversine_distance_km(18.7300, 76.3800, 18.8480, 76.5350)
    assert 20.0 <= dist <= 26.0

def test_mandi_source_mapping_crosswalk():
    """Tests that raw API strings from Agmarknet, MSAMB, and e-NAM resolve to canonical mandi_id."""
    assert get_canonical_mandi_id("AGMARKNET", "Lasalgaon(Niphad)") == "MH_NASHIK_LASALGAON_MAIN"
    assert get_canonical_mandi_id("AGMARKNET", "Latur") == "MH_LATUR_MAIN"
    assert get_canonical_mandi_id("MSAMB", "अंबाजोगाई") == "MH_BEED_AMBEJOGAI_MAIN"
    assert get_canonical_mandi_id("MSAMB", "मुरुड") == "MH_LATUR_MURUD_SUB"
    assert get_canonical_mandi_id("ENAM", "MH_ENAM_014") == "MH_LATUR_MAIN"

def test_outlier_gate_unit_correction():
    """Tests that the Outlier Gate normalizes per-kg rates and extra zero typos."""
    # 1. Per-kg typo: clerk typed 46.5 instead of 4650
    valid, modal, min_p, max_p, reason = sanitize_and_validate_price("SOYBEAN", 46.5, 43.0, 48.0)
    assert valid is True
    assert modal == 4650.0
    assert min_p == 4300.0

    # 2. Extra zero typo: clerk typed 46800 instead of 4680
    valid, modal, min_p, max_p, reason = sanitize_and_validate_price("SOYBEAN", 46800.0)
    assert valid is True
    assert modal == 4680.0

    # 3. Absurd outlier: ₹15,000 for Soybean (benchmark is ~4,650)
    valid, modal, min_p, max_p, reason = sanitize_and_validate_price("SOYBEAN", 15000.0)
    assert valid is False
    assert "Outlier rejected" in reason

def test_timestamp_honesty_badge():
    """Tests that freshness badge correctly differentiates Today vs Last Auction."""
    today_str = date.today().strftime("%Y-%m-%d")
    yesterday_str = (date.today() - timedelta(days=1)).strftime("%Y-%m-%d")
    old_str = (date.today() - timedelta(days=5)).strftime("%Y-%m-%d")

    badge_today = get_timestamp_honesty_badge(today_str)
    assert badge_today["badge_type"] == "TODAYS_AUCTION"
    assert badge_today["badge_icon"] == "🟢"
    assert badge_today["is_fresh"] is True

    badge_yesterday = get_timestamp_honesty_badge(yesterday_str)
    assert badge_yesterday["badge_type"] == "LAST_AUCTION"
    assert badge_yesterday["badge_icon"] == "🟡"
    assert badge_yesterday["days_ago"] == 1

    badge_old = get_timestamp_honesty_badge(old_str)
    assert badge_old["badge_type"] == "STALE_AUCTION"
    assert badge_old["badge_icon"] == "🔴"

def test_3_layer_price_resolution():
    """Tests 3-Layer price resolution across Principal APMC, Sub-Yard, and Weekly Haat."""
    # Layer 1: Direct Price from Latur Main
    latur_mandi = {
        "mandi_id": "MH_LATUR_MAIN",
        "mandi_tier": "PRINCIPAL_APMC",
        "parent_mandi_id": None,
        "market_days": "MON,TUE,WED,THU,FRI,SAT"
    }
    p1 = resolve_mandi_price(latur_mandi, "SOYBEAN")
    assert p1["resolution_layer"] == 1
    assert p1["source"] == "AGMARKNET"
    assert p1["confidence_score"] == 1.0
    assert p1["modal_price"] >= 4400.0

    # Layer 2: Parent Derivative for Murud Sub-Yard (parent = MH_LATUR_MAIN)
    murud_sub = {
        "mandi_id": "MH_LATUR_MURUD_SUB",
        "mandi_tier": "SUB_YARD",
        "parent_mandi_id": "MH_LATUR_MAIN",
        "market_days": "MON,TUE,WED,THU,FRI"
    }
    p2 = resolve_mandi_price(murud_sub, "SOYBEAN")
    assert p2["resolution_layer"] == 2
    assert p2["source"] == "DERIVED_PARENT_APMC"
    assert p2["confidence_score"] == 0.90
    # Parity should be ~98% of parent price
    assert abs(p2["modal_price"] - round(p1["modal_price"] * 0.98, 2)) <= 5.0

    # Layer 3: Haat Benchmark for Ghatnandur Weekly Haat
    haat = {
        "mandi_id": "MH_BEED_GHATNANDUR_HAAT",
        "mandi_tier": "GRAM_HAAT",
        "parent_mandi_id": "MH_BEED_AMBEJOGAI_MAIN",
        "latitude": 18.6750,
        "longitude": 76.3200,
        "market_days": "MON,FRI"
    }
    p3 = resolve_mandi_price(haat, "SOYBEAN")
    assert p3["resolution_layer"] == 3
    assert "DERIVED_HAAT_BENCHMARK" in p3["source"]
    assert p3["confidence_score"] == 0.85

def test_universal_net_arbitrage_ranking():
    """
    Tests that closer Sub-Yards / Haats can outperform farther Principal APMCs
    in net in-hand profit due to fuel and zero-cess logistics savings.
    """
    # Farmer coordinates near Ambejogai / Somanwadi (18.7120, 76.3450)
    req = UniversalArbitrageRequest(
        latitude=18.7120,
        longitude=76.3450,
        commodity_id="SOYBEAN",
        weight_quintals=15.0,
        vehicle_type="tata_ace",
        radius_km=70.0,
        include_haats=True
    )
    res = calculate_universal_arbitrage(req)
    assert res.status == "success"
    assert res.total_markets_evaluated >= 3
    assert res.best_market is not None

    # Ranking must be strictly descending by net_earnings
    earnings = [m.net_earnings for m in res.ranking]
    assert earnings == sorted(earnings, reverse=True)

    # First market must have HIGHEST_NET_PROFIT badge
    assert res.ranking[0].recommendation_badge == "HIGHEST_NET_PROFIT"
    assert res.ranking[0].effective_net_rate > 0

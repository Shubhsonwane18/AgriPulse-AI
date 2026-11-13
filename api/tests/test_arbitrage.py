"""
Unit Tests for Net Mandi Arbitrage Engine (AGENTS.md Section 4.1 & Milestone 1)
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import pytest
from services.market_arbitrage.calculator import rank_mandis_by_net_profit, MandiCandidate

def test_farther_mandi_with_higher_gross_drops_in_rank():
    """
    Core Invariant: A mandi offering ₹2,400/q located 90 km away MUST rank BELOW
    a local mandi offering ₹2,320/q located 10 km away for a 10-quintal load
    because round-trip diesel outweighs the ₹80/q price premium.
    """
    candidates = [
        MandiCandidate(id="mandi-far", name="Distant APMC", distance_km=90.0, modal_price_per_qtl=2400.0),
        MandiCandidate(id="mandi-near", name="Hyperlocal APMC", distance_km=10.0, modal_price_per_qtl=2320.0),
    ]

    ranked = rank_mandis_by_net_profit(
        weight_quintals=10.0,
        candidates=candidates,
        vehicle_type="tata_ace",       # 11 km/L
        diesel_price_per_l=92.5,
        loading_fee_per_qtl=25.0,
        apmc_cess_pct=1.05
    )

    # Local mandi must be #1
    assert ranked[0]["mandi_id"] == "mandi-near", "Hyperlocal mandi must deliver higher net earnings"
    assert ranked[0]["net_earnings"] > ranked[1]["net_earnings"]
    assert ranked[0]["rank"] == 1
    assert ranked[0]["recommendation_badge"] == "HIGHEST_NET_PROFIT"

def test_large_volume_makes_distant_mandi_viable():
    """
    When farmer hauls 50 quintals in a heavy LCV (Pickup 407), the ₹80/q price spread
    (₹4,000 extra) overcomes the fixed fuel overhead, making distant mandi #1.
    """
    candidates = [
        MandiCandidate(id="mandi-far", name="Distant APMC", distance_km=90.0, modal_price_per_qtl=2400.0),
        MandiCandidate(id="mandi-near", name="Hyperlocal APMC", distance_km=10.0, modal_price_per_qtl=2320.0),
    ]

    ranked = rank_mandis_by_net_profit(
        weight_quintals=50.0,
        candidates=candidates,
        vehicle_type="pickup_407",     # 8.5 km/L
        diesel_price_per_l=92.5,
        loading_fee_per_qtl=25.0,
        apmc_cess_pct=1.05
    )

    assert ranked[0]["mandi_id"] == "mandi-far", "High volume should absorb fuel cost and unlock price spread"

if __name__ == "__main__":
    test_farther_mandi_with_higher_gross_drops_in_rank()
    test_large_volume_makes_distant_mandi_viable()
    print("✅ All Market Arbitrage unit tests passed!")

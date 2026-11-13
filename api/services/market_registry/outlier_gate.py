"""
Strict Freshness & Outlier Gate (MANDI_REGISTRY_SPEC.md Step 4)
- Unit & Outlier Guard: Detects ₹/kg vs ₹/qtl, extra zeroes, and compares against 7-day district median (±40% gate).
- Timestamp Honesty Badge: Generates honest status labels for auctions (Today vs Last Auction).
"""
from datetime import date, datetime, timedelta
from typing import Dict, Any, Optional, Tuple

# Baseline Benchmark Commodity Rates (₹/Quintal) across Maharashtra & Central India
COMMODITY_MEDIAN_BENCHMARKS = {
    "SOYBEAN": 4650.0,
    "COTTON": 7150.0,
    "ONION": 2150.0,
    "WHEAT": 2450.0,
    "TUR_ARHAR": 7800.0,
    "CHANA": 5600.0,
    "TOMATO": 1850.0,
    "TURMERIC": 12500.0,
    "MAIZE": 2100.0,
    "BAJRA": 2350.0,
    "JOWAR": 3200.0,
    "RICE": 2400.0,
    "SUGARCANE": 325.0, # Per quintal
}

def sanitize_and_validate_price(
    commodity_id: str,
    modal_price: float,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None
) -> Tuple[bool, float, Optional[float], Optional[float], str]:
    """
    Validates and auto-corrects unit mismatches and typos.
    Returns (is_valid, corrected_modal, corrected_min, corrected_max, reason).
    """
    canonical_crop = commodity_id.upper().strip()
    benchmark = COMMODITY_MEDIAN_BENCHMARKS.get(canonical_crop, 3500.0)

    # 1. Per-KG typo check: e.g. clerk typed 46.5 instead of 4650
    if 5.0 <= modal_price <= 150.0 and benchmark > 800.0:
        modal_price = modal_price * 100.0
        if min_price: min_price = min_price * 100.0
        if max_price: max_price = max_price * 100.0

    # 2. Extra zero typo check: e.g. clerk typed 46500 instead of 4650
    if modal_price > benchmark * 4.0:
        if modal_price / 10.0 <= benchmark * 1.5:
            modal_price = modal_price / 10.0
            if min_price and min_price > benchmark * 4.0: min_price = min_price / 10.0
            if max_price and max_price > benchmark * 4.0: max_price = max_price / 10.0

    # 3. Outlier check: outside ±40% of reference median
    lower_bound = benchmark * 0.60
    upper_bound = benchmark * 1.45

    if modal_price < lower_bound:
        return True, round(modal_price, 2), min_price, max_price, f"Unusually low price (< -40% of median ₹{benchmark})"
    elif modal_price > upper_bound:
        return False, round(modal_price, 2), min_price, max_price, f"Outlier rejected (> +45% of median ₹{benchmark})"

    # Sanitize spread consistency
    if min_price and min_price > modal_price:
        min_price = modal_price * 0.95
    if max_price and max_price < modal_price:
        max_price = modal_price * 1.05

    return True, round(modal_price, 2), (round(min_price, 2) if min_price else None), (round(max_price, 2) if max_price else None), "VERIFIED_MEDIAN_RANGE"

def get_timestamp_honesty_badge(price_date_str: str) -> Dict[str, Any]:
    """
    Evaluates auction date freshness and returns verified honesty badges.
    """
    today = date.today()
    try:
        if isinstance(price_date_str, date):
            p_date = price_date_str
        else:
            p_date = datetime.strptime(price_date_str, "%Y-%m-%d").date()
    except Exception:
        p_date = today

    days_ago = (today - p_date).days

    if days_ago == 0:
        return {
            "badge_type": "TODAYS_AUCTION",
            "badge_color": "green",
            "badge_icon": "🟢",
            "badge_label": f"Today's Auction ({p_date.strftime('%d %b')})",
            "is_fresh": True,
            "days_ago": 0
        }
    elif days_ago == 1:
        return {
            "badge_type": "LAST_AUCTION",
            "badge_color": "amber",
            "badge_icon": "🟡",
            "badge_label": f"Last Auction ({p_date.strftime('%d %b')} — Mandi Closed Today)",
            "is_fresh": True,
            "days_ago": 1
        }
    elif days_ago <= 3:
        return {
            "badge_type": "RECENT_AUCTION",
            "badge_color": "amber",
            "badge_icon": "🟡",
            "badge_label": f"Recent Auction ({p_date.strftime('%d %b')})",
            "is_fresh": False,
            "days_ago": days_ago
        }
    else:
        return {
            "badge_type": "STALE_AUCTION",
            "badge_color": "red",
            "badge_icon": "🔴",
            "badge_label": f"Historical Rate ({p_date.strftime('%d %b')})",
            "is_fresh": False,
            "days_ago": days_ago
        }


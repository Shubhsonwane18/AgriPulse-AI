"""
3-Layer Price Resolution Engine (MANDI_REGISTRY_SPEC.md Section 4)
- Layer 1: Direct on-day electronic trade rate (Agmarknet, e-NAM, MSAMB).
- Layer 2: Parent APMC Derivative for Sub-Yards (local logistics parity).
- Layer 3: Regional Benchmark Derivative for Weekly Haats & FPO Centers (with active auction days check).
"""
from datetime import date, datetime, timedelta
from typing import Dict, Any, Optional, List
from .db import get_db_connection, haversine_distance_km
from .outlier_gate import get_timestamp_honesty_badge, COMMODITY_MEDIAN_BENCHMARKS

def is_market_open_on_date(market_days_str: str, check_date: Optional[date] = None) -> bool:
    """Checks if the mandi or weekly haat conducts active auctions on the specified date."""
    if not market_days_str:
        return True
    
    target = check_date or date.today()
    day_abbr = target.strftime("%a").upper()[:3] # 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'
    allowed_days = [d.strip().upper() for d in market_days_str.split(",")]
    return day_abbr in allowed_days

def resolve_mandi_price(
    mandi: Dict[str, Any],
    commodity_id: str,
    target_date: Optional[date] = None,
    variety: str = "FAQ",
    grade: str = "FAQ"
) -> Dict[str, Any]:
    """
    Executes the 3-Layer progressive price resolution waterfall.
    """
    today = target_date or date.today()
    today_str = today.strftime("%Y-%m-%d")
    canonical_crop = commodity_id.upper().strip()
    mandi_id = mandi["mandi_id"]
    tier = mandi.get("mandi_tier", "PRINCIPAL_APMC")
    parent_id = mandi.get("parent_mandi_id")
    market_days = mandi.get("market_days", "MON,TUE,WED,THU,FRI,SAT")
    is_open = is_market_open_on_date(market_days, today)

    with get_db_connection() as conn:
        # -----------------------------------------------------------------
        # LAYER 1: DIRECT ELECTRONIC PRICE (Agmarknet / MSAMB / e-NAM)
        # -----------------------------------------------------------------
        row = conn.execute("""
            SELECT modal_price_per_qtl, min_price_per_qtl, max_price_per_qtl,
                   variety, grade, arrival_tonnes, price_date, source, confidence_score
            FROM daily_mandi_prices
            WHERE mandi_id = ? AND commodity_id = ?
            ORDER BY price_date DESC, (variety = ?) DESC
            LIMIT 1;
        """, (mandi_id, canonical_crop, variety)).fetchone()

        if row:
            p_date_str = row["price_date"]
            honesty = get_timestamp_honesty_badge(p_date_str)
            return {
                "mandi_id": mandi_id,
                "commodity_id": canonical_crop,
                "variety": row["variety"],
                "grade": row["grade"],
                "modal_price": round(float(row["modal_price_per_qtl"]), 2),
                "min_price": round(float(row["min_price_per_qtl"]), 2) if row["min_price_per_qtl"] else None,
                "max_price": round(float(row["max_price_per_qtl"]), 2) if row["max_price_per_qtl"] else None,
                "arrival_tonnes": float(row["arrival_tonnes"]) if row["arrival_tonnes"] else None,
                "price_date": p_date_str,
                "source": row["source"],
                "confidence_score": float(row["confidence_score"] or 1.0),
                "resolution_layer": 1,
                "layer_name": "Direct Electronic Market Feed",
                "is_open_today": is_open,
                "honesty_badge": honesty
            }

        # -----------------------------------------------------------------
        # LAYER 2: PARENT APMC DERIVATIVE (For Sub-Yards / Up-Bazaars)
        # -----------------------------------------------------------------
        if tier == "SUB_YARD" and parent_id:
            parent_row = conn.execute("""
                SELECT p.modal_price_per_qtl, p.min_price_per_qtl, p.max_price_per_qtl,
                       p.variety, p.grade, p.price_date, m.mandi_name as parent_name
                FROM daily_mandi_prices p
                JOIN unified_mandis m ON m.mandi_id = p.mandi_id
                WHERE p.mandi_id = ? AND p.commodity_id = ?
                ORDER BY p.price_date DESC
                LIMIT 1;
            """, (parent_id, canonical_crop)).fetchone()

            if parent_row:
                # Sub-yards trade at ~98.0% parity of the Principal APMC
                PARITY_RATIO = 0.980
                derived_modal = round(float(parent_row["modal_price_per_qtl"]) * PARITY_RATIO, 2)
                derived_min = round(float(parent_row["min_price_per_qtl"]) * PARITY_RATIO, 2) if parent_row["min_price_per_qtl"] else None
                derived_max = round(float(parent_row["max_price_per_qtl"]) * PARITY_RATIO, 2) if parent_row["max_price_per_qtl"] else None
                honesty = get_timestamp_honesty_badge(parent_row["price_date"])

                return {
                    "mandi_id": mandi_id,
                    "commodity_id": canonical_crop,
                    "variety": parent_row["variety"],
                    "grade": parent_row["grade"],
                    "modal_price": derived_modal,
                    "min_price": derived_min,
                    "max_price": derived_max,
                    "arrival_tonnes": None,
                    "price_date": parent_row["price_date"],
                    "source": "DERIVED_PARENT_APMC",
                    "confidence_score": 0.90,
                    "resolution_layer": 2,
                    "layer_name": f"Derived from Parent ({parent_row['parent_name']}) at 98% Parity",
                    "is_open_today": is_open,
                    "honesty_badge": honesty
                }

        # -----------------------------------------------------------------
        # LAYER 3: REGIONAL BENCHMARK DERIVATIVE (For Weekly Haats & FPOs)
        # -----------------------------------------------------------------
        # Find nearest Principal APMC that has a rate for this crop
        m_lat = float(mandi.get("latitude", 18.7))
        m_lon = float(mandi.get("longitude", 76.4))

        benchmark_candidates = conn.execute("""
            SELECT p.mandi_id, p.modal_price_per_qtl, p.min_price_per_qtl, p.max_price_per_qtl,
                   p.variety, p.grade, p.price_date, m.mandi_name, m.latitude, m.longitude
            FROM daily_mandi_prices p
            JOIN unified_mandis m ON m.mandi_id = p.mandi_id
            WHERE p.commodity_id = ? AND m.mandi_tier = 'PRINCIPAL_APMC'
            ORDER BY p.price_date DESC
            LIMIT 10;
        """, (canonical_crop,)).fetchall()

        if benchmark_candidates:
            # Pick the geographically closest Principal APMC
            closest_bench = min(
                benchmark_candidates,
                key=lambda b: haversine_distance_km(m_lat, m_lon, float(b["latitude"]), float(b["longitude"]))
            )
            base_modal = float(closest_bench["modal_price_per_qtl"])
            base_min = float(closest_bench["min_price_per_qtl"]) if closest_bench["min_price_per_qtl"] else base_modal * 0.94
            base_max = float(closest_bench["max_price_per_qtl"]) if closest_bench["max_price_per_qtl"] else base_modal * 1.06

            if tier == "GRAM_HAAT":
                # Weekly rural haats: 94.0% of benchmark (intermediary aggregation haircut)
                FACTOR = 0.940
                source_label = "DERIVED_HAAT_BENCHMARK"
                layer_desc = f"Regional Haat Benchmark (derived from {closest_bench['mandi_name']})"
                conf = 0.85
            elif tier == "FPO_CENTER":
                # FPOs eliminate middleman commission: +1.5% premium
                FACTOR = 1.015
                source_label = "DERIVED_FPO_PREMIUM"
                layer_desc = f"FPO Direct Aggregator Rate (+1.5% premium over {closest_bench['mandi_name']})"
                conf = 0.88
            else:
                FACTOR = 0.960
                source_label = "DERIVED_REGIONAL_BENCHMARK"
                layer_desc = f"District Benchmark ({closest_bench['mandi_name']})"
                conf = 0.82

            honesty = get_timestamp_honesty_badge(closest_bench["price_date"])

            return {
                "mandi_id": mandi_id,
                "commodity_id": canonical_crop,
                "variety": closest_bench["variety"],
                "grade": closest_bench["grade"],
                "modal_price": round(base_modal * FACTOR, 2),
                "min_price": round(base_min * FACTOR, 2),
                "max_price": round(base_max * FACTOR, 2),
                "arrival_tonnes": None,
                "price_date": closest_bench["price_date"],
                "source": source_label,
                "confidence_score": conf,
                "resolution_layer": 3,
                "layer_name": layer_desc,
                "is_open_today": is_open,
                "honesty_badge": honesty
            }

    # Absolute fallback to state median benchmark
    fallback_median = COMMODITY_MEDIAN_BENCHMARKS.get(canonical_crop, 3800.0)
    return {
        "mandi_id": mandi_id,
        "commodity_id": canonical_crop,
        "variety": variety,
        "grade": grade,
        "modal_price": round(fallback_median * (0.94 if tier == "GRAM_HAAT" else 1.0), 2),
        "min_price": round(fallback_median * 0.92, 2),
        "max_price": round(fallback_median * 1.06, 2),
        "arrival_tonnes": None,
        "price_date": today_str,
        "source": "STATE_MEDIAN_BENCHMARK",
        "confidence_score": 0.70,
        "resolution_layer": 3,
        "layer_name": "State Statutory Reference Rate",
        "is_open_today": is_open,
        "honesty_badge": get_timestamp_honesty_badge(today_str)
    }


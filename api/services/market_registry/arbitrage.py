"""
Universal Multi-Tier Net Arbitrage Calculation Engine (MANDI_REGISTRY_SPEC.md Section 5)
Ranks Principal APMCs, Sub-Yards, GrAM Weekly Haats, and FPOs by true in-hand profit (₹).
"""
import math
from typing import List, Dict, Any, Optional
from .db import get_db_connection, haversine_distance_km
from .price_engine import resolve_mandi_price, is_market_open_on_date
from .models import UniversalArbitrageRequest, UniversalMandiEvaluation, UniversalArbitrageResponse

# Vehicle Fuel Economy (Kilometers per Liter)
VEHICLE_EFFICIENCY_KM_PER_L = {
    "tata_ace": 11.0,        # Chhota Hathi
    "pickup_407": 8.5,       # Bolero Maxi Truck / LCV
    "tractor": 5.0,          # Farm Trolley
    "three_wheeler": 18.0,   # Cargo Auto / Piaggio Ape
}

def calculate_universal_arbitrage(payload: UniversalArbitrageRequest) -> UniversalArbitrageResponse:
    """
    Evaluates candidate markets within the farmer's radius across all tiers.
    Calculates exact in-hand net realization factoring true logistics expenses.
    """
    lat = payload.latitude
    lon = payload.longitude
    q_quintals = payload.weight_quintals
    commodity = payload.commodity_id.upper().strip()
    radius_km = payload.radius_km
    vehicle = payload.vehicle_type.lower()
    diesel = payload.diesel_price_per_l
    mileage = VEHICLE_EFFICIENCY_KM_PER_L.get(vehicle, 11.0)

    # 1. Fetch all candidate mandis from database
    with get_db_connection() as conn:
        query = "SELECT * FROM unified_mandis"
        params = []
        if not payload.include_haats:
            query += " WHERE mandi_tier != 'GRAM_HAAT'"
        all_mandis = [dict(row) for row in conn.execute(query, params).fetchall()]

    # 2. Filter by radius and resolve price
    evaluated_markets: List[Dict[str, Any]] = []

    for m in all_mandis:
        dist = haversine_distance_km(lat, lon, float(m["latitude"]), float(m["longitude"]))
        if dist > radius_km:
            continue

        # Resolve price via 3-layer engine
        price_info = resolve_mandi_price(m, commodity)
        is_open = price_info["is_open_today"]

        if payload.open_today_only and not is_open:
            continue

        modal_rate = price_info["modal_price"]
        gross_rev = q_quintals * modal_rate

        # Vehicle & transport calculation
        # Round trip fuel: 2 * dist / mileage * diesel_price
        fuel_cost = (2.0 * dist / mileage) * diesel

        # Handling fee: Local haats have cheaper village labour
        tier = m.get("mandi_tier", "PRINCIPAL_APMC")
        if tier == "GRAM_HAAT":
            handling_rate = 12.0
            tolls = 0.0
        elif tier == "FPO_CENTER":
            handling_rate = 15.0
            tolls = 0.0
        elif tier == "SUB_YARD":
            handling_rate = 20.0
            tolls = 50.0 if dist > 40.0 else 0.0
        else:
            handling_rate = 25.0
            tolls = 80.0 if dist > 35.0 else 0.0

        handling_fee = q_quintals * handling_rate

        # Mandi cess: 0% at Haats & FPO centers, lower at sub-yards
        cess_pct = float(m.get("mandi_cess_pct", 1.05))
        cess_fee = (cess_pct / 100.0) * gross_rev

        total_overhead = fuel_cost + handling_fee + cess_fee + tolls
        net_in_hand = max(0.0, gross_rev - total_overhead)
        effective_rate = net_in_hand / q_quintals if q_quintals > 0 else 0.0

        # Construct explanation
        if tier == "GRAM_HAAT":
            expl = f"स्थानिक आठवडी बाजार — शून्य मंडी सेस (0%) व ₹{round(fuel_cost)} इंधन खर्च. स्थानिक शेतमाल विक्रीसाठी सोयीचे."
        elif tier == "FPO_CENTER":
            expl = f"FPO थेट खरेदी — थेट विक्रीमुळे मध्यस्थ दलाली व बाजार फी नाही (+१.५% प्रीमियम)."
        elif tier == "SUB_YARD":
            expl = f"तालुका उपबाजार — मुख्य बाजारपेठेपेक्षा कमी गर्दी व जवळचे अंतर ({round(dist, 1)} km)."
        else:
            expl = f"मुख्य बाजार समिती — मोठी उलाढाल व थेट लिलाव (इंधन व टोल: ₹{round(fuel_cost + tolls)})."

        evaluated_markets.append({
            "mandi_id": m["mandi_id"],
            "mandi_name": m["mandi_name"],
            "mandi_name_local": m.get("mandi_name_local"),
            "mandi_tier": tier,
            "parent_mandi_name": m.get("parent_mandi_id"),
            "distance_km": round(dist, 1),
            "is_open_today": is_open,
            "market_days": m.get("market_days", "MON-SAT"),
            "quoted_gross_rate": round(modal_rate, 2),
            "price_source": price_info["source"],
            "confidence_score": price_info["confidence_score"],
            "price_resolution_layer": price_info["resolution_layer"],
            "gross_revenue": round(gross_rev, 2),
            "fuel_overhead": round(fuel_cost, 2),
            "handling_fee": round(handling_fee, 2),
            "cess_fee": round(cess_fee, 2),
            "total_logistics_overhead": round(total_overhead, 2),
            "net_earnings": round(net_in_hand, 2),
            "effective_net_rate": round(effective_rate, 2),
            "explanation": expl
        })

    # Sort strictly descending by in-hand profit
    evaluated_markets.sort(key=lambda x: x["net_earnings"], reverse=True)

    # Assign ranks and badges
    for idx, item in enumerate(evaluated_markets):
        item["rank"] = idx + 1
        if idx == 0:
            item["recommendation_badge"] = "HIGHEST_NET_PROFIT"
        elif idx == 1:
            item["recommendation_badge"] = "VIABLE_ALTERNATIVE"
        elif item["distance_km"] > 45.0 and item["total_logistics_overhead"] > 1200.0:
            item["recommendation_badge"] = "AVOID_EXCESS_OVERHEAD"
        else:
            item["recommendation_badge"] = "SECONDARY_MARKET"

    best = evaluated_markets[0] if evaluated_markets else None
    worst = evaluated_markets[-1] if evaluated_markets else None
    spread = round(best["net_earnings"] - worst["net_earnings"], 2) if best and worst else 0.0

    return UniversalArbitrageResponse(
        status="success",
        farmer_coordinates={"latitude": lat, "longitude": lon},
        commodity_id=commodity,
        weight_quintals=q_quintals,
        vehicle_type=vehicle,
        total_markets_evaluated=len(evaluated_markets),
        best_market=UniversalMandiEvaluation(**best) if best else None,
        arbitrage_spread_inr=spread,
        ranking=[UniversalMandiEvaluation(**item) for item in evaluated_markets]
    )


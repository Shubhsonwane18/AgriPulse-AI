"""
Net Mandi Arbitrage Calculation Engine (AGENTS.md Section 4.1 & 5.1)
Calculates mathematically true in-hand profits factoring round-trip fuel,
vehicle mileage, loading/unloading fees, toll charges, and APMC commission cesses.
"""
from typing import List, Dict, Any, Union
from .models import MandiCandidate, MandiEvaluation

# Vehicle Fuel Economy (Kilometers per Liter)
VEHICLE_EFFICIENCY_KM_PER_L = {
    "tata_ace": 11.0,        # Mini-truck (Chhota Hathi)
    "pickup_407": 8.5,       # Bolero Maxi Truck / LCV
    "tractor": 5.0,          # Standard 35-50 HP farm trolley
    "three_wheeler": 18.0,   # Cargo Auto / Piaggio Ape
}

def rank_mandis_by_net_profit(
    weight_quintals: float,
    candidates: List[Union[MandiCandidate, Dict[str, Any]]],
    vehicle_type: str = "tata_ace",
    diesel_price_per_l: float = 92.5,
    loading_fee_per_qtl: float = 25.0,
    apmc_cess_pct: float = 1.05,
    tolls_inr: float = 0.0
) -> List[Dict[str, Any]]:
    """
    Evaluates candidate mandis and sorts strictly by actual in-hand net realization.
    Formula:
      Gross Revenue = Q * P
      Fuel Cost = 2 * Distance * (Diesel Price / Vehicle Mileage)
      Logistics Overhead = Fuel Cost + Tolls + (Q * Loading Fee) + (Cess % * Gross Revenue)
      Net Realization = Gross Revenue - Logistics Overhead
      Effective Rate = Net Realization / Q
    """
    mileage = VEHICLE_EFFICIENCY_KM_PER_L.get(vehicle_type.lower(), 10.0)
    evaluations: List[Dict[str, Any]] = []

    for item in candidates:
        if isinstance(item, dict):
            m_id = item.get("id") or item.get("mandi_id", "unknown")
            m_name = item.get("name") or item.get("mandi_name", "Unknown Mandi")
            m_dist = float(item.get("distance_km", 10.0))
            m_price = float(item.get("modal_price_per_qtl", item.get("modal_price", 2000.0)))
        else:
            m_id = item.id
            m_name = item.name
            m_dist = float(item.distance_km)
            m_price = float(item.modal_price_per_qtl)

        gross_value = weight_quintals * m_price
        
        # Round trip fuel: 2 * distance / mileage * diesel price
        fuel_cost = (2.0 * m_dist / mileage) * diesel_price_per_l
        handling_fee = weight_quintals * loading_fee_per_qtl
        cess_fee = (apmc_cess_pct / 100.0) * gross_value
        
        total_overhead = fuel_cost + handling_fee + cess_fee + tolls_inr
        net_earnings = max(0.0, gross_value - total_overhead)
        net_rate_per_qtl = net_earnings / weight_quintals if weight_quintals > 0 else 0.0

        evaluations.append({
            "mandi_id": m_id,
            "mandi_name": m_name,
            "distance_km": round(m_dist, 1),
            "quoted_gross_rate": round(m_price, 2),
            "gross_revenue": round(gross_value, 2),
            "fuel_overhead": round(fuel_cost, 2),
            "handling_fee": round(handling_fee, 2),
            "cess_fee": round(cess_fee, 2),
            "total_logistics_overhead": round(total_overhead, 2),
            "net_earnings": round(net_earnings, 2),
            "effective_net_rate": round(net_rate_per_qtl, 2)
        })

    # Sort strictly descending by in-hand net realization
    evaluations.sort(key=lambda x: x["net_earnings"], reverse=True)

    # Assign dynamic rank and recommendations
    for idx, eval_item in enumerate(evaluations):
        eval_item["rank"] = idx + 1
        if idx == 0:
            eval_item["recommendation_badge"] = "HIGHEST_NET_PROFIT"
        elif idx == 1:
            eval_item["recommendation_badge"] = "VIABLE_ALTERNATIVE"
        else:
            eval_item["recommendation_badge"] = "AVOID_EXCESS_OVERHEAD"

    return evaluations


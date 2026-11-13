"""
Net Mandi Arbitrage Calculation Engine (AGENTS.md Section 4.1 & 5.1)
Calculates mathematically true in-hand profits factoring round-trip fuel,
vehicle mileage, loading/unloading fees, toll charges, and APMC commission cesses.
Generates compact WhatsApp/Telegram rich comparison cards.
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

def format_mandi_arbitrage_card(
    evaluations: List[Dict[str, Any]],
    commodity_name: str = "Soybean",
    weight_quintals: float = 10.0,
    language: str = "mr"
) -> str:
    """
    Renders a compact WhatsApp / Telegram comparison card with formatting.
    """
    lang = language.lower()[:2]
    if not evaluations:
        return "कोणतीही जवळची बाजार समिती उपलब्ध नाही." if lang == "mr" else "No nearby mandis found."

    best = evaluations[0]
    
    if lang == "mr":
        lines = [
            f"📊 *बाजारभाव व निव्वळ नफा तुलना ({weight_quintals} क्विंटल {commodity_name})*",
            "━━━━━━━━━━━━━━━━━━━━━━"
        ]
        for item in evaluations[:3]:
            r_icon = "🥇" if item["rank"] == 1 else "🥈" if item["rank"] == 2 else "🥉"
            lines.append(
                f"{r_icon} *{item['mandi_name']}* ({item['distance_km']} किमी)\n"
                f"   • जाहीर भाव: ₹{int(item['quoted_gross_rate'])}/क्विं\n"
                f"   • एकूण वाहतूक खर्च: ₹{int(item['total_logistics_overhead'])}\n"
                f"   👉 *हातात मिळणारा नफा: ₹{int(item['net_earnings']):,}* (दर: ₹{int(item['effective_net_rate'])}/क्विं)"
            )
        lines.append("━━━━━━━━━━━━━━━━━━━━━━")
        lines.append(f"💡 *सल्ला:* {best['mandi_name']} मध्ये विक्री केल्यास वाहतूक खर्च वजा जाता सर्वाधिक नफा मिळेल!")
        return "\n".join(lines)
    elif lang == "hi":
        lines = [
            f"📊 *मंडी भाव एवं शुद्ध मुनाफा तुलना ({weight_quintals} क्विंटल {commodity_name})*",
            "━━━━━━━━━━━━━━━━━━━━━━"
        ]
        for item in evaluations[:3]:
            r_icon = "🥇" if item["rank"] == 1 else "🥈" if item["rank"] == 2 else "🥉"
            lines.append(
                f"{r_icon} *{item['mandi_name']}* ({item['distance_km']} किमी)\n"
                f"   • मॉडल भाव: ₹{int(item['quoted_gross_rate'])}/क्विं\n"
                f"   • परिवहन खर्च: ₹{int(item['total_logistics_overhead'])}\n"
                f"   👉 *हाथ में आने वाला मुनाफा: ₹{int(item['net_earnings']):,}* (दर: ₹{int(item['effective_net_rate'])}/क्विं)"
            )
        lines.append("━━━━━━━━━━━━━━━━━━━━━━")
        lines.append(f"💡 *सलाह:* {best['mandi_name']} में उपज बेचने पर सबसे अधिक शुद्ध बचत होगी!")
        return "\n".join(lines)
    else:
        lines = [
            f"📊 *Mandi Net Realization Comparison ({weight_quintals} Qtl {commodity_name})*",
            "━━━━━━━━━━━━━━━━━━━━━━"
        ]
        for item in evaluations[:3]:
            r_icon = "🥇" if item["rank"] == 1 else "🥈" if item["rank"] == 2 else "🥉"
            lines.append(
                f"{r_icon} *{item['mandi_name']}* ({item['distance_km']} km)\n"
                f"   • Quoted Rate: ₹{int(item['quoted_gross_rate'])}/Qtl\n"
                f"   • Transport & Fees: ₹{int(item['total_logistics_overhead'])}\n"
                f"   👉 *Net In-Hand: ₹{int(item['net_earnings']):,}* (Effective: ₹{int(item['effective_net_rate'])}/Qtl)"
            )
        lines.append("━━━━━━━━━━━━━━━━━━━━━━")
        lines.append(f"💡 *Recommendation:* Sell at {best['mandi_name']} for highest true in-hand return.")
        return "\n".join(lines)

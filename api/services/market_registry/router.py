"""
FastAPI Router for Universal Mandi Registry & Real-Time Multi-Tier Pricing
(MANDI_REGISTRY_SPEC.md Section 6)
"""
from fastapi import APIRouter, HTTPException, Query, Body
from typing import Optional, List, Dict, Any
from datetime import date
from .models import UniversalArbitrageRequest, UniversalArbitrageResponse, MandiTier
from .db import get_db_connection, haversine_distance_km
from .price_engine import resolve_mandi_price, is_market_open_on_date
from .arbitrage import calculate_universal_arbitrage
from .ingestion import ingest_agmarknet_feed
from .seeder import seed_universal_registry

router = APIRouter(prefix="/api/v1/market", tags=["Universal Mandi Registry"])

@router.get("/registry")
async def get_mandi_registry(
    lat: float = Query(..., description="Latitude of farmer location"),
    lon: float = Query(..., description="Longitude of farmer location"),
    radius_km: float = Query(50.0, ge=1.0, le=300.0, description="Search radius in kilometers"),
    commodity: str = Query("SOYBEAN", description="Canonical commodity ID"),
    tier: Optional[str] = Query(None, description="Filter tier: PRINCIPAL_APMC, SUB_YARD, GRAM_HAAT, FPO_CENTER"),
    open_today_only: bool = Query(False, description="Filter only markets with active auctions today")
):
    """
    Returns all large and small agricultural markets (Principal APMCs, Sub-Yards, GrAM Haats, FPOs)
    within the specified radius, with 3-layer resolved prices, variety/grade, and honesty badges.
    """
    today = date.today()
    canonical_crop = commodity.upper().strip()

    with get_db_connection() as conn:
        query = "SELECT * FROM unified_mandis"
        params = []
        if tier and tier.upper() != "ALL":
            query += " WHERE mandi_tier = ?"
            params.append(tier.upper())

        rows = conn.execute(query, params).fetchall()

    results = []
    for r in rows:
        m = dict(r)
        dist = haversine_distance_km(lat, lon, float(m["latitude"]), float(m["longitude"]))
        if dist > radius_km:
            continue

        price_info = resolve_mandi_price(m, canonical_crop, today)
        is_open = price_info["is_open_today"]

        if open_today_only and not is_open:
            continue

        m_dict = {
            "mandi_id": m["mandi_id"],
            "mandi_name": m["mandi_name"],
            "mandi_name_local": m.get("mandi_name_local"),
            "mandi_tier": m["mandi_tier"],
            "parent_mandi_id": m.get("parent_mandi_id"),
            "state_name": m.get("state_name"),
            "district_name": m.get("district_name"),
            "subdistrict_name": m.get("subdistrict_name"),
            "village_name": m.get("village_name"),
            "latitude": float(m["latitude"]),
            "longitude": float(m["longitude"]),
            "distance_km": round(dist, 1),
            "market_days": m.get("market_days", "MON-SAT"),
            "is_open_today": is_open,
            "has_weighbridge": bool(m.get("has_weighbridge", 1)),
            "is_enam_enabled": bool(m.get("is_enam_enabled", 0)),
            "mandi_cess_pct": float(m.get("mandi_cess_pct", 1.05)),
            "pricing": {
                "commodity_id": canonical_crop,
                "variety": price_info["variety"],
                "grade": price_info["grade"],
                "modal_price": price_info["modal_price"],
                "min_price": price_info["min_price"],
                "max_price": price_info["max_price"],
                "arrival_tonnes": price_info["arrival_tonnes"],
                "price_date": price_info["price_date"],
                "source": price_info["source"],
                "confidence_score": price_info["confidence_score"],
                "resolution_layer": price_info["resolution_layer"],
                "layer_name": price_info["layer_name"],
                "honesty_badge": price_info["honesty_badge"]
            }
        }
        results.append(m_dict)

    # Sort primarily by distance
    results.sort(key=lambda x: x["distance_km"])

    return {
        "status": "success",
        "farmer_coordinates": {"latitude": lat, "longitude": lon},
        "search_radius_km": radius_km,
        "total_markets_found": len(results),
        "markets": results
    }

@router.post("/arbitrage/universal", response_model=UniversalArbitrageResponse)
async def post_universal_arbitrage(payload: UniversalArbitrageRequest):
    """
    Calculates true in-hand realization (₹) across Principal APMCs, Sub-Yards, GrAM Weekly Haats,
    and FPO collection centers, ranking markets by net profit after fuel, handling, and cess.
    """
    try:
        response = calculate_universal_arbitrage(payload)
        return response
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))

@router.post("/prices/ingest")
async def trigger_price_ingestion(
    api_key: Optional[str] = Query(None, description="Optional Data.gov.in API key"),
    state: str = Query("Maharashtra", description="Target state")
):
    """
    Triggers the multi-source ingestion pipeline with canonical crosswalk mapping & outlier guard.
    """
    try:
        report = await ingest_agmarknet_feed(api_key=api_key, state_filter=state)
        return report
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


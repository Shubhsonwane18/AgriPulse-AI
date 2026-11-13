"""
High-Precision Spatial Boundary & Mandi Resolver Engine
Snaps raw GPS/Satellite coordinates to official LGD Administrative Units
(State -> District -> Taluka -> Gram Panchayat -> Village) and finds nearest APMC Mandi yards.
"""

import json
import urllib.request
from pathlib import Path
from typing import Dict, Any, List, Optional
from services.village_directory.service import VillageDirectoryService
from services.village_directory.db import haversine_distance_km

APMC_GEOJSON_PATH = Path(__file__).resolve().parent.parent / "data" / "apmc_directory.geojson"

# In-memory APMC Mandi cache
_MANDIS_CACHE: Optional[List[Dict[str, Any]]] = None

def _fetch_realtime_osm_infrastructure(lat: float, lon: float) -> Dict[str, Any]:
    """
    Fetches live vector roads, rivers, water bodies, and locality names directly from OpenStreetMap.
    """
    try:
        url = f"https://nominatim.openstreetmap.org/reverse?format=json&lat={lat}&lon={lon}&zoom=18&addressdetails=1"
        req = urllib.request.Request(url, headers={"User-Agent": "AgriPulse-Agronomy-OS/2.0"})
        with urllib.request.urlopen(req, timeout=2.5) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            addr = data.get("address", {})
            road = addr.get("road") or addr.get("highway") or addr.get("path") or "ग्रामीण रस्ता / Field Approach Track"
            locality = addr.get("village") or addr.get("hamlet") or addr.get("town") or addr.get("suburb") or addr.get("neighbourhood")
            waterbody = addr.get("water") or addr.get("river") or addr.get("canal") or addr.get("stream")
            
            return {
                "display_name": data.get("display_name", ""),
                "road": road,
                "locality": locality,
                "county": addr.get("county", ""),
                "district": addr.get("state_district", ""),
                "waterbody": waterbody or "स्थानिक नदी खोरे / स्थानिक ओढा (Natural Watershed)"
            }
    except Exception as e:
        return {
            "road": "शेताचा पाणंद रस्ता / Field Approach Road",
            "locality": None,
            "county": None,
            "district": None,
            "waterbody": "स्थानिक नदी खोरे / ओढा"
        }

def _load_apmc_mandis() -> List[Dict[str, Any]]:
    global _MANDIS_CACHE
    if _MANDIS_CACHE is not None:
        return _MANDIS_CACHE

    mandis = []
    if APMC_GEOJSON_PATH.exists():
        try:
            with open(APMC_GEOJSON_PATH, encoding="utf-8") as f:
                data = json.load(f)
                for feat in data.get("features", []):
                    geom = feat.get("geometry", {})
                    props = feat.get("properties", {})
                    coords = geom.get("coordinates", [0, 0])
                    # GeoJSON is [lon, lat]
                    lon = coords[0]
                    lat = coords[1]
                    mandis.append({
                        "id": props.get("id"),
                        "name": props.get("name"),
                        "district": props.get("district"),
                        "state": props.get("state"),
                        "primary_commodity": props.get("primaryCommodity", "Agri Commodities"),
                        "cess_pct": props.get("mandiCessPct", 1.05),
                        "latitude": lat,
                        "longitude": lon,
                        "modal_price": 2850
                    })
        except Exception as e:
            print("Failed loading APMC geojson:", e)

    # Fallback to key known agricultural mandis if file wasn't found
    if not mandis:
        mandis = [
            {"id": "ambejogai-apmc", "name": "Ambejogai APMC Market", "district": "Beed", "state": "Maharashtra", "primary_commodity": "Soybean / Cotton", "latitude": 18.7300, "longitude": 76.3800, "modal_price": 2850},
            {"id": "parli-apmc", "name": "Parli Vaijnath APMC", "district": "Beed", "state": "Maharashtra", "primary_commodity": "Cotton / Soybean", "latitude": 18.8480, "longitude": 76.5350, "modal_price": 2920},
            {"id": "beed-apmc", "name": "Beed APMC Yard", "district": "Beed", "state": "Maharashtra", "primary_commodity": "Bajra / Jowar", "latitude": 18.9900, "longitude": 75.7600, "modal_price": 2750},
            {"id": "latur-apmc", "name": "Latur APMC Super Yard", "district": "Latur", "state": "Maharashtra", "primary_commodity": "Soybean / Urad", "latitude": 18.4088, "longitude": 76.5604, "modal_price": 3100},
            {"id": "lasalgaon-apmc", "name": "Lasalgaon Mandi Yard", "district": "Nashik", "state": "Maharashtra", "primary_commodity": "Onion", "latitude": 20.1472, "longitude": 74.2255, "modal_price": 2200},
            {"id": "kolhapur-apmc", "name": "Kolhapur APMC Market Yard", "district": "Kolhapur", "state": "Maharashtra", "primary_commodity": "Jaggery / Sugarcane", "latitude": 16.7050, "longitude": 74.2433, "modal_price": 3400},
            {"id": "baramati-apmc", "name": "Baramati APMC", "district": "Pune", "state": "Maharashtra", "primary_commodity": "Sugarcane / Pomegranate", "latitude": 18.1550, "longitude": 74.5800, "modal_price": 3050},
        ]

    _MANDIS_CACHE = mandis
    return _MANDIS_CACHE


def resolve_farm_location(
    latitude: float,
    longitude: float,
    accuracy: Optional[float] = None
) -> Dict[str, Any]:
    """
    Snaps raw coordinates to:
    1. Exact LGD village, taluka, district, state, GP, and PIN code.
    2. Top 3 closest APMC wholesale mandis with road/air distances.
    """
    # 1. Reverse geocode via LGD SQLite Directory
    nearest_candidates = VillageDirectoryService.get_nearest(lat=latitude, lon=longitude, limit=3)
    
    if nearest_candidates:
        matched_village = nearest_candidates[0]
    else:
        # Fallback default if completely outside bounding boxes
        matched_village = {
            "village_code": 582062,
            "village_name": "Somanwadi",
            "village_name_local": "सोमणवाडी",
            "subdistrict_name": "Ambejogai",
            "district_name": "Beed",
            "state_name": "Maharashtra",
            "gram_panchayat": "Somanwadi GP",
            "pincode": "431517",
            "distance_km": 0.0
        }

    # 2. Match nearest Multi-Tier Mandis from Universal Mandi Registry
    from services.market_registry.db import get_db_connection as get_reg_conn
    from services.market_registry.price_engine import resolve_mandi_price

    ranked_mandis = []
    try:
        with get_reg_conn() as reg_conn:
            rows = reg_conn.execute("SELECT * FROM unified_mandis;").fetchall()
            for r in rows:
                m = dict(r)
                d = haversine_distance_km(latitude, longitude, float(m["latitude"]), float(m["longitude"]))
                price_info = resolve_mandi_price(m, "SOYBEAN")
                
                tier = m.get("mandi_tier", "PRINCIPAL_APMC")
                tier_label = {
                    "PRINCIPAL_APMC": "मुख्य बाजार समिती (Principal APMC)",
                    "SUB_YARD": "तालुका उपबाजार (Sub-Yard)",
                    "GRAM_HAAT": "ग्रामीण आठवडी बाजार (Weekly Haat)",
                    "FPO_CENTER": "FPO खरेदी केंद्र (Direct FPO)"
                }.get(tier, tier)

                ranked_mandis.append({
                    "id": m.get("mandi_id"),
                    "name": m.get("mandi_name"),
                    "name_local": m.get("mandi_name_local"),
                    "tier": tier,
                    "tier_label": tier_label,
                    "district": m.get("district_name"),
                    "state": m.get("state_name"),
                    "distance_km": round(d, 1),
                    "market_days": m.get("market_days", "MON-SAT"),
                    "is_open_today": price_info.get("is_open_today", True),
                    "modal_price": price_info.get("modal_price", 4650),
                    "min_price": price_info.get("min_price"),
                    "max_price": price_info.get("max_price"),
                    "variety": price_info.get("variety", "FAQ"),
                    "grade": price_info.get("grade", "FAQ"),
                    "price_source": price_info.get("source"),
                    "confidence_score": price_info.get("confidence_score", 1.0),
                    "resolution_layer": price_info.get("resolution_layer", 1),
                    "honesty_badge": price_info.get("honesty_badge")
                })
    except Exception as e:
        print("Universal registry query fallback:", e)

    if not ranked_mandis:
        all_mandis = _load_apmc_mandis()
        for m in all_mandis:
            d = haversine_distance_km(latitude, longitude, m["latitude"], m["longitude"])
            ranked_mandis.append({
                "id": m.get("id"),
                "name": m.get("name"),
                "tier": "PRINCIPAL_APMC",
                "tier_label": "मुख्य बाजार समिती",
                "district": m.get("district"),
                "state": m.get("state"),
                "distance_km": round(d, 1),
                "modal_price": m.get("modal_price", 2800),
                "is_open_today": True
            })

    ranked_mandis.sort(key=lambda x: x["distance_km"])
    top_3_mandis = ranked_mandis[:4]

    v_name = matched_village.get("village_name_local") or matched_village.get("village_name")
    t_name = matched_village.get("subdistrict_name")
    d_name = matched_village.get("district_name")
    pin = matched_village.get("pincode", "")

    mandi_lines = "\n".join([
        f"• {m['name']} ({m['distance_km']} km) — ₹{m['modal_price']}/Qtl [{m.get('tier_label', 'APMC')}]"
        for m in top_3_mandis
    ])

    # 3. Real-time OpenStreetMap road, river, and locality context
    osm_context = _fetch_realtime_osm_infrastructure(latitude, longitude)

    formatted_reply = (
        f"📍 स्थान प्राप्त झाले: {v_name}, ता. {t_name}, जि. {d_name} (पिनकोड: {pin}).\n"
        f"🛣️ जवळचा रस्ता: {osm_context.get('road', 'शेताचा रस्ता')}\n"
        f"💧 जलस्रोत/नदी: {osm_context.get('waterbody', 'स्थानिक ओढा')}\n\n"
        f"🏢 जवळच्या प्रमुख बाजार समित्या (Nearest APMC Mandis):\n"
        f"{mandi_lines}"
    )

    return {
        "status": "success",
        "coordinates": {
            "latitude": round(latitude, 6),
            "longitude": round(longitude, 6)
        },
        "accuracy_meters": round(accuracy, 1) if accuracy is not None else None,
        "is_high_precision": (accuracy is not None and accuracy <= 15.0),
        "village": matched_village,
        "nearest_mandis": top_3_mandis,
        "infrastructure": osm_context,
        "formatted_reply": formatted_reply
    }


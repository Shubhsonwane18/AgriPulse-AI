"""
Geospatial Routing & Distance Calculation Engine
Supports OSRM (Open Source Routing Machine) real-world road networks
with an instantaneous Haversine rural winding factor fallback.
"""
import math
import httpx
from typing import Tuple, Dict, Any, Optional

def calculate_haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Computes great-circle distance between two GPS coordinates in kilometers.
    Applies a 1.25 road curvature winding factor to simulate actual rural highway distance.
    """
    R = 6371.0  # Earth radius in kilometers
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2.0) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2.0) ** 2)
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    straight_line_km = R * c
    
    # 1.25 winding factor accounts for Indian state highways and village approach roads
    road_km = max(1.0, straight_line_km * 1.25)
    return round(road_km, 1)

async def get_driving_route_osrm(
    lat1: float, lon1: float,
    lat2: float, lon2: float,
    timeout_sec: float = 1.5
) -> Dict[str, Any]:
    """
    Queries OSRM public routing API for actual road driving distance (km) and duration (mins).
    Gracefully falls back to calibrated Haversine distance if offline, slow, or blocked.
    """
    fallback_dist = calculate_haversine_distance(lat1, lon1, lat2, lon2)
    # Estimate travel time based on rural transit speed (approx 35 km/h for small commercial vehicles)
    fallback_duration_min = round((fallback_dist / 35.0) * 60, 1)

    url = f"http://router.project-osrm.org/route/v1/driving/{lon1},{lat1};{lon2},{lat2}?overview=false"
    try:
        async with httpx.AsyncClient(timeout=timeout_sec) as client:
            resp = await client.get(url)
            if resp.status_code == 200:
                data = resp.json()
                if data.get("code") == "Ok" and data.get("routes"):
                    route = data["routes"][0]
                    road_km = round(route["distance"] / 1000.0, 1)
                    duration_min = round(route["duration"] / 60.0, 1)
                    return {
                        "distance_km": road_km,
                        "duration_minutes": duration_min,
                        "source": "OSRM_ROAD_NETWORK",
                        "is_real_road": True
                    }
    except Exception:
        pass

    return {
        "distance_km": fallback_dist,
        "duration_minutes": fallback_duration_min,
        "source": "HAVERSINE_WINDING_FALLBACK",
        "is_real_road": False
    }

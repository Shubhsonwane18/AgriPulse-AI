"""
Geospatial Routing & Distance Calculation Engine
"""
import math
from typing import Tuple

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

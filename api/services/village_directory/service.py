"""
Local Government Directory (LGD) Administrative Unit Query Service
Async & Sync database query functions for State -> District -> Taluka -> Village navigation.
"""
from typing import List, Optional, Dict, Any
from .db import get_db_connection, haversine_distance_km
from .models import StateRecord, DistrictRecord, SubDistrictRecord, VillageRecord, VillageSearchResponse

class VillageDirectoryService:

    @staticmethod
    def get_states() -> List[StateRecord]:
        with get_db_connection() as con:
            rows = con.execute("""
                SELECT 
                    s.state_code,
                    s.state_name,
                    s.state_name_local,
                    COUNT(DISTINCT d.district_code) as district_count
                FROM states s
                LEFT JOIN districts d ON s.state_code = d.state_code
                GROUP BY s.state_code, s.state_name, s.state_name_local
                ORDER BY s.state_name ASC;
            """).fetchall()
            return [
                StateRecord(
                    state_code=r["state_code"],
                    state_name=r["state_name"],
                    state_name_local=r["state_name_local"],
                    district_count=r["district_count"]
                ) for r in rows
            ]

    @staticmethod
    def get_districts(state_code: Optional[int] = None, state_name: Optional[str] = None) -> List[DistrictRecord]:
        with get_db_connection() as con:
            query = """
                SELECT 
                    d.district_code,
                    d.state_code,
                    d.district_name,
                    d.district_name_local,
                    d.latitude,
                    d.longitude,
                    COUNT(DISTINCT sd.subdistrict_code) as subdistrict_count,
                    COUNT(DISTINCT v.village_code) as village_count
                FROM districts d
                JOIN states s ON d.state_code = s.state_code
                LEFT JOIN subdistricts sd ON d.district_code = sd.district_code
                LEFT JOIN villages v ON d.district_code = v.district_code
            """
            params = []
            if state_code:
                query += " WHERE d.state_code = ?"
                params.append(state_code)
            elif state_name:
                query += " WHERE LOWER(s.state_name) = LOWER(?)"
                params.append(state_name.strip())

            query += " GROUP BY d.district_code ORDER BY d.district_name ASC;"
            rows = con.execute(query, params).fetchall()
            return [
                DistrictRecord(
                    district_code=r["district_code"],
                    state_code=r["state_code"],
                    district_name=r["district_name"],
                    district_name_local=r["district_name_local"],
                    latitude=r["latitude"],
                    longitude=r["longitude"],
                    subdistrict_count=r["subdistrict_count"],
                    village_count=r["village_count"]
                ) for r in rows
            ]

    @staticmethod
    def get_subdistricts(district_code: Optional[int] = None, district_name: Optional[str] = None) -> List[SubDistrictRecord]:
        with get_db_connection() as con:
            query = """
                SELECT 
                    sd.subdistrict_code,
                    sd.district_code,
                    sd.state_code,
                    sd.subdistrict_name,
                    sd.subdistrict_name_local,
                    sd.latitude,
                    sd.longitude,
                    COUNT(v.village_code) as village_count
                FROM subdistricts sd
                JOIN districts d ON sd.district_code = d.district_code
                LEFT JOIN villages v ON sd.subdistrict_code = v.subdistrict_code
            """
            params = []
            if district_code:
                query += " WHERE sd.district_code = ?"
                params.append(district_code)
            elif district_name:
                query += " WHERE LOWER(d.district_name) = LOWER(?)"
                params.append(district_name.strip())

            query += " GROUP BY sd.subdistrict_code ORDER BY sd.subdistrict_name ASC;"
            rows = con.execute(query, params).fetchall()
            return [
                SubDistrictRecord(
                    subdistrict_code=r["subdistrict_code"],
                    district_code=r["district_code"],
                    state_code=r["state_code"],
                    subdistrict_name=r["subdistrict_name"],
                    subdistrict_name_local=r["subdistrict_name_local"],
                    latitude=r["latitude"],
                    longitude=r["longitude"],
                    village_count=r["village_count"]
                ) for r in rows
            ]

    @staticmethod
    def get_villages(
        subdistrict_code: Optional[int] = None,
        subdistrict_name: Optional[str] = None,
        district_name: Optional[str] = None,
        limit: int = 200,
        offset: int = 0
    ) -> List[VillageRecord]:
        with get_db_connection() as con:
            query = """
                SELECT 
                    v.village_code,
                    v.subdistrict_code,
                    v.district_code,
                    v.state_code,
                    v.village_name,
                    v.village_name_local,
                    sd.subdistrict_name,
                    d.district_name,
                    s.state_name,
                    v.gram_panchayat,
                    v.block_name,
                    v.pincode,
                    v.latitude,
                    v.longitude,
                    v.is_verified
                FROM villages v
                JOIN subdistricts sd ON v.subdistrict_code = sd.subdistrict_code
                JOIN districts d ON v.district_code = d.district_code
                JOIN states s ON v.state_code = s.state_code
            """
            params = []
            conditions = []
            if subdistrict_code:
                conditions.append("v.subdistrict_code = ?")
                params.append(subdistrict_code)
            if subdistrict_name:
                conditions.append("LOWER(sd.subdistrict_name) = LOWER(?)")
                params.append(subdistrict_name.strip())
            if district_name:
                conditions.append("LOWER(d.district_name) = LOWER(?)")
                params.append(district_name.strip())

            if conditions:
                query += " WHERE " + " AND ".join(conditions)

            query += " ORDER BY v.village_name ASC LIMIT ? OFFSET ?;"
            params.extend([limit, offset])

            rows = con.execute(query, params).fetchall()
            return [
                VillageRecord(
                    village_code=r["village_code"],
                    subdistrict_code=r["subdistrict_code"],
                    district_code=r["district_code"],
                    state_code=r["state_code"],
                    village_name=r["village_name"],
                    village_name_local=r["village_name_local"],
                    subdistrict_name=r["subdistrict_name"],
                    district_name=r["district_name"],
                    state_name=r["state_name"],
                    gram_panchayat=r["gram_panchayat"],
                    block_name=r["block_name"],
                    pincode=r["pincode"],
                    latitude=r["latitude"],
                    longitude=r["longitude"],
                    is_verified=bool(r["is_verified"])
                ) for r in rows
            ]

    @staticmethod
    def search(query_str: str, limit: int = 30) -> VillageSearchResponse:
        q = (query_str or "").strip()
        if not q:
            return VillageSearchResponse(total_matches=0, query=q, results=[])

        with get_db_connection() as con:
            # 1. Clean query for FTS5 (escape quotes)
            clean_term = q.replace('"', '').replace("'", "")
            fts_query = f'"{clean_term}"*'

            rows = []
            try:
                # FTS5 ranked search
                rows = con.execute("""
                    SELECT 
                        v.village_code,
                        v.subdistrict_code,
                        v.district_code,
                        v.state_code,
                        v.village_name,
                        v.village_name_local,
                        sd.subdistrict_name,
                        d.district_name,
                        s.state_name,
                        v.gram_panchayat,
                        v.block_name,
                        v.pincode,
                        v.latitude,
                        v.longitude,
                        v.is_verified,
                        bm25(villages_fts) as rank
                    FROM villages_fts fts
                    JOIN villages v ON fts.rowid = v.village_code
                    JOIN subdistricts sd ON v.subdistrict_code = sd.subdistrict_code
                    JOIN districts d ON v.district_code = d.district_code
                    JOIN states s ON v.state_code = s.state_code
                    WHERE villages_fts MATCH ?
                    ORDER BY rank ASC
                    LIMIT ?;
                """, (fts_query, limit)).fetchall()
            except Exception:
                rows = []

            # Fallback to standard LIKE if FTS yielded 0 results or had tokenizer issue
            if not rows:
                pattern = f"%{clean_term}%"
                rows = con.execute("""
                    SELECT 
                        v.village_code,
                        v.subdistrict_code,
                        v.district_code,
                        v.state_code,
                        v.village_name,
                        v.village_name_local,
                        sd.subdistrict_name,
                        d.district_name,
                        s.state_name,
                        v.gram_panchayat,
                        v.block_name,
                        v.pincode,
                        v.latitude,
                        v.longitude,
                        v.is_verified
                    FROM villages v
                    JOIN subdistricts sd ON v.subdistrict_code = sd.subdistrict_code
                    JOIN districts d ON v.district_code = d.district_code
                    JOIN states s ON v.state_code = s.state_code
                    WHERE v.village_name LIKE ?
                       OR v.village_name_local LIKE ?
                       OR sd.subdistrict_name LIKE ?
                       OR d.district_name LIKE ?
                       OR v.pincode LIKE ?
                    ORDER BY 
                        CASE WHEN v.village_name LIKE ? THEN 1 ELSE 2 END,
                        v.village_name ASC
                    LIMIT ?;
                """, (pattern, pattern, pattern, pattern, pattern, f"{clean_term}%", limit)).fetchall()

            results = [
                VillageRecord(
                    village_code=r["village_code"],
                    subdistrict_code=r["subdistrict_code"],
                    district_code=r["district_code"],
                    state_code=r["state_code"],
                    village_name=r["village_name"],
                    village_name_local=r["village_name_local"],
                    subdistrict_name=r["subdistrict_name"],
                    district_name=r["district_name"],
                    state_name=r["state_name"],
                    gram_panchayat=r["gram_panchayat"],
                    block_name=r["block_name"],
                    pincode=r["pincode"],
                    latitude=r["latitude"],
                    longitude=r["longitude"],
                    is_verified=bool(r["is_verified"])
                ) for r in rows
            ]

            return VillageSearchResponse(
                total_matches=len(results),
                query=q,
                results=results
            )

    @staticmethod
    def get_nearest(lat: float, lon: float, limit: int = 5) -> List[Dict[str, Any]]:
        """Finds closest villages by geographic bounding box and exact Haversine calculation."""
        delta = 0.5  # ~55km bounding box
        with get_db_connection() as con:
            candidates = con.execute("""
                SELECT 
                    v.village_code,
                    v.village_name,
                    v.village_name_local,
                    sd.subdistrict_name,
                    d.district_name,
                    s.state_name,
                    v.latitude,
                    v.longitude,
                    v.pincode
                FROM villages v
                JOIN subdistricts sd ON v.subdistrict_code = sd.subdistrict_code
                JOIN districts d ON v.district_code = d.district_code
                JOIN states s ON v.state_code = s.state_code
                WHERE v.latitude BETWEEN ? AND ?
                  AND v.longitude BETWEEN ? AND ?;
            """, (lat - delta, lat + delta, lon - delta, lon + delta)).fetchall()

            if not candidates:
                # Expand box if in remote zone
                candidates = con.execute("""
                    SELECT 
                        v.village_code,
                        v.village_name,
                        v.village_name_local,
                        sd.subdistrict_name,
                        d.district_name,
                        s.state_name,
                        v.latitude,
                        v.longitude,
                        v.pincode
                    FROM villages v
                    JOIN subdistricts sd ON v.subdistrict_code = sd.subdistrict_code
                    JOIN districts d ON v.district_code = d.district_code
                    JOIN states s ON v.state_code = s.state_code
                    LIMIT 200;
                """).fetchall()

            ranked = []
            for c in candidates:
                dist = haversine_distance_km(lat, lon, c["latitude"], c["longitude"])
                ranked.append({
                    "village_code": c["village_code"],
                    "village_name": c["village_name"],
                    "village_name_local": c["village_name_local"],
                    "subdistrict_name": c["subdistrict_name"],
                    "district_name": c["district_name"],
                    "state_name": c["state_name"],
                    "pincode": c["pincode"],
                    "latitude": c["latitude"],
                    "longitude": c["longitude"],
                    "distance_km": round(dist, 2)
                })

            ranked.sort(key=lambda x: x["distance_km"])
            return ranked[:limit]


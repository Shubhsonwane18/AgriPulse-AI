"""
FastAPI Router for Local Government Directory (LGD) Administrative Units
Conforms to Government API Setu (apisetu.gov.in) & LGD REST endpoints.
"""
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query, UploadFile, File
from .service import VillageDirectoryService
from .importer import import_lgd_csv
from .models import (
    StateRecord,
    DistrictRecord,
    SubDistrictRecord,
    VillageRecord,
    VillageSearchResponse,
    LGDImportSummary
)

router = APIRouter(prefix="/api/v1/lgd", tags=["Local Government Directory (LGD)"])

@router.get("/states", response_model=List[StateRecord])
def get_lgd_states():
    """Returns official master list of Indian States with LGD codes."""
    try:
        return VillageDirectoryService.get_states()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))

@router.get("/districts", response_model=List[DistrictRecord])
def get_lgd_districts(
    stateCode: Optional[int] = Query(None, description="LGD State Code (e.g., 27 for Maharashtra)"),
    state: Optional[str] = Query(None, description="State Name in English (e.g., Maharashtra)")
):
    """Returns official districts mapped to a State with LGD codes and counts."""
    try:
        return VillageDirectoryService.get_districts(state_code=stateCode, state_name=state)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))

@router.get("/subdistricts", response_model=List[SubDistrictRecord])
@router.get("/talukas", response_model=List[SubDistrictRecord])
def get_lgd_subdistricts(
    districtCode: Optional[int] = Query(None, description="LGD District Code (e.g., 501 for Kolhapur, 508 for Nashik)"),
    district: Optional[str] = Query(None, description="District Name in English (e.g., Kolhapur, Nashik, Pune)")
):
    """Returns official subdistricts / talukas mapped to a District with LGD codes."""
    try:
        return VillageDirectoryService.get_subdistricts(district_code=districtCode, district_name=district)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))

@router.get("/villages", response_model=List[VillageRecord])
def get_lgd_villages(
    subdistrictCode: Optional[int] = Query(None, description="LGD Sub-District/Taluka Code"),
    taluka: Optional[str] = Query(None, description="Taluka Name (e.g., Karvir, Niphad, Baramati)"),
    district: Optional[str] = Query(None, description="District Name (e.g., Kolhapur, Nashik)"),
    limit: int = Query(200, ge=1, le=1000, description="Pagination limit"),
    offset: int = Query(0, ge=0, description="Pagination offset")
):
    """Returns all villages mapped to a Taluka and District with official 6-digit LGD codes, GP, and coordinates."""
    try:
        return VillageDirectoryService.get_villages(
            subdistrict_code=subdistrictCode,
            subdistrict_name=taluka,
            district_name=district,
            limit=limit,
            offset=offset
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))

@router.get("/search", response_model=VillageSearchResponse)
def search_lgd_villages(
    q: str = Query(..., min_length=1, description="Search term in English or Marathi/Hindi (e.g., Lasalgaon, लासलगाव, Shirdi, शिर्डी)"),
    limit: int = Query(30, ge=1, le=100, description="Maximum results to return")
):
    """Instant full-text FTS5 search across all villages, talukas, and districts with rank scoring."""
    try:
        return VillageDirectoryService.search(query_str=q, limit=limit)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))

@router.get("/reverse")
def reverse_geocode_village(
    lat: float = Query(..., description="Latitude coordinate"),
    lon: float = Query(..., description="Longitude coordinate"),
    limit: int = Query(5, ge=1, le=20, description="Number of nearest candidates")
):
    """Reverse geocodes GPS coordinates to the nearest official LGD villages with distance in kilometers."""
    try:
        candidates = VillageDirectoryService.get_nearest(lat=lat, lon=lon, limit=limit)
        return {
            "status": "success",
            "query_coordinates": {"latitude": lat, "longitude": lon},
            "nearest_villages": candidates
        }
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))

@router.post("/import-csv", response_model=LGDImportSummary)
async def upload_lgd_csv(
    file: UploadFile = File(..., description="Official LGD / Data.gov.in CSV file"),
    defaultState: str = Query("Maharashtra", description="Default state name if missing in CSV"),
    defaultStateCode: int = Query(27, description="Default state LGD code")
):
    """
    Ingests an official LGD CSV downloaded from lgdirectory.gov.in or data.gov.in into the local SQLite directory.
    Supports tens of thousands of villages in a single transaction with automatic FTS indexing.
    """
    try:
        contents = await file.read()
        summary = import_lgd_csv(
            file_or_content=contents,
            default_state_name=defaultState,
            default_state_code=defaultStateCode
        )
        return summary
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to import CSV: {str(exc)}")


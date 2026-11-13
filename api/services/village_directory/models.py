"""
Pydantic v2 Models for Local Government Directory (LGD) Administrative Units
"""
from typing import Optional, List
from pydantic import BaseModel, Field

class StateRecord(BaseModel):
    state_code: int = Field(..., description="Official LGD State Code (e.g., 27 for Maharashtra)")
    state_name: str = Field(..., description="English State Name")
    state_name_local: Optional[str] = Field(None, description="State Name in Local Script (Marathi, Hindi, etc.)")
    district_count: Optional[int] = Field(0, description="Total districts in state")

class DistrictRecord(BaseModel):
    district_code: int = Field(..., description="Official LGD District Code")
    state_code: int = Field(..., description="Parent State LGD Code")
    district_name: str = Field(..., description="District Name in English")
    district_name_local: Optional[str] = Field(None, description="District Name in Local Script")
    latitude: float = Field(..., description="Centroid Latitude")
    longitude: float = Field(..., description="Centroid Longitude")
    subdistrict_count: Optional[int] = Field(0, description="Total talukas/sub-districts")
    village_count: Optional[int] = Field(0, description="Total villages in district")

class SubDistrictRecord(BaseModel):
    subdistrict_code: int = Field(..., description="Official LGD Sub-District/Taluka Code")
    district_code: int = Field(..., description="Parent District LGD Code")
    state_code: int = Field(..., description="Parent State LGD Code")
    subdistrict_name: str = Field(..., description="Taluka/Sub-district Name in English")
    subdistrict_name_local: Optional[str] = Field(None, description="Taluka Name in Local Script")
    latitude: float = Field(..., description="Centroid Latitude")
    longitude: float = Field(..., description="Centroid Longitude")
    village_count: Optional[int] = Field(0, description="Total villages in taluka")

class VillageRecord(BaseModel):
    village_code: int = Field(..., description="Official LGD Village Code (Census / LGD 6-digit code)")
    subdistrict_code: int = Field(..., description="Parent Sub-District LGD Code")
    district_code: int = Field(..., description="Parent District LGD Code")
    state_code: int = Field(..., description="Parent State LGD Code")
    village_name: str = Field(..., description="Village Name in English")
    village_name_local: Optional[str] = Field(None, description="Village Name in Local Script (Devanagari)")
    subdistrict_name: Optional[str] = Field(None, description="Taluka Name")
    district_name: Optional[str] = Field(None, description="District Name")
    state_name: Optional[str] = Field(None, description="State Name")
    gram_panchayat: Optional[str] = Field(None, description="Mapped Gram Panchayat")
    block_name: Optional[str] = Field(None, description="Block Name")
    pincode: Optional[str] = Field(None, description="Postal PIN Code")
    latitude: float = Field(..., description="Latitude Coordinate")
    longitude: float = Field(..., description="Longitude Coordinate")
    is_verified: bool = Field(True, description="LGD standard verification status")

class VillageSearchResponse(BaseModel):
    total_matches: int
    query: str
    results: List[VillageRecord]

class LGDImportSummary(BaseModel):
    status: str
    states_imported: int
    districts_imported: int
    subdistricts_imported: int
    villages_imported: int
    message: str


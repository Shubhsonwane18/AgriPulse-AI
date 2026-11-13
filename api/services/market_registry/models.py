"""
Pydantic v2 Models for Universal Mandi Registry & Real-Time Pricing Architecture
(MANDI_REGISTRY_SPEC.md)
"""
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum
from datetime import date

class MandiTier(str, Enum):
    PRINCIPAL_APMC = "PRINCIPAL_APMC"
    SUB_YARD = "SUB_YARD"
    GRAM_HAAT = "GRAM_HAAT"
    FPO_CENTER = "FPO_CENTER"
    PRIVATE_YARD = "PRIVATE_YARD"

class GeocodePrecision(str, Enum):
    EXACT_YARD_PIN = "EXACT_YARD_PIN"
    VILLAGE_CENTROID = "VILLAGE_CENTROID"
    TALUKA_FALLBACK = "TALUKA_FALLBACK"
    CROWD_GPS = "CROWD_GPS"

class PriceSource(str, Enum):
    AGMARKNET = "AGMARKNET"
    STATE_BOARD = "STATE_BOARD"
    ENAM = "ENAM"
    DERIVED_PARENT_APMC = "DERIVED_PARENT_APMC"
    DERIVED_HAAT_BENCHMARK = "DERIVED_HAAT_BENCHMARK"
    DERIVED_FPO_PREMIUM = "DERIVED_FPO_PREMIUM"
    CROWD_SLIP_OCR = "CROWD_SLIP_OCR"

class MandiRecord(BaseModel):
    mandi_id: str
    parent_mandi_id: Optional[str] = None
    mandi_name: str
    mandi_name_local: Optional[str] = None
    mandi_tier: MandiTier
    state_code: int
    district_code: int
    subdistrict_code: Optional[int] = None
    village_code: Optional[int] = None
    state_name: Optional[str] = None
    district_name: Optional[str] = None
    subdistrict_name: Optional[str] = None
    village_name: Optional[str] = None
    latitude: float
    longitude: float
    geocode_precision: GeocodePrecision = GeocodePrecision.EXACT_YARD_PIN
    verification_status: str = "OFFICIAL"
    market_days: str = "MON,TUE,WED,THU,FRI,SAT"
    has_weighbridge: bool = True
    is_enam_enabled: bool = False
    mandi_cess_pct: float = 1.05
    agmarknet_code: Optional[str] = None
    enam_code: Optional[str] = None
    distance_km: Optional[float] = None
    is_open_today: Optional[bool] = True

class DailyPriceRecord(BaseModel):
    mandi_id: str
    commodity_id: str
    variety: str = "FAQ"
    min_price_per_qtl: Optional[float] = None
    max_price_per_qtl: Optional[float] = None
    modal_price_per_qtl: float
    arrival_tonnes: Optional[float] = None
    price_date: date
    source: PriceSource
    confidence_score: float = 1.0
    layer: int = 1  # 1: Direct, 2: Sub-Yard Parent, 3: Haat/FPO Benchmark

class UniversalArbitrageRequest(BaseModel):
    latitude: float = Field(..., ge=-90.0, le=90.0, description="Farmer GPS latitude")
    longitude: float = Field(..., ge=-180.0, le=180.0, description="Farmer GPS longitude")
    commodity_id: str = Field(default="SOYBEAN", description="Normalized canonical commodity ID")
    weight_quintals: float = Field(default=10.0, ge=0.5, description="Produce quantity in quintals")
    vehicle_type: str = Field(default="tata_ace", description="Vehicle: tata_ace, pickup_407, tractor, three_wheeler")
    radius_km: float = Field(default=50.0, ge=2.0, le=250.0, description="Search radius in kilometers")
    include_haats: bool = Field(default=True, description="Whether to include rural weekly haats")
    open_today_only: bool = Field(default=False, description="Filter only markets with active auctions today")
    diesel_price_per_l: float = Field(default=92.5, ge=50.0)

class UniversalMandiEvaluation(BaseModel):
    mandi_id: str
    mandi_name: str
    mandi_name_local: Optional[str] = None
    mandi_tier: MandiTier
    parent_mandi_name: Optional[str] = None
    distance_km: float
    is_open_today: bool
    market_days: str
    quoted_gross_rate: float
    price_source: str
    confidence_score: float
    price_resolution_layer: int
    gross_revenue: float
    fuel_overhead: float
    handling_fee: float
    cess_fee: float
    total_logistics_overhead: float
    net_earnings: float
    effective_net_rate: float
    rank: int
    recommendation_badge: str
    explanation: str

class UniversalArbitrageResponse(BaseModel):
    status: str = "success"
    farmer_coordinates: Dict[str, float]
    commodity_id: str
    weight_quintals: float
    vehicle_type: str
    total_markets_evaluated: int
    best_market: Optional[UniversalMandiEvaluation] = None
    arbitrage_spread_inr: float
    ranking: List[UniversalMandiEvaluation]

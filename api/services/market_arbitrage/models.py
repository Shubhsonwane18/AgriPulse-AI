"""
Pydantic Models for Market Arbitrage and Net Realization
"""
from pydantic import BaseModel, Field
from typing import List, Optional

class MandiCandidate(BaseModel):
    id: str
    name: str
    distance_km: float = Field(..., ge=0.1, description="One-way road distance in km")
    modal_price_per_qtl: float = Field(..., ge=0.0, description="Modal quoted rate in ₹/quintal")
    min_price_per_qtl: Optional[float] = None
    max_price_per_qtl: Optional[float] = None
    arrivals_tonnes: Optional[float] = None
    district: Optional[str] = None
    state: Optional[str] = None

class ArbitrageRequest(BaseModel):
    weight_quintals: float = Field(default=10.0, ge=0.5, description="Produce quantity in quintals")
    vehicle_type: str = Field(default="tata_ace", description="Vehicle type: tata_ace, pickup_407, tractor, three_wheeler")
    diesel_price_per_l: float = Field(default=92.5, ge=50.0, description="Diesel cost per liter")
    loading_fee_per_qtl: float = Field(default=25.0, ge=0.0, description="Loading/unloading labor fee per quintal")
    apmc_cess_pct: float = Field(default=1.05, ge=0.0, le=5.0, description="Mandi statutory fee percentage")
    tolls_inr: float = Field(default=0.0, ge=0.0, description="Estimated one-way highway tolls")
    mandis: List[MandiCandidate]

class MandiEvaluation(BaseModel):
    mandi_id: str
    mandi_name: str
    distance_km: float
    quoted_gross_rate: float
    gross_revenue: float
    fuel_overhead: float
    handling_fee: float
    cess_fee: float
    total_logistics_overhead: float
    net_earnings: float
    effective_net_rate: float
    rank: int
    recommendation_badge: str

class ArbitrageResponse(BaseModel):
    status: str = "success"
    crop: Optional[str] = "All"
    weight_quintals: float
    vehicle_type: str
    diesel_price_per_l: float
    best_mandi_id: str
    best_mandi_name: str
    max_net_earnings: float
    arbitrage_spread_per_qtl: float
    ranking: List[MandiEvaluation]


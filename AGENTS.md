# AGENTS.md — AgriAgent-OS: Autonomous Multimodal Agronomy & Market Orchestrator

## 1. System Overview & Problem Statement
Traditional agricultural tech solutions fail smallholder farmers because they rely on isolated models (e.g., standard PlantVillage leaf CNNs, raw APMC mandi price lists, and generic weather dashboards). 

**AgriAgent-OS** is an autonomous, context-aware decision agent designed to eliminate three primary agricultural leakages:
1. **Net Mandi Arbitrage:** Smallholder farmers often travel to distant wholesale mandis for higher quoted prices, only to lose money on transit fuel, loading fees, and commission cesses. This system calculates mathematically true in-hand profits.
2. **Context-Aware Spraying Windows:** Standard disease models recommend chemical sprays without evaluating weather conditions. Spraying before rain washes chemicals into the soil; spraying during high wind causes pesticide drift. AgriAgent-OS couples computer vision with a 48-hour hourly weather check.
3. **Voice-First Regional Accessibility:** Farmers in rural areas often face literacy and typing barriers. The system interfaces via WhatsApp/Telegram voice notes processed through Indian regional language ASR/TTS models (Marathi, Hindi, Telugu).

---

## 2. Technical Stack & Dependencies

- **Runtime & Language:** Python 3.11+
- **Application Framework:** FastAPI (asynchronous endpoints, Pydantic v2 schemas)
- **Computer Vision:** YOLOv8-cls / MobileNetV4 quantized to ONNX Runtime (CPU-optimized)
- **Database & Spatial Engine:** PostgreSQL + PostGIS (Production) or SQLite + SpatiaLite (Local sandbox)
- **External Data Providers:**
  - **Mandi Pricing:** Data.gov.in / Agmarknet Daily Wholesale Price API
  - **Hyperlocal Weather:** Open-Meteo REST API (Latitude/Longitude hourly metrics)
  - **Speech-to-Text / Text-to-Speech:** Bhashini API (MeitY) or Faster-Whisper
  - **Farmer Communication Interface:** WhatsApp Business Cloud API / Telegram Bot API

---

## 3. Directory Layout

```text
agriagent-os/
├── AGENTS.md                          # Master specification and agent rules
├── config.py                          # Environment variables & Pydantic settings
├── main.py                            # FastAPI application entrypoint
├── requirements.txt                   # Production dependencies
├── docker-compose.yml                 # Database & service orchestrations
├── data/
│   ├── apmc_directory.geojson         # Geocoded APMC yards in target states
│   └── models/                        # Quantized ONNX disease classification models
├── services/
│   ├── market_arbitrage/              # Logistics, routing, and net profit ranker
│   │   ├── __init__.py
│   │   ├── models.py                  # Pydantic schemas for prices and transit
│   │   ├── routing.py                 # OSRM / Haversine distance engine
│   │   └── calculator.py              # True net realization logic
│   ├── agronomy_guard/                # Pathology inference & weather lockout
│   │   ├── __init__.py
│   │   ├── weather_client.py          # Open-Meteo forecast analyzer
│   │   ├── vision_infer.py            # ONNX image inference pipeline
│   │   └── advisory_rules.py          # CIBRC chemical dosage & safety guidelines
│   ├── voice_gateway/                 # Speech transcription & regional synthesis
│   │   ├── __init__.py
│   │   ├── audio_converter.py         # OGG/Opus to 16kHz WAV converter
│   │   └── bhashini_client.py         # Multi-language ASR and TTS integration
│   └── bot_orchestration/             # Bot webhooks and conversational flow
│       ├── __init__.py
│       ├── telegram_handler.py        # Telegram webhook handler
│       └── message_router.py          # Intent parser & pipeline coordinator
└── tests/
    ├── test_arbitrage.py              # Arbitrage math and edge-case unit tests
    ├── test_weather_window.py         # Spray window logic tests
    └── test_api_endpoints.py          # FastAPI route integration tests
```

---

## 4. Domain Logic & Mathematical Formulations

### 4.1. Net Mandi Realization Formula
For any candidate APMC yard $i$, never rank by gross modal price $P_i$. Compute net in-hand realization $R_{\text{net}, i}$:

$$\text{Gross Revenue}_i = Q \times P_i$$

$$\text{Fuel Cost}_i = 2 \times D_i \times \left(\frac{\text{Diesel Price}}{\text{Mileage}_v}\right)$$

$$\text{Logistics Expense}_i = \text{Fuel Cost}_i + \text{Tolls}_i + (Q \times C_{\text{loading}}) + (C_{\text{cess}} \times \text{Gross Revenue}_i)$$

$$\text{Net Realization}_i = \text{Gross Revenue}_i - \text{Logistics Expense}_i$$

$$\text{Effective Rate}_i = \frac{\text{Net Realization}_i}{Q}$$

Where:
- $Q$: Produce quantity (Quintals)
- $P_i$: Modal price quoted at mandi $i$ (₹/Quintal)
- $D_i$: One-way road distance between farm GPS and mandi $i$ (km)
- $\text{Mileage}_v$: Fuel economy of vehicle $v$ (e.g., Tata Ace $\approx 11 \text{ km/L}$, Tractor $\approx 5 \text{ km/L}$)
- $C_{\text{loading}}$: Labour cost per quintal (₹25/Qtl typical)
- $C_{\text{cess}}$: APMC market fee percentage (typically 1.0% to 1.5%)

### 4.2. Chemical Spraying Window Rules
1. **Precipitation Lockout:** If `precipitation_probability` $> 40\%$ or hourly `precipitation` $\ge 0.5\text{ mm}$ within 6 hours of application, flag **SPRAY_BLOCKED**.
2. **Wind Drift Lockout:** If `wind_speed_10m` $> 18.0\text{ km/h}$, flag **WIND_DRIFT_HAZARD** (chemical droplets will miss target canopy).
3. **High Heat Lockout:** If `temperature_2m` $> 35^\circ\text{C}$, advise spraying only during early morning (06:00–09:00) or late evening (17:00–19:00) to prevent leaf scorching.

---

## 5. Reference Code Modules

### 5.1. `services/market_arbitrage/calculator.py`
```python
from dataclasses import dataclass
from typing import List, Dict, Any

@dataclass
class MandiCandidate:
    id: str
    name: str
    distance_km: float
    modal_price_per_qtl: float

VEHICLE_EFFICIENCY_KM_PER_L = {
    "tata_ace": 11.0,
    "pickup_407": 8.5,
    "tractor": 5.0,
    "three_wheeler": 18.0
}

def rank_mandis_by_net_profit(
    weight_quintals: float,
    candidates: List[MandiCandidate],
    vehicle_type: str = "tata_ace",
    diesel_price_per_l: float = 92.0,
    loading_fee_per_qtl: float = 25.0,
    apmc_cess_pct: float = 1.05
) -> List[Dict[str, Any]]:
    mileage = VEHICLE_EFFICIENCY_KM_PER_L.get(vehicle_type, 10.0)
    evaluations = []

    for mandi in candidates:
        gross_value = weight_quintals * mandi.modal_price_per_qtl
        # Round trip fuel
        fuel_cost = (2.0 * mandi.distance_km / mileage) * diesel_price_per_l
        handling_fee = weight_quintals * loading_fee_per_qtl
        cess_fee = (apmc_cess_pct / 100.0) * gross_value
        
        total_overhead = fuel_cost + handling_fee + cess_fee
        net_earnings = gross_value - total_overhead
        net_rate_per_qtl = net_earnings / weight_quintals

        evaluations.append({
            "mandi_id": mandi.id,
            "mandi_name": mandi.name,
            "distance_km": mandi.distance_km,
            "quoted_gross_rate": mandi.modal_price_per_qtl,
            "gross_revenue": round(gross_value, 2),
            "logistics_overhead": round(total_overhead, 2),
            "net_earnings": round(net_earnings, 2),
            "effective_net_rate": round(net_rate_per_qtl, 2)
        })

    # Rank strictly by actual in-hand return
    evaluations.sort(key=lambda item: item["net_earnings"], reverse=True)
    return evaluations
```

### 5.2. `services/agronomy_guard/weather_client.py`
```python
import httpx
from typing import Dict, Any

async def evaluate_spraying_window(lat: float, lon: float) -> Dict[str, Any]:
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": lat,
        "longitude": lon,
        "hourly": ["precipitation_probability", "precipitation", "wind_speed_10m", "temperature_2m"],
        "forecast_days": 1,
        "timezone": "auto"
    }
    
    async with httpx.AsyncClient(timeout=8.0) as client:
        resp = await client.get(url, params=params)
        resp.raise_for_status()
        payload = resp.json()["hourly"]

    # Evaluate the first 8 hours from call time
    inspection_hours = min(8, len(payload["time"]))
    rain_risk = False
    high_wind = False
    viable_slots = []

    for idx in range(inspection_hours):
        rain_prob = payload["precipitation_probability"][idx]
        rain_amount = payload["precipitation"][idx]
        wind_spd = payload["wind_speed_10m"][idx]
        hour_tag = payload["time"][idx].split("T")[1]

        if rain_prob > 40 or rain_amount >= 0.5:
            rain_risk = True
        elif wind_spd > 18.0:
            high_wind = True
        else:
            viable_slots.append(hour_tag)

    is_safe_now = not rain_risk and not high_wind

    return {
        "safe_to_spray_now": is_safe_now,
        "rain_hazard": rain_risk,
        "wind_drift_hazard": high_wind,
        "safe_window_hours": viable_slots if viable_slots else [],
        "action_advisory": (
            "Safe to proceed with chemical application."
            if is_safe_now
            else "DO NOT SPRAY: Wash-off or spray drift risk detected. Wait for optimal window."
        )
    }
```

### 5.3. `main.py`
```python
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
from typing import List, Optional
from services.market_arbitrage.calculator import rank_mandis_by_net_profit, MandiCandidate
from services.agronomy_guard.weather_client import evaluate_spraying_window

app = FastAPI(
    title="AgriAgent-OS API",
    description="Multimodal decision engine for smallholder farmers",
    version="1.0.0"
)

class MandiInput(BaseModel):
    id: str
    name: str
    distance_km: float
    modal_price_per_qtl: float

class ArbitrageRequest(BaseModel):
    weight_quintals: float
    vehicle_type: str = "tata_ace"
    mandis: List[MandiInput]

@app.post("/api/v1/market/arbitrage")
async def calculate_arbitrage(payload: ArbitrageRequest):
    candidates = [
        MandiCandidate(
            id=m.id,
            name=m.name,
            distance_km=m.distance_km,
            modal_price_per_qtl=m.modal_price_per_qtl
        )
        for m in payload.mandis
    ]
    ranked = rank_mandis_by_net_profit(
        weight_quintals=payload.weight_quintals,
        candidates=candidates,
        vehicle_type=payload.vehicle_type
    )
    return {"status": "success", "ranking": ranked}

@app.get("/api/v1/agronomy/spray-window")
async def get_spray_window(lat: float, lon: float):
    try:
        report = await evaluate_spraying_window(lat, lon)
        return {"status": "success", "evaluation": report}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
```

---

## 6. Development Phases & Milestones

### Milestone 1: Arbitrage Engine (Weeks 1–2)
- [x] Implement distance calculations and test routing calculations.
- [x] Seed Mandi geo-coordinates and daily APMC price ingestion script via `data.gov.in`.
- [x] Verify that farther mandis with higher gross prices correctly drop in rank when fuel expenses exceed price delta.

### Milestone 2: Agronomy Guard & Weather Checks (Weeks 3–4)
- [x] Connect Open-Meteo hourly precipitation and wind speed checks.
- [x] Set up ONNX runtime model inference for leaf pathology.
- [x] Generate structured advisories combining chemical prescriptions with spraying window validation.

### Milestone 3: Voice Interface & Bot Service (Weeks 5–6)
- [x] Build audio preprocessing pipeline (convert input audio to 16kHz mono WAV).
- [x] Connect Bhashini / Whisper transcription and regional text-to-speech output.
- [x] Wire Telegram bot webhooks to trigger end-to-end voice query analysis.

### Milestone 4: Edge Optimization & Delivery (Weeks 7–8)
- [x] Package entire application using Docker Compose with PostgreSQL + PostGIS.
- [x] Build local SQLite offline-cache fallback for network-constrained farm environments.
- [x] Conduct end-to-end validation with sample real-world farmer queries.

---

## 7. Rules and Invariants for Autonomous Agents
- **No Hallucinated Chemical Recipes:** Never suggest random chemical concoctions. All chemical recommendations must include chemical name, concentration percentage, and dilution ratio conforming to standard agricultural guidance.
- **Async Non-Blocking Network Calls:** All outbound requests to weather services, mandi feeds, and voice APIs must use `httpx.AsyncClient`.
- **Strict Data Typing:** All APIs must validate input and output payloads using Pydantic v2 models.
- **Fail Gracefully:** If the weather or voice API is unreachable, fall back to cached data or textual responses without crashing the agent loop.


# MANDI_REGISTRY_SPEC.md — Universal Mandi & Real-Time Pricing Architecture

## 1. System Objective & Problem Statement
Standard agricultural portals only index ~2,400 Principal APMC yards, ignoring **7,000+ Taluka Sub-Yards (Up-Bazaars)**, **22,000+ Rural Weekly Haats (GrAMs)**, and **10,000+ FPO/Private Collection Centers**. Furthermore, small markets rarely publish daily electronic rates, and official government directories lack GPS coordinates.

**Goal:** Build a unified, spatially indexed **Universal Mandi Registry** and **3-Layer Price Resolution Engine** that lists *every* small and large market within a farmer's radius, filters by active auction days, resolves live or derived on-day prices, and ranks markets by **Net In-Hand Profit (₹)**.

---

## 2. Multi-Source Data Ingestion Context
To achieve 100% coverage of big and small markets across India, ingest and merge four authoritative datasets:

1. **Principal & Sub-Yard APMCs (~7,000+ yards):**
   - **Source:** `data.gov.in` Agmarknet API (`9ef84268-d588-465a-a308-a864a43d0070`) + State Agricultural Marketing Boards (e.g., MSAMB for Maharashtra, UP Mandi Parishad, Krishi Marata Vahini).
   - **Hierarchy Rule:** Link every `SUB_YARD` to its `parent_mandi_id` (the Principal Taluka/District APMC).
2. **e-NAM Electronic Mandis (~1,400+ yards):**
   - **Source:** `enam.gov.in` state-wise mandi directory.
   - **Flag:** Set `is_enam_enabled = TRUE` (indicates electronic weighbridge and assaying lab availability).
3. **Village Weekly Haats / GrAMs (~22,000+ rural markets):**
   - **Source:** Ministry of Rural Development **Mission Antyodaya** village survey dataset (`has_weekly_haat == True`).
   - **Mapping:** Bind directly to the village's official **LGD (Local Government Directory) Code** and village centroid coordinates.
4. **FPO & Private Procurement Centers (~10,000+ centers):**
   - **Source:** SFAC / NABARD registered FPO directories and WDRA registered warehouses.

---

## 3. Database Schema (PostgreSQL + PostGIS & SQLite Fallback)
Use a single self-referencing table so one spatial radius query returns all tiers simultaneously:

```sql
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE unified_mandis (
    mandi_id VARCHAR(60) PRIMARY KEY,            -- e.g., 'MH_LATUR_MAIN', 'MH_LATUR_MURUD_SUB'
    parent_mandi_id VARCHAR(60) REFERENCES unified_mandis(mandi_id),
    mandi_name VARCHAR(150) NOT NULL,
    mandi_name_local VARCHAR(150),               -- Regional script name (Marathi/Hindi/etc.)
    mandi_tier VARCHAR(30) NOT NULL,             -- 'PRINCIPAL_APMC', 'SUB_YARD', 'GRAM_HAAT', 'FPO_CENTER', 'PRIVATE_YARD'
    
    -- Official LGD Administrative Hierarchy
    state_code INT NOT NULL,
    district_code INT NOT NULL,
    subdistrict_code INT,                        -- Taluka LGD Code
    village_code INT,                            -- Village LGD Code
    
    -- Spatial Indexing & Verification
    latitude NUMERIC(10, 6) NOT NULL,
    longitude NUMERIC(10, 6) NOT NULL,
    geocode_precision VARCHAR(30) NOT NULL,      -- 'EXACT_YARD_PIN', 'VILLAGE_CENTROID', 'TALUKA_FALLBACK', 'CROWD_GPS'
    verification_status VARCHAR(20) DEFAULT 'OFFICIAL', -- 'OFFICIAL', 'COMMUNITY_VERIFIED', 'UNVERIFIED'
    
    -- Operational Rules
    market_days VARCHAR(50) DEFAULT 'MON,TUE,WED,THU,FRI,SAT', -- e.g., 'WED,SAT' for weekly haats
    has_weighbridge BOOLEAN DEFAULT TRUE,
    is_enam_enabled BOOLEAN DEFAULT FALSE,
    mandi_cess_pct NUMERIC(4, 2) DEFAULT 1.05,
    
    -- External Source Identifiers (for deduplication)
    agmarknet_code VARCHAR(50),
    enam_code VARCHAR(50),
    state_board_code VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_unified_mandis_coords ON unified_mandis(latitude, longitude);
CREATE INDEX idx_unified_mandis_district ON unified_mandis(district_code, subdistrict_code);
CREATE INDEX idx_unified_mandis_tier ON unified_mandis(mandi_tier);

CREATE TABLE daily_mandi_prices (
    id BIGSERIAL PRIMARY KEY,
    mandi_id VARCHAR(60) REFERENCES unified_mandis(mandi_id),
    commodity_id VARCHAR(50) NOT NULL,           -- Normalized canonical ID (e.g., 'SOYBEAN', 'TUR_ARHAR')
    variety VARCHAR(100) DEFAULT 'FAQ',
    min_price_per_qtl NUMERIC(10, 2),
    max_price_per_qtl NUMERIC(10, 2),
    modal_price_per_qtl NUMERIC(10, 2) NOT NULL,
    arrival_tonnes NUMERIC(10, 2),
    price_date DATE NOT NULL,
    source VARCHAR(30) NOT NULL,                 -- 'AGMARKNET', 'STATE_BOARD', 'ENAM', 'DERIVED_PARENT_APMC', 'DERIVED_HAAT_BENCHMARK', 'CROWD_SLIP_OCR'
    confidence_score NUMERIC(3, 2) DEFAULT 1.00,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT uq_mandi_commodity_date UNIQUE (mandi_id, commodity_id, variety, price_date)
);

CREATE INDEX idx_prices_lookup ON daily_mandi_prices(mandi_id, commodity_id, price_date DESC);
```

---

## 4. 3-Layer Price Resolution Engine

Smallholder markets and rural weekly haats rarely publish daily electronic rates on Agmarknet. The system applies a progressive 3-layer waterfall:

```
[Target Market Request: (mandi_id, commodity_id, date)]
                       │
                       ▼
    [Layer 1: Direct Electronic Price]
    - Checks daily_mandi_prices for on-day reports
    - Source: Agmarknet, e-NAM, State Marketing Board
    - Confidence: 1.00
                       │ (If not reported on-day)
                       ▼
    [Layer 2: Parent APMC Derivative (Sub-Yards)]
    - Validates if target is 'SUB_YARD' with parent_mandi_id
    - Retrieves parent Principal APMC on-day modal price
    - Price Adjustment: 97.5% - 98.5% parity (local transit delta)
    - Source: 'DERIVED_PARENT_APMC', Confidence: 0.90
                       │ (If not a Sub-Yard or parent unpriced)
                       ▼
    [Layer 3: Regional Benchmark Derivative (GrAMs / FPOs)]
    - Checks target's active market_days (e.g. Is Haat open today?)
    - Matches nearest Principal APMC or Taluka Benchmark rate
    - For Weekly Haat (GrAM): 93.0% - 95.0% volume/trader haircut
    - For FPO Procurement Center: +1.5% premium (direct aggregator saving)
    - Source: 'DERIVED_HAAT_BENCHMARK' / 'DERIVED_FPO_PREMIUM'
    - Confidence: 0.85
```

---

## 5. Net Mandi Arbitrage Mathematical Formulation

Never rank candidate markets solely by gross modal rate $P_i$. Compute net in-hand realization $R_{\text{net}, i}$:

$$\text{Gross Revenue}_i = Q \times P_i$$

$$\text{Fuel Cost}_i = 2 \times D_i \times \left(\frac{\text{Diesel Price}}{\text{Mileage}_v}\right)$$

$$\text{Logistics Expense}_i = \text{Fuel Cost}_i + \text{Tolls}_i + (Q \times C_{\text{loading}}) + (C_{\text{cess}, i} \times \text{Gross Revenue}_i)$$

$$\text{Net Realization}_i = \text{Gross Revenue}_i - \text{Logistics Expense}_i$$

$$\text{Effective Rate}_i = \frac{\text{Net Realization}_i}{Q}$$

Where:
- $Q$: Produce quantity (Quintals)
- $P_i$: Modal price resolved via 3-Layer engine (₹/Quintal)
- $D_i$: One-way road/geodesic distance between farm GPS and mandi $i$ (km)
- $\text{Mileage}_v$: Fuel economy of vehicle $v$ (e.g. Tata Ace $\approx 11 \text{ km/L}$, Tractor $\approx 5 \text{ km/L}$, Three-Wheeler $\approx 18 \text{ km/L}$)
- $C_{\text{loading}}$: Labour handling cost per quintal (₹25/Qtl typical, ₹10/Qtl at local haat)
- $C_{\text{cess}, i}$: APMC market fee (typically 1.0% to 1.5% at Principal APMC, 0.5% at Sub-Yard, **0.0% at Weekly Haat**)

---

## 6. API Interface Contracts

### 6.1. Search & Radius Registry (`GET /api/v1/market/registry`)
- **Query Parameters:**
  - `lat` (float), `lon` (float)
  - `radius_km` (float, default 50.0)
  - `commodity` (string, optional)
  - `tier` (string: `ALL`, `PRINCIPAL_APMC`, `SUB_YARD`, `GRAM_HAAT`, `FPO_CENTER`)
  - `open_today_only` (bool, default false)

### 6.2. Universal Multi-Tier Net Arbitrage (`POST /api/v1/market/arbitrage/universal`)
- **Request Body:**
  ```json
  {
    "latitude": 18.7120,
    "longitude": 76.3450,
    "commodity_id": "SOYBEAN",
    "weight_quintals": 15.0,
    "vehicle_type": "tata_ace",
    "radius_km": 60.0,
    "include_haats": true
  }
  ```
- **Response:**
  Ranked list of all tiers with gross price, derived source, confidence score, fuel overhead, net earnings, and actionable recommendation badge.

-- ============================================================================
-- 002_universal_mandi_registry.sql
-- Universal Mandi Registry, Crosswalk Mapping & 4-Step Pinpoint Ingestion
-- (MANDI_REGISTRY_SPEC.md)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. Unified Mandis Table (Principal APMCs, Sub-Yards, GrAM Haats, FPOs)
CREATE TABLE IF NOT EXISTS public.unified_mandis (
    mandi_id VARCHAR(60) PRIMARY KEY,
    parent_mandi_id VARCHAR(60) REFERENCES public.unified_mandis(mandi_id),
    mandi_name VARCHAR(150) NOT NULL,
    mandi_name_local VARCHAR(150),
    mandi_tier VARCHAR(30) NOT NULL,             -- 'PRINCIPAL_APMC', 'SUB_YARD', 'GRAM_HAAT', 'FPO_CENTER', 'PRIVATE_YARD'
    
    -- Official LGD Administrative Hierarchy
    state_code INT NOT NULL,
    district_code INT NOT NULL,
    subdistrict_code INT,                        -- Taluka LGD Code
    village_code INT,                            -- Village LGD Code
    state_name VARCHAR(100),
    district_name VARCHAR(100),
    subdistrict_name VARCHAR(100),
    village_name VARCHAR(100),
    
    -- Spatial Coordinates & Precision
    latitude NUMERIC(10, 6) NOT NULL,
    longitude NUMERIC(10, 6) NOT NULL,
    location GEOMETRY(Point, 4326),
    geocode_precision VARCHAR(30) NOT NULL DEFAULT 'EXACT_YARD_PIN', -- 'EXACT_YARD_PIN', 'VILLAGE_CENTROID', 'TALUKA_FALLBACK'
    verification_status VARCHAR(20) DEFAULT 'OFFICIAL',
    
    -- Operational Auction Rules
    market_days VARCHAR(50) DEFAULT 'MON,TUE,WED,THU,FRI,SAT',       -- e.g. 'MON,THU' for weekly haats
    has_weighbridge BOOLEAN DEFAULT TRUE,
    is_enam_enabled BOOLEAN DEFAULT FALSE,
    mandi_cess_pct NUMERIC(4, 2) DEFAULT 1.05,
    
    -- External System Identifiers
    agmarknet_code VARCHAR(50),
    enam_code VARCHAR(50),
    state_board_code VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_unified_mandis_coords ON public.unified_mandis(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_unified_mandis_district ON public.unified_mandis(district_code, subdistrict_code);
CREATE INDEX IF NOT EXISTS idx_unified_mandis_tier ON public.unified_mandis(mandi_tier);

-- 2. Mandi Source Mapping (Canonical Crosswalk Table)
-- Binds raw API market strings from Agmarknet, e-NAM, and MSAMB 1-to-1 to exact PostGIS pins
CREATE TABLE IF NOT EXISTS public.mandi_source_mapping (
    mandi_id VARCHAR(60) NOT NULL REFERENCES public.unified_mandis(mandi_id) ON DELETE CASCADE,
    source_name VARCHAR(30) NOT NULL,            -- 'AGMARKNET', 'ENAM', 'MSAMB'
    external_market_string VARCHAR(150) NOT NULL,-- Exact raw string e.g. 'Lasalgaon(Niphad)'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (source_name, external_market_string)
);

CREATE INDEX IF NOT EXISTS idx_mandi_mapping_id ON public.mandi_source_mapping(mandi_id);

-- 3. Daily Mandi Prices Table (Category -> Commodity -> Variety -> Grade)
CREATE TABLE IF NOT EXISTS public.daily_mandi_prices (
    id BIGSERIAL PRIMARY KEY,
    mandi_id VARCHAR(60) NOT NULL REFERENCES public.unified_mandis(mandi_id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL DEFAULT 'CEREALS', -- 'CEREALS', 'PULSES', 'OILSEEDS', 'VEGETABLES', 'SPICES', 'FRUITS'
    commodity_id VARCHAR(50) NOT NULL,               -- e.g. 'SOYBEAN', 'ONION', 'COTTON'
    variety VARCHAR(100) NOT NULL DEFAULT 'FAQ',     -- e.g. 'Yellow', 'Red / Gavran', 'Deshi'
    grade VARCHAR(50) NOT NULL DEFAULT 'FAQ',         -- 'FAQ', 'Super', 'Medium'
    min_price_per_qtl NUMERIC(10, 2),
    max_price_per_qtl NUMERIC(10, 2),
    modal_price_per_qtl NUMERIC(10, 2) NOT NULL,
    arrival_tonnes NUMERIC(10, 2),
    price_date DATE NOT NULL,
    source VARCHAR(30) NOT NULL,                     -- 'AGMARKNET', 'MSAMB', 'ENAM', 'DERIVED_PARENT_APMC', 'DERIVED_HAAT_BENCHMARK'
    confidence_score NUMERIC(3, 2) DEFAULT 1.00,
    is_outlier BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT uq_exact_crop_rate UNIQUE (mandi_id, commodity_id, variety, grade, price_date)
);

CREATE INDEX IF NOT EXISTS idx_prices_lookup ON public.daily_mandi_prices(mandi_id, commodity_id, price_date DESC);
CREATE INDEX IF NOT EXISTS idx_prices_date ON public.daily_mandi_prices(price_date DESC);


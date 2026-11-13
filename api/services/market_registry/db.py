"""
Database Access Layer for Universal Mandi Registry & Canonical Mapping (SQLite Fallback Engine)
Supports spatial bounding box filtering, Haversine distance ranking, and crosswalk lookups.
"""
import sqlite3
import math
from pathlib import Path
from typing import List, Dict, Any, Optional

DB_PATH = Path(__file__).resolve().parent.parent.parent / "data" / "villages" / "lgd_villages.db"

def get_db_connection() -> sqlite3.Connection:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    conn.execute("PRAGMA journal_mode = WAL;")
    return conn

def haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Computes Great-Circle Haversine distance in km between two GPS coordinates."""
    r = 6371.0
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)
    a = (math.sin(delta_phi / 2.0) ** 2 +
         math.cos(phi1) * math.cos(phi2) * (math.sin(delta_lambda / 2.0) ** 2))
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return r * c

def init_registry_tables():
    """Initializes unified_mandis, mandi_source_mapping, and daily_mandi_prices in SQLite."""
    with get_db_connection() as conn:
        conn.executescript("""
        CREATE TABLE IF NOT EXISTS unified_mandis (
            mandi_id TEXT PRIMARY KEY,
            parent_mandi_id TEXT,
            mandi_name TEXT NOT NULL,
            mandi_name_local TEXT,
            mandi_tier TEXT NOT NULL,
            state_code INTEGER NOT NULL,
            district_code INTEGER NOT NULL,
            subdistrict_code INTEGER,
            village_code INTEGER,
            state_name TEXT,
            district_name TEXT,
            subdistrict_name TEXT,
            village_name TEXT,
            latitude REAL NOT NULL,
            longitude REAL NOT NULL,
            geocode_precision TEXT DEFAULT 'EXACT_YARD_PIN',
            verification_status TEXT DEFAULT 'OFFICIAL',
            market_days TEXT DEFAULT 'MON,TUE,WED,THU,FRI,SAT',
            has_weighbridge INTEGER DEFAULT 1,
            is_enam_enabled INTEGER DEFAULT 0,
            mandi_cess_pct REAL DEFAULT 1.05,
            agmarknet_code TEXT,
            enam_code TEXT,
            state_board_code TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (parent_mandi_id) REFERENCES unified_mandis(mandi_id)
        );

        CREATE INDEX IF NOT EXISTS idx_unified_mandis_coords ON unified_mandis(latitude, longitude);
        CREATE INDEX IF NOT EXISTS idx_unified_mandis_tier ON unified_mandis(mandi_tier);
        CREATE INDEX IF NOT EXISTS idx_unified_mandis_district ON unified_mandis(district_name, subdistrict_name);

        CREATE TABLE IF NOT EXISTS mandi_source_mapping (
            mandi_id TEXT NOT NULL,
            source_name TEXT NOT NULL,
            external_market_string TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (source_name, external_market_string),
            FOREIGN KEY (mandi_id) REFERENCES unified_mandis(mandi_id) ON DELETE CASCADE
        );

        CREATE INDEX IF NOT EXISTS idx_mapping_mandi ON mandi_source_mapping(mandi_id);

        CREATE TABLE IF NOT EXISTS daily_mandi_prices (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            mandi_id TEXT NOT NULL,
            category TEXT NOT NULL DEFAULT 'CEREALS',
            commodity_id TEXT NOT NULL,
            variety TEXT NOT NULL DEFAULT 'FAQ',
            grade TEXT NOT NULL DEFAULT 'FAQ',
            min_price_per_qtl REAL,
            max_price_per_qtl REAL,
            modal_price_per_qtl REAL NOT NULL,
            arrival_tonnes REAL,
            price_date TEXT NOT NULL,
            source TEXT NOT NULL,
            confidence_score REAL DEFAULT 1.00,
            is_outlier INTEGER DEFAULT 0,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE (mandi_id, commodity_id, variety, grade, price_date),
            FOREIGN KEY (mandi_id) REFERENCES unified_mandis(mandi_id) ON DELETE CASCADE
        );

        CREATE INDEX IF NOT EXISTS idx_prices_lookup ON daily_mandi_prices(mandi_id, commodity_id, price_date);
        CREATE INDEX IF NOT EXISTS idx_prices_commodity ON daily_mandi_prices(commodity_id, price_date);
        """)


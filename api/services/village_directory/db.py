"""
SQLite Database Engine for Local Government Directory (LGD) Villages
Equipped with FTS5 Full-Text Search and Spatial Haversine Distance Indexing.
"""
import sqlite3
import math
from pathlib import Path
from typing import Optional, List, Dict, Any

DB_PATH = Path(__file__).resolve().parent.parent.parent / "data" / "villages" / "lgd_villages.db"

def get_db_connection() -> sqlite3.Connection:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    con = sqlite3.connect(str(DB_PATH))
    con.row_factory = sqlite3.Row
    con.execute("PRAGMA foreign_keys = ON;")
    con.execute("PRAGMA journal_mode = WAL;")
    return con

def haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Computes Great-Circle Haversine distance in kilometers between two GPS points."""
    r = 6371.0  # Earth's radius in km
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)
    a = (math.sin(delta_phi / 2.0) ** 2 +
         math.cos(phi1) * math.cos(phi2) * (math.sin(delta_lambda / 2.0) ** 2))
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return r * c

def init_db():
    """Initializes standard LGD administrative hierarchy tables and full-text index."""
    with get_db_connection() as con:
        con.executescript("""
        CREATE TABLE IF NOT EXISTS states (
            state_code INTEGER PRIMARY KEY,
            state_name TEXT NOT NULL UNIQUE,
            state_name_local TEXT
        );

        CREATE TABLE IF NOT EXISTS districts (
            district_code INTEGER PRIMARY KEY,
            state_code INTEGER NOT NULL,
            district_name TEXT NOT NULL,
            district_name_local TEXT,
            latitude REAL NOT NULL,
            longitude REAL NOT NULL,
            FOREIGN KEY(state_code) REFERENCES states(state_code)
        );

        CREATE TABLE IF NOT EXISTS subdistricts (
            subdistrict_code INTEGER PRIMARY KEY,
            district_code INTEGER NOT NULL,
            state_code INTEGER NOT NULL,
            subdistrict_name TEXT NOT NULL,
            subdistrict_name_local TEXT,
            latitude REAL NOT NULL,
            longitude REAL NOT NULL,
            FOREIGN KEY(district_code) REFERENCES districts(district_code),
            FOREIGN KEY(state_code) REFERENCES states(state_code)
        );

        CREATE TABLE IF NOT EXISTS villages (
            village_code INTEGER PRIMARY KEY,
            subdistrict_code INTEGER NOT NULL,
            district_code INTEGER NOT NULL,
            state_code INTEGER NOT NULL,
            village_name TEXT NOT NULL,
            village_name_local TEXT,
            gram_panchayat TEXT,
            block_name TEXT,
            pincode TEXT,
            latitude REAL NOT NULL,
            longitude REAL NOT NULL,
            is_verified INTEGER DEFAULT 1,
            FOREIGN KEY(subdistrict_code) REFERENCES subdistricts(subdistrict_code),
            FOREIGN KEY(district_code) REFERENCES districts(district_code),
            FOREIGN KEY(state_code) REFERENCES states(state_code)
        );

        CREATE INDEX IF NOT EXISTS idx_districts_state ON districts(state_code);
        CREATE INDEX IF NOT EXISTS idx_subdistricts_district ON subdistricts(district_code);
        CREATE INDEX IF NOT EXISTS idx_villages_subdistrict ON villages(subdistrict_code);
        CREATE INDEX IF NOT EXISTS idx_villages_district ON villages(district_code);
        CREATE INDEX IF NOT EXISTS idx_villages_name ON villages(village_name);
        CREATE INDEX IF NOT EXISTS idx_villages_pincode ON villages(pincode);

        -- FTS5 full text search table for high-speed multi-lingual autocomplete
        CREATE VIRTUAL TABLE IF NOT EXISTS villages_fts USING fts5(
            village_name,
            village_name_local,
            subdistrict_name,
            district_name,
            state_name,
            gram_panchayat,
            pincode,
            tokenize = 'unicode61 remove_diacritics 0'
        );
        """)
        con.commit()

# Ensure schema is ready upon module import
init_db()


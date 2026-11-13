
"""
Universal LGD & Data.gov.in CSV Ingestion Pipeline
Parses official exports from lgdirectory.gov.in and data.gov.in into the local SQLite database.
"""
import csv
import io
import re
from typing import Dict, Any, Optional, TextIO, Union
from .db import get_db_connection
from .models import LGDImportSummary

def normalize_key(k: str) -> str:
    return re.sub(r'[^a-z0-9]', '', str(k).lower().strip())

HEADER_MAP = {
    'statecode': 'state_code',
    'statelgdcode': 'state_code',
    'statename': 'state_name',
    'statenameinenglish': 'state_name',
    'statenamelocal': 'state_name_local',
    'statenamelocallanguage': 'state_name_local',

    'districtcode': 'district_code',
    'districtlgdcode': 'district_code',
    'districtname': 'district_name',
    'districtnameinenglish': 'district_name',
    'districtnamelocal': 'district_name_local',

    'subdistrictcode': 'subdistrict_code',
    'subdistrictlgdcode': 'subdistrict_code',
    'talukacode': 'subdistrict_code',
    'taluklgdcode': 'subdistrict_code',
    'subdistrictname': 'subdistrict_name',
    'subdistrictnameinenglish': 'subdistrict_name',
    'talukaname': 'subdistrict_name',
    'talukname': 'subdistrict_name',
    'subdistrictnamelocal': 'subdistrict_name_local',

    'villagecode': 'village_code',
    'villagelgdcode': 'village_code',
    'censusvillagecode': 'village_code',
    'villagename': 'village_name',
    'villagenameinenglish': 'village_name',
    'villagenamelocal': 'village_name_local',
    'villagenamelocallanguage': 'village_name_local',

    'grampanchayat': 'gram_panchayat',
    'grampanchayatname': 'gram_panchayat',
    'gpname': 'gram_panchayat',
    'blockname': 'block_name',
    'pincode': 'pincode',
    'pincodeorpostal': 'pincode',
    'latitude': 'latitude',
    'lat': 'latitude',
    'longitude': 'longitude',
    'lon': 'longitude',
    'long': 'longitude',
}

def import_lgd_csv(
    file_or_content: Union[str, TextIO, bytes],
    default_state_name: str = "Maharashtra",
    default_state_code: int = 27
) -> LGDImportSummary:
    """
    Ingests an LGD / Data.gov.in CSV table into the SQLite database.
    Can accept a raw CSV string, bytes, or open file object.
    """
    if isinstance(file_or_content, bytes):
        text_stream = io.StringIO(file_or_content.decode('utf-8', errors='ignore'))
    elif isinstance(file_or_content, str):
        if '\n' in file_or_content:
            text_stream = io.StringIO(file_or_content)
        else:
            text_stream = open(file_or_content, 'r', encoding='utf-8', errors='ignore')
    else:
        text_stream = file_or_content

    reader = csv.DictReader(text_stream)
    if not reader.fieldnames:
        return LGDImportSummary(
            status="error",
            states_imported=0,
            districts_imported=0,
            subdistricts_imported=0,
            villages_imported=0,
            message="CSV is empty or missing valid headers."
        )

    # Map raw headers to normalized fields
    field_mapping: Dict[str, str] = {}
    for raw_col in reader.fieldnames:
        norm = normalize_key(raw_col)
        if norm in HEADER_MAP:
            field_mapping[raw_col] = HEADER_MAP[norm]

    states: Dict[int, Dict[str, Any]] = {}
    districts: Dict[int, Dict[str, Any]] = {}
    subdistricts: Dict[int, Dict[str, Any]] = {}
    villages: List[Dict[str, Any]] = []

    row_count = 0
    auto_id_counter = 100000

    for row in reader:
        row_count += 1
        record: Dict[str, Any] = {}
        for raw_k, val in row.items():
            if raw_k in field_mapping and val is not None:
                record[field_mapping[raw_k]] = str(val).strip()

        # State
        s_code = int(record.get('state_code', default_state_code))
        s_name = record.get('state_name', default_state_name)
        s_local = record.get('state_name_local', None)
        if s_code not in states:
            states[s_code] = {'state_code': s_code, 'state_name': s_name, 'state_name_local': s_local}

        # District
        d_name = record.get('district_name')
        if not d_name:
            continue
        try:
            d_code = int(record.get('district_code', 0))
        except (ValueError, TypeError):
            d_code = hash(d_name) % 100000
        if d_code <= 0:
            d_code = (abs(hash(d_name)) % 90000) + 10000

        d_lat = float(record.get('latitude', 18.5204))
        d_lon = float(record.get('longitude', 73.8567))
        d_local = record.get('district_name_local', None)
        if d_code not in districts:
            districts[d_code] = {
                'district_code': d_code,
                'state_code': s_code,
                'district_name': d_name,
                'district_name_local': d_local,
                'latitude': d_lat,
                'longitude': d_lon
            }

        # Sub-district / Taluka
        sub_name = record.get('subdistrict_name') or d_name
        try:
            sub_code = int(record.get('subdistrict_code', 0))
        except (ValueError, TypeError):
            sub_code = (abs(hash(f"{d_name}_{sub_name}")) % 900000) + 100000
        if sub_code <= 0:
            sub_code = (abs(hash(f"{d_name}_{sub_name}")) % 900000) + 100000

        sub_local = record.get('subdistrict_name_local', None)
        if sub_code not in subdistricts:
            subdistricts[sub_code] = {
                'subdistrict_code': sub_code,
                'district_code': d_code,
                'state_code': s_code,
                'subdistrict_name': sub_name,
                'subdistrict_name_local': sub_local,
                'latitude': d_lat,
                'longitude': d_lon
            }

        # Village
        v_name = record.get('village_name')
        if not v_name:
            continue
        try:
            v_code = int(record.get('village_code', 0))
        except (ValueError, TypeError):
            auto_id_counter += 1
            v_code = auto_id_counter
        if v_code <= 0:
            auto_id_counter += 1
            v_code = auto_id_counter

        v_local = record.get('village_name_local', None)
        gp = record.get('gram_panchayat', None)
        block = record.get('block_name', None)
        pin = record.get('pincode', None)
        v_lat = float(record.get('latitude', d_lat))
        v_lon = float(record.get('longitude', d_lon))

        villages.append({
            'village_code': v_code,
            'subdistrict_code': sub_code,
            'district_code': d_code,
            'state_code': s_code,
            'village_name': v_name,
            'village_name_local': v_local,
            'gram_panchayat': gp,
            'block_name': block,
            'pincode': pin,
            'latitude': v_lat,
            'longitude': v_lon,
            'is_verified': 1
        })

    # Execute atomic SQLite ingestion
    with get_db_connection() as con:
        # States
        con.executemany("""
            INSERT OR REPLACE INTO states (state_code, state_name, state_name_local)
            VALUES (:state_code, :state_name, :state_name_local)
        """, list(states.values()))

        # Districts
        con.executemany("""
            INSERT OR REPLACE INTO districts (district_code, state_code, district_name, district_name_local, latitude, longitude)
            VALUES (:district_code, :state_code, :district_name, :district_name_local, :latitude, :longitude)
        """, list(districts.values()))

        # Subdistricts
        con.executemany("""
            INSERT OR REPLACE INTO subdistricts (subdistrict_code, district_code, state_code, subdistrict_name, subdistrict_name_local, latitude, longitude)
            VALUES (:subdistrict_code, :district_code, :state_code, :subdistrict_name, :subdistrict_name_local, :latitude, :longitude)
        """, list(subdistricts.values()))

        # Villages in batches of 1000
        batch_size = 1000
        for i in range(0, len(villages), batch_size):
            batch = villages[i:i + batch_size]
            con.executemany("""
                INSERT OR REPLACE INTO villages (
                    village_code, subdistrict_code, district_code, state_code,
                    village_name, village_name_local, gram_panchayat, block_name,
                    pincode, latitude, longitude, is_verified
                ) VALUES (
                    :village_code, :subdistrict_code, :district_code, :state_code,
                    :village_name, :village_name_local, :gram_panchayat, :block_name,
                    :pincode, :latitude, :longitude, :is_verified
                )
            """, batch)

        # Re-populate FTS5 index
        con.execute("DELETE FROM villages_fts;")
        con.execute("""
            INSERT INTO villages_fts (
                rowid, village_name, village_name_local,
                subdistrict_name, district_name, state_name,
                gram_panchayat, pincode
            )
            SELECT 
                v.village_code,
                v.village_name,
                v.village_name_local,
                sd.subdistrict_name,
                d.district_name,
                s.state_name,
                v.gram_panchayat,
                v.pincode
            FROM villages v
            JOIN subdistricts sd ON v.subdistrict_code = sd.subdistrict_code
            JOIN districts d ON v.district_code = d.district_code
            JOIN states s ON v.state_code = s.state_code;
        """)
        con.commit()

    return LGDImportSummary(
        status="success",
        states_imported=len(states),
        districts_imported=len(districts),
        subdistricts_imported=len(subdistricts),
        villages_imported=len(villages),
        message=f"Successfully ingested {len(villages)} villages across {len(subdistricts)} talukas and {len(districts)} districts into LGD SQLite directory."
    )


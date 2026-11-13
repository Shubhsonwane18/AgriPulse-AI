"""
Universal Mandi Registry & Multi-Tier Seeder (MANDI_REGISTRY_SPEC.md Section 2 & 3)
Seeds Principal APMCs, Sub-Yards, GrAM Weekly Haats, and FPO Centers with:
- Mandi Hierarchy (parent_mandi_id linkage)
- Mandi Source Mapping (canonical Agmarknet/MSAMB/e-NAM string crosswalk)
- Category -> Commodity -> Variety -> Grade Daily Price Records
"""
from datetime import date, timedelta
from typing import List, Dict, Any
from .db import get_db_connection, init_registry_tables
from .outlier_gate import sanitize_and_validate_price

# 1. Authoritative Multi-Tier Mandi Registry
UNIFIED_MANDIS_SEED: List[Dict[str, Any]] = [
    # PRINCIPAL APMCs
    {
        "mandi_id": "MH_LATUR_MAIN",
        "parent_mandi_id": None,
        "mandi_name": "Latur APMC Super Yard",
        "mandi_name_local": "लातूर मुख्य कृषी उत्पन्न बाजार समिती",
        "mandi_tier": "PRINCIPAL_APMC",
        "state_code": 27, "district_code": 505, "subdistrict_code": 4012, "village_code": None,
        "state_name": "Maharashtra", "district_name": "Latur", "subdistrict_name": "Latur", "village_name": "Latur City",
        "latitude": 18.4088, "longitude": 76.5604,
        "geocode_precision": "EXACT_YARD_PIN", "verification_status": "OFFICIAL",
        "market_days": "MON,TUE,WED,THU,FRI,SAT",
        "has_weighbridge": 1, "is_enam_enabled": 1, "mandi_cess_pct": 1.05,
        "agmarknet_code": "MH_LAT_01", "enam_code": "MH_ENAM_014"
    },
    {
        "mandi_id": "MH_BEED_AMBEJOGAI_MAIN",
        "parent_mandi_id": None,
        "mandi_name": "Ambejogai APMC Market Yard",
        "mandi_name_local": "अंबाजोगाई कृषी उत्पन्न बाजार समिती",
        "mandi_tier": "PRINCIPAL_APMC",
        "state_code": 27, "district_code": 504, "subdistrict_code": 4006, "village_code": None,
        "state_name": "Maharashtra", "district_name": "Beed", "subdistrict_name": "Ambejogai", "village_name": "Ambejogai",
        "latitude": 18.7300, "longitude": 76.3800,
        "geocode_precision": "EXACT_YARD_PIN", "verification_status": "OFFICIAL",
        "market_days": "MON,TUE,WED,THU,FRI,SAT",
        "has_weighbridge": 1, "is_enam_enabled": 1, "mandi_cess_pct": 1.05,
        "agmarknet_code": "MH_BEE_02", "enam_code": "MH_ENAM_022"
    },
    {
        "mandi_id": "MH_BEED_PARLI_MAIN",
        "parent_mandi_id": None,
        "mandi_name": "Parli Vaijnath APMC Yard",
        "mandi_name_local": "परळी वैजनाथ मुख्य बाजार समिती",
        "mandi_tier": "PRINCIPAL_APMC",
        "state_code": 27, "district_code": 504, "subdistrict_code": 4007, "village_code": None,
        "state_name": "Maharashtra", "district_name": "Beed", "subdistrict_name": "Parli", "village_name": "Parli",
        "latitude": 18.8480, "longitude": 76.5350,
        "geocode_precision": "EXACT_YARD_PIN", "verification_status": "OFFICIAL",
        "market_days": "MON,TUE,WED,THU,FRI,SAT",
        "has_weighbridge": 1, "is_enam_enabled": 1, "mandi_cess_pct": 1.05,
        "agmarknet_code": "MH_BEE_03", "enam_code": "MH_ENAM_023"
    },
    {
        "mandi_id": "MH_BEED_MAIN",
        "parent_mandi_id": None,
        "mandi_name": "Beed Central APMC",
        "mandi_name_local": "बीड मुख्य बाजार समिती",
        "mandi_tier": "PRINCIPAL_APMC",
        "state_code": 27, "district_code": 504, "subdistrict_code": 4001, "village_code": None,
        "state_name": "Maharashtra", "district_name": "Beed", "subdistrict_name": "Beed", "village_name": "Beed City",
        "latitude": 18.9900, "longitude": 75.7600,
        "geocode_precision": "EXACT_YARD_PIN", "verification_status": "OFFICIAL",
        "market_days": "MON,TUE,WED,THU,FRI,SAT",
        "has_weighbridge": 1, "is_enam_enabled": 0, "mandi_cess_pct": 1.05,
        "agmarknet_code": "MH_BEE_01", "enam_code": None
    },
    {
        "mandi_id": "MH_NASHIK_LASALGAON_MAIN",
        "parent_mandi_id": None,
        "mandi_name": "Lasalgaon Onion Mandi Yard",
        "mandi_name_local": "लासलगाव कांदा मुख्य बाजार समिती",
        "mandi_tier": "PRINCIPAL_APMC",
        "state_code": 27, "district_code": 498, "subdistrict_code": 3955, "village_code": None,
        "state_name": "Maharashtra", "district_name": "Nashik", "subdistrict_name": "Niphad", "village_name": "Lasalgaon",
        "latitude": 20.1472, "longitude": 74.2255,
        "geocode_precision": "EXACT_YARD_PIN", "verification_status": "OFFICIAL",
        "market_days": "MON,TUE,WED,THU,FRI,SAT",
        "has_weighbridge": 1, "is_enam_enabled": 1, "mandi_cess_pct": 1.25,
        "agmarknet_code": "MH_NAS_05", "enam_code": "MH_ENAM_089"
    },
    {
        "mandi_id": "MH_KOLHAPUR_MAIN",
        "parent_mandi_id": None,
        "mandi_name": "Kolhapur APMC Market Yard",
        "mandi_name_local": "कोल्हापूर मुख्य शेती बाजार समिती (शाहू मार्केट)",
        "mandi_tier": "PRINCIPAL_APMC",
        "state_code": 27, "district_code": 515, "subdistrict_code": 4120, "village_code": None,
        "state_name": "Maharashtra", "district_name": "Kolhapur", "subdistrict_name": "Karvir", "village_name": "Kolhapur",
        "latitude": 16.7050, "longitude": 74.2433,
        "geocode_precision": "EXACT_YARD_PIN", "verification_status": "OFFICIAL",
        "market_days": "MON,TUE,WED,THU,FRI,SAT",
        "has_weighbridge": 1, "is_enam_enabled": 1, "mandi_cess_pct": 1.10,
        "agmarknet_code": "MH_KOL_01", "enam_code": "MH_ENAM_099"
    },
    {
        "mandi_id": "MH_PUNE_BARAMATI_MAIN",
        "parent_mandi_id": None,
        "mandi_name": "Baramati APMC Yard",
        "mandi_name_local": "बारामती कृषी उत्पन्न बाजार समिती",
        "mandi_tier": "PRINCIPAL_APMC",
        "state_code": 27, "district_code": 502, "subdistrict_code": 3988, "village_code": None,
        "state_name": "Maharashtra", "district_name": "Pune", "subdistrict_name": "Baramati", "village_name": "Baramati",
        "latitude": 18.1550, "longitude": 74.5800,
        "geocode_precision": "EXACT_YARD_PIN", "verification_status": "OFFICIAL",
        "market_days": "MON,TUE,WED,THU,FRI,SAT",
        "has_weighbridge": 1, "is_enam_enabled": 1, "mandi_cess_pct": 1.05,
        "agmarknet_code": "MH_PUN_04", "enam_code": "MH_ENAM_112"
    },

    # TALUKA SUB-YARDS (Up-Bazaars) — linked to Parent Mandi
    {
        "mandi_id": "MH_LATUR_MURUD_SUB",
        "parent_mandi_id": "MH_LATUR_MAIN",
        "mandi_name": "Murud APMC Sub-Yard",
        "mandi_name_local": "मुरुड उपबाजार (लातूर उपकेंद्र)",
        "mandi_tier": "SUB_YARD",
        "state_code": 27, "district_code": 505, "subdistrict_code": 4012, "village_code": 582450,
        "state_name": "Maharashtra", "district_name": "Latur", "subdistrict_name": "Latur", "village_name": "Murud",
        "latitude": 18.4680, "longitude": 76.4150,
        "geocode_precision": "EXACT_YARD_PIN", "verification_status": "OFFICIAL",
        "market_days": "MON,TUE,WED,THU,FRI",
        "has_weighbridge": 1, "is_enam_enabled": 0, "mandi_cess_pct": 0.85,
        "agmarknet_code": None, "enam_code": None
    },
    {
        "mandi_id": "MH_BEED_BARDAPUR_SUB",
        "parent_mandi_id": "MH_BEED_AMBEJOGAI_MAIN",
        "mandi_name": "Bardapur Sub-Yard",
        "mandi_name_local": "बर्दापूर उपबाजार समिती",
        "mandi_tier": "SUB_YARD",
        "state_code": 27, "district_code": 504, "subdistrict_code": 4006, "village_code": 582090,
        "state_name": "Maharashtra", "district_name": "Beed", "subdistrict_name": "Ambejogai", "village_name": "Bardapur",
        "latitude": 18.6650, "longitude": 76.4650,
        "geocode_precision": "EXACT_YARD_PIN", "verification_status": "OFFICIAL",
        "market_days": "MON,WED,FRI",
        "has_weighbridge": 1, "is_enam_enabled": 0, "mandi_cess_pct": 0.80,
        "agmarknet_code": None, "enam_code": None
    },
    {
        "mandi_id": "MH_BEED_SIRSALA_SUB",
        "parent_mandi_id": "MH_BEED_PARLI_MAIN",
        "mandi_name": "Sirsala Cotton Sub-Yard",
        "mandi_name_local": "शिरसाळा कापूस उपबाजार",
        "mandi_tier": "SUB_YARD",
        "state_code": 27, "district_code": 504, "subdistrict_code": 4007, "village_code": 582145,
        "state_name": "Maharashtra", "district_name": "Beed", "subdistrict_name": "Parli", "village_name": "Sirsala",
        "latitude": 18.9600, "longitude": 76.4800,
        "geocode_precision": "EXACT_YARD_PIN", "verification_status": "OFFICIAL",
        "market_days": "TUE,THU,SAT",
        "has_weighbridge": 1, "is_enam_enabled": 0, "mandi_cess_pct": 0.80,
        "agmarknet_code": None, "enam_code": None
    },
    {
        "mandi_id": "MH_KOLHAPUR_SHIROL_SUB",
        "parent_mandi_id": "MH_KOLHAPUR_MAIN",
        "mandi_name": "Shirol Agri Sub-Yard",
        "mandi_name_local": "शिरोळ शेतमाल उपबाजार",
        "mandi_tier": "SUB_YARD",
        "state_code": 27, "district_code": 515, "subdistrict_code": 4124, "village_code": 583100,
        "state_name": "Maharashtra", "district_name": "Kolhapur", "subdistrict_name": "Shirol", "village_name": "Shirol",
        "latitude": 16.7150, "longitude": 74.5950,
        "geocode_precision": "EXACT_YARD_PIN", "verification_status": "OFFICIAL",
        "market_days": "MON,WED,FRI",
        "has_weighbridge": 1, "is_enam_enabled": 0, "mandi_cess_pct": 0.75,
        "agmarknet_code": None, "enam_code": None
    },

    # RURAL WEEKLY HAATS (GrAMs) — Mission Antyodaya Rural Markets
    {
        "mandi_id": "MH_BEED_GHATNANDUR_HAAT",
        "parent_mandi_id": "MH_BEED_AMBEJOGAI_MAIN",
        "mandi_name": "Ghatnandur Weekly Haat (GrAM)",
        "mandi_name_local": "घाटनांदूर आठवडी ग्रामीण बाजार",
        "mandi_tier": "GRAM_HAAT",
        "state_code": 27, "district_code": 504, "subdistrict_code": 4006, "village_code": 582075,
        "state_name": "Maharashtra", "district_name": "Beed", "subdistrict_name": "Ambejogai", "village_name": "Ghatnandur",
        "latitude": 18.6750, "longitude": 76.3200,
        "geocode_precision": "VILLAGE_CENTROID", "verification_status": "OFFICIAL",
        "market_days": "MON,FRI",  # Active days: Monday & Friday
        "has_weighbridge": 0, "is_enam_enabled": 0, "mandi_cess_pct": 0.0, # Zero APMC cess at Haats!
        "agmarknet_code": None, "enam_code": None
    },
    {
        "mandi_id": "MH_BEED_LOKHANDI_HAAT",
        "parent_mandi_id": "MH_BEED_AMBEJOGAI_MAIN",
        "mandi_name": "Lokhandi Savargaon Haat",
        "mandi_name_local": "लोखंडी सावरगाव आठवडी बाजार",
        "mandi_tier": "GRAM_HAAT",
        "state_code": 27, "district_code": 504, "subdistrict_code": 4006, "village_code": 582080,
        "state_name": "Maharashtra", "district_name": "Beed", "subdistrict_name": "Ambejogai", "village_name": "Lokhandi Savargaon",
        "latitude": 18.7850, "longitude": 76.4150,
        "geocode_precision": "VILLAGE_CENTROID", "verification_status": "COMMUNITY_VERIFIED",
        "market_days": "FRI",      # Active day: Friday
        "has_weighbridge": 0, "is_enam_enabled": 0, "mandi_cess_pct": 0.0,
        "agmarknet_code": None, "enam_code": None
    },
    {
        "mandi_id": "MH_LATUR_RENAPUR_HAAT",
        "parent_mandi_id": "MH_LATUR_MAIN",
        "mandi_name": "Renapur Rural Haat",
        "mandi_name_local": "रेणापूर रविवार आठवडी बाजार",
        "mandi_tier": "GRAM_HAAT",
        "state_code": 27, "district_code": 505, "subdistrict_code": 4015, "village_code": 582520,
        "state_name": "Maharashtra", "district_name": "Latur", "subdistrict_name": "Renapur", "village_name": "Renapur",
        "latitude": 18.5250, "longitude": 76.5400,
        "geocode_precision": "VILLAGE_CENTROID", "verification_status": "OFFICIAL",
        "market_days": "SUN,THU",
        "has_weighbridge": 0, "is_enam_enabled": 0, "mandi_cess_pct": 0.0,
        "agmarknet_code": None, "enam_code": None
    },

    # FPO & PRIVATE DIRECT PROCUREMENT CENTERS
    {
        "mandi_id": "MH_FPO_LATUR_HUB",
        "parent_mandi_id": None,
        "mandi_name": "MahaFPO Latur Oilseed Cluster",
        "mandi_name_local": "महाएफपीओ शेतकरी उत्पादक कंपनी खरेदी केंद्र",
        "mandi_tier": "FPO_CENTER",
        "state_code": 27, "district_code": 505, "subdistrict_code": 4012, "village_code": 582410,
        "state_name": "Maharashtra", "district_name": "Latur", "subdistrict_name": "Latur", "village_name": "Harangul",
        "latitude": 18.3850, "longitude": 76.5150,
        "geocode_precision": "EXACT_YARD_PIN", "verification_status": "OFFICIAL",
        "market_days": "MON,TUE,WED,THU,FRI,SAT",
        "has_weighbridge": 1, "is_enam_enabled": 0, "mandi_cess_pct": 0.0, # Zero market cess!
        "agmarknet_code": None, "enam_code": None
    },
    {
        "mandi_id": "MH_FPO_BALIRAJA_AMBEJOGAI",
        "parent_mandi_id": None,
        "mandi_name": "Baliraja Farmer Producer Center",
        "mandi_name_local": "बळीराजा शेतकरी उत्पादक केंद्र (अंबाजोगाई)",
        "mandi_tier": "FPO_CENTER",
        "state_code": 27, "district_code": 504, "subdistrict_code": 4006, "village_code": 582062,
        "state_name": "Maharashtra", "district_name": "Beed", "subdistrict_name": "Ambejogai", "village_name": "Somanwadi",
        "latitude": 18.7180, "longitude": 76.3500,
        "geocode_precision": "EXACT_YARD_PIN", "verification_status": "OFFICIAL",
        "market_days": "MON,TUE,WED,THU,FRI,SAT",
        "has_weighbridge": 1, "is_enam_enabled": 0, "mandi_cess_pct": 0.0,
        "agmarknet_code": None, "enam_code": None
    },
]

# 2. Canonical Crosswalk Mapping (Binds raw API strings 1-to-1 to exact PostGIS pins)
MANDI_SOURCE_MAPPINGS: List[Dict[str, str]] = [
    # Agmarknet Raw Strings
    {"mandi_id": "MH_LATUR_MAIN", "source_name": "AGMARKNET", "external_market_string": "Latur"},
    {"mandi_id": "MH_LATUR_MAIN", "source_name": "AGMARKNET", "external_market_string": "Latur(Grain)"},
    {"mandi_id": "MH_BEED_AMBEJOGAI_MAIN", "source_name": "AGMARKNET", "external_market_string": "Ambejogai"},
    {"mandi_id": "MH_BEED_PARLI_MAIN", "source_name": "AGMARKNET", "external_market_string": "Parli Vaijnath"},
    {"mandi_id": "MH_BEED_PARLI_MAIN", "source_name": "AGMARKNET", "external_market_string": "Parli"},
    {"mandi_id": "MH_BEED_MAIN", "source_name": "AGMARKNET", "external_market_string": "Beed"},
    {"mandi_id": "MH_NASHIK_LASALGAON_MAIN", "source_name": "AGMARKNET", "external_market_string": "Lasalgaon"},
    {"mandi_id": "MH_NASHIK_LASALGAON_MAIN", "source_name": "AGMARKNET", "external_market_string": "Lasalgaon(Niphad)"},
    {"mandi_id": "MH_KOLHAPUR_MAIN", "source_name": "AGMARKNET", "external_market_string": "Kolhapur"},
    {"mandi_id": "MH_PUNE_BARAMATI_MAIN", "source_name": "AGMARKNET", "external_market_string": "Baramati"},

    # MSAMB Maharashtra State Marketing Board Strings
    {"mandi_id": "MH_LATUR_MAIN", "source_name": "MSAMB", "external_market_string": "लातूर"},
    {"mandi_id": "MH_BEED_AMBEJOGAI_MAIN", "source_name": "MSAMB", "external_market_string": "अंबाजोगाई"},
    {"mandi_id": "MH_BEED_PARLI_MAIN", "source_name": "MSAMB", "external_market_string": "परळी वैजनाथ"},
    {"mandi_id": "MH_BEED_MAIN", "source_name": "MSAMB", "external_market_string": "बीड"},
    {"mandi_id": "MH_NASHIK_LASALGAON_MAIN", "source_name": "MSAMB", "external_market_string": "लासलगाव"},
    {"mandi_id": "MH_KOLHAPUR_MAIN", "source_name": "MSAMB", "external_market_string": "कोल्हापूर"},
    {"mandi_id": "MH_LATUR_MURUD_SUB", "source_name": "MSAMB", "external_market_string": "मुरुड"},
    {"mandi_id": "MH_BEED_BARDAPUR_SUB", "source_name": "MSAMB", "external_market_string": "बर्दापूर"},
    {"mandi_id": "MH_BEED_SIRSALA_SUB", "source_name": "MSAMB", "external_market_string": "शिरसाळा"},

    # e-NAM Codes
    {"mandi_id": "MH_LATUR_MAIN", "source_name": "ENAM", "external_market_string": "MH_ENAM_014"},
    {"mandi_id": "MH_BEED_AMBEJOGAI_MAIN", "source_name": "ENAM", "external_market_string": "MH_ENAM_022"},
    {"mandi_id": "MH_BEED_PARLI_MAIN", "source_name": "ENAM", "external_market_string": "MH_ENAM_023"},
    {"mandi_id": "MH_NASHIK_LASALGAON_MAIN", "source_name": "ENAM", "external_market_string": "MH_ENAM_089"},
    {"mandi_id": "MH_KOLHAPUR_MAIN", "source_name": "ENAM", "external_market_string": "MH_ENAM_099"},
]

# 3. Category -> Commodity -> Variety -> Grade Daily Price Records
def get_initial_price_records() -> List[Dict[str, Any]]:
    today_str = date.today().strftime("%Y-%m-%d")
    yesterday_str = (date.today() - timedelta(days=1)).strftime("%Y-%m-%d")

    return [
        # Latur Main APMC
        {
            "mandi_id": "MH_LATUR_MAIN", "category": "OILSEEDS", "commodity_id": "SOYBEAN",
            "variety": "Yellow", "grade": "FAQ",
            "min_price": 4450.0, "max_price": 4820.0, "modal_price": 4680.0,
            "arrival_tonnes": 850.0, "price_date": today_str, "source": "AGMARKNET", "confidence_score": 1.0
        },
        {
            "mandi_id": "MH_LATUR_MAIN", "category": "OILSEEDS", "commodity_id": "SOYBEAN",
            "variety": "Deshi", "grade": "Super",
            "min_price": 4700.0, "max_price": 5050.0, "modal_price": 4900.0,
            "arrival_tonnes": 220.0, "price_date": today_str, "source": "AGMARKNET", "confidence_score": 1.0
        },
        {
            "mandi_id": "MH_LATUR_MAIN", "category": "PULSES", "commodity_id": "TUR_ARHAR",
            "variety": "White (Gajraj)", "grade": "FAQ",
            "min_price": 7400.0, "max_price": 8100.0, "modal_price": 7850.0,
            "arrival_tonnes": 340.0, "price_date": today_str, "source": "AGMARKNET", "confidence_score": 1.0
        },

        # Ambejogai APMC
        {
            "mandi_id": "MH_BEED_AMBEJOGAI_MAIN", "category": "OILSEEDS", "commodity_id": "SOYBEAN",
            "variety": "Yellow", "grade": "FAQ",
            "min_price": 4350.0, "max_price": 4720.0, "modal_price": 4580.0,
            "arrival_tonnes": 420.0, "price_date": today_str, "source": "MSAMB", "confidence_score": 1.0
        },
        {
            "mandi_id": "MH_BEED_AMBEJOGAI_MAIN", "category": "FIBRES", "commodity_id": "COTTON",
            "variety": "Medium Staple", "grade": "FAQ",
            "min_price": 6800.0, "max_price": 7350.0, "modal_price": 7120.0,
            "arrival_tonnes": 310.0, "price_date": today_str, "source": "MSAMB", "confidence_score": 1.0
        },
        {
            "mandi_id": "MH_BEED_AMBEJOGAI_MAIN", "category": "PULSES", "commodity_id": "TUR_ARHAR",
            "variety": "Red (Marathwada)", "grade": "FAQ",
            "min_price": 7300.0, "max_price": 7950.0, "modal_price": 7720.0,
            "arrival_tonnes": 180.0, "price_date": today_str, "source": "MSAMB", "confidence_score": 1.0
        },

        # Parli Vaijnath APMC
        {
            "mandi_id": "MH_BEED_PARLI_MAIN", "category": "OILSEEDS", "commodity_id": "SOYBEAN",
            "variety": "Yellow", "grade": "FAQ",
            "min_price": 4400.0, "max_price": 4760.0, "modal_price": 4620.0,
            "arrival_tonnes": 390.0, "price_date": today_str, "source": "ENAM", "confidence_score": 1.0
        },
        {
            "mandi_id": "MH_BEED_PARLI_MAIN", "category": "FIBRES", "commodity_id": "COTTON",
            "variety": "Long Staple", "grade": "Super",
            "min_price": 7100.0, "max_price": 7580.0, "modal_price": 7380.0,
            "arrival_tonnes": 520.0, "price_date": today_str, "source": "ENAM", "confidence_score": 1.0
        },

        # Lasalgaon Onion Yard (Yesterday's auction to test timestamp honesty badge!)
        {
            "mandi_id": "MH_NASHIK_LASALGAON_MAIN", "category": "VEGETABLES", "commodity_id": "ONION",
            "variety": "Red / Gavran", "grade": "FAQ",
            "min_price": 1850.0, "max_price": 2450.0, "modal_price": 2180.0,
            "arrival_tonnes": 1450.0, "price_date": yesterday_str, "source": "AGMARKNET", "confidence_score": 1.0
        },

        # Kolhapur Market Yard
        {
            "mandi_id": "MH_KOLHAPUR_MAIN", "category": "CEREALS", "commodity_id": "WHEAT",
            "variety": "Sharbati / Lokwan", "grade": "FAQ",
            "min_price": 2550.0, "max_price": 2980.0, "modal_price": 2780.0,
            "arrival_tonnes": 240.0, "price_date": today_str, "source": "AGMARKNET", "confidence_score": 1.0
        },

        # MahaFPO Direct Center (Direct Aggregator rate with no middleman cess)
        {
            "mandi_id": "MH_FPO_LATUR_HUB", "category": "OILSEEDS", "commodity_id": "SOYBEAN",
            "variety": "Yellow", "grade": "FAQ",
            "min_price": 4600.0, "max_price": 4780.0, "modal_price": 4720.0,
            "arrival_tonnes": 95.0, "price_date": today_str, "source": "DERIVED_FPO_PREMIUM", "confidence_score": 0.95
        }
    ]

def seed_universal_registry():
    """Initializes tables and seeds the multi-tier registry and mappings."""
    init_registry_tables()

    with get_db_connection() as conn:
        # 1. Upsert Mandis
        for m in UNIFIED_MANDIS_SEED:
            conn.execute("""
            INSERT INTO unified_mandis (
                mandi_id, parent_mandi_id, mandi_name, mandi_name_local, mandi_tier,
                state_code, district_code, subdistrict_code, village_code,
                state_name, district_name, subdistrict_name, village_name,
                latitude, longitude, geocode_precision, verification_status,
                market_days, has_weighbridge, is_enam_enabled, mandi_cess_pct,
                agmarknet_code, enam_code
            ) VALUES (
                :mandi_id, :parent_mandi_id, :mandi_name, :mandi_name_local, :mandi_tier,
                :state_code, :district_code, :subdistrict_code, :village_code,
                :state_name, :district_name, :subdistrict_name, :village_name,
                :latitude, :longitude, :geocode_precision, :verification_status,
                :market_days, :has_weighbridge, :is_enam_enabled, :mandi_cess_pct,
                :agmarknet_code, :enam_code
            ) ON CONFLICT (mandi_id) DO UPDATE SET
                mandi_name = excluded.mandi_name,
                parent_mandi_id = excluded.parent_mandi_id,
                mandi_tier = excluded.mandi_tier,
                market_days = excluded.market_days,
                latitude = excluded.latitude,
                longitude = excluded.longitude,
                mandi_cess_pct = excluded.mandi_cess_pct;
            """, m)

        # 2. Upsert Canonical Mappings
        for mapping in MANDI_SOURCE_MAPPINGS:
            conn.execute("""
            INSERT INTO mandi_source_mapping (
                mandi_id, source_name, external_market_string
            ) VALUES (
                :mandi_id, :source_name, :external_market_string
            ) ON CONFLICT (source_name, external_market_string) DO UPDATE SET
                mandi_id = excluded.mandi_id;
            """, mapping)

        # 3. Upsert Daily Prices (Through Outlier Guard)
        prices = get_initial_price_records()
        for p in prices:
            valid, modal, min_p, max_p, reason = sanitize_and_validate_price(
                p["commodity_id"], p["modal_price"], p.get("min_price"), p.get("max_price")
            )
            if valid:
                conn.execute("""
                INSERT INTO daily_mandi_prices (
                    mandi_id, category, commodity_id, variety, grade,
                    min_price_per_qtl, max_price_per_qtl, modal_price_per_qtl,
                    arrival_tonnes, price_date, source, confidence_score, is_outlier
                ) VALUES (
                    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0
                ) ON CONFLICT (mandi_id, commodity_id, variety, grade, price_date) DO UPDATE SET
                    modal_price_per_qtl = excluded.modal_price_per_qtl,
                    min_price_per_qtl = excluded.min_price_per_qtl,
                    max_price_per_qtl = excluded.max_price_per_qtl,
                    source = excluded.source,
                    confidence_score = excluded.confidence_score;
                """, (
                    p["mandi_id"], p["category"], p["commodity_id"], p["variety"], p["grade"],
                    min_p, max_p, modal, p.get("arrival_tonnes"), p["price_date"],
                    p["source"], p.get("confidence_score", 1.0)
                ))

        conn.commit()
    print("✓ Universal Mandi Registry seeded with multi-tier yards, crosswalks & prices.")

if __name__ == "__main__":
    seed_universal_registry()


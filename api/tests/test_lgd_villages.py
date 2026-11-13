"""
Unit & Integration Tests for Local Government Directory (LGD) Village Subsystem
Tests State -> District -> Taluka -> Village navigation, FTS5 multi-lingual search,
spatial reverse geocoding, and CSV batch ingestion.
"""
import pytest
from fastapi.testclient import TestClient
from main import app
from services.village_directory.service import VillageDirectoryService
from services.village_directory.importer import import_lgd_csv

client = TestClient(app)

def test_lgd_states_endpoint():
    resp = client.get("/api/v1/lgd/states")
    assert resp.status_code == 200
    states = resp.json()
    assert len(states) >= 4
    mah = next((s for s in states if s["state_code"] == 27), None)
    assert mah is not None
    assert mah["state_name"] == "Maharashtra"
    assert mah["state_name_local"] == "महाराष्ट्र"

def test_lgd_all_36_maharashtra_districts():
    resp = client.get("/api/v1/lgd/districts?state=Maharashtra")
    assert resp.status_code == 200
    districts = resp.json()
    # All 36 districts of Maharashtra are present
    assert len(districts) == 36
    d_names = [d["district_name"] for d in districts]
    assert "Kolhapur" in d_names
    assert "Nashik" in d_names
    assert "Pune" in d_names
    assert "Ahmednagar" in d_names
    assert "Solapur" in d_names
    assert "Sangli" in d_names
    assert "Satara" in d_names
    assert "Jalgaon" in d_names

def test_lgd_talukas_for_district():
    resp = client.get("/api/v1/lgd/talukas?district=Kolhapur")
    assert resp.status_code == 200
    talukas = resp.json()
    assert len(talukas) >= 6
    t_names = [t["subdistrict_name"] for t in talukas]
    assert "Karvir" in t_names
    assert "Hatkanangale" in t_names
    assert "Shirol" in t_names

def test_lgd_villages_for_taluka():
    resp = client.get("/api/v1/lgd/villages?taluka=Karvir&district=Kolhapur")
    assert resp.status_code == 200
    villages = resp.json()
    assert len(villages) >= 5
    v_names = [v["village_name"] for v in villages]
    assert "Kasaba Bawada" in v_names
    assert "Uchgaon" in v_names
    first = villages[0]
    assert first["village_code"] > 0
    assert first["latitude"] > 0
    assert first["longitude"] > 0

def test_lgd_search_multilingual():
    # 1. Search in Marathi Devanagari
    resp_mr = client.get("/api/v1/lgd/search?q=शिर्डी")
    assert resp_mr.status_code == 200
    data_mr = resp_mr.json()
    assert data_mr["total_matches"] >= 1
    assert any("Shirdi" in v["village_name"] for v in data_mr["results"])

    # 2. Search in English
    resp_en = client.get("/api/v1/lgd/search?q=Lasalgaon")
    assert resp_en.status_code == 200
    data_en = resp_en.json()
    assert data_en["total_matches"] >= 1
    assert data_en["results"][0]["district_name"] == "Nashik"

def test_lgd_reverse_geocoding_nearest_village():
    # Coordinates of central Kolhapur (16.7050, 74.2433)
    resp = client.get("/api/v1/lgd/reverse?lat=16.7050&lon=74.2433&limit=3")
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "success"
    nearest = data["nearest_villages"]
    assert len(nearest) >= 1
    # Kasaba Bawada is ~1.8 km from Karvir center
    top = nearest[0]
    assert top["distance_km"] < 10.0
    assert top["district_name"] == "Kolhapur"

def test_lgd_csv_importer():
    sample_csv = """State LGD Code,State Name,District LGD Code,District Name,Subdistrict LGD Code,Subdistrict Name,Village LGD Code,Village Name,Village Name Local,Gram Panchayat,Pincode,Latitude,Longitude
27,Maharashtra,501,Kolhapur,4150,Karvir,999001,Test Agri Model Village,चाचणी कृषी गाव,Test GP,416001,16.7100,74.2500
"""
    summary = import_lgd_csv(sample_csv)
    assert summary.status == "success"
    assert summary.villages_imported == 1

    # Verify search finds the newly imported village
    found = VillageDirectoryService.search("Test Agri Model")
    assert len(found.results) >= 1
    assert found.results[0].village_code == 999001


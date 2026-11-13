"""
Integration Tests for FastAPI Routes (AGENTS.md Section 5.3)
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health():
    res = client.get("/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "ok"

def test_market_arbitrage_v1():
    payload = {
        "weight_quintals": 12.0,
        "vehicle_type": "tata_ace",
        "diesel_price_per_l": 92.5,
        "mandis": [
            {"id": "m1", "name": "Lasalgaon", "distance_km": 15.0, "modal_price_per_qtl": 2300.0},
            {"id": "m2", "name": "Pimpalgaon", "distance_km": 35.0, "modal_price_per_qtl": 2320.0}
        ]
    }
    res = client.post("/api/v1/market/arbitrage", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "success"
    assert len(data["ranking"]) == 2
    assert "net_earnings" in data["ranking"][0]

def test_agronomy_spray_window_v1():
    res = client.get("/api/v1/agronomy/spray-window?lat=20.1472&lon=74.2255")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "success"
    assert "evaluation" in data
    assert "safe_to_spray_now" in data["evaluation"]

def test_agronomy_diagnose_v1():
    payload = {
        "crop_name": "Tomato",
        "symptoms": "Dark concentric rings on lower leaves, early blight target spots",
        "lat": 20.1472,
        "lon": 74.2255
    }
    res = client.post("/api/v1/agronomy/diagnose", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "success"
    assert "prescription" in data
    assert "spraying_window" in data

if __name__ == "__main__":
    test_health()
    test_market_arbitrage_v1()
    test_agronomy_spray_window_v1()
    test_agronomy_diagnose_v1()
    print("✅ All FastAPI endpoint integration tests passed!")

"""
Unit Tests for Weather Spray Window Engine & MOS Downscaling (AGENTS.md Section 4.2 & Milestone 2)
"""
import sys
import os
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

# Ensure tests run deterministically in sandbox mode
os.environ["AGRIPULSE_OFFLINE"] = "true"

import pytest
from services.agronomy_guard.weather_client import evaluate_spraying_window


def test_weather_window_structure():
    """Validates that evaluation returns all required domain keys and MOS metadata"""
    res = evaluate_spraying_window(20.1472, 74.2255)

    assert "safe_to_spray_now" in res
    assert "rain_hazard" in res
    assert "wind_drift_hazard" in res
    assert "safe_window_hours" in res
    assert "action_advisory" in res
    assert "mos_downscaled" in res
    assert res["mos_downscaled"] is True
    assert "hourly_preview" in res
    assert len(res["hourly_preview"]) > 0
    assert isinstance(res["safe_window_hours"], list)


def test_convective_rain_lockout_override():
    """
    Test scenario:
    Global model predicts light drizzle (0.2 mm, 45% prob) at 15:00 on an August afternoon (33°C).
    Raw global NWP would NOT trigger the 0.5 mm threshold, but MOS Downscaler detects
    diurnal convective instability and triggers SPRAY_BLOCKED.
    """
    mock_payload = {
        "time": ["2026-08-15T15:00", "2026-08-15T16:00"],
        "precipitation": [0.2, 0.2],
        "precipitation_probability": [45.0, 45.0],
        "wind_speed_10m": [8.0, 9.0],
        "temperature_2m": [33.0, 32.5],
        "relative_humidity_2m": [60.0, 62.0]
    }

    res = evaluate_spraying_window(18.7120, 76.3450, mock_hourly_payload=mock_payload)

    assert res["mos_convective_risk_detected"] is True
    assert res["safe_to_spray_now"] is False
    assert res["rain_hazard"] is True
    assert "MOS Microclimate Downscaler Alert" in (res["lockout_reason"] or "")


if __name__ == "__main__":
    test_weather_window_structure()
    test_convective_rain_lockout_override()
    print("✅ All Weather Window & MOS unit tests passed!")

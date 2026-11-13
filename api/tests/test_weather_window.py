"""
Unit Tests for Weather Spray Window Engine (AGENTS.md Section 4.2 & Milestone 2)
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import pytest
import asyncio
from services.agronomy_guard.weather_client import evaluate_spraying_window

def test_weather_window_structure():
    """Validates that evaluation returns all required domain keys"""
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    res = loop.run_until_complete(evaluate_spraying_window(20.1472, 74.2255))
    loop.close()

    assert "safe_to_spray_now" in res
    assert "rain_hazard" in res
    assert "wind_drift_hazard" in res
    assert "safe_window_hours" in res
    assert "action_advisory" in res
    assert isinstance(res["safe_window_hours"], list)

if __name__ == "__main__":
    test_weather_window_structure()
    print("✅ All Weather Window unit tests passed!")

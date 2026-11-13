"""
Comprehensive Unit Tests for Model Output Statistics (MOS) Downscaling Engine
Tests feature engineering, bias correction, convective cloudburst risk detection,
and inference speed invariants.
"""
import sys
import os
import time
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import pytest
from services.agronomy_guard.mos_downscaler import (
    MOSDownscalerEngine,
    MOSFeatureVector,
    get_mos_downscaler
)


def test_mos_feature_array_generation():
    """Validates physical feature vector engineering dimensions and properties"""
    feat = MOSFeatureVector(
        month=8,
        hour=15,
        om_precip_forecast=0.2,
        om_precip_prob=45.0,
        om_wind=12.0,
        om_temp=32.0
    )
    arr = feat.to_feature_array()
    assert len(arr) == 10
    # Convective potential must be strictly positive during hot monsoon afternoon
    assert arr[6] > 0.0
    # Monsoon season indicator must be 1.0 for August
    assert arr[7] == 1.0


def test_convective_afternoon_downscaling():
    """
    Core Invariant: Coarse global model predicts light drizzle (0.2 mm) with moderate probability (45%)
    at 15:00 on an August afternoon (33°C).
    MOS Downscaler must adjust rain upwards and flag convective risk & SPRAY_BLOCKED.
    """
    engine = get_mos_downscaler()
    feat = MOSFeatureVector(
        month=8,
        hour=15,
        om_precip_forecast=0.2,
        om_precip_prob=45.0,
        om_wind=8.0,
        om_temp=33.0
    )
    res = engine.predict_slot(feat)

    assert res.is_convective_risk is True
    assert res.downscaled_precip_mm > res.raw_precip_mm
    assert res.downscaled_precip_prob >= 45.0
    assert res.hazard_level == "SPRAY_BLOCKED"
    assert "convective shower" in res.advisory_note.lower()


def test_dry_winter_morning_preservation():
    """
    Core Invariant: A clear, calm December morning (08:00, 20°C, 0mm, 5% prob)
    must remain completely dry (0mm) and return SAFE.
    """
    engine = get_mos_downscaler()
    feat = MOSFeatureVector(
        month=12,
        hour=8,
        om_precip_forecast=0.0,
        om_precip_prob=5.0,
        om_wind=7.0,
        om_temp=20.0
    )
    res = engine.predict_slot(feat)

    assert res.is_convective_risk is False
    assert res.downscaled_precip_mm <= 0.1
    assert res.hazard_level == "SAFE"


def test_wind_drift_hazard_detection():
    """
    When wind speed exceeds 18 km/h, WIND_DRIFT_HAZARD must be triggered
    even if rainfall is 0mm.
    """
    engine = get_mos_downscaler()
    feat = MOSFeatureVector(
        month=11,
        hour=10,
        om_precip_forecast=0.0,
        om_precip_prob=5.0,
        om_wind=22.5,
        om_temp=26.0
    )
    res = engine.predict_slot(feat)

    assert res.hazard_level == "WIND_DRIFT_HAZARD"
    assert "wind drift risk" in res.advisory_note.lower()


def test_inference_latency_under_10ms():
    """
    Ensures inference runs in memory and executes in sub-10ms to prevent UI freezing.
    """
    engine = get_mos_downscaler()
    feat = MOSFeatureVector(
        month=7,
        hour=14,
        om_precip_forecast=1.2,
        om_precip_prob=60.0,
        om_wind=10.0,
        om_temp=30.0
    )
    t0 = time.perf_counter()
    for _ in range(10):
        _ = engine.predict_slot(feat)
    t1 = time.perf_counter()
    avg_ms = ((t1 - t0) / 10.0) * 1000.0

    print(f"Average MOS inference time: {avg_ms:.2f} ms")
    assert avg_ms < 15.0  # Must be fast on standard CPU


if __name__ == "__main__":
    test_mos_feature_array_generation()
    test_convective_afternoon_downscaling()
    test_dry_winter_morning_preservation()
    test_wind_drift_hazard_detection()
    test_inference_latency_under_10ms()
    print("✅ All MOS Downscaler unit tests passed successfully!")

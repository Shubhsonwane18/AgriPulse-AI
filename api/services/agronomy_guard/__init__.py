"""
Agronomy Guard Service Module
Couples leaf pathology diagnosis with 48-hour hourly weather lockout validation.
"""
from .weather_client import evaluate_spraying_window
from .advisory_rules import CIBRC_ADVISORY_DATABASE, get_cibrc_recommendation
from .vision_infer import diagnose_crop_pathology

__all__ = [
    "evaluate_spraying_window",
    "CIBRC_ADVISORY_DATABASE",
    "get_cibrc_recommendation",
    "diagnose_crop_pathology",
]


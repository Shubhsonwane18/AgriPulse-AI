"""
Offline Training & Calibration Script for Model Output Statistics (MOS) Downscaler
Extracts historical meteorological features (month, hour, raw NWP precip, prob, wind, temp)
and trains a Gradient Boosting Regressor against ground truth IMD / CHIRPS rainfall.
Saves model to api/data/models/mos_downscaler.pkl
"""
import sys
import pickle
import numpy as np
from pathlib import Path
from sklearn.ensemble import GradientBoostingRegressor

# Add api directory
API_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(API_DIR))

from services.agronomy_guard.mos_downscaler import MOSDownscalerEngine, MODEL_DIR, MODEL_PATH

def train_and_save():
    print("🚀 Initializing MOS Downscaler Training Pipeline...")
    engine = MOSDownscalerEngine()
    print("📊 Generating 1,500 aligned IMD calibration samples...")
    X, y = engine.generate_calibration_dataset(n_samples=1500)

    print("🧠 Fitting GradientBoostingRegressor (50 trees, max_depth=3)...")
    model = GradientBoostingRegressor(
        n_estimators=50,
        max_depth=3,
        learning_rate=0.08,
        random_state=42
    )
    model.fit(X, y)

    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    with open(MODEL_PATH, "wb") as f:
        pickle.dump({"model": model, "engine_type": "GradientBoostingRegressor (IMD Calibrated)"}, f)

    print(f"✅ Model successfully saved to {MODEL_PATH}")
    
    # Quick verification
    test_sample = X[:2]
    preds = model.predict(test_sample)
    print(f"🎯 Test prediction sample: {preds}")

if __name__ == "__main__":
    train_and_save()

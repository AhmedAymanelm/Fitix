def get_mock_inbody_data() -> dict:
    """Simulated Response for UI Development"""
    return {
        "profile": {
            "name": "MOAED",
            "date": "2026-06-18 13:47",
            "age": "15",
            "height": "174",
            "gender": "Male"
        },
        "metrics": {
            "weight": 86.0,
            "bmi": 28.4,
            "tbf_percent": 28.0,
            "vfi": 13.8,
            "sm_percent": 28.3,
            "ffm": 61.92,
            "fm": 24.08,
            "tbw_percent": 47.6
        },
        "metabolism": {
            "bmr": 1707.0,
            "recommended_intake": 2012.0,
            "total_score": 54.4,
            "bio_age": 23.0
        },
        "weight_control": {
            "reduce_weight": "13.6 ~ 30.0 kg",
            "reduce_fat": "5.2 ~ 14.6 kg",
            "increase_muscle": "5.8 ~ 17.8 kg",
            "increase_water": "2.1 ~ 19.3 kg"
        },
        "is_mock": True
    }

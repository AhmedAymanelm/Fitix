def get_inbody_prompt() -> str:
    return """
You are an expert fitness data analyst. Read this InBody composition report.
Extract the values exactly as they appear for the user.
Make sure to get the exact numbers for Weight, BMI, TBF%, VFI, SM%, FFM, FM, and TBW%.
Also extract the BMR, recommended calorie intake, total score, and bio-age.
Finally, extract the weight control advice ranges.

Ensure your response is valid JSON that PERFECTLY matches this structure:
{
  "profile": {
    "name": "string",
    "date": "string",
    "age": "string",
    "height": "string",
    "gender": "string"
  },
  "metrics": {
    "weight": 0.0,
    "bmi": 0.0,
    "tbf_percent": 0.0,
    "vfi": 0.0,
    "sm_percent": 0.0,
    "ffm": 0.0,
    "fm": 0.0,
    "tbw_percent": 0.0
  },
  "metabolism": {
    "bmr": 0.0,
    "recommended_intake": 0.0,
    "total_score": 0.0,
    "bio_age": 0.0
  },
  "weight_control": {
    "reduce_weight": "string",
    "reduce_fat": "string",
    "increase_muscle": "string",
    "increase_water": "string"
  }
}
Return ONLY the raw JSON object, without any markdown formatting.
"""

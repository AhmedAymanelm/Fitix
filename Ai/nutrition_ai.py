import os
import json
import requests
from typing import List

from Ai.prompts.nutrition_prompt import get_nutrition_prompt

def generate_nutrition_plan(client_data: dict, food_items: list[dict]) -> dict:
    """
    Generates a nutrition plan using Gemini AI based on client data.
    Falls back to mock data if no API key is configured.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    print(f"[AI] GEMINI_API_KEY set: {bool(api_key)}")

    if not api_key:
        raise ValueError("مفتاح API الخاص بـ Gemini غير متوفر. يرجى إضافة GEMINI_API_KEY في إعدادات البيئة (Railway Variables).")

    # Build the food catalog string
    food_catalog = "\n".join([
        f"- {f['name']} ({f['category']}): {f['calories']} سعرة | بروتين {f['protein']}g | كارب {f['carbs']}g | دهون {f['fats']}g (لكل 100 جرام)"
        for f in food_items
    ])

    prompt = get_nutrition_prompt(client_data, food_catalog)

    models_to_try = [
        "gemini-3.5-flash",
        "gemini-3.5-flash-lite",
        "gemini-3.1-pro-preview",
        "gemini-flash-latest"
    ]
    
    payload = {
        "contents": [
            {
                "role": "user",
                "parts": [{"text": prompt}]
            }
        ],
        "generationConfig": {
            "responseMimeType": "application/json",
            "temperature": 0.7
        }
    }
    
    headers = {"Content-Type": "application/json"}
    
    last_error = None
    for model_name in models_to_try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"
        try:
            print(f"[AI] Calling Gemini REST API with model {model_name}, food items: {len(food_items)}")
            resp = requests.post(url, json=payload, headers=headers)
            
            if resp.status_code == 200:
                data = resp.json()
                try:
                    raw_text = data["candidates"][0]["content"]["parts"][0]["text"]
                except Exception:
                    raise ValueError(f"خطأ في تحليل استجابة الذكاء الاصطناعي: {json.dumps(data)}")
                    
                # Clean up any potential markdown formatting
                raw_text = raw_text.strip()
                if raw_text.startswith("```json"):
                    raw_text = raw_text[7:]
                if raw_text.startswith("```"):
                    raw_text = raw_text[3:]
                if raw_text.endswith("```"):
                    raw_text = raw_text[:-3]

                result = json.loads(raw_text.strip())
                return result
            else:
                error_text = resp.text
                print(f"[AI] Gemini API Error with {model_name}: {resp.status_code} - {error_text}")
                last_error = f"السيرفر مشغول أو النموذج غير متاح ({resp.status_code})"
                if resp.status_code == 429:
                    last_error = "تم تجاوز الحد المسموح به للطلبات (Rate Limit)."
                    # Don't try other models if rate limited
                    break
        except Exception as e:
            print(f"[AI] Gemini REST API error with {model_name}: {type(e).__name__}: {e}")
            last_error = str(e)

    raise ValueError(f"فشل توليد النظام الغذائي بعد المحاولة بعدة نماذج. آخر خطأ: {last_error}")

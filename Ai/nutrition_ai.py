import os
import json
from typing import List

from Ai.prompts.nutrition_prompt import get_nutrition_prompt


# Check if google-generativeai is available
try:
    import google.generativeai as genai_sdk
    GENAI_AVAILABLE = True
except ImportError:
    GENAI_AVAILABLE = False


def generate_nutrition_plan(client_data: dict, food_items: list[dict]) -> dict:
    """
    Generates a nutrition plan using Gemini AI based on client data.
    Falls back to mock data if no API key is configured.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    print(f"[AI] GEMINI_API_KEY set: {bool(api_key)}")
    print(f"[AI] google-generativeai available: {GENAI_AVAILABLE}")

    if not GENAI_AVAILABLE:
        raise ValueError("مكتبة الذكاء الاصطناعي (google-generativeai) غير مثبتة.")
    if not api_key:
        raise ValueError("مفتاح API الخاص بـ Gemini غير متوفر. يرجى إضافة GEMINI_API_KEY في إعدادات البيئة (Railway Variables).")

    # Build the food catalog string
    food_catalog = "\n".join([
        f"- {f['name']} ({f['category']}): {f['calories']} سعرة | بروتين {f['protein']}g | كارب {f['carbs']}g | دهون {f['fats']}g (لكل 100 جرام)"
        for f in food_items
    ])

    prompt = get_nutrition_prompt(client_data, food_catalog)

    try:
        genai_sdk.configure(api_key=api_key)
        print(f"[AI] Calling Gemini API, food items: {len(food_items)}")

        models_to_try = [
            "gemini-1.5-flash",
            "gemini-2.0-flash",
        ]

        response = None
        errors = []

        for model_name in models_to_try:
            try:
                print(f"[AI] Trying model {model_name}...")
                model = genai_sdk.GenerativeModel(model_name)
                response = model.generate_content(
                    prompt,
                    generation_config=genai_sdk.types.GenerationConfig(
                        response_mime_type="application/json",
                        temperature=0.7
                    )
                )
                print(f"[AI] Model {model_name} succeeded!")
                break
            except Exception as e:
                errors.append(f"{model_name}: {str(e)}")
                if "429" in str(e) or "RESOURCE_EXHAUSTED" in str(e):
                    raise ValueError("تم تجاوز الحد المسموح به للطلبات (Rate Limit). يرجى المحاولة لاحقاً.")
                print(f"[AI] Model {model_name} failed: {str(e)}")
                continue

        if not response:
            error_details = " | ".join(errors)
            raise ValueError(f"فشل توليد النظام الغذائي. الأخطاء: {error_details}")

        print(f"[AI] Gemini response received, length: {len(response.text)}")

        # Clean up any potential markdown formatting
        raw_text = response.text.strip()
        if raw_text.startswith("```json"):
            raw_text = raw_text[7:]
        if raw_text.startswith("```"):
            raw_text = raw_text[3:]
        if raw_text.endswith("```"):
            raw_text = raw_text[:-3]

        result = json.loads(raw_text.strip())
        return result

    except Exception as e:
        print(f"[AI] Gemini API error: {type(e).__name__}: {e}")
        raise RuntimeError(f"Gemini API فشل: {type(e).__name__}: {e}")

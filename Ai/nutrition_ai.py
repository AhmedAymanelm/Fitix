import os
import json
from typing import List

from Ai.prompts.nutrition_prompt import get_nutrition_prompt
from Ai.mocks.nutrition_mock import get_mock_nutrition_plan

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

    if not api_key or not GENAI_AVAILABLE:
        return get_mock_nutrition_plan(client_data)

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
            "gemini-1.5-flash-latest",
            "gemini-1.5-pro",
            "gemini-pro",
        ]

        response = None
        last_error = None

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
                last_error = str(e)
                if "429" in last_error or "RESOURCE_EXHAUSTED" in last_error:
                    raise
                print(f"[AI] Model {model_name} failed: {last_error}")
                continue

        if not response:
            raise ValueError(f"فشل توليد النظام الغذائي. آخر خطأ: {last_error}")

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

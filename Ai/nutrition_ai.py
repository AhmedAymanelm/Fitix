import os
import json

# Import schemas, prompts, and mocks
from Ai.schemas.nutrition_schema import NutritionPlanOutput
from Ai.prompts.nutrition_prompt import get_nutrition_prompt
from Ai.mocks.nutrition_mock import get_mock_nutrition_plan

# Check if google-genai is available
try:
    from google import genai
    from google.genai import types
except ImportError:
    genai = None

def generate_nutrition_plan(client_data: dict, food_items: list[dict]) -> dict:
    """
    Generates a nutrition plan using Gemini AI based on client data
    and ONLY food items available in the database.
    Supports workout schedule, health notes, and 3-4 meal alternatives.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    
    if not api_key or not genai:
        return get_mock_nutrition_plan(client_data)
    
    # Build the food catalog string
    food_catalog = "\n".join([
        f"- {f['name']} ({f['category']}): {f['calories']} سعرة | بروتين {f['protein']}g | كارب {f['carbs']}g | دهون {f['fats']}g (لكل 100 جرام)"
        for f in food_items
    ])
    
    prompt = get_nutrition_prompt(client_data, food_catalog)

    try:
        client = genai.Client(api_key=api_key)
        
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=NutritionPlanOutput,
                temperature=0.7,
            )
        )
        
        result = json.loads(response.text)
        return result
        
    except Exception as e:
        print(f"Gemini API error: {e}")
        return get_mock_nutrition_plan(client_data)

import os
import json
from io import BytesIO
from PIL import Image

# Import schemas, prompts, and mocks
from Ai.schemas.inbody_schema import InBodyData
from Ai.prompts.inbody_prompt import get_inbody_prompt
from Ai.mocks.inbody_mock import get_mock_inbody_data

# Check if google-genai is available
try:
    from google import genai
    from google.genai import types
except ImportError:
    genai = None

def parse_inbody_image(image_bytes: bytes) -> dict:
    """
    Parses an InBody image using Gemini 1.5 Flash and returns structured JSON.
    If no GEMINI_API_KEY is found, returns mock data for demo purposes.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    
    if not api_key or not genai:
        return get_mock_inbody_data()

    # ── Real AI Integration ──
    try:
        client = genai.Client(api_key=api_key)
        
        # Open image using PIL
        img = Image.open(BytesIO(image_bytes))
        
        prompt = get_inbody_prompt()
        
        response = client.models.generate_content(
            model="gemini-flash-latest",
            contents=[img, prompt],
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=InBodyData,
                temperature=0.1
            )
        )
        
        data = json.loads(response.text)
        data["is_mock"] = False
        return data
        
    except Exception as e:
        error_msg = str(e)
        if "429" in error_msg or "RESOURCE_EXHAUSTED" in error_msg:
            raise ValueError("لقد استهلكت الحد الأقصى للطلبات المجانية في الدقيقة. يرجى الانتظار لمدة دقيقة واحدة ثم المحاولة مرة أخرى.")
        print(f"OCR Error: {e}")
        raise ValueError(f"فشل تحليل التقرير: {error_msg}")

import os
import json
from io import BytesIO
from PIL import Image

from Ai.prompts.inbody_prompt import get_inbody_prompt
# Check if google-generativeai is available
try:
    import google.generativeai as genai_sdk
    GENAI_AVAILABLE = True
except ImportError:
    GENAI_AVAILABLE = False


def parse_inbody_image(image_bytes: bytes) -> dict:
    """
    Parses an InBody image using Gemini Flash and returns structured JSON.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    print(f"[AI] GEMINI_API_KEY set: {bool(api_key)}")
    print(f"[AI] google-generativeai available: {GENAI_AVAILABLE}")

    if not api_key or not GENAI_AVAILABLE:
        raise ValueError("تكامل الذكاء الاصطناعي غير متوفر. تأكد من إعداد GEMINI_API_KEY و google-generativeai.")

    # ── Real AI Integration ──
    try:
        genai_sdk.configure(api_key=api_key)

        prompt = get_inbody_prompt()

        # Convert image bytes to PIL Image
        img = Image.open(BytesIO(image_bytes))

        models_to_try = [
            "gemini-1.5-flash",
            "gemini-1.5-flash-latest",
            "gemini-1.5-pro",
            "gemini-pro-vision",
        ]

        response = None
        last_error = None

        for model_name in models_to_try:
            try:
                print(f"[AI] Trying model {model_name}...")
                model = genai_sdk.GenerativeModel(model_name)
                response = model.generate_content(
                    [img, prompt],
                    generation_config=genai_sdk.types.GenerationConfig(
                        response_mime_type="application/json",
                        temperature=0.1
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
            raise ValueError(f"فشل التحليل. آخر خطأ: {last_error}")

        # Clean up any potential markdown formatting
        raw_text = response.text.strip()
        if raw_text.startswith("```json"):
            raw_text = raw_text[7:]
        if raw_text.startswith("```"):
            raw_text = raw_text[3:]
        if raw_text.endswith("```"):
            raw_text = raw_text[:-3]

        data = json.loads(raw_text.strip())
        data["is_mock"] = False
        return data

    except Exception as e:
        error_msg = str(e)
        if "429" in error_msg or "RESOURCE_EXHAUSTED" in error_msg:
            raise ValueError("لقد استهلكت الحد الأقصى للطلبات المجانية في الدقيقة. يرجى الانتظار لمدة دقيقة واحدة ثم المحاولة مرة أخرى.")
        print(f"[AI] OCR Error: {type(e).__name__}: {e}")
        raise ValueError(f"فشل تحليل التقرير: {error_msg}")

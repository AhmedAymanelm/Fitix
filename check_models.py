import os
import google.generativeai as genai_sdk
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("NO API KEY FOUND IN .env")
else:
    genai_sdk.configure(api_key=api_key)
    try:
        models = genai_sdk.list_models()
        print("AVAILABLE MODELS:")
        for m in models:
            if "generateContent" in m.supported_generation_methods:
                print(f"- {m.name}")
    except Exception as e:
        print(f"Error fetching models: {e}")

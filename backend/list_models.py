import os
from google import genai
from google.genai import types

client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
test_models = [
    "gemini-2.0-flash-lite",
    "gemini-flash-latest",
    "gemini-2.0-flash-001",
    "gemini-2.5-flash",
    "gemini-1.5-flash"
]

for m in test_models:
    print(f"Testing {m}...")
    try:
        response = client.models.generate_content(
            model=m,
            contents="Say hi"
        )
        print(f"SUCCESS: {m}")
        break
    except Exception as e:
        print(f"FAILED {m}: {e}")

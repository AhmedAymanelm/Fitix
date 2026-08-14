import os
import requests
import json

def generate_assistant_response(message: str, context: str = "") -> str:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return "عذراً، لم يتم إعداد مفتاح الذكاء الاصطناعي (GEMINI_API_KEY) في السيرفر."

    system_instruction = f"""أنت مساعد ذكي مخصص للكباتن والمدربين الرياضيين في نظام إدارة الجيم 'Fitix'. مهمتك هي الرد على استفسارات الكباتن حول تحليل بيانات العملاء، اقتراح أنظمة غذائية أو تمارين، وتقديم نصائح رياضية مبنية على أسس علمية. تحدث بلهجة مصرية احترافية، ودودة، ومحفزة.

إليك بيانات العملاء الحالية في قاعدة البيانات لكي تتمكن من الإجابة على أي استفسارات عنهم:
{context}

إذا سألك الكابتن عن عميل غير موجود في هذه القائمة، أخبره أنك لا تجد هذا العميل. لا تخترع بيانات من عندك.
"""

    models_to_try = [
        "gemini-3.5-flash",
        "gemini-3.5-flash-lite",
        "gemini-3.1-pro-preview",
        "gemini-flash-latest"
    ]
    
    payload = {
        "system_instruction": {
            "parts": [{"text": system_instruction}]
        },
        "contents": [
            {
                "role": "user",
                "parts": [{"text": message}]
            }
        ],
        "safetySettings": [
            {
                "category": "HARM_CATEGORY_HATE_SPEECH",
                "threshold": "BLOCK_NONE"
            },
            {
                "category": "HARM_CATEGORY_HARASSMENT",
                "threshold": "BLOCK_NONE"
            }
        ]
    }
    
    headers = {"Content-Type": "application/json"}
    
    last_error = None
    for model_name in models_to_try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"
        try:
            resp = requests.post(url, json=payload, headers=headers)
            if resp.status_code == 200:
                data = resp.json()
                try:
                    return data["candidates"][0]["content"]["parts"][0]["text"]
                except Exception:
                    return f"خطأ في تحليل الرد: {json.dumps(data)}"
            else:
                print(f"Gemini API Error with {model_name}: {resp.status_code} - {resp.text}")
                last_error = f"عذراً، رفض السيرفر الطلب (كود {resp.status_code})."
                if resp.status_code == 429:
                    last_error = "عذراً، تم تجاوز الحد المسموح للطلبات. جرب تاني كمان شوية."
                    break
        except Exception as e:
            print(f"Exception calling Gemini REST API with {model_name}: {e}")
            last_error = "عذراً، حدث خطأ في الاتصال بالذكاء الاصطناعي."
            
    return last_error

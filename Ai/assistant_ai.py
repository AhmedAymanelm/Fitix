import os
import requests
import json

def generate_assistant_response(message: str) -> str:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return "عذراً، لم يتم إعداد مفتاح الذكاء الاصطناعي (GEMINI_API_KEY) في السيرفر."

    system_instruction = "أنت مساعد ذكي مخصص للكباتن والمدربين الرياضيين في نظام إدارة الجيم 'Fitix'. مهمتك هي الرد على استفسارات الكباتن حول تحليل بيانات العملاء، اقتراح أنظمة غذائية أو تمارين، وتقديم نصائح رياضية مبنية على أسس علمية. تحدث بلهجة مصرية احترافية، ودودة، ومحفزة. إذا سألك الكابتن عن بيانات حية، أخبره أنك لا تملك صلاحية الوصول لقاعدة البيانات الحية بعد ولكنك تستطيع مساعدته في تحليل أي بيانات يكتبها لك."

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
    
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
    
    try:
        resp = requests.post(url, json=payload, headers=headers)
        if resp.status_code == 200:
            data = resp.json()
            try:
                return data["candidates"][0]["content"]["parts"][0]["text"]
            except Exception:
                return f"خطأ في تحليل الرد: {json.dumps(data)}"
        else:
            print(f"Gemini API Error: {resp.status_code} - {resp.text}")
            return f"عذراً، رفض السيرفر الطلب (كود {resp.status_code}). تأكد من صلاحية المفتاح (API Key) وأن المشروع مدعوم."
    except Exception as e:
        print(f"Exception calling Gemini REST API: {e}")
        return "عذراً، حدث خطأ في الاتصال بالذكاء الاصطناعي. يرجى المحاولة لاحقاً."

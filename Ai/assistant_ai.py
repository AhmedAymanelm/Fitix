import os
import google.generativeai as genai_sdk
from google.generativeai.types import HarmCategory, HarmBlockThreshold

def generate_assistant_response(message: str) -> str:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return "عذراً، لم يتم إعداد مفتاح الذكاء الاصطناعي (GEMINI_API_KEY) في السيرفر."

    genai_sdk.configure(api_key=api_key)
    
    system_instruction = """
أنت مساعد ذكي مخصص للكباتن والمدربين الرياضيين في نظام إدارة الجيم 'Fitix'.
مهمتك هي الرد على استفسارات الكباتن حول تحليل بيانات العملاء، اقتراح أنظمة غذائية أو تمارين، وتقديم نصائح رياضية مبنية على أسس علمية.
تحدث بلهجة مصرية احترافية، ودودة، ومحفزة. 
إذا سألك الكابتن عن بيانات حية، أخبره أنك لا تملك صلاحية الوصول لقاعدة البيانات الحية بعد ولكنك تستطيع مساعدته في تحليل أي بيانات يكتبها لك.
"""

    model = genai_sdk.GenerativeModel(
        model_name="gemini-1.5-flash",
        system_instruction=system_instruction,
    )
    
    try:
        response = model.generate_content(
            message,
            safety_settings={
                HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
                HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
            }
        )
        return response.text
    except Exception as e:
        print(f"Error calling Gemini: {e}")
        return "عذراً، حدث خطأ أثناء التواصل مع الذكاء الاصطناعي. يرجى المحاولة لاحقاً."

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

    models_to_try = [
        "gemini-2.5-flash",
        "gemini-2.0-flash",
        "gemini-1.5-flash-latest",
        "gemini-1.5-pro",
        "gemini-1.5-flash-8b",
        "gemini-1.0-pro"
    ]
    
    last_error = ""
    for model_name in models_to_try:
        try:
            model = genai_sdk.GenerativeModel(
                model_name=model_name,
                system_instruction=system_instruction,
            )
            
            response = model.generate_content(
                message,
                safety_settings={
                    HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
                    HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
                }
            )
            return response.text
        except Exception as e:
            last_error = str(e)
            continue
            
    print(f"Error calling Gemini: {last_error}")
    return "عذراً، حدث خطأ أثناء التواصل مع الذكاء الاصطناعي. يرجى المحاولة لاحقاً."

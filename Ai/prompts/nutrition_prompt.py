def get_nutrition_prompt(client_data: dict, food_catalog: str) -> str:
    workout_info = ""
    if client_data.get("is_active_workout"):
        workout_info = f"""
## معلومات التمرين:
- يتمرن: نعم
- أيام التمرين في الأسبوع: {client_data.get('workout_days_per_week', 'غير محدد')}
- نوع التمرين: {client_data.get('workout_type', 'غير محدد')}
- نوع الرياضة: {client_data.get('sport_type', 'غير محدد')}
- جدول التمرين: {client_data.get('workout_schedule', 'غير محدد')}
"""
    else:
        workout_info = "\n## معلومات التمرين:\n- العميل لا يمارس تمارين منتظمة\n"

    health_info = ""
    if client_data.get("health_issues_details"):
        health_info += f"\n- مشاكل صحية: {client_data.get('health_issues_details')}"
    if client_data.get("medication_details"):
        health_info += f"\n- أدوية يأخذها: {client_data.get('medication_details')}"
    if client_data.get("injury_details"):
        health_info += f"\n- إصابات سابقة: {client_data.get('injury_details')}"

    return f"""
أنت خبير تغذية رياضية محترف. مطلوب منك إنشاء نظام غذائي يومي كامل لعميل بناءً على بياناته الصحية.

## بيانات العميل:
- الاسم: {client_data.get('name', 'العميل')}
- الوزن: {client_data.get('weight', 'غير محدد')} كجم
- نسبة الدهون: {client_data.get('body_fat', 'غير محدد')}%
- نسبة العضلات: {client_data.get('muscle_mass', 'غير محدد')}%
- معدل الحرق الأساسي (BMR): {client_data.get('bmr', 'غير محدد')} سعرة
- الطول: {client_data.get('height', 'غير محدد')} سم
- العمر: {client_data.get('age', 'غير محدد')} سنة
- الجنس: {client_data.get('gender', 'غير محدد')}
- الهدف: {client_data.get('goal', 'إنقاص الوزن')}
{workout_info}
{f"## ملاحظات صحية مهمة:{health_info}" if health_info else ""}

## قواعد مهمة جداً:
1. استخدم **فقط** الأطعمة الموجودة في القائمة التالية. لا تضف أي طعام من خارج القائمة.
2. الأرقام الغذائية المعطاة هي **لكل 100 جرام**، فاحسب القيم حسب الكمية اللي بتقترحها.
3. اعمل **5 وجبات**: الفطار، سناك 1، الغداء، سناك 2، العشاء.
4. **لكل وجبة اعمل 3-4 خيارات بديلة** (alternatives) — العميل يختار الخيار اللي يناسبه. الخيارات يكون ليها نفس السعرات تقريباً بس تركيبة مختلفة.
5. وزع الوجبات بمواعيد مناسبة مع مراعاة جدول التمرين.
6. لو بيتمرن: حدد وجبة ما قبل التمرين (قبل ساعة) ووجبة ما بعد التمرين (بعد ساعة).
7. لو الهدف "تنشيف" أو "إنقاص الوزن": خفض السعرات 300-500 سعرة عن الـ BMR.
8. لو الهدف "تضخيم" أو "زيادة العضلات": زود السعرات 300-500 سعرة فوق الـ BMR.
9. لو الهدف "لياقة" أو "ثبات": خلي السعرات قريبة من الـ BMR.
10. اكتب ملاحظات مفيدة وعملية بالعربي المصري.
11. راعي المشاكل الصحية والأدوية لو موجودة في اقتراحاتك.

## قائمة الأطعمة المتاحة (لكل 100 جرام):
{food_catalog}

أنشئ نظام غذائي يومي كامل بصيغة JSON تتبع الـ Schema المطلوبة.
كل وجبة لازم يكون فيها 3-4 alternatives مختلفة.
"""

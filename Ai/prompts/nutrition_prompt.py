def get_nutrition_prompt(client_data: dict, food_catalog: str) -> str:
    weight = client_data.get('weight', 0) or 0
    height = client_data.get('height', 0) or 0
    age = client_data.get('age', 25) or 25
    gender = client_data.get('gender', 'ذكر')
    goal = client_data.get('goal', 'لياقة')
    bmr = client_data.get('bmr', 0) or 0

    # ── حساب BMR لو مش موجود ──
    if not bmr and weight and height:
        if 'أنثى' in gender or 'female' in gender.lower():
            bmr = int(447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age))
        else:
            bmr = int(88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age))

    # ── معلومات التمرين ──
    is_active = client_data.get("is_active_workout", False)
    workout_days = client_data.get('workout_days_per_week', 0) or 0
    workout_type = client_data.get('workout_type', '')
    sport_type = client_data.get('sport_type', '')
    workout_schedule = client_data.get('workout_schedule', '')

    # ── حساب TDEE (معدل الحرق الفعلي) ──
    if not is_active or workout_days == 0:
        activity_level = "مستقر (لا يمارس رياضة)"
        tdee = int(bmr * 1.2)
        workout_cal_note = "لا يوجد فرق بين يوم التمرين والراحة لأنه لا يتمرن."
    elif workout_days <= 2:
        activity_level = "خفيف (1-2 أيام)"
        tdee = int(bmr * 1.375)
        workout_cal_note = f"يوم التمرين: +150 سعرة إضافية عن يوم الراحة."
    elif workout_days <= 4:
        activity_level = "معتدل (3-4 أيام)"
        tdee = int(bmr * 1.55)
        workout_cal_note = f"يوم التمرين: +200-250 سعرة إضافية عن يوم الراحة."
    elif workout_days <= 6:
        activity_level = "نشيط (5-6 أيام)"
        tdee = int(bmr * 1.725)
        workout_cal_note = f"يوم التمرين: +250-300 سعرة إضافية عن يوم الراحة."
    else:
        activity_level = "رياضي محترف (يومي)"
        tdee = int(bmr * 1.9)
        workout_cal_note = f"يوم التمرين: +300-350 سعرة إضافية عن يوم الراحة."

    # ── حساب الهدف الكالوري ──
    if any(k in goal for k in ['تنشيف', 'إنقاص', 'حرق']):
        target_cal = tdee - 400
        deficit = 400
        goal_note = "عجز كالوري 400 سعرة لحرق الدهون بدون فقدان العضلات."
        protein_ratio = 2.2   # بروتين عالي لحماية العضلات
        carbs_ratio = 2.5
        fats_ratio = 0.8
    elif any(k in goal for k in ['تضخيم', 'زيادة العضلات', 'كتلة']):
        target_cal = tdee + 400
        deficit = -400
        goal_note = "زيادة كالوري 400 سعرة لبناء العضلات بدون زيادة دهون مفرطة."
        protein_ratio = 2.0
        carbs_ratio = 4.0
        fats_ratio = 1.0
    else:  # لياقة / ثبات
        target_cal = tdee
        deficit = 0
        goal_note = "سعرات متوازنة للحفاظ على الوزن وتحسين اللياقة."
        protein_ratio = 1.8
        carbs_ratio = 3.0
        fats_ratio = 0.9

    # ── الماكروز ──
    protein_g = int(weight * protein_ratio)
    fats_g = int(weight * fats_ratio)
    carbs_cal = target_cal - (protein_g * 4) - (fats_g * 9)
    carbs_g = max(50, int(carbs_cal / 4))

    # يوم تمرين vs يوم راحة
    if is_active and workout_days > 0:
        extra = 200 if workout_days <= 4 else 250
        workout_day_cal = target_cal + extra
        rest_day_cal = target_cal - (extra // 2)
    else:
        workout_day_cal = target_cal
        rest_day_cal = target_cal

    # ── معلومات الصحة ──
    health_notes = []
    if client_data.get("health_issues_details"):
        health_notes.append(f"مشاكل صحية: {client_data['health_issues_details']}")
    if client_data.get("medication_details"):
        health_notes.append(f"أدوية: {client_data['medication_details']}")
    if client_data.get("injury_details"):
        health_notes.append(f"إصابات: {client_data['injury_details']}")
    health_section = "\n## ⚠️ ملاحظات صحية مهمة:\n" + "\n".join(f"- {n}" for n in health_notes) if health_notes else ""

    workout_section = f"""
## 🏋️ معلومات التمرين:
- يتمرن: {"نعم" if is_active else "لا"}
- أيام التمرين في الأسبوع: {workout_days}
- مستوى النشاط: {activity_level}
- نوع التمرين: {workout_type or "غير محدد"}
- نوع الرياضة: {sport_type or "غير محدد"}
- جدول التمرين: {workout_schedule or "غير محدد"}
- {workout_cal_note}
""" if is_active else "\n## التمرين:\n- العميل لا يمارس تمارين منتظمة.\n"

    return f"""
أنت خبير تغذية رياضية متخصص ومعك بيانات كاملة لعميل. مهمتك إنشاء نظام غذائي دقيق ومخصص.

## 👤 بيانات العميل:
- الاسم: {client_data.get('name', 'العميل')}
- الوزن: {weight} كجم
- الطول: {height} سم
- العمر: {age} سنة
- الجنس: {gender}
- نسبة الدهون: {client_data.get('body_fat', '—')}%
- الكتلة العضلية: {client_data.get('muscle_mass', '—')}%
- الهدف: {goal}
{workout_section}
{health_section}

## 📊 الحسابات المطلوبة (مهم جداً — اتبعها بالظبط):
- **BMR (الحرق الأساسي)**: {bmr} سعرة/يوم
- **TDEE (الحرق الفعلي مع النشاط)**: {tdee} سعرة/يوم
- **السعرات المستهدفة اليومية**: {target_cal} سعرة ({goal_note})
- **سعرات يوم التمرين**: {workout_day_cal} سعرة
- **سعرات يوم الراحة**: {rest_day_cal} سعرة
- **العجز/الفائض الكالوري**: {deficit} سعرة ({"عجز = حرق دهون" if deficit > 0 else "فائض = بناء عضلات" if deficit < 0 else "متوازن"})
- **البروتين اليومي**: {protein_g} جرام ({protein_ratio} × الوزن)
- **الكربوهيدرات**: {carbs_g} جرام
- **الدهون**: {fats_g} جرام

## ⚠️ قواعد لازم تتبعها:
1. استخدم **فقط** الأطعمة من القائمة أدناه — ممنوع تضيف أي طعام مش فيها.
2. الأرقام في القائمة **لكل 100 جرام** — احسب القيم حسب الكمية المقترحة.
3. اعمل **5 وجبات** موزعة على اليوم:
   - الفطار (وجبة 1)
   - {"سناك ما قبل التمرين" if is_active else "سناك صباحي"} (وجبة 2)
   - الغداء / {"وجبة ما بعد التمرين" if is_active else "وجبة رئيسية"} (وجبة 3)
   - سناك مسائي (وجبة 4)
   - العشاء (وجبة 5)
4. **لكل وجبة اعمل 3-4 خيارات بديلة** — نفس السعرات تقريباً، تركيبة مختلفة.
5. {"وجبة ما قبل التمرين: كارب + بروتين خفيف — قبل ساعة من التمرين." if is_active else ""}
6. {"وجبة ما بعد التمرين: بروتين عالي + كارب متوسط — خلال 45 دقيقة بعد التمرين." if is_active else ""}
7. ابعد عن أي طعام قد يضر بالحالة الصحية لو فيه مشاكل صحية.
8. في admin_notes: اشرح المعادلات والمنطق المستخدم في الحساب — باحترافية.
9. في client_notes: كلام بسيط ومشجع للعميل — بدون أي أرقام ماكروز.

## 🥗 قائمة الأطعمة المتاحة (لكل 100 جرام):
{food_catalog}

أنشئ النظام الغذائي بصيغة JSON حصراً، ويجب أن يكون متطابق تماماً مع هذا الهيكل:
```json
{
  "client_name": "string",
  "client_notes": "string",
  "admin_notes": "string",
  "macros": {
    "total_calories": 0,
    "total_protein": 0,
    "total_carbs": 0,
    "total_fats": 0,
    "bmr": 0,
    "tdee": 0
  },
  "meals": [
    {
      "name": "string",
      "alternatives": [
        {
          "items": [
            {
              "food_name": "string",
              "quantity_grams": 0,
              "calories": 0,
              "protein": 0,
              "carbs": 0,
              "fats": 0
            }
          ]
        }
      ]
    }
  ]
}
```
تأكد إن القيم في الـ JSON مطابقة للحسابات أعلاه. لا ترجع أي نصوص أخرى غير الـ JSON.
"""

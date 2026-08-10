def get_mock_nutrition_plan(client_data: dict) -> dict:
    """Returns a mock nutrition plan for development/demo."""
    goal = client_data.get('goal', 'إنقاص الوزن')
    bmr = client_data.get('bmr', 1800)
    
    if 'تنشيف' in goal or 'إنقاص' in goal:
        daily_cal = int(bmr - 400) if bmr else 1400
    elif 'تضخيم' in goal or 'زيادة' in goal:
        daily_cal = int(bmr + 400) if bmr else 2200
    else:
        daily_cal = int(bmr) if bmr else 1800
    
    return {
        "daily_calories": daily_cal,
        "protein_target": 150,
        "carbs_target": 180,
        "fats_target": 50,
        "meals": [
            {
                "meal_name": "الفطار",
                "items": [
                    {"food_name": "بياض بيض", "quantity_grams": 200, "calories": 104, "protein": 22, "carbs": 1.6, "fats": 0},
                    {"food_name": "الشوفان", "quantity_grams": 50, "calories": 185, "protein": 6.5, "carbs": 33.5, "fats": 3.5},
                    {"food_name": "لبن خالي الدسم", "quantity_grams": 200, "calories": 70, "protein": 6, "carbs": 10, "fats": 6}
                ],
                "total_calories": 359
            },
            {
                "meal_name": "سناك 1",
                "items": [
                    {"food_name": "الزبادي الخالي الدسم", "quantity_grams": 150, "calories": 84, "protein": 8.5, "carbs": 11.5, "fats": 0.3},
                    {"food_name": "الموز", "quantity_grams": 100, "calories": 89, "protein": 1.1, "carbs": 22.8, "fats": 0.3}
                ],
                "total_calories": 173
            },
            {
                "meal_name": "الغداء",
                "items": [
                    {"food_name": "صدور فراخ", "quantity_grams": 200, "calories": 330, "protein": 62, "carbs": 0, "fats": 7.2},
                    {"food_name": "الأرز الأبيض", "quantity_grams": 150, "calories": 195, "protein": 4.05, "carbs": 42.15, "fats": 0.45},
                    {"food_name": "الخيار", "quantity_grams": 100, "calories": 15, "protein": 0.7, "carbs": 3.6, "fats": 0.1}
                ],
                "total_calories": 540
            },
            {
                "meal_name": "سناك 2",
                "items": [
                    {"food_name": "جبنة قريش", "quantity_grams": 100, "calories": 103, "protein": 12.5, "carbs": 2.7, "fats": 4.5},
                    {"food_name": "الطماطم", "quantity_grams": 100, "calories": 18, "protein": 0.9, "carbs": 3.9, "fats": 0.2}
                ],
                "total_calories": 121
            },
            {
                "meal_name": "العشاء",
                "items": [
                    {"food_name": "التونة", "quantity_grams": 100, "calories": 130, "protein": 28, "carbs": 0, "fats": 1},
                    {"food_name": "العيش البلدي (الأسمر)", "quantity_grams": 80, "calories": 200, "protein": 5.6, "carbs": 40, "fats": 1.6},
                    {"food_name": "الخس", "quantity_grams": 80, "calories": 12, "protein": 0.9, "carbs": 1.8, "fats": 0.1}
                ],
                "total_calories": 342
            }
        ],
        "notes": "⚠️ ده نظام تجريبي (Mock) — عشان نظام حقيقي لازم يتفعل مفتاح Gemini API.\n\n💡 نصائح عامة:\n- اشرب على الأقل 3 لتر مية يومياً.\n- كل وجبة الفطار في أول ساعة بعد ما تصحى.\n- فاصل بين كل وجبة والتانية من 2-3 ساعات.\n- ممنوع السكريات والمشروبات الغازية.",
        "is_mock": True
    }

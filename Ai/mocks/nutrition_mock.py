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
        "bmr": bmr or 1800,
        "workout_day_calories": daily_cal + 200,
        "rest_day_calories": daily_cal - 100,
        "caloric_deficit": 400 if 'تنشيف' in goal else -400,
        "total_protein": 150,
        "total_carbs": 180,
        "total_fats": 50,
        "admin_notes": "⚠️ ده نظام تجريبي (Mock) — عشان نظام حقيقي لازم يتفعل مفتاح Gemini API.",
        "client_notes": "اشرب على الأقل 3 لتر مية يومياً. كل وجبة الفطار في أول ساعة بعد ما تصحى.",
        "workout_nutrition_notes": "اكل سناك بروتين قبل التمرين بساعة وبعده بنص ساعة.",
        "meals": [
            {
                "meal_name": "الفطار",
                "meal_time": "7:00 ص",
                "meal_role": "فطار",
                "total_calories": 359,
                "alternatives": [
                    {
                        "alternative_label": "خيار 1",
                        "total_calories": 359,
                        "total_protein": 34,
                        "total_carbs": 45,
                        "total_fats": 9,
                        "items": [
                            {"food_name": "بياض بيض", "quantity_grams": 200, "calories": 104, "protein": 22, "carbs": 1.6, "fats": 0},
                            {"food_name": "الشوفان", "quantity_grams": 50, "calories": 185, "protein": 6.5, "carbs": 33.5, "fats": 3.5},
                            {"food_name": "لبن خالي الدسم", "quantity_grams": 200, "calories": 70, "protein": 6, "carbs": 10, "fats": 6}
                        ]
                    },
                    {
                        "alternative_label": "خيار 2",
                        "total_calories": 350,
                        "total_protein": 30,
                        "total_carbs": 40,
                        "total_fats": 8,
                        "items": [
                            {"food_name": "بيض كامل", "quantity_grams": 150, "calories": 215, "protein": 18, "carbs": 1, "fats": 15},
                            {"food_name": "العيش البلدي (الأسمر)", "quantity_grams": 80, "calories": 200, "protein": 5.6, "carbs": 40, "fats": 1.6}
                        ]
                    }
                ]
            },
            {
                "meal_name": "سناك 1",
                "meal_time": "10:00 ص",
                "meal_role": "سناك",
                "total_calories": 173,
                "alternatives": [
                    {
                        "alternative_label": "خيار 1",
                        "total_calories": 173,
                        "total_protein": 10,
                        "total_carbs": 34,
                        "total_fats": 1,
                        "items": [
                            {"food_name": "الزبادي الخالي الدسم", "quantity_grams": 150, "calories": 84, "protein": 8.5, "carbs": 11.5, "fats": 0.3},
                            {"food_name": "الموز", "quantity_grams": 100, "calories": 89, "protein": 1.1, "carbs": 22.8, "fats": 0.3}
                        ]
                    },
                    {
                        "alternative_label": "خيار 2",
                        "total_calories": 160,
                        "total_protein": 13,
                        "total_carbs": 20,
                        "total_fats": 4,
                        "items": [
                            {"food_name": "جبنة قريش", "quantity_grams": 100, "calories": 103, "protein": 12.5, "carbs": 2.7, "fats": 4.5},
                            {"food_name": "تفاحة", "quantity_grams": 100, "calories": 52, "protein": 0.3, "carbs": 14, "fats": 0.2}
                        ]
                    }
                ]
            },
            {
                "meal_name": "الغداء",
                "meal_time": "2:00 م",
                "meal_role": "غداء",
                "total_calories": 540,
                "alternatives": [
                    {
                        "alternative_label": "خيار 1",
                        "total_calories": 540,
                        "total_protein": 66,
                        "total_carbs": 46,
                        "total_fats": 8,
                        "items": [
                            {"food_name": "صدور فراخ", "quantity_grams": 200, "calories": 330, "protein": 62, "carbs": 0, "fats": 7.2},
                            {"food_name": "الأرز الأبيض", "quantity_grams": 150, "calories": 195, "protein": 4.05, "carbs": 42.15, "fats": 0.45},
                            {"food_name": "الخيار", "quantity_grams": 100, "calories": 15, "protein": 0.7, "carbs": 3.6, "fats": 0.1}
                        ]
                    },
                    {
                        "alternative_label": "خيار 2",
                        "total_calories": 520,
                        "total_protein": 60,
                        "total_carbs": 40,
                        "total_fats": 10,
                        "items": [
                            {"food_name": "لحم بقري", "quantity_grams": 150, "calories": 300, "protein": 48, "carbs": 0, "fats": 12},
                            {"food_name": "البطاطس المسلوقة", "quantity_grams": 150, "calories": 120, "protein": 3, "carbs": 27, "fats": 0.2},
                            {"food_name": "الطماطم", "quantity_grams": 100, "calories": 18, "protein": 0.9, "carbs": 3.9, "fats": 0.2}
                        ]
                    }
                ]
            },
            {
                "meal_name": "سناك 2",
                "meal_time": "5:00 م",
                "meal_role": "سناك",
                "total_calories": 121,
                "alternatives": [
                    {
                        "alternative_label": "خيار 1",
                        "total_calories": 121,
                        "total_protein": 13,
                        "total_carbs": 7,
                        "total_fats": 5,
                        "items": [
                            {"food_name": "جبنة قريش", "quantity_grams": 100, "calories": 103, "protein": 12.5, "carbs": 2.7, "fats": 4.5},
                            {"food_name": "الطماطم", "quantity_grams": 100, "calories": 18, "protein": 0.9, "carbs": 3.9, "fats": 0.2}
                        ]
                    }
                ]
            },
            {
                "meal_name": "العشاء",
                "meal_time": "9:00 م",
                "meal_role": "عشاء",
                "total_calories": 342,
                "alternatives": [
                    {
                        "alternative_label": "خيار 1",
                        "total_calories": 342,
                        "total_protein": 35,
                        "total_carbs": 42,
                        "total_fats": 3,
                        "items": [
                            {"food_name": "التونة", "quantity_grams": 100, "calories": 130, "protein": 28, "carbs": 0, "fats": 1},
                            {"food_name": "العيش البلدي (الأسمر)", "quantity_grams": 80, "calories": 200, "protein": 5.6, "carbs": 40, "fats": 1.6},
                            {"food_name": "الخس", "quantity_grams": 80, "calories": 12, "protein": 0.9, "carbs": 1.8, "fats": 0.1}
                        ]
                    },
                    {
                        "alternative_label": "خيار 2",
                        "total_calories": 320,
                        "total_protein": 40,
                        "total_carbs": 30,
                        "total_fats": 5,
                        "items": [
                            {"food_name": "صدور فراخ", "quantity_grams": 150, "calories": 247, "protein": 46, "carbs": 0, "fats": 5.4},
                            {"food_name": "الخضار المشكلة", "quantity_grams": 100, "calories": 30, "protein": 2, "carbs": 6, "fats": 0.5},
                            {"food_name": "الأرز الأبيض", "quantity_grams": 60, "calories": 78, "protein": 1.6, "carbs": 17, "fats": 0.18}
                        ]
                    }
                ]
            }
        ],
        "is_mock": True
    }


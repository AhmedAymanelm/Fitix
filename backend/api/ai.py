from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from config.database import get_db
from models.user import User
from models.client_profile import ClientProfile
from models.inbody import InBodyReading
from models.nutrition import NutritionPlan, Meal, FoodItem
from api.deps import get_current_admin
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from Ai.inbody_ocr import parse_inbody_image
from Ai.nutrition_ai import generate_nutrition_plan

router = APIRouter()

@router.post("/inbody-ocr")
async def extract_inbody_data(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """
    استقبال صورة تقرير InBody وتحليلها باستخدام الذكاء الاصطناعي لاستخراج البيانات المنظمة.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="يجب رفع صورة صالحة.")
    
    try:
        content = await file.read()
        # استدعاء دالة الذكاء الاصطناعي
        data = parse_inbody_image(content)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate-plan")
def generate_plan(data: dict, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    """
    توليد نظام غذائي بالذكاء الاصطناعي بناءً على بيانات العميل
    والأطعمة الموجودة في قاعدة البيانات فقط.
    """
    client_id = data.get("client_id")
    goal = data.get("goal", "إنقاص الوزن")
    
    if not client_id:
        raise HTTPException(status_code=400, detail="يجب تحديد العميل")
    
    # Get client data
    user = db.query(User).filter(User.id == client_id, User.role == "user").first()
    if not user:
        raise HTTPException(status_code=404, detail="العميل غير موجود")
    
    # Get latest InBody reading
    latest_reading = db.query(InBodyReading).filter(
        InBodyReading.user_id == client_id
    ).order_by(InBodyReading.reading_date.desc()).first()
    
    # Build client data dict
    profile = user.profile
    client_data = {
        "name": user.full_name,
        "weight": latest_reading.weight if latest_reading else (profile.weight if profile else None),
        "body_fat": latest_reading.body_fat if latest_reading else (profile.body_fat if profile else None),
        "muscle_mass": latest_reading.muscle_mass if latest_reading else (profile.muscle_mass if profile else None),
        "bmr": latest_reading.bmr if latest_reading else None,
        "height": profile.height if profile else None,
        "age": profile.age if profile else None,
        "gender": profile.gender if profile else None,
        "goal": goal,
        # Workout info
        "is_active_workout": profile.is_active_workout if profile else False,
        "workout_days_per_week": profile.workout_days_per_week if profile else None,
        "workout_type": profile.workout_type if profile else None,
        "workout_schedule": profile.workout_schedule if profile else None,
        "sport_type": profile.sport_type if profile else None,
        # Health info
        "health_issues_details": profile.health_issues_details if profile else None,
        "medication_details": profile.medication_details if profile else None,
        "injury_details": profile.injury_details if profile else None,
    }
    
    # Get ALL food items from database
    food_items = db.query(FoodItem).all()
    food_list = [
        {
            "name": f.name,
            "category": f.category or "عام",
            "calories": f.calories,
            "protein": f.protein,
            "carbs": f.carbs,
            "fats": f.fats
        }
        for f in food_items
    ]
    
    if not food_list:
        raise HTTPException(status_code=400, detail="لا توجد أطعمة في قاعدة البيانات. أضف أطعمة أولاً.")
    
    # Generate plan using AI
    plan_data = generate_nutrition_plan(client_data, food_list)
    
    # Save to database
    new_plan = NutritionPlan(
        user_id=client_id,
        goal=goal,
        daily_calories=plan_data.get("daily_calories", 0),
        status="pending",
        is_active=False
    )
    db.add(new_plan)
    db.flush()
    
    # Save meals — now with alternatives support
    import json as _json
    for meal in plan_data.get("meals", []):
        # Build items string from first alternative (for backward compat)
        alternatives = meal.get("alternatives", [])
        if alternatives:
            first_alt = alternatives[0]
            items_str = " + ".join([
                f"{item['food_name']} ({item['quantity_grams']}g)"
                for item in first_alt.get("items", [])
            ])
        else:
            # Fallback for old format
            items_str = meal.get("items", "")

        # Store full alternatives JSON in items field for rich display
        full_data = _json.dumps({
            "meal_time": meal.get("meal_time", ""),
            "alternatives": alternatives
        }, ensure_ascii=False)

        new_meal = Meal(
            plan_id=new_plan.id,
            name=meal.get("meal_name", "وجبة"),
            items=full_data,  # JSON with all alternatives
            calories=meal.get("total_calories", 0)
        )
        db.add(new_meal)
    
    db.commit()
    db.refresh(new_plan)
    
    return {
        "plan_id": new_plan.id,
        "client_name": user.full_name,
        "goal": goal,
        "plan": plan_data,
        "message": "تم توليد النظام الغذائي بنجاح! في انتظار موافقة المدرب."
    }


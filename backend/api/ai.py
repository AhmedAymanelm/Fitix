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
from Ai.assistant_ai import generate_assistant_response
from pydantic import BaseModel

class ChatRequest(BaseModel):
    message: str

router = APIRouter()

@router.post("/assistant-chat")
def assistant_chat(request: ChatRequest, admin=Depends(get_current_admin), db: Session = Depends(get_db)):
    """
    محادثة مع المساعد الذكي (للكباتن).
    """
    # Fetch all active clients
    clients = db.query(User).filter(User.role == "user", User.is_active == True).all()
    context_lines = []
    for c in clients:
        p = c.profile
        if p:
            goal = p.goal or "غير محدد"
            weight = p.weight or "غير محدد"
            height = p.height or "غير محدد"
            injury = "نعم" if p.has_injury else "لا"
            injury_det = f" (التفاصيل: {p.injury_details})" if p.has_injury and p.injury_details else ""
            notes = p.notes or "لا يوجد"
            context_lines.append(f"- العميل: {c.full_name} | هدفه: {goal} | وزنه: {weight} كجم | طوله: {height} سم | إصابات: {injury}{injury_det} | ملاحظات: {notes}")
        else:
            context_lines.append(f"- العميل: {c.full_name} | (لا يوجد بروفايل)")
            
    context = "\n".join(context_lines)
    
    response_text = generate_assistant_response(request.message, context)
    return {"reply": response_text}

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

    # ── حفظ كل الماكروز في الداتابيز ──
    import json as _json
    macros = plan_data.get("macros", {})
    new_plan = NutritionPlan(
        user_id=client_id,
        goal=goal,
        daily_calories=plan_data.get("daily_calories", macros.get("total_calories", 0)),
        total_protein=plan_data.get("total_protein", macros.get("total_protein", 0)),
        total_carbs=plan_data.get("total_carbs", macros.get("total_carbs", 0)),
        total_fats=plan_data.get("total_fats", macros.get("total_fats", 0)),
        caloric_deficit=plan_data.get("caloric_deficit", macros.get("caloric_deficit", 0)),
        bmr_used=plan_data.get("bmr", macros.get("bmr", 0)),
        workout_day_calories=plan_data.get("workout_day_calories", macros.get("workout_day_calories", 0)),
        rest_day_calories=plan_data.get("rest_day_calories", macros.get("rest_day_calories", 0)),
        admin_notes=plan_data.get("admin_notes", ""),
        status="pending",
        is_active=False
    )
    db.add(new_plan)
    db.flush()

    # ── حفظ الوجبات ──
    for meal in plan_data.get("meals", []):
        alternatives = meal.get("alternatives", [])
        
        # Calculate total calories for the meal based on the first alternative
        meal_cals = 0
        if alternatives and len(alternatives) > 0:
            first_alt_items = alternatives[0].get("items", [])
            meal_cals = sum(item.get("calories", 0) for item in first_alt_items)
            
        full_data = _json.dumps({
            "meal_time": meal.get("meal_time", ""),
            "meal_role": meal.get("meal_role", ""),
            "alternatives": alternatives
        }, ensure_ascii=False)

        new_meal = Meal(
            plan_id=new_plan.id,
            name=meal.get("name", meal.get("meal_name", "وجبة")),
            items=full_data,
            calories=meal.get("total_calories", meal_cals)
        )
        db.add(new_meal)

    db.commit()
    db.refresh(new_plan)

    # ── Admin data (كل التفاصيل) ──
    admin_data = {
        "plan_id": new_plan.id,
        "daily_calories": plan_data.get("daily_calories"),
        "workout_day_calories": plan_data.get("workout_day_calories"),
        "rest_day_calories": plan_data.get("rest_day_calories"),
        "caloric_deficit": plan_data.get("caloric_deficit"),
        "bmr": plan_data.get("bmr"),
        "total_protein": plan_data.get("total_protein"),
        "total_carbs": plan_data.get("total_carbs"),
        "total_fats": plan_data.get("total_fats"),
        "admin_notes": plan_data.get("admin_notes"),
    }

    return {
        "plan_id": new_plan.id,
        "client_name": user.full_name,
        "goal": goal,
        "plan": plan_data,          # كل التفاصيل — للأدمن
        "admin_data": admin_data,   # ملخص الماكروز — للأدمن
        "message": "تم توليد النظام الغذائي بنجاح!"
    }



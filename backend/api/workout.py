from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from config.database import get_db
from models.user import User
from models.workout import WorkoutPlan, WorkoutExercise, WorkoutLog
from api.deps import get_current_user
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from models.exercise import Exercise

class PlanCreate(BaseModel):
    name: str
    day_of_week: Optional[str] = None
    notes: Optional[str] = None

class LogCreate(BaseModel):
    plan_id: int
    is_completed: bool
    session_data: List[Dict[str, Any]]

class ExerciseAdd(BaseModel):
    exercise_id: int
    sets: int = 3
    reps: int = 12
    rest_seconds: int = 60
    weight: Optional[str] = "-"
    notes: Optional[str] = None

router = APIRouter(prefix="/api/workouts", tags=["Workouts"], dependencies=[Depends(get_current_user)])

@router.get("/today")
def get_today_workout(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """جلب تمرين اليوم الخاص باليوزر الحالي."""
    # Map English day to Arabic day
    days_map = {
        "Saturday": "السبت",
        "Sunday": "الأحد",
        "Monday": "الاثنين",
        "Tuesday": "الثلاثاء",
        "Wednesday": "الأربعاء",
        "Thursday": "الخميس",
        "Friday": "الجمعة"
    }
    today_en = datetime.now().strftime("%A")
    today_ar = days_map.get(today_en, "السبت")

    plan = db.query(WorkoutPlan).filter(
        WorkoutPlan.user_id == current_user.id,
        WorkoutPlan.day_of_week == today_ar
    ).first()
    
    if not plan:
        return {"plan_id": None, "plan_name": f"يوم راحة ({today_ar}) - لا توجد تمارين", "exercises": []}
        
    exercises = db.query(WorkoutExercise).filter(WorkoutExercise.plan_id == plan.id).order_by(WorkoutExercise.order).all()
    
    res_ex = []
    for ex in exercises:
        res_ex.append({
            "id": ex.id,
            "name": ex.exercise.name,
            "muscle_group": ex.exercise.muscle_group,
            "sets": ex.sets,
            "reps": ex.reps,
            "rest_seconds": ex.rest_seconds,
            "weight": ex.weight or "-",
            "status": "لم يبدأ", # Mock status
            "video_url": ex.exercise.gif_url
        })
        
    return {
        "plan_id": plan.id,
        "plan_name": plan.name,
        "notes": plan.notes,
        "exercises": res_ex
    }

@router.post("/finish_exercise/{exercise_id}")
def finish_exercise(exercise_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """تحديد التمرين كـ مكتمل."""
    return {"status": "ok", "message": "تم إنهاء التمرين"}

# --- Admin Endpoints ---

@router.get("/admin/client/{client_id}")
def get_client_workouts(client_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    plans = db.query(WorkoutPlan).filter(WorkoutPlan.user_id == client_id).all()
    res = []
    for p in plans:
        exercises = db.query(WorkoutExercise).filter(WorkoutExercise.plan_id == p.id).order_by(WorkoutExercise.order).all()
        ex_list = []
        for ex in exercises:
            ex_list.append({
                "id": ex.id,
                "exercise_id": ex.exercise_id,
                "name": ex.exercise.name,
                "gif_url": ex.exercise.gif_url,
                "video_url": ex.exercise.video_url,
                "sets": ex.sets,
                "reps": ex.reps,
                "rest_seconds": ex.rest_seconds,
                "weight": ex.weight
            })
        res.append({
            "id": p.id,
            "name": p.name,
            "day_of_week": p.day_of_week,
            "is_completed": p.is_completed,
            "exercises": ex_list
        })
    return res

@router.post("/admin/client/{client_id}")
def create_client_workout_plan(client_id: int, plan: PlanCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
        
    new_plan = WorkoutPlan(
        user_id=client_id,
        name=plan.name,
        day_of_week=plan.day_of_week,
        notes=plan.notes
    )
    db.add(new_plan)
    db.commit()
    db.refresh(new_plan)
    return {"message": "تم إضافة الخطة بنجاح", "plan_id": new_plan.id}

@router.post("/admin/plan/{plan_id}/exercise")
def add_exercise_to_plan(plan_id: int, data: ExerciseAdd, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
        
    plan = db.query(WorkoutPlan).filter(WorkoutPlan.id == plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="الخطة غير موجودة")
        
    # Get max order
    max_order = db.query(WorkoutExercise).filter(WorkoutExercise.plan_id == plan_id).count()
    
    new_ex = WorkoutExercise(
        plan_id=plan_id,
        exercise_id=data.exercise_id,
        order=max_order + 1,
        sets=data.sets,
        reps=data.reps,
        rest_seconds=data.rest_seconds,
        weight=data.weight,
        notes=data.notes
    )
    db.add(new_ex)
    db.commit()
    return {"message": "تمت إضافة التمرين بنجاح"}

class ExerciseUpdate(BaseModel):
    sets: int
    reps: int
    rest_seconds: int
    weight: str

@router.put("/admin/exercise/{ex_id}")
def update_workout_exercise(ex_id: int, data: ExerciseUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
        
    ex = db.query(WorkoutExercise).filter(WorkoutExercise.id == ex_id).first()
    if not ex:
        raise HTTPException(status_code=404, detail="التمرين غير موجود")
        
    ex.sets = data.sets
    ex.reps = data.reps
    ex.rest_seconds = data.rest_seconds
    ex.weight = data.weight
    
    db.commit()
    return {"message": "تم تحديث التمرين بنجاح"}

@router.delete("/admin/exercise/{ex_id}")
def delete_workout_exercise(ex_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
        
    ex = db.query(WorkoutExercise).filter(WorkoutExercise.id == ex_id).first()
    if not ex:
        raise HTTPException(status_code=404, detail="التمرين غير موجود")
        
    db.delete(ex)
    db.commit()
    return {"message": "تم حذف التمرين بنجاح"}

@router.delete("/admin/plan/{plan_id}")
def delete_workout_plan(plan_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
        
    plan = db.query(WorkoutPlan).filter(WorkoutPlan.id == plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="الخطة غير موجودة")
        
    db.delete(plan)
    db.commit()
    return {"message": "تم حذف الخطة بنجاح"}

@router.post("/log")
def create_workout_log(data: LogCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    import json
    from datetime import date
    
    today = date.today()
    log = db.query(WorkoutLog).filter(
        WorkoutLog.user_id == current_user.id,
        WorkoutLog.plan_id == data.plan_id
    ).order_by(WorkoutLog.created_at.desc()).first()
    
    if log and log.created_at.date() == today:
        log.is_completed = data.is_completed
        log.session_data = json.dumps(data.session_data)
    else:
        log = WorkoutLog(
            user_id=current_user.id,
            plan_id=data.plan_id,
            is_completed=data.is_completed,
            session_data=json.dumps(data.session_data)
        )
        db.add(log)
    
    # Mark the plan as completed so it doesn't show up again today
    plan = db.query(WorkoutPlan).filter(WorkoutPlan.id == data.plan_id).first()
    if plan:
        plan.is_completed = True
            
    db.commit()
    return {"message": "تم حفظ التدريب بنجاح"}

@router.get("/history/{user_id}")
def get_workout_history(user_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "admin" and current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    logs = db.query(WorkoutLog).filter(WorkoutLog.user_id == user_id).order_by(WorkoutLog.created_at.desc()).all()
    
    res = []
    for log in logs:
        import json
        try:
            sd = json.loads(log.session_data)
        except:
            sd = []
            
        plan = db.query(WorkoutPlan).filter(WorkoutPlan.id == log.plan_id).first()
        plan_name = plan.name if plan else f"خطة محذوفة (ID: {log.plan_id})"
        total_exercises = 0
        target_exercises = []
        
        if plan:
            plan_exercises = db.query(WorkoutExercise).filter(WorkoutExercise.plan_id == plan.id).order_by(WorkoutExercise.order).all()
            total_exercises = len(plan_exercises)
            
            for pe in plan_exercises:
                ex_data = next((item for item in sd if item.get('exercise_id') == pe.id), None)
                target_exercises.append({
                    "exercise_id": pe.id,
                    "name": pe.exercise.name if pe.exercise else "غير معروف",
                    "target_sets": pe.sets,
                    "completed_sets": ex_data.get('completed_sets', []) if ex_data else [],
                    "partial_sets": ex_data.get('partial_sets', []) if ex_data else [],
                    "skipped_rests": ex_data.get('skipped_rests', []) if ex_data else []
                })
        
        attempted_count = len([x for x in target_exercises if len(x['completed_sets']) > 0 or len(x['partial_sets']) > 0])
            
        res.append({
            "id": log.id,
            "plan_id": log.plan_id,
            "plan_name": plan_name,
            "is_completed": log.is_completed,
            "date": log.created_at.isoformat(),
            "total_exercises": total_exercises,
            "attempted_exercises": attempted_count,
            "details": target_exercises,
            "session_data": sd
        })
    return res

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
import os
import uuid
import shutil

from config.database import get_db
from api.deps import get_current_user
from models.user import User
from models.fitness_test import FitnessTest

router = APIRouter(prefix="/api/fitness_tests", tags=["Fitness Tests"])

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploads", "cv_videos")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
async def upload_cv_session(
    video: UploadFile = File(...),
    reps: int = Form(...),
    duration: int = Form(...),
    exercise: str = Form(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """رفع فيديو التمرين وحفظ الإحصائيات"""
    
    if not current_user.cv_access:
        raise HTTPException(status_code=403, detail="غير مصرح لك باستخدام هذه الخاصية")

    # Save the file
    ext = "webm" # Default for MediaRecorder
    if video.filename and "." in video.filename:
        ext = video.filename.split(".")[-1]
        
    filename = f"{uuid.uuid4()}.{ext}"
    file_path = os.path.join(UPLOAD_DIR, filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(video.file, buffer)
        
    video_url = f"/uploads/cv_videos/{filename}"

    # Create record
    test = FitnessTest(
        user_id=current_user.id,
        exercise_name=exercise,
        reps_count=reps,
        duration_seconds=duration,
        video_url=video_url,
        status="reviewed" # Automatically reviewed since it's CV tracked
    )
    
    db.add(test)
    db.commit()
    db.refresh(test)
    
    return {"message": "تم حفظ التمرين بنجاح", "test_id": test.id}

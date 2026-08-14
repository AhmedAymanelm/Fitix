from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from config.database import get_db
from models.user import User
from schemas.auth import UserCreate, UserLogin, UserResponse, Token, MessageResponse, UpdateCredentials
from api.deps import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(payload: UserCreate, db: Session = Depends(get_db)):
    """إنشاء حساب جديد (عميل أو مدرب)."""
    # Check if username already exists
    existing = db.query(User).filter(User.username == payload.username).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="اسم المستخدم ده موجود بالفعل",
        )

    user = User(
        username=payload.username,
        full_name=payload.full_name,
        phone=payload.phone,
        hashed_password=hash_password(payload.password),
        role=payload.role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(data={"sub": user.username, "role": user.role})
    return Token(
        access_token=token,
        user=UserResponse.model_validate(user),
    )


@router.post("/login", response_model=Token)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    """تسجيل دخول — يرجع JWT token."""
    user = db.query(User).filter(User.username == payload.username).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="اسم المستخدم أو كلمة السر غلط",
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="الحساب ده موقوف. كلم المدرب",
        )

    token = create_access_token(data={"sub": user.username, "role": user.role})
    return Token(
        access_token=token,
        user=UserResponse.model_validate(user),
    )


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """جيب بيانات اليوزر الحالي (محمي بالتوكن)."""
    return current_user

@router.put("/update-credentials")
def update_credentials(payload: UpdateCredentials, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if payload.new_username:
        existing = db.query(User).filter(User.username == payload.new_username, User.id != current_user.id).first()
        if existing:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="اسم المستخدم موجود بالفعل")
        current_user.username = payload.new_username
    
    if payload.new_password:
        current_user.hashed_password = hash_password(payload.new_password)
        
    if payload.new_username or payload.new_password:
        db.commit()
        
    return {"message": "تم تحديث الحساب بنجاح", "new_username": current_user.username}

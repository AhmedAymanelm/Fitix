from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, desc
from datetime import datetime

from config.database import get_db
from models.user import User
from models.message import Message
from api.deps import get_current_user
from pydantic import BaseModel
from typing import List

router = APIRouter(prefix="/api/chat", tags=["Chat"], dependencies=[Depends(get_current_user)])

class MessageCreate(BaseModel):
    receiver_id: int
    content: str

@router.get("/conversations")
def get_conversations(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """جلب قائمة المحادثات لليوزر الحالي."""
    if current_user.role == "admin":
        users = db.query(User).filter(User.role == "user").all()
    else:
        users = db.query(User).filter(User.role == "admin").all()
        
    convos = []
    for u in users:
        # Get last message
        last_msg = db.query(Message).filter(
            or_(
                and_(Message.sender_id == current_user.id, Message.receiver_id == u.id),
                and_(Message.sender_id == u.id, Message.receiver_id == current_user.id)
            )
        ).order_by(desc(Message.sent_at)).first()
        
        unread = db.query(Message).filter(
            Message.sender_id == u.id,
            Message.receiver_id == current_user.id,
            Message.is_read == False
        ).count()
        
        convos.append({
            "user_id": u.id,
            "name": u.full_name,
            "last_message": last_msg.content if last_msg else "بدء المحادثة...",
            "last_time": last_msg.sent_at if last_msg else datetime.min,
            "unread": unread
        })
    
    # Sort by last message time, descending
    convos.sort(key=lambda x: x["last_time"], reverse=True)
    
    # Remove last_time before returning to avoid JSON serialization issues if not needed, 
    # but FastAPI handles datetime natively.
    for c in convos:
        del c["last_time"]
        
    return convos

@router.get("/{user_id}")
def get_chat_history(user_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """جلب المحادثة بينك وبين user_id."""
    messages = db.query(Message).filter(
        or_(
            and_(Message.sender_id == current_user.id, Message.receiver_id == user_id),
            and_(Message.sender_id == user_id, Message.receiver_id == current_user.id)
        )
    ).order_by(Message.sent_at).all()
    
    # Mark as read
    for m in messages:
        if m.receiver_id == current_user.id and not m.is_read:
            m.is_read = True
    db.commit()
    
    return [
        {
            "id": m.id,
            "is_me": m.sender_id == current_user.id,
            "content": m.content,
            "time": m.sent_at.strftime("%H:%M")
        } for m in messages
    ]

@router.post("")
def send_message(payload: MessageCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """إرسال رسالة."""
    msg = Message(
        sender_id=current_user.id,
        receiver_id=payload.receiver_id,
        content=payload.content
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return {"status": "ok", "message": msg.content}

from datetime import datetime
from sqlalchemy import Integer, String, DateTime, ForeignKey, func, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from config.database import Base


class ProgressPhoto(Base):
    """سجل لصور التطور للعميل (ألبوم صور)"""
    __tablename__ = "progress_photos"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)

    photo_front: Mapped[str | None] = mapped_column(String(500), nullable=True)
    photo_back: Mapped[str | None] = mapped_column(String(500), nullable=True)
    photo_side: Mapped[str | None] = mapped_column(String(500), nullable=True)
    
    date: Mapped[datetime] = mapped_column(DateTime, default=func.now())
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Relationships
    user: Mapped["User"] = relationship(back_populates="progress_photos")

    def __repr__(self) -> str:
        return f"<ProgressPhoto user_id={self.user_id} date={self.date}>"

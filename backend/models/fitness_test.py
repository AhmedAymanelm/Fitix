from datetime import datetime

from sqlalchemy import String, Integer, DateTime, ForeignKey, func, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from config.database import Base


class FitnessTest(Base):
    """اختبار اللياقة بالكاميرا CV."""
    __tablename__ = "fitness_tests"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    
    exercise_name: Mapped[str] = mapped_column(String(100), nullable=False)      # "سكوات"
    reps_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)  # عدد العدات الصحيحة
    duration_seconds: Mapped[int | None] = mapped_column(Integer, nullable=True) # مدة الاختبار
    score: Mapped[int | None] = mapped_column(Integer, nullable=True)            # التقييم
    video_url: Mapped[str | None] = mapped_column(Text, nullable=True)           # فيديو الاختبار
    ai_feedback: Mapped[str | None] = mapped_column(Text, nullable=True)         # ملاحظات الذكاء الاصطناعي
    status: Mapped[str] = mapped_column(String(20), default="pending")           # "pending", "reviewed"
    
    test_date: Mapped[datetime] = mapped_column(DateTime, default=func.now())

    # Relationships
    user: Mapped["User"] = relationship(back_populates="fitness_tests")

    def __repr__(self) -> str:
        return f"<FitnessTest {self.exercise_name} user={self.user_id}>"

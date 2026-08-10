from datetime import datetime

from sqlalchemy import Float, DateTime, ForeignKey, func, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from config.database import Base


class InBodyReading(Base):
    """قراءة InBody للعميل في تاريخ معين."""
    __tablename__ = "inbody_readings"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    
    weight: Mapped[float] = mapped_column(Float, nullable=False)                 # الوزن بالكيلو
    body_fat: Mapped[float] = mapped_column(Float, nullable=False)               # نسبة الدهون PBF
    muscle_mass: Mapped[float] = mapped_column(Float, nullable=False)            # الكتلة العضلية SMM
    total_body_water: Mapped[float | None] = mapped_column(Float, nullable=True) # الماء الكلي TBW
    
    bmi: Mapped[float | None] = mapped_column(Float, nullable=True)              # مؤشر كتلة الجسم
    vfi: Mapped[float | None] = mapped_column(Float, nullable=True)              # الدهون الحشوية
    ffm: Mapped[float | None] = mapped_column(Float, nullable=True)              # الكتلة الخالية من الدهون
    fat_mass: Mapped[float | None] = mapped_column(Float, nullable=True)         # كتلة الدهون
    tbw_percent: Mapped[float | None] = mapped_column(Float, nullable=True)      # نسبة المياه
    
    bmr: Mapped[float | None] = mapped_column(Float, nullable=True)              # معدل الحرق
    score: Mapped[float | None] = mapped_column(Float, nullable=True)            # التقييم
    bio_age: Mapped[float | None] = mapped_column(Float, nullable=True)          # العمر الحيوي
    
    target_weight: Mapped[str | None] = mapped_column(Text, nullable=True)       # الوزن المستهدف
    target_fat: Mapped[str | None] = mapped_column(Text, nullable=True)          # الدهون المطلوبة
    target_muscle: Mapped[str | None] = mapped_column(Text, nullable=True)       # العضلات المطلوبة
    target_water: Mapped[str | None] = mapped_column(Text, nullable=True)        # المياه المطلوبة
    
    image_url: Mapped[str | None] = mapped_column(Text, nullable=True)           # صورة التقرير المرفوعة
    reading_date: Mapped[datetime] = mapped_column(DateTime, default=func.now())
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    # Relationships
    user: Mapped["User"] = relationship(back_populates="inbody_readings")

    def __repr__(self) -> str:
        return f"<InBodyReading {self.weight}kg, fat {self.body_fat}% on {self.reading_date}>"

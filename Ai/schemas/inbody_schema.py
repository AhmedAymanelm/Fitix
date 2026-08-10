from pydantic import BaseModel, Field

class ClientProfile(BaseModel):
    name: str = Field(description="اسم العميل (Name)")
    date: str = Field(description="تاريخ ووقت الفحص")
    age: str = Field(description="السن (Age)")
    height: str = Field(description="الطول (Height)")
    gender: str = Field(description="النوع (Sex/Gender)")

class BodyMetrics(BaseModel):
    weight: float = Field(description="الوزن بالكجم (Weight)")
    bmi: float = Field(description="مؤشر كتلة الجسم (BMI)")
    tbf_percent: float = Field(description="نسبة الدهون الكلية TBF%")
    vfi: float = Field(description="معدل الدهون الحشوية VFI")
    sm_percent: float = Field(description="نسبة العضلات الهيكلية SM%")
    ffm: float = Field(description="الكتلة الخالية من الدهون FFM بالكجم")
    fm: float = Field(description="كتلة الدهون المطلقة FM بالكجم")
    tbw_percent: float = Field(description="نسبة المياه في الجسم TBW%")

class Metabolism(BaseModel):
    bmr: float = Field(description="معدل الأيض الأساسي BMR")
    recommended_intake: float = Field(description="السعرات المقترحة يومياً")
    total_score: float = Field(description="التقييم الإجمالي / Composite Score")
    bio_age: float = Field(description="العمر الحيوي / Bio-Age")

class WeightControl(BaseModel):
    reduce_weight: str = Field(description="الوزن المستهدف تخفيضه (نطاق بالكجم)")
    reduce_fat: str = Field(description="الدهون المطلوبة تخفيضها (نطاق بالكجم)")
    increase_muscle: str = Field(description="العضلات المطلوب زيادتها (نطاق بالكجم)")
    increase_water: str = Field(description="المياه المطلوب زيادتها (نطاق بالكجم) إن وجد")

class InBodyData(BaseModel):
    profile: ClientProfile
    metrics: BodyMetrics
    metabolism: Metabolism
    weight_control: WeightControl

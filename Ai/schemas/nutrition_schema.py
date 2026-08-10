from pydantic import BaseModel, Field
from typing import List, Optional


class MealItem(BaseModel):
    food_name: str = Field(description="اسم الصنف من قاعدة البيانات بالظبط")
    quantity_grams: int = Field(description="الكمية بالجرام")
    calories: float = Field(description="السعرات الحرارية لهذه الكمية")
    protein: float = Field(description="البروتين بالجرام لهذه الكمية")
    carbs: float = Field(description="الكربوهيدرات بالجرام لهذه الكمية")
    fats: float = Field(description="الدهون بالجرام لهذه الكمية")


class MealAlternative(BaseModel):
    """بديل واحد من وجبة — نفس الوجبة بتركيبة مختلفة"""
    alternative_label: str = Field(description="مثال: خيار 1، خيار 2، خيار 3")
    items: List[MealItem] = Field(description="الأصناف في هذا الخيار البديل")
    total_calories: int = Field(description="إجمالي سعرات الخيار البديل")
    total_protein: float = Field(description="إجمالي البروتين بالجرام")
    total_carbs: float = Field(description="إجمالي الكربوهيدرات بالجرام")
    total_fats: float = Field(description="إجمالي الدهون بالجرام")


class MealPlan(BaseModel):
    meal_name: str = Field(description="اسم الوجبة مثل: الفطار، سناك 1، الغداء، سناك 2، العشاء")
    meal_time: str = Field(description="الوقت المقترح للوجبة مثل: 7:00 ص، 10:00 ص")
    alternatives: List[MealAlternative] = Field(
        description="3 إلى 4 خيارات بديلة لهذه الوجبة. العميل يختار الخيار اللي يناسبه"
    )
    # الخيار الأساسي للتخزين (أول alternative)
    items: Optional[str] = Field(default=None, description="ملخص نصي للخيار الأول")
    total_calories: int = Field(description="متوسط سعرات الوجبة (بناءً على الخيار الأول)")


class NutritionPlanOutput(BaseModel):
    daily_calories: int = Field(description="إجمالي السعرات اليومية المستهدفة")
    protein_target: int = Field(description="إجمالي البروتين اليومي المستهدف بالجرام")
    carbs_target: int = Field(description="إجمالي الكربوهيدرات اليومية المستهدفة بالجرام")
    fats_target: int = Field(description="إجمالي الدهون اليومية المستهدفة بالجرام")
    meals: List[MealPlan] = Field(description="قائمة الوجبات (5 وجبات) — كل وجبة فيها 3-4 خيارات بديلة")
    workout_nutrition_notes: str = Field(description="ملاحظات خاصة بالتغذية حول التمرين (وجبة ما قبل وما بعد التمرين)")
    notes: str = Field(description="ملاحظات ونصائح عامة للعميل بالعربي المصري")

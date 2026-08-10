import pandas as pd
from config.database import SessionLocal, engine, Base
from models.nutrition import FoodItem

Base.metadata.create_all(bind=engine)
db = SessionLocal()

print("Reading excel...")
df = pd.read_excel('/Users/ahmed/socail/fitness_app/جدول_التغذية_المطور_والحاسبة.xlsx', sheet_name='دليل الأغذية (لكل 100ج)')

print("Clearing old food items...")
db.query(FoodItem).delete()
db.commit()

print("Importing new items...")
count = 0
for idx, row in df.iterrows():
    name = row['اسم الصنف (Food Item)']
    cat = row['التصنيف (Category)']
    cal = row['السعرات لكل 100ج (kcal)']
    pro = row['البروتين (g)']
    carb = row['الكربوهيدرات (g)']
    fat = row['الدهون (g)']
    
    if pd.isna(name): continue
    
    item = FoodItem(
        name=str(name).strip(),
        category=str(cat).strip() if not pd.isna(cat) else None,
        calories=float(cal) if not pd.isna(cal) else 0.0,
        protein=float(pro) if not pd.isna(pro) else 0.0,
        carbs=float(carb) if not pd.isna(carb) else 0.0,
        fats=float(fat) if not pd.isna(fat) else 0.0
    )
    db.add(item)
    count += 1

db.commit()
print(f"Successfully imported {count} food items!")

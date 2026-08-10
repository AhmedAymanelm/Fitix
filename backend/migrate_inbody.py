import sqlite3
import os

db_path = os.path.join(os.path.dirname(__file__), "..", "database", "form_fitness.db")
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

columns_to_add = [
    ("bmi", "FLOAT"),
    ("vfi", "FLOAT"),
    ("ffm", "FLOAT"),
    ("fat_mass", "FLOAT"),
    ("tbw_percent", "FLOAT"),
    ("bmr", "FLOAT"),
    ("score", "FLOAT"),
    ("bio_age", "FLOAT"),
    ("target_weight", "TEXT"),
    ("target_fat", "TEXT"),
    ("target_muscle", "TEXT"),
    ("target_water", "TEXT")
]

for col_name, col_type in columns_to_add:
    try:
        cursor.execute(f"ALTER TABLE inbody_readings ADD COLUMN {col_name} {col_type}")
        print(f"Added {col_name}")
    except sqlite3.OperationalError as e:
        print(f"Skipped {col_name} (already exists?): {e}")

conn.commit()
conn.close()
print("Migration completed.")

import os
import psycopg2
from dotenv import load_dotenv

load_dotenv('.env')
conn = psycopg2.connect(os.getenv('DATABASE_URL'))
cursor = conn.cursor()

try:
    print("Clearing old categories...")
    cursor.execute("DELETE FROM category_exercises;")
    cursor.execute("DELETE FROM exercise_categories;")
    
    categories = {
        'الصدر': {'icon': '🦍', 'desc': 'تمارين عضلة الصدر', 'keywords': ['chest', 'pec', 'fly', 'bench press', 'push-up', 'push up', 'cable crossover']},
        'الظهر': {'icon': '🐢', 'desc': 'تمارين عضلة الظهر', 'keywords': ['back', 'row', 'lat ', 'pull', 'chin-up', 'chin up', 'deadlift']},
        'الأرجل': {'icon': '🦵', 'desc': 'تمارين الأرجل والسمانة', 'keywords': ['leg', 'squat', 'lunge', 'calf', 'glute', 'thigh', 'hamstring', 'quad']},
        'الأكتاف': {'icon': '🪨', 'desc': 'تمارين عضلات الكتف', 'keywords': ['shoulder', 'delt', 'lateral raise', 'front raise', 'upright row', 'military press']},
        'الذراع (باي وتراي)': {'icon': '💪', 'desc': 'تمارين البايسبس والترايسبس', 'keywords': ['bicep', 'tricep', 'curl', 'arm ', 'pushdown', 'skull crusher', 'extension']},
        'البطن والوسط': {'icon': '🍫', 'desc': 'تمارين البطن والكور', 'keywords': ['ab ', 'abs', 'core', 'crunch', 'plank', 'sit-up', 'oblique', 'russian twist']},
        'أخرى (عام)': {'icon': '🏋️', 'desc': 'تمارين عامة', 'keywords': []}
    }
    
    cat_ids = {}
    sort_idx = 1
    for name, data in categories.items():
        cursor.execute(
            "INSERT INTO exercise_categories (name, icon, description, sort_order) VALUES (%s, %s, %s, %s) RETURNING id;",
            (name, data['icon'], data['desc'], sort_idx)
        )
        cat_ids[name] = cursor.fetchone()[0]
        sort_idx += 1
    
    cursor.execute("SELECT id, name FROM exercises;")
    exercises = cursor.fetchall()
    
    assigned_counts = {name: 0 for name in categories.keys()}
    
    print(f"Categorizing {len(exercises)} exercises based on their names...")
    
    for ex in exercises:
        ex_id = ex[0]
        ex_name = ex[1].lower()
        
        matched_cat = 'أخرى (عام)'
        for cat_name, data in categories.items():
            if any(kw in ex_name for kw in data['keywords']):
                matched_cat = cat_name
                break
        
        assigned_counts[matched_cat] += 1
        
        cursor.execute(
            "INSERT INTO category_exercises (category_id, exercise_id, sort_order) VALUES (%s, %s, %s);",
            (cat_ids[matched_cat], ex_id, assigned_counts[matched_cat])
        )
        
    conn.commit()
    print("Migration successful!")
    for k, v in assigned_counts.items():
        print(f" - {k}: {v} exercises")
        
except Exception as e:
    conn.rollback()
    print("Error:", e)
finally:
    cursor.close()
    conn.close()

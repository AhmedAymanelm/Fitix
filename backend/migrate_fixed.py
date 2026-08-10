"""
migrate_fixed.py — Migration مصلّح مع تحويل Boolean + FK handling
"""
import sqlite3, os
from psycopg2.extras import execute_values
import psycopg2

SQLITE_PATH = os.path.join(os.path.dirname(__file__), '..', 'database', 'form_fitness.db')
PG_URL = (
    "postgresql://neondb_owner:npg_btz3H2WLgeov"
    "@ep-frosty-sky-aykqm68z-pooler.c-5.us-east-2.aws.neon.tech"
    "/neondb?sslmode=require"
)

TABLE_ORDER = [
    'users', 'client_profiles', 'exercises',
    'workout_plans', 'workout_exercises', 'workout_logs',
    'nutrition_plans', 'meals', 'food_items',
    'inbody_readings', 'fitness_tests', 'messages',
    'notifications', 'notification_settings',
]

def get_bool_cols(pg_cur, table):
    """جلب أسماء الأعمدة من نوع boolean في PostgreSQL."""
    pg_cur.execute("""
        SELECT column_name FROM information_schema.columns
        WHERE table_name = %s AND data_type = 'boolean'
    """, (table,))
    return {row[0] for row in pg_cur.fetchall()}

def convert_row(row, bool_cols, col_names):
    """تحويل 0/1 → False/True لأعمدة الـ Boolean."""
    vals = []
    for i, v in enumerate(row):
        col = col_names[i]
        if col in bool_cols and isinstance(v, int):
            vals.append(bool(v))
        else:
            vals.append(v)
    return tuple(vals)

def main():
    print(f"📂 SQLite: {SQLITE_PATH}")
    sq = sqlite3.connect(SQLITE_PATH)
    sq.row_factory = sqlite3.Row

    print("🐘 Connecting to Neon...")
    pg = psycopg2.connect(PG_URL)
    pg.autocommit = False
    cur = pg.cursor()
    print("✅ Connected!\n")

    # تعطيل الـ FK constraints مؤقتاً
    cur.execute("SET session_replication_role = 'replica';")
    pg.commit()

    total = 0

    for table in TABLE_ORDER:
        r = sq.execute(
            "SELECT name FROM sqlite_master WHERE type='table' AND name=?", (table,)
        ).fetchone()
        if not r:
            print(f"⏭️  {table} — not found")
            continue

        rows = sq.execute(f"SELECT * FROM {table}").fetchall()
        if not rows:
            print(f"⬜ {table} — 0 rows")
            continue

        col_names = [d[0] for d in sq.execute(f"SELECT * FROM {table} LIMIT 0").description]
        bool_cols = get_bool_cols(cur, table)
        cols_q = ', '.join(f'"{c}"' for c in col_names)

        print(f"➡️  {table}: {len(rows)} rows (bools: {bool_cols or 'none'})...", end=' ', flush=True)

        try:
            cur.execute(f'DELETE FROM "{table}"')

            # تحويل الـ rows مع fix الـ boolean
            data = [convert_row(row, bool_cols, col_names) for row in rows]
            placeholders = '(' + ','.join(['%s'] * len(col_names)) + ')'
            execute_values(
                cur,
                f'INSERT INTO "{table}" ({cols_q}) VALUES %s',
                data,
                template=placeholders,
                page_size=500
            )

            # تحديث الـ sequence
            cur.execute(f"""
                DO $$ BEGIN
                    PERFORM setval(
                        pg_get_serial_sequence('{table}', 'id'),
                        COALESCE((SELECT MAX(id) FROM "{table}"), 1)
                    );
                EXCEPTION WHEN OTHERS THEN NULL;
                END $$;
            """)

            pg.commit()
            print(f"✅ {len(rows)} migrated")
            total += len(rows)

        except Exception as e:
            pg.rollback()
            print(f"\n   ❌ {e}")

    # إعادة تفعيل الـ FK constraints
    cur.execute("SET session_replication_role = 'origin';")
    pg.commit()

    sq.close()
    pg.close()
    print(f"\n🎉 Done! Total migrated: {total} rows")

if __name__ == "__main__":
    main()

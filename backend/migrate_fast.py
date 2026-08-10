"""
migrate_fast.py — Bulk migration SQLite → Neon PostgreSQL
"""
import sqlite3, os, sys

SQLITE_PATH = os.path.join(os.path.dirname(__file__), '..', 'database', 'form_fitness.db')
PG_URL = (
    "postgresql://neondb_owner:npg_btz3H2WLgeov"
    "@ep-frosty-sky-aykqm68z-pooler.c-5.us-east-2.aws.neon.tech"
    "/neondb?sslmode=require"
)

# ترتيب الجداول حسب الـ foreign keys
TABLE_ORDER = [
    'users', 'client_profiles', 'exercises',
    'workout_plans', 'workout_exercises', 'workout_logs',
    'nutrition_plans', 'meals', 'food_items',
    'inbody_readings', 'fitness_tests', 'messages',
    'notifications', 'notification_settings',
]

def main():
    import psycopg2
    from psycopg2.extras import execute_values

    print(f"📂 SQLite: {SQLITE_PATH}")
    sq = sqlite3.connect(SQLITE_PATH)
    sq.row_factory = sqlite3.Row

    print("🐘 Connecting to Neon...")
    pg = psycopg2.connect(PG_URL)
    pg.autocommit = False
    cur = pg.cursor()
    print("✅ Connected!\n")

    total = 0

    for table in TABLE_ORDER:
        # تحقق من وجود الجدول في SQLite
        r = sq.execute("SELECT name FROM sqlite_master WHERE type='table' AND name=?", (table,)).fetchone()
        if not r:
            print(f"⏭️  {table} — not found in SQLite")
            continue

        rows = sq.execute(f"SELECT * FROM {table}").fetchall()
        if not rows:
            print(f"⬜ {table} — 0 rows")
            continue

        cols = [d[0] for d in sq.execute(f"SELECT * FROM {table} LIMIT 0").description]
        cols_q = ', '.join(f'"{c}"' for c in cols)

        print(f"➡️  {table}: {len(rows)} rows...", end=' ', flush=True)

        try:
            # حذف البيانات القديمة
            cur.execute(f'DELETE FROM "{table}"')

            # Bulk insert بـ execute_values (أسرع 100x من executemany)
            data = [tuple(row) for row in rows]
            placeholders = '(' + ','.join(['%s'] * len(cols)) + ')'
            execute_values(
                cur,
                f'INSERT INTO "{table}" ({cols_q}) VALUES %s ON CONFLICT DO NOTHING',
                data,
                template=placeholders,
                page_size=500
            )

            # إعادة تعيين الـ sequence
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
            print(f"✅ done")
            total += len(rows)

        except Exception as e:
            pg.rollback()
            print(f"\n   ❌ Error in {table}: {e}")
            # حاول تجاهل الـ conflicts وأعد المحاولة
            try:
                data = [tuple(row) for row in rows]
                execute_values(
                    cur,
                    f'INSERT INTO "{table}" ({cols_q}) VALUES %s ON CONFLICT DO NOTHING',
                    data,
                    template=placeholders,
                    page_size=100
                )
                pg.commit()
                print(f"   ✅ Recovered with conflict-skip!")
                total += len(rows)
            except Exception as e2:
                pg.rollback()
                print(f"   ❌ Fatal: {e2}")

    sq.close()
    pg.close()
    print(f"\n🎉 Migration done! Total: {total} rows migrated to Neon.")

if __name__ == "__main__":
    main()

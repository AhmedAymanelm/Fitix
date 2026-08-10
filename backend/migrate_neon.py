"""
migrate_neon.py — Migration مصلّح لـ Neon (بدون FK disable)
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

# ترتيب صحيح — الـ parent tables أولاً
TABLE_ORDER = [
    'users',
    'client_profiles',
    'exercises',
    'workout_plans',
    'workout_exercises',
    'workout_logs',
    'nutrition_plans',
    'meals',
    'food_items',
    'inbody_readings',
    'fitness_tests',
    'messages',
    'notifications',
    'notification_settings',
]

def get_bool_cols(pg_cur, table):
    pg_cur.execute("""
        SELECT column_name FROM information_schema.columns
        WHERE table_name = %s AND data_type = 'boolean'
    """, (table,))
    return {row[0] for row in pg_cur.fetchall()}

def convert_row(row, bool_cols, col_names):
    vals = []
    for i, v in enumerate(row):
        col = col_names[i]
        if col in bool_cols:
            if isinstance(v, int):
                vals.append(bool(v))
            elif v is None:
                vals.append(False)
            else:
                vals.append(v)
        else:
            vals.append(v)
    return tuple(vals)

def migrate_table(sq, cur, pg, table):
    r = sq.execute(
        "SELECT name FROM sqlite_master WHERE type='table' AND name=?", (table,)
    ).fetchone()
    if not r:
        print(f"⏭️  {table} — not in SQLite")
        return 0

    rows = sq.execute(f"SELECT * FROM {table}").fetchall()
    if not rows:
        print(f"⬜ {table} — 0 rows")
        return 0

    col_names = [d[0] for d in sq.execute(f"SELECT * FROM {table} LIMIT 0").description]
    bool_cols = get_bool_cols(cur, table)
    cols_q = ', '.join(f'"{c}"' for c in col_names)

    bools_str = f" (bool cols: {bool_cols})" if bool_cols else ""
    print(f"➡️  {table}: {len(rows)} rows{bools_str}...", end=' ', flush=True)

    # حذف البيانات الموجودة
    cur.execute(f'TRUNCATE TABLE "{table}" CASCADE')
    pg.commit()

    # تحويل البيانات
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
    print(f"✅ {len(rows)}")
    return len(rows)


def main():
    print(f"📂 SQLite: {SQLITE_PATH}")
    sq = sqlite3.connect(SQLITE_PATH)
    sq.row_factory = sqlite3.Row

    print("🐘 Connecting to Neon...")
    pg = psycopg2.connect(PG_URL)
    pg.autocommit = False
    cur = pg.cursor()
    print("✅ Connected!\n")

    total = 0
    failed = []

    for table in TABLE_ORDER:
        try:
            count = migrate_table(sq, cur, pg, table)
            total += count
        except Exception as e:
            pg.rollback()
            print(f"\n   ❌ {table}: {e}")
            failed.append(table)

    sq.close()
    pg.close()

    print(f"\n{'='*50}")
    print(f"🎉 Migration complete! {total} rows migrated to Neon.")
    if failed:
        print(f"⚠️  Failed tables: {failed}")
    else:
        print("✅ All tables migrated successfully!")

if __name__ == "__main__":
    main()

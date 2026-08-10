"""
migrate_sqlite_to_postgres.py
نقل البيانات من SQLite → Neon PostgreSQL
"""
import sqlite3
import os
import sys

# ── إعداد الـ paths ──
SQLITE_PATH = os.path.join(os.path.dirname(__file__), '..', 'database', 'form_fitness.db')

# ── الـ Neon PostgreSQL URL ──
PG_URL = (
    "postgresql://neondb_owner:npg_btz3H2WLgeov"
    "@ep-frosty-sky-aykqm68z-pooler.c-5.us-east-2.aws.neon.tech"
    "/neondb?sslmode=require"
)

# ── ترتيب الجداول حسب الـ foreign keys ──
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

# ── أنواع SQLite → PostgreSQL ──
TYPE_MAP = {
    'INTEGER': 'INTEGER',
    'TEXT': 'TEXT',
    'REAL': 'REAL',
    'BLOB': 'BYTEA',
    'NUMERIC': 'NUMERIC',
    'BOOLEAN': 'BOOLEAN',
    'DATETIME': 'TIMESTAMP',
    'DATE': 'DATE',
    'VARCHAR': 'VARCHAR',
    'FLOAT': 'FLOAT',
    'JSON': 'TEXT',
}

def map_type(sqlite_type: str) -> str:
    if not sqlite_type:
        return 'TEXT'
    upper = sqlite_type.upper().split('(')[0].strip()
    for k, v in TYPE_MAP.items():
        if k in upper:
            return v
    return 'TEXT'


def main():
    try:
        import psycopg2
    except ImportError:
        print("Installing psycopg2...")
        os.system(f"{sys.executable} -m pip install psycopg2-binary -q")
        import psycopg2

    # ── فتح SQLite ──
    print(f"📂 Opening SQLite: {SQLITE_PATH}")
    sqlite_conn = sqlite3.connect(SQLITE_PATH)
    sqlite_conn.row_factory = sqlite3.Row
    sqlite_cur = sqlite_conn.cursor()

    # ── فتح PostgreSQL ──
    print(f"🐘 Connecting to Neon PostgreSQL...")
    pg_conn = psycopg2.connect(PG_URL)
    pg_conn.autocommit = False
    pg_cur = pg_conn.cursor()
    print("✅ Connected to Neon!\n")

    total_migrated = 0

    for table in TABLE_ORDER:
        # تحقق إن الجدول موجود في SQLite
        sqlite_cur.execute(
            "SELECT name FROM sqlite_master WHERE type='table' AND name=?", (table,)
        )
        if not sqlite_cur.fetchone():
            print(f"⏭️  Skipping {table} (not in SQLite)")
            continue

        # جلب schema الجدول
        sqlite_cur.execute(f"PRAGMA table_info({table})")
        columns_info = sqlite_cur.fetchall()
        if not columns_info:
            continue

        col_names = [col[1] for col in columns_info]

        # جلب البيانات من SQLite
        sqlite_cur.execute(f"SELECT * FROM {table}")
        rows = sqlite_cur.fetchall()

        if not rows:
            print(f"⬜ {table}: 0 rows (skip)")
            continue

        print(f"➡️  Migrating {table}: {len(rows)} rows...", end=' ')

        # حذف الداتا القديمة (لو موجودة) وإعادة الإدخال
        try:
            pg_cur.execute(f"DELETE FROM {table}")
        except Exception:
            pg_conn.rollback()
            try:
                # الجدول مش موجود، أنشئه
                sqlite_cur.execute(f"PRAGMA table_info({table})")
                cols = sqlite_cur.fetchall()
                col_defs = []
                for col in cols:
                    name = col[1]
                    dtype = map_type(col[2])
                    notnull = "NOT NULL" if col[3] else ""
                    pk = "PRIMARY KEY" if col[5] else ""
                    default = f"DEFAULT {col[4]}" if col[4] is not None and not col[5] else ""
                    col_defs.append(f'"{name}" {dtype} {pk} {notnull} {default}'.strip())
                create_sql = f'CREATE TABLE IF NOT EXISTS "{table}" ({", ".join(col_defs)})'
                pg_cur.execute(create_sql)
                pg_conn.commit()
                pg_cur.execute(f"DELETE FROM {table}")
            except Exception as e2:
                print(f"\n❌ Cannot create/clear {table}: {e2}")
                pg_conn.rollback()
                continue

        # إدخال البيانات
        cols_quoted = ', '.join(f'"{c}"' for c in col_names)
        placeholders = ', '.join(['%s'] * len(col_names))
        insert_sql = f'INSERT INTO "{table}" ({cols_quoted}) VALUES ({placeholders})'

        inserted = 0
        errors = 0
        for row in rows:
            try:
                values = []
                for v in row:
                    # تحويل True/False من SQLite (0/1) لـ bool
                    values.append(v)
                pg_cur.execute(insert_sql, values)
                inserted += 1
            except Exception as e:
                errors += 1
                if errors <= 3:
                    print(f"\n   ⚠️ Row error in {table}: {e}")
                pg_conn.rollback()
                # محاولة إعادة إدخال باقي الصفوف
                pg_cur = pg_conn.cursor()

        try:
            # تحديث الـ sequence (autoincrement) في PostgreSQL
            pg_cur.execute(f"""
                DO $$ BEGIN
                    PERFORM setval(
                        pg_get_serial_sequence('{table}', 'id'),
                        COALESCE((SELECT MAX(id) FROM "{table}"), 1)
                    );
                EXCEPTION WHEN OTHERS THEN NULL;
                END $$;
            """)
        except Exception:
            pass

        pg_conn.commit()
        print(f"✅ {inserted}/{len(rows)} inserted" + (f" ({errors} errors)" if errors else ""))
        total_migrated += inserted

    sqlite_conn.close()
    pg_conn.close()

    print(f"\n🎉 Migration complete! Total rows migrated: {total_migrated}")


if __name__ == "__main__":
    main()

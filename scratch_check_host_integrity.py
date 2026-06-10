import sqlite3

db_path = 'D:\\n8n\\database.sqlite'

def run():
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute("PRAGMA integrity_check;")
        res = cursor.fetchall()
        print("Integrity check results:")
        for r in res:
            print("  ", r)
        conn.close()
    except Exception as e:
        print("Check failed:", e)

if __name__ == '__main__':
    run()

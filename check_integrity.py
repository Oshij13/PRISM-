import sqlite3

def run():
    try:
        conn = sqlite3.connect('n8n_database_check.sqlite')
        cursor = conn.cursor()
        cursor.execute("PRAGMA integrity_check;")
        res = cursor.fetchone()
        print("Integrity check result:", res)
        conn.close()
    except Exception as e:
        print("Check failed:", e)

if __name__ == '__main__':
    run()

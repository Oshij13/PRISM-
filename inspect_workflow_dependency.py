import sqlite3

db_path = 'D:\\n8n\\database.sqlite'

def run():
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("SELECT DISTINCT dependencyKey, dependencyType, dependencyInfo FROM workflow_dependency;")
    rows = cursor.fetchall()
    print("Distinct values in workflow_dependency:")
    for r in rows:
        print(f"  Key: {r[0]} | Type: {r[1]} | Info: {r[2]}")
    conn.close()

if __name__ == '__main__':
    run()

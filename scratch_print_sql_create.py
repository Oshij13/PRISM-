import sqlite3

db_path = 'D:\\n8n\\database.sqlite'

def run():
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("SELECT sql FROM sqlite_master WHERE type='table' AND name='workflow_entity';")
    row = cursor.fetchone()
    if row:
        print("CREATE TABLE workflow_entity SQL:")
        print(row[0])
    else:
        print("workflow_entity table not found.")
    conn.close()

if __name__ == '__main__':
    run()

import sqlite3

db_path = 'D:\\n8n\\database.sqlite'

def run():
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM [user];")
    rows = cursor.fetchall()
    
    print("User table contents:")
    for row in rows:
        for key in row.keys():
            print(f"  {key}: {row[key]}")
    conn.close()

if __name__ == '__main__':
    run()

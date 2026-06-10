import sqlite3

db_path = 'D:\\n8n\\database.sqlite'

def run():
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Get all tables
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = [row[0] for row in cursor.fetchall()]
    
    term = "spond to W"
    
    print(f"Robust search for '{term}' in all columns of all tables...")
    
    for table in tables:
        cursor.execute(f"PRAGMA table_info([{table}]);")
        columns = [col[1] for col in cursor.fetchall()]
        
        for col in columns:
            try:
                # CAST as TEXT to ensure we can search blobs, numbers, etc. safely
                query = f'SELECT rowid, CAST([{col}] AS TEXT) FROM [{table}] WHERE CAST([{col}] AS TEXT) LIKE ?;'
                cursor.execute(query, (f"%{term}%",))
                rows = cursor.fetchall()
                if rows:
                    print(f"\n[FOUND] Table: {table} | Column: {col} | Matches: {len(rows)}")
                    for r in rows:
                        rowid, val_str = r
                        idx = val_str.find(term)
                        start = max(0, idx - 50)
                        end = min(len(val_str), idx + 150)
                        print(f"  RowID: {rowid}")
                        print(f"  Snippet: ... {val_str[start:end]} ...")
            except Exception as e:
                print(f"  [ERROR querying] Table: {table} | Column: {col}: {e}")
                
    conn.close()

if __name__ == '__main__':
    run()

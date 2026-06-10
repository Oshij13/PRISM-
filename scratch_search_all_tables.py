import sqlite3
import json

db_path = 'D:\\n8n\\database.sqlite'

def run():
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Get all tables
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = [row[0] for row in cursor.fetchall()]
    
    term = "spond to W"
    
    print(f"Searching for '{term}' in all tables...")
    
    for table in tables:
        # Get columns of the table
        cursor.execute(f"PRAGMA table_info({table});")
        columns = [col[1] for col in cursor.fetchall()]
        
        for col in columns:
            try:
                # We do a LIKE search
                query = f"SELECT rowid, [{col}] FROM [{table}] WHERE [{col}] LIKE ?;"
                cursor.execute(query, (f"%{term}%",))
                rows = cursor.fetchall()
                if rows:
                    print(f"\n[FOUND] Table: {table} | Column: {col} | Matches: {len(rows)}")
                    for r in rows:
                        rowid, val = r
                        val_str = str(val)
                        idx = val_str.find(term)
                        start = max(0, idx - 50)
                        end = min(len(val_str), idx + 150)
                        print(f"  RowID: {rowid}")
                        print(f"  Snippet: ... {val_str[start:end]} ...")
            except Exception as e:
                # Some columns (like blobs or specific types) might fail, skip
                pass
                
    conn.close()

if __name__ == '__main__':
    run()

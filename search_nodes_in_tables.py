import sqlite3
import json

db_path = 'n8n_database_check.sqlite'

def run():
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Get all tables
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = [t[0] for t in cursor.fetchall()]
    
    for table in tables:
        # Get column names
        cursor.execute(f"PRAGMA table_info({table});")
        cols = [c[1] for c in cursor.fetchall()]
        
        for col in cols:
            try:
                cursor.execute(f"SELECT ROWID, {col} FROM {table} WHERE {col} LIKE '%companyName%';")
                rows = cursor.fetchall()
                if rows:
                    print(f"\nFound matches in table '{table}', column '{col}':")
                    for row in rows:
                        row_id, val = row
                        val_str = str(val)
                        print(f"  ROWID {row_id}: length={len(val_str)}")
                        # If it contains ={{ $json.body.companyName }}, print it
                        has_eq = '={{ $json.body.companyName }}' in val_str
                        print(f"    Contains with '=': {has_eq}")
                        
                        # Find snippet
                        pos = val_str.find('companyName')
                        start = max(0, pos - 50)
                        end = min(len(val_str), pos + 100)
                        print(f"    Snippet: ... {val_str[start:end]} ...")
            except Exception:
                continue
                
    conn.close()

if __name__ == '__main__':
    run()

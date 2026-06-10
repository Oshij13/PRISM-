import sqlite3
import json

db_path = 'D:\\n8n\\database.sqlite'

def run():
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Get all tables
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = [t[0] for t in cursor.fetchall()]
    
    print("Scanning host DB all tables for JSON invalidity...")
    for table in tables:
        # Get column names
        cursor.execute(f"PRAGMA table_info([{table}]);")
        columns = [col[1] for col in cursor.fetchall()]
        
        for col in columns:
            try:
                # Query all non-empty strings/blobs
                cursor.execute(f"SELECT ROWID, [{col}] FROM [{table}] WHERE [{col}] IS NOT NULL;")
                rows = cursor.fetchall()
            except Exception:
                continue
                
            for row in rows:
                row_id, val = row
                if isinstance(val, str):
                    striped = val.strip()
                    if '{' in striped or '[' in striped:
                        try:
                            json.loads(striped)
                        except json.JSONDecodeError as e:
                            # It could be that it's just a normal text column containing brackets.
                            # but if it is one of the JSON/simple-json columns in system tables, it is problematic!
                            # Let's print any failed parsing in tables of interest:
                            # e.g., execution_entity, workflow_entity, credentials_entity, execution_data, workflow_history
                            if table in ['execution_entity', 'workflow_entity', 'credentials_entity', 'execution_data', 'workflow_history']:
                                print(f"INVALID JSON in table '{table}', column '{col}', ROWID '{row_id}':")
                                print(f"  Error: {e}")
                                print(f"  Snippet: {striped[:200]}")
                                # Print around the error position
                                pos = e.pos
                                start = max(0, pos - 40)
                                end = min(len(striped), pos + 40)
                                print(f"  Context around position {pos}:")
                                print(f"  ... {repr(striped[start:pos])} <-- HERE --> {repr(striped[pos:end])} ...\n")
                                
    conn.close()

if __name__ == '__main__':
    run()

import sqlite3
import json

db_path = 'D:\\n8n\\database.sqlite'

def validate_json_field(row_id, name, field_name, value):
    if value is None or value == "":
        return True
    try:
        json.loads(value)
        return True
    except Exception as e:
        print(f"[ERROR] Workflow: {name} (ID: {row_id}) | Field: {field_name} is INVALID JSON: {e}")
        print(f"  Value: {repr(value)}")
        return False

def run():
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    cursor.execute("SELECT id, name, nodes, connections, settings, staticData, pinData, meta, description FROM workflow_entity;")
    rows = cursor.fetchall()
    
    fields = ["nodes", "connections", "settings", "staticData", "pinData", "meta", "description"]
    
    print(f"Validating all columns in {len(rows)} workflows...")
    
    all_ok = True
    for row in rows:
        row_id, name = row[0], row[1]
        for idx, field_name in enumerate(fields):
            val = row[idx + 2]
            # description is not necessarily JSON, but let's treat it as string
            if field_name == "description":
                continue
            if not validate_json_field(row_id, name, field_name, val):
                all_ok = False
                
    if all_ok:
        print("All workflows checked: nodes, connections, settings, staticData, pinData, and meta are valid JSON or null.")
    else:
        print("Done. Found invalid JSON fields!")
        
    conn.close()

if __name__ == '__main__':
    run()

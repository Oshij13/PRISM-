import sqlite3
import json

db_path = 'D:\\n8n\\database.sqlite'

def run():
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    cursor.execute("SELECT settings FROM workflow_entity WHERE id='MDJmNwCRbwcLvNjd';")
    row = cursor.fetchone()
    
    if row:
        settings = json.loads(row[0]) if row[0] else {}
        settings["saveDataSuccessExecution"] = "all"
        settings["saveDataErrorExecution"] = "all"
        settings["saveExecutionProgress"] = True
        
        cursor.execute("UPDATE workflow_entity SET settings=? WHERE id='MDJmNwCRbwcLvNjd';", (json.dumps(settings),))
        conn.commit()
        print("Updated workflow settings to save execution data.")
    else:
        print("Workflow not found.")
        
    conn.close()

if __name__ == '__main__':
    run()

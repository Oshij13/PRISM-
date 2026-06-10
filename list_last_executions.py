import sqlite3
import json

db_path = 'n8n_database_check.sqlite'

def run():
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Query last 10 executions
    cursor.execute("SELECT id, status, workflowId, startedAt FROM execution_entity ORDER BY id DESC LIMIT 10;")
    rows = cursor.fetchall()
    
    print("Last 10 executions in database:")
    for row in rows:
        print(f"ID: {row[0]} | Status: {row[1]} | WorkflowID: {row[2]} | StartedAt: {row[3]}")
        
    conn.close()

if __name__ == '__main__':
    run()

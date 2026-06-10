import sqlite3
import json

db_path = 'n8n_database_check.sqlite'

def run():
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Check if workflow_published_version table exists
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = [t[0] for t in cursor.fetchall()]
    
    if 'workflow_published_version' in tables:
        print("Table 'workflow_published_version' exists.")
        cursor.execute("PRAGMA table_info(workflow_published_version);")
        cols = [c[1] for c in cursor.fetchall()]
        print("Columns:", cols)
        
        # Let's search for our workflow
        cursor.execute("SELECT * FROM workflow_published_version;")
        rows = cursor.fetchall()
        print(f"Found {len(rows)} published workflows.")
        for row in rows:
            w_id_idx = cols.index('workflowId') if 'workflowId' in cols else -1
            nodes_idx = cols.index('nodes') if 'nodes' in cols else -1
            
            if w_id_idx != -1:
                w_id = row[w_id_idx]
                if w_id == 'MDJmNwCRbwcLvNjd':
                    print("  => Found Parent Orchestrator Agent in published version!")
                    if nodes_idx != -1:
                        nodes = json.loads(row[nodes_idx])
                        for node in nodes:
                            if node.get("name") == "Edit Fields":
                                print("  Assignments in published version:")
                                print(json.dumps(node.get("parameters", {}).get("assignments", {}).get("assignments", []), indent=2))
    else:
        print("Table 'workflow_published_version' does not exist.")
        
    conn.close()

if __name__ == '__main__':
    run()

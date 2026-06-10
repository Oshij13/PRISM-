import sqlite3
import json

db_path = 'n8n_database_check.sqlite'

def run():
    print("=== READING DATABASE ===")
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("SELECT nodes FROM workflow_entity WHERE id='MDJmNwCRbwcLvNjd';")
    db_nodes = json.loads(cursor.fetchone()[0])
    db_val = None
    for node in db_nodes:
        if node.get("name") == "Edit Fields":
            assignments = node.get("parameters", {}).get("assignments", {}).get("assignments", [])
            for ass in assignments:
                if ass.get("name") == "company":
                    db_val = ass.get("value")
    print(f"Database Value: {repr(db_val)}")
    conn.close()

    print("\n=== READING CLI EXPORT ===")
    with open('cli_export.json', encoding='utf-16') as f:
        cli_wf = json.load(f)
    cli_nodes = cli_wf[0].get("nodes", []) if isinstance(cli_wf, list) else cli_wf.get("nodes", [])
    cli_val = None
    for node in cli_nodes:
        if node.get("name") == "Edit Fields":
            assignments = node.get("parameters", {}).get("assignments", {}).get("assignments", [])
            for ass in assignments:
                if ass.get("name") == "company":
                    cli_val = ass.get("value")
    print(f"CLI Export Value: {repr(cli_val)}")

if __name__ == '__main__':
    run()

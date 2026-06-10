import sqlite3
import json

db_path = 'n8n_database_check.sqlite'

def run():
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Query execution data for sub-workflow (Company Research Agent) execution 177
    cursor.execute("SELECT data FROM execution_data WHERE executionId = 177;")
    row = cursor.fetchone()
    
    if row:
        data = json.loads(row[0])
        print("Sub-workflow execution 177 data is a", type(data))
        
        memo = {}
        def resolve(idx_str):
            idx = int(idx_str)
            if idx in memo:
                return memo[idx]
            val = data[idx]
            if isinstance(val, dict):
                res = {}
                memo[idx] = res
                for k, v in val.items():
                    res[k] = resolve(v) if isinstance(v, str) and v.isdigit() else v
                return res
            elif isinstance(val, list):
                res = []
                memo[idx] = res
                for v in val:
                    res.append(resolve(v) if isinstance(v, str) and v.isdigit() else v)
                return res
            else:
                return val
                
        resolved = resolve("0")
        with open('resolved_execution_177.json', 'w') as f:
            json.dump(resolved, f, indent=2)
        print("Successfully exported resolved execution 177 to resolved_execution_177.json")
        
        # Let's look for "company" in the resolved JSON
        run_data = resolved.get('resultData', {}).get('runData', {})
        trigger_node = run_data.get('When Executed by Another Workflow')
        if trigger_node:
            print("Trigger Node output:")
            print(json.dumps(trigger_node, indent=2)[:1000])
    else:
        print("Execution 177 not found.")
        
    conn.close()

if __name__ == '__main__':
    run()

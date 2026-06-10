import sqlite3
import json

db_path = 'n8n_database_check.sqlite'

def run():
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Query last execution in execution_entity
    cursor.execute("SELECT id, status, workflowId, startedAt FROM execution_entity ORDER BY id DESC LIMIT 1;")
    row = cursor.fetchone()
    
    if not row:
        print("No executions found.")
        return
        
    e_id, status, w_id, started = row
    print(f"Latest Execution ID: {e_id} | Status: {status} | Workflow ID: {w_id} | StartedAt: {started}")
    
    cursor.execute("SELECT data FROM execution_data WHERE executionId = ?;", (e_id,))
    d_row = cursor.fetchone()
    
    if d_row:
        data = json.loads(d_row[0])
        print("Successfully loaded execution data.")
        
        # Let's write a resolver for flatted format
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
        
        # Let's resolve the root
        resolved = resolve("0")
        with open('resolved_last_execution.json', 'w') as f:
            json.dump(resolved, f, indent=2)
        print("Exported resolved execution data to resolved_last_execution.json")
        
        # Look for the Webhook node and Edit Fields node in runData
        run_data = resolved.get('resultData', {}).get('runData', {})
        print("Nodes executed in this run:", list(run_data.keys()))
        
        webhook_node = run_data.get('Webhook')
        if webhook_node:
            print("\nWebhook node output data:")
            # We want to print output main data
            print(json.dumps(webhook_node, indent=2)[:1500])
            
        edit_fields_node = run_data.get('Edit Fields')
        if edit_fields_node:
            print("\nEdit Fields node output data:")
            print(json.dumps(edit_fields_node, indent=2)[:1500])
            
    conn.close()

if __name__ == '__main__':
    run()

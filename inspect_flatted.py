import sqlite3
import json

db_path = 'n8n_database_check.sqlite'

def parse_flatted(data):
    # A simple parser for flatted JSON structure used by n8n
    memo = {}
    
    def resolve(val):
        if isinstance(val, str) and val.isdigit():
            idx = int(val)
            if idx in memo:
                return memo[idx]
            
            # Placeholder to handle circular reference
            item = data[idx]
            if isinstance(item, dict):
                res = {}
                memo[idx] = res
                for k, v in item.items():
                    res[k] = resolve(v)
                return res
            elif isinstance(item, list):
                res = []
                memo[idx] = res
                for v in item:
                    res.append(resolve(v))
                return res
            else:
                memo[idx] = item
                return item
        return val

    # Resolve from root (index 0)
    return resolve("0")

def run():
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    cursor.execute("SELECT id FROM execution_entity WHERE workflowId = 'MDJmNwCRbwcLvNjd' ORDER BY id DESC LIMIT 1;")
    row = cursor.fetchone()
    if row:
        e_id = row[0]
        cursor.execute("SELECT data FROM execution_data WHERE executionId = ?;", (e_id,))
        d_row = cursor.fetchone()
        if d_row:
            data = json.loads(d_row[0])
            
            # Let's print index 37 directly
            if len(data) > 37:
                # Let's resolve index 37 (the webhook body)
                # Let's write a simple resolver for it
                memo = {}
                def resolve_index(idx_str):
                    idx = int(idx_str)
                    if idx in memo:
                        return memo[idx]
                    val = data[idx]
                    if isinstance(val, dict):
                        res = {}
                        memo[idx] = res
                        for k, v in val.items():
                            res[k] = resolve_index(v) if isinstance(v, str) and v.isdigit() else v
                        return res
                    elif isinstance(val, list):
                        res = []
                        memo[idx] = res
                        for v in val:
                            res.append(resolve_index(v) if isinstance(v, str) and v.isdigit() else v)
                        return res
                    else:
                        return val
                
                print("Webhook Body resolved from index 37:")
                body = resolve_index("37")
                print(json.dumps(body, indent=2))
                
                # Let's also resolve index 33 (full Webhook node json input)
                print("\nWebhook Node JSON input resolved from index 33:")
                node_input = resolve_index("33")
                print(json.dumps(node_input, indent=2))
                
    conn.close()

if __name__ == '__main__':
    run()

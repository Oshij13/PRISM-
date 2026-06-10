import json

def run():
    with open('cli_export.json', encoding='utf-16') as f:
        data = json.load(f)
        
    workflows = data if isinstance(data, list) else [data]
    
    for wf in workflows:
        print(f"Workflow ID: {wf.get('id')} | Name: {wf.get('name')}")
        for node in wf.get("nodes", []):
            if node.get("name") == "Edit Fields":
                print("Assignments for 'Edit Fields':")
                print(json.dumps(node.get("parameters", {}).get("assignments", {}).get("assignments", []), indent=2))

if __name__ == '__main__':
    run()

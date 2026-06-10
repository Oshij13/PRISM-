import json

def run():
    with open('cli_export.json', encoding='utf-16') as f:
        data = json.load(f)
        
    wf_list = data if isinstance(data, list) else [data]
    for wf in wf_list:
        for node in wf.get("nodes", []):
            if node.get("name") == "Edit Fields":
                print("Node 'Edit Fields' assignments in cli_export.json:")
                print(json.dumps(node.get("parameters", {}).get("assignments", {}).get("assignments", []), indent=2))
                
if __name__ == '__main__':
    run()

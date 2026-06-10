import json

with open('Parent_Orchestrator_Agent_From_DB.json') as f:
    wf = json.load(f)
    
for node in wf.get("nodes", []):
    if "expressionProperties" in node:
        print(f"Node '{node.get('name')}' has expressionProperties:")
        print(json.dumps(node["expressionProperties"], indent=2))
    else:
        print(f"Node '{node.get('name')}' has NO expressionProperties.")

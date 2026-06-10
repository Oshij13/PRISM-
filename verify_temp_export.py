import json

def run():
    try:
        try:
            with open('temp_export.json', 'r', encoding='utf-16') as f:
                data = json.load(f)
        except Exception:
            with open('temp_export.json', 'r', encoding='utf-8') as f:
                data = json.load(f)
        print("Successfully loaded temp_export.json as valid JSON.")
        print("Number of workflows exported:", len(data))
        for idx, w in enumerate(data):
            print(f"  {idx+1}. ID: {w.get('id')} | Name: {w.get('name')} | Nodes count: {len(w.get('nodes', []))}")
    except Exception as e:
        print("Failed to load temp_export.json:", e)

if __name__ == '__main__':
    run()

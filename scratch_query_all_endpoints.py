import sqlite3
import requests
import json

db_path = 'D:\\n8n\\database.sqlite'

# Verified bcrypt hash for 'password'
known_hash = '$2a$10$1WyO9.LVueZ6xeqXBoNnu.xMdEz7r9Wvrb0VGUyBREib19578OdGi'

def run():
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # 1. Fetch current password hash
    cursor.execute("SELECT password, email FROM [user] WHERE email='oshijkumar1@gmail.com';")
    row = cursor.fetchone()
    if not row:
        print("User not found.")
        conn.close()
        return
        
    orig_hash = row[0]
    print(f"Original password hash: {orig_hash}")
    
    # 2. Update password to 'password'
    cursor.execute("UPDATE [user] SET password=? WHERE email='oshijkumar1@gmail.com';", (known_hash,))
    conn.commit()
    print("Temporarily updated user password to 'password'.")
    
    # 3. Call login API
    session = requests.Session()
    login_url = "http://localhost:5678/rest/login"
    login_data = {
        "emailOrLdapLoginId": "oshijkumar1@gmail.com",
        "password": "password"
    }
    
    try:
        print(f"Sending login request to {login_url}...")
        resp = session.post(login_url, json=login_data)
        print(f"Login Response Code: {resp.status_code}")
        
        if resp.status_code == 200:
            endpoints = [
                "/rest/workflows?includeScopes=true&includeFolders=true",
                "/rest/workflows/MDJmNwCRbwcLvNjd",
                "/rest/credentials?includeScopes=true",
                "/rest/executions?limit=20",
                "/rest/variables",
                "/rest/data-tables",
                "/rest/folders",
                "/rest/tags",
                "/rest/settings",
                "/rest/users",
                "/rest/workflows/active"
            ]
            
            for endpoint in endpoints:
                url = f"http://localhost:5678{endpoint}"
                print(f"\nQuerying endpoint: {url}...")
                r = session.get(url)
                print(f"  Response Code: {r.status_code}")
                body = r.text
                print(f"  Response Body Preview (100 chars): {body[:100]}")
                
                # Check JSON validity
                try:
                    parsed = json.loads(body)
                    print("  JSON Validity: VALID")
                except json.JSONDecodeError as je:
                    print(f"  [INVALID JSON] Error: {je}")
                    print(f"  Snippet of invalid JSON: {body[:300]}")
                
                # Check for "spond to W"
                if "spond to W" in body:
                    print("  [FOUND STRING] 'spond to W' is PRESENT in this response!")
                    # Find and print context
                    idx = body.find("spond to W")
                    start = max(0, idx - 50)
                    end = min(len(body), idx + 150)
                    print(f"  Context: ... {body[start:end]} ...")
        else:
            print("Login failed.")
            
    except Exception as e:
        print("HTTP request error:", e)
    finally:
        # 5. Restore original password hash
        cursor.execute("UPDATE [user] SET password=? WHERE email='oshijkumar1@gmail.com';", (orig_hash,))
        conn.commit()
        print("Restored original password hash in database.")
        conn.close()

if __name__ == '__main__':
    run()

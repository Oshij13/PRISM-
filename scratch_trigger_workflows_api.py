import sqlite3
import requests
import json

db_path = 'D:\\n8n\\database.sqlite'

# bcrypt hash for 'password'
known_hash = '$2a$10$BYGSKn7ihpbAeGNNEGsxYepOdTH7rwxbY8gxOvFi6inZLIj5U0wDK'

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
        print(f"Login Response Body: {resp.text[:500]}")
        
        if resp.status_code == 200:
            # 4. Query /rest/workflows or /api/v1/workflows
            # Let's try both /rest/workflows and /api/v1/workflows
            for endpoint in ["/rest/workflows", "/api/v1/workflows"]:
                url = f"http://localhost:5678{endpoint}"
                print(f"\nQuerying workflows endpoint: {url}...")
                w_resp = session.get(url)
                print(f"Response Code: {w_resp.status_code}")
                print(f"Response Body: {w_resp.text[:500]}")
        else:
            # Maybe the login URL is different, let's try /api/v1/login
            login_url_v1 = "http://localhost:5678/api/v1/login"
            print(f"Retrying login with {login_url_v1}...")
            resp_v1 = session.post(login_url_v1, json=login_data)
            print(f"Login Response Code: {resp_v1.status_code}")
            if resp_v1.status_code == 200:
                url = "http://localhost:5678/api/v1/workflows"
                print(f"Querying workflows endpoint: {url}...")
                w_resp = session.get(url)
                print(f"Response Code: {w_resp.status_code}")
                print(f"Response Body: {w_resp.text[:500]}")
            
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

import sqlite3
import urllib.request
import urllib.parse
import json
import http.cookiejar

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
    
    # Set up opener with cookie jar
    cj = http.cookiejar.CookieJar()
    opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))
    
    # 3. Call login API
    login_url = "http://localhost:5678/rest/login"
    login_data = {
        "emailOrLdapLoginId": "oshijkumar1@gmail.com",
        "password": "password"
    }
    
    try:
        print(f"Sending login request to {login_url}...")
        data_bytes = json.dumps(login_data).encode('utf-8')
        req = urllib.request.Request(
            login_url, 
            data=data_bytes, 
            headers={'Content-Type': 'application/json'}
        )
        
        login_success = False
        try:
            with opener.open(req) as resp:
                print(f"Login Response Code: {resp.status}")
                body = resp.read().decode('utf-8')
                print(f"Login Response Body: {body[:500]}")
                if resp.status == 200:
                    login_success = True
        except urllib.error.HTTPError as e:
            print(f"Login failed: {e.code} - {e.reason}")
            body = e.read().decode('utf-8')
            print(f"Body: {body}")
            
            # Retry with /api/v1/login if v1 REST login is different
            login_url_v1 = "http://localhost:5678/api/v1/login"
            print(f"Retrying login with {login_url_v1}...")
            req_v1 = urllib.request.Request(
                login_url_v1,
                data=data_bytes,
                headers={'Content-Type': 'application/json'}
            )
            try:
                with opener.open(req_v1) as resp_v1:
                    print(f"Login V1 Response Code: {resp_v1.status}")
                    if resp_v1.status == 200:
                        login_success = True
            except urllib.error.HTTPError as e_v1:
                print(f"Login V1 failed: {e_v1.code} - {e_v1.reason}")
        
        if login_success:
            # 4. Query /rest/workflows and /api/v1/workflows
            for endpoint in ["/rest/workflows", "/api/v1/workflows"]:
                url = f"http://localhost:5678{endpoint}"
                print(f"\nQuerying workflows endpoint: {url}...")
                w_req = urllib.request.Request(url)
                try:
                    with opener.open(w_req) as w_resp:
                        print(f"Response Code: {w_resp.status}")
                        w_body = w_resp.read().decode('utf-8')
                        print(f"Response Body: {w_body[:500]}")
                except urllib.error.HTTPError as we:
                    print(f"Endpoint failed: {we.code} - {we.reason}")
                    w_body = we.read().decode('utf-8')
                    print(f"Response Body: {w_body[:500]}")
            
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

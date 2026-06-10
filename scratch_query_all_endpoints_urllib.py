import sqlite3
import urllib.request
import urllib.parse
import json
import http.cookiejar
import subprocess
import time

db_path = 'D:\\n8n\\database.sqlite'
orig_hash = '$2a$10$P4XFQCfDNoXi47hmnJP6A.9l14gRCkyQD8Cng8d7jcM87m0J486jS'
new_hash = '$2a$10$1WyO9.LVueZ6xeqXBoNnu.xMdEz7r9Wvrb0VGUyBREib19578OdGi' # verified hash for 'password'

def run_cmd(cmd):
    print(f"Executing: {cmd}")
    res = subprocess.run(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    return res.returncode == 0

def update_db(pw_hash):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("UPDATE [user] SET password=? WHERE email='oshijkumar1@gmail.com';", (pw_hash,))
    conn.commit()
    print(f"Updated password hash in DB to: {pw_hash}")
    conn.close()

def make_api_calls():
    # Set up opener with cookie jar
    cj = http.cookiejar.CookieJar()
    opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))
    
    # Login
    login_url = "http://localhost:5678/rest/login"
    login_data = {
        "emailOrLdapLoginId": "oshijkumar1@gmail.com",
        "password": "password"
    }
    
    print("Logging in...")
    try:
        data_bytes = json.dumps(login_data).encode('utf-8')
        req = urllib.request.Request(
            login_url, 
            data=data_bytes, 
            headers={'Content-Type': 'application/json'}
        )
        with opener.open(req) as resp:
            print(f"Login Response Code: {resp.status}")
            
        cookie_str = []
        for cookie in cj:
            cookie_str.append(f"{cookie.name}={cookie.value}")
        joined_cookies = "; ".join(cookie_str)
        
        endpoints = [
            "/rest/workflows?includeScopes=true&includeFolders=true",
            "/rest/workflows/MDJmNwCRbwcLvNjd",
            "/rest/credentials?includeScopes=true",
            "/rest/executions?limit=20",
            "/rest/variables",
            "/rest/folders",
            "/rest/tags",
            "/rest/settings",
            "/rest/users",
            "/rest/workflows/active"
        ]
        
        for endpoint in endpoints:
            url = f"http://localhost:5678{endpoint}"
            print(f"\nQuerying endpoint: {url}...")
            
            w_req = urllib.request.Request(url)
            if cookie_str:
                w_req.add_header('Cookie', joined_cookies)
            w_req.add_header('Accept', 'application/json, text/plain, */*')
            w_req.add_header('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)')
            
            try:
                with opener.open(w_req) as w_resp:
                    print(f"  Response Code: {w_resp.status}")
                    body = w_resp.read().decode('utf-8')
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
                        idx = body.find("spond to W")
                        start = max(0, idx - 50)
                        end = min(len(body), idx + 150)
                        print(f"  Context: ... {body[start:end]} ...")
            except urllib.error.HTTPError as he:
                print(f"  HTTP Error: {he.code} - {he.reason}")
                try:
                    err_body = he.read().decode('utf-8')
                    print(f"  Error Response Preview: {err_body[:200]}")
                except Exception:
                    pass
                
    except Exception as ex:
        print(f"Request error: {ex}")

def main():
    try:
        # 1. Stop container
        run_cmd("docker stop exciting_shannon")
        # 2. Update password to new hash
        update_db(new_hash)
        # 3. Start container
        run_cmd("docker start exciting_shannon")
        # 4. Wait for n8n to boot up
        print("Waiting 25 seconds for n8n to boot up...")
        time.sleep(25)
        # 5. Call API
        make_api_calls()
    finally:
        # 6. Restore original password hash
        print("\nRestoring original password...")
        run_cmd("docker stop exciting_shannon")
        update_db(orig_hash)
        run_cmd("docker start exciting_shannon")

if __name__ == '__main__':
    main()

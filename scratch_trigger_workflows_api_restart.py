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
    print(f"Exit code: {res.returncode}")
    if res.stdout:
        print(f"Stdout:\n{res.stdout.strip()}")
    if res.stderr:
        print(f"Stderr:\n{res.stderr.strip()}")
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
            print("Login Response Headers:")
            for k, v in resp.getheaders():
                print(f"  {k}: {v}")
            body = resp.read().decode('utf-8')
            print(f"Login Response Body: {body[:300]}")
            
        print("\nCookies in CookieJar:")
        xsrf_token = None
        for cookie in cj:
            print(f"  Cookie: {cookie.name} = {cookie.value}")
            if 'xsrf' in cookie.name.lower() or 'csrf' in cookie.name.lower():
                xsrf_token = cookie.value
                
        # Call workflows API with typical frontend query parameters
        url = "http://localhost:5678/rest/workflows?includeScopes=true&includeFolders=true"
        print(f"\nQuerying workflows endpoint: {url}...")
        w_req = urllib.request.Request(url)
        
        cookie_str = []
        for cookie in cj:
            cookie_str.append(f"{cookie.name}={cookie.value}")
        if cookie_str:
            joined_cookies = "; ".join(cookie_str)
            print(f"Sending Cookie header: {joined_cookies}")
            w_req.add_header('Cookie', joined_cookies)
            
        w_req.add_header('Accept', 'application/json, text/plain, */*')
        w_req.add_header('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)')
        
        with opener.open(w_req) as w_resp:
            print(f"Workflows Response Code: {w_resp.status}")
            w_body = w_resp.read().decode('utf-8')
            with open("d:\\Product Management BITSoM\\Capstone Project Guideline\\PRISM\\temp_workflows_response.json", "w", encoding="utf-8") as f:
                f.write(w_body)
            print("Wrote full workflows response to temp_workflows_response.json")
            
        # Call single workflow API
        single_url = "http://localhost:5678/rest/workflows/MDJmNwCRbwcLvNjd"
        print(f"\nQuerying single workflow endpoint: {single_url}...")
        s_req = urllib.request.Request(single_url)
        if cookie_str:
            s_req.add_header('Cookie', joined_cookies)
        s_req.add_header('Accept', 'application/json, text/plain, */*')
        s_req.add_header('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)')
        with opener.open(s_req) as s_resp:
            print(f"Single Workflow Response Code: {s_resp.status}")
            s_body = s_resp.read().decode('utf-8')
            with open("d:\\Product Management BITSoM\\Capstone Project Guideline\\PRISM\\temp_single_workflow_response.json", "w", encoding="utf-8") as f:
                f.write(s_body)
            print("Wrote single workflow response to temp_single_workflow_response.json")
            
        # Call executions API
        exec_url = "http://localhost:5678/rest/executions?limit=20"
        print(f"\nQuerying executions endpoint: {exec_url}...")
        e_req = urllib.request.Request(exec_url)
        if cookie_str:
            e_req.add_header('Cookie', joined_cookies)
        e_req.add_header('Accept', 'application/json, text/plain, */*')
        e_req.add_header('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)')
        with opener.open(e_req) as e_resp:
            print(f"Executions Response Code: {e_resp.status}")
            e_body = e_resp.read().decode('utf-8')
            with open("d:\\Product Management BITSoM\\Capstone Project Guideline\\PRISM\\temp_executions_response.json", "w", encoding="utf-8") as f:
                f.write(e_body)
            print("Wrote executions response to temp_executions_response.json")
    except urllib.error.HTTPError as e:
        print(f"HTTP Error: {e.code} - {e.reason}")
        try:
            print("Response:", e.read().decode('utf-8')[:1000])
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

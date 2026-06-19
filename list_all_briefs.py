import urllib.request
import json

supabase_url = 'https://dgopgdfvsbaucsjejimk.supabase.co/rest/v1/meeting_briefs?select=id,company,person_name,created_at&order=created_at.desc'
supabase_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRnb3BnZGZ2c2JhdWNzamVqaW1rIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTc3MTg4NiwiZXhwIjoyMDk1MzQ3ODg2fQ.P7_Y-rYwi3ITA7p8FsD3a1Kd14z8qg83lUbTb3tn-dc'

def run():
    print("Querying all briefs from Supabase...")
    req = urllib.request.Request(
        supabase_url,
        headers={
            'apikey': supabase_key,
            'Authorization': f'Bearer {supabase_key}'
        }
    )
    try:
        with urllib.request.urlopen(req) as response:
            briefs = json.loads(response.read().decode('utf-8'))
            print(f"\nFound {len(briefs)} briefs in Supabase:")
            for b in briefs:
                print(f"ID: {b.get('id')} | Company: {b.get('company')} | Person: {b.get('person_name')} | CreatedAt: {b.get('created_at')}")
    except Exception as e:
        print("Error querying Supabase:", e)

if __name__ == '__main__':
    run()

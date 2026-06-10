import sqlite3
import json
from supabase import create_client, Client

supabase_url = 'https://dgopgdfvsbaucsjejimk.supabase.co'
supabase_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRnb3BnZGZ2c2JhdWNzamVqaW1rIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTc3MTg4NiwiZXhwIjoyMDk1MzQ3ODg2fQ.P7_Y-rYwi3ITA7p8FsD3a1Kd14z8qg83lUbTb3tn-dc'

supabase: Client = create_client(supabase_url, supabase_key)

def run():
    print("Querying all briefs from Supabase...")
    res = supabase.table('meeting_briefs').select('id, company, created_at').order('created_at', desc=True).execute()
    briefs = res.data
    
    print(f"\nFound {len(briefs)} briefs in Supabase:")
    for b in briefs:
        print(f"ID: {b['id']} | Company: {b['company']} | CreatedAt: {b['created_at']}")

if __name__ == '__main__':
    run()

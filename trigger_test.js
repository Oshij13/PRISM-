import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dgopgdfvsbaucsjejimk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRnb3BnZGZ2c2JhdWNzamVqaW1rIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTc3MTg4NiwiZXhwIjoyMDk1MzQ3ODg2fQ.P7_Y-rYwi3ITA7p8FsD3a1Kd14z8qg83lUbTb3tn-dc';

const supabase = createClient(supabaseUrl, supabaseKey);

// Use the production webhook endpoint instead of the test webhook
const webhookUrl = 'http://localhost:5678/webhook/prism-brief';

async function run() {
  const payload = {
    companyName: 'Swish',
    personName: 'Aniket Shah',
    personTitle: 'CEO',
    meetingType: 'PRISM Demo',
    meetingGoal: 'PRISM Demo',
    priority: 'high'
  };

  console.log('1. Triggering n8n production webhook...');
  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });
    
    console.log('Trigger response status:', res.status);
    if (!res.ok) {
      console.error('Trigger failed:', await res.text());
      return;
    }
    
    const data = await res.json();
    console.log('Trigger response body:', JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Trigger exception:', e);
    return;
  }

  console.log('\n2. Polling Supabase for brief of "Swish"...');
  let found = false;
  // Increase timeout to 60 seconds because the agents take some time to run and insert the row
  for (let i = 0; i < 20; i++) {
    console.log(`Polling attempt ${i+1}/20...`);
    const { data: briefs, error } = await supabase
      .from('meeting_briefs')
      .select('id, company, created_at')
      .ilike('company', 'Swish');
      
    if (error) {
      console.error('Error polling:', error);
    } else if (briefs && briefs.length > 0) {
      console.log('SUCCESS! Found briefs for "Swish":');
      console.log(JSON.stringify(briefs, null, 2));
      found = true;
      break;
    }
    await new Promise(r => setTimeout(r, 3500));
  }
  
  if (!found) {
    console.log('Failed to find brief for "Swish" within polling window.');
  }
}

run();

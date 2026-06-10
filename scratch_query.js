import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dgopgdfvsbaucsjejimk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRnb3BnZGZ2c2JhdWNzamVqaW1rIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTc3MTg4NiwiZXhwIjoyMDk1MzQ3ODg2fQ.P7_Y-rYwi3ITA7p8FsD3a1Kd14z8qg83lUbTb3tn-dc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log('Querying briefs from Supabase...');
  const { data: briefs, error } = await supabase
    .from('meeting_briefs')
    .select('id, company, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching briefs:', error);
  } else {
    console.log(`Found ${briefs.length} briefs:`);
    console.log(JSON.stringify(briefs, null, 2));
  }
}

run();

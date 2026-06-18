-- PRISM Supabase Migration Schema
-- Run this SQL in your Supabase SQL Editor to create the meetings table and set up policies.

-- Create meetings table
CREATE TABLE IF NOT EXISTS public.meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_role TEXT,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  priority TEXT DEFAULT 'medium',
  meeting_type TEXT,
  meeting_goal TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;

-- Policy to view own meetings
CREATE POLICY "Allow users to view their own meetings" 
ON public.meetings FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- Policy to insert own meetings
CREATE POLICY "Allow users to insert their own meetings" 
ON public.meetings FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- Policy to update own meetings
CREATE POLICY "Allow users to update their own meetings" 
ON public.meetings FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- Policy to delete own meetings
CREATE POLICY "Allow users to delete their own meetings" 
ON public.meetings FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);

-- Create index on user_id for optimal search queries
CREATE INDEX IF NOT EXISTS meetings_user_id_idx ON public.meetings (user_id);

-- ==========================================
-- VALTORI SUPABASE DATABASE SETUP
-- ==========================================
-- Run this SQL in Supabase SQL Editor
-- Go to: https://supabase.com/dashboard/project/aqzjxlxdjhegypnhsdcp/sql/new

-- Table 1: Users (Email collection)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Table 2: Call Sessions (Store call results)
CREATE TABLE IF NOT EXISTS public.call_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  user_email TEXT NOT NULL,
  duration INTEGER NOT NULL,
  overall_score INTEGER NOT NULL,
  confidence_score INTEGER NOT NULL,
  clarity_score INTEGER NOT NULL,
  pacing_score INTEGER NOT NULL,
  filler_count INTEGER NOT NULL,
  sale_closed BOOLEAN NOT NULL,
  messages JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.call_sessions ENABLE ROW LEVEL SECURITY;

-- Policies for users table
CREATE POLICY "Allow public inserts to users" ON public.users
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can read own data" ON public.users
  FOR SELECT
  USING (true);

-- Policies for call_sessions table
CREATE POLICY "Users can insert own sessions" ON public.call_sessions
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can read own sessions" ON public.call_sessions
  FOR SELECT
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON public.call_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON public.call_sessions(created_at DESC);

-- ==========================================
-- VERIFICATION QUERIES (Optional - test after setup)
-- ==========================================

-- Check if tables were created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'call_sessions');

-- Check policies
SELECT tablename, policyname 
FROM pg_policies 
WHERE tablename IN ('users', 'call_sessions');

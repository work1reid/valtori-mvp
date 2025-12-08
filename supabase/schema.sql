-- Valtori Database Schema - CLEAN INSTALL
-- This will DROP existing tables and recreate them fresh

-- Drop existing objects (if they exist)
DROP POLICY IF EXISTS "Allow all operations for now" ON calls;
DROP VIEW IF EXISTS call_analytics;
DROP TABLE IF EXISTS calls;

-- Create calls table to store call history and scores
CREATE TABLE calls (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    duration INTEGER NOT NULL,
    call_state VARCHAR(20) NOT NULL,
    score INTEGER CHECK (score >= 0 AND score <= 100),
    conversation JSONB NOT NULL,
    feedback JSONB,
    user_id UUID
);

-- Create indexes for faster queries
CREATE INDEX calls_created_at_idx ON calls(created_at DESC);
CREATE INDEX calls_user_id_idx ON calls(user_id);
CREATE INDEX calls_score_idx ON calls(score);

-- Enable Row Level Security (RLS)
ALTER TABLE calls ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for now
CREATE POLICY "Allow all operations for now" ON calls
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Create a view for call analytics
CREATE VIEW call_analytics AS
SELECT 
    DATE(created_at) as call_date,
    COUNT(*) as total_calls,
    ROUND(AVG(score)::numeric, 2) as avg_score,
    ROUND(AVG(duration)::numeric, 2) as avg_duration,
    MAX(score) as highest_score,
    MIN(score) as lowest_score
FROM calls
WHERE score IS NOT NULL
GROUP BY DATE(created_at)
ORDER BY call_date DESC;

-- Grant access to the view
GRANT SELECT ON call_analytics TO anon, authenticated;

-- Add helpful comments
COMMENT ON TABLE calls IS 'Stores Valtori sales training call simulations';
COMMENT ON COLUMN calls.conversation IS 'JSONB array of conversation messages';
COMMENT ON COLUMN calls.feedback IS 'JSONB array of AI-generated feedback points';

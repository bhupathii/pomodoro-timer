-- Create a table for active user sessions
CREATE TABLE IF NOT EXISTS active_sessions (
  session_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL, -- This will be a browser-generated unique ID
  page TEXT NOT NULL,
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS active_sessions_last_seen_idx ON active_sessions (last_seen);
CREATE INDEX IF NOT EXISTS active_sessions_user_page_idx ON active_sessions (user_id, page);

-- Function to register or update a user session
CREATE OR REPLACE FUNCTION register_active_session(
  p_user_id TEXT,
  p_page TEXT
)
RETURNS UUID AS $$
DECLARE
  v_session_id UUID;
BEGIN
  -- Try to update an existing session for this user and page
  UPDATE active_sessions
  SET last_seen = NOW()
  WHERE user_id = p_user_id AND page = p_page
  RETURNING session_id INTO v_session_id;
  
  -- If no session exists, create a new one
  IF v_session_id IS NULL THEN
    INSERT INTO active_sessions (user_id, page)
    VALUES (p_user_id, p_page)
    RETURNING session_id INTO v_session_id;
  END IF;
  
  RETURN v_session_id;
END;
$$ LANGUAGE plpgsql;

-- Function to end a session
CREATE OR REPLACE FUNCTION end_session(
  p_user_id TEXT,
  p_page TEXT
)
RETURNS VOID AS $$
BEGIN
  DELETE FROM active_sessions
  WHERE user_id = p_user_id AND page = p_page;
END;
$$ LANGUAGE plpgsql;

-- Function to count active users (sessions with activity in the last 60 seconds)
CREATE OR REPLACE FUNCTION count_active_users(
  p_page TEXT,
  p_seconds INT DEFAULT 60
)
RETURNS INT AS $$
DECLARE
  active_count INT;
BEGIN
  SELECT COUNT(DISTINCT user_id) INTO active_count
  FROM active_sessions
  WHERE page = p_page
    AND last_seen > NOW() - (p_seconds * INTERVAL '1 second');
  
  RETURN active_count;
END;
$$ LANGUAGE plpgsql;

-- Create cleanup function to remove old sessions
CREATE OR REPLACE FUNCTION cleanup_inactive_sessions(p_seconds INT DEFAULT 120)
RETURNS INT AS $$
DECLARE
  deleted_count INT;
BEGIN
  DELETE FROM active_sessions
  WHERE last_seen < NOW() - (p_seconds * INTERVAL '1 second')
  RETURNING COUNT(*) INTO deleted_count;
  
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Enable RLS (Row Level Security) for active_sessions table
ALTER TABLE active_sessions ENABLE ROW LEVEL SECURITY;

-- Create policy allowing anonymous users to insert/update/delete their own sessions
CREATE POLICY "Enable anonymous access" ON active_sessions
  FOR ALL
  USING (true);

-- Make sure realtime is enabled for the active_sessions table 
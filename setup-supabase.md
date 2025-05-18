# My Supabase Setup for Pomodoro User Counter

Here's how I set up Supabase for the live user counter feature in my Pomodoro Timer.

## Step 1: Supabase Account Creation

1. Created account at [supabase.com](https://supabase.com/)
2. Set up a new organization
3. Started a project named "pomodoro-timer"
4. Used a strong database password (stored in my password manager)
5. Selected European region (closest to my target users)
6. Waited for database provisioning

## Step 2: Database Setup

I created these database elements:

```sql
-- Active user sessions table
CREATE TABLE IF NOT EXISTS active_sessions (
  session_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  page TEXT NOT NULL,
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS active_sessions_last_seen_idx ON active_sessions (last_seen);
CREATE INDEX IF NOT EXISTS active_sessions_user_page_idx ON active_sessions (user_id, page);

-- Session registration function
CREATE OR REPLACE FUNCTION register_active_session(
  p_user_id TEXT,
  p_page TEXT
)
RETURNS UUID AS $$
DECLARE
  v_session_id UUID;
BEGIN
  -- Try to update existing session
  UPDATE active_sessions
  SET last_seen = NOW()
  WHERE user_id = p_user_id AND page = p_page
  RETURNING session_id INTO v_session_id;

  -- Create new if none exists
  IF v_session_id IS NULL THEN
    INSERT INTO active_sessions (user_id, page)
    VALUES (p_user_id, p_page)
    RETURNING session_id INTO v_session_id;
  END IF;

  RETURN v_session_id;
END;
$$ LANGUAGE plpgsql;

-- Session end function
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

-- Active user counter function
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

-- Cleanup function
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

-- Security setup
ALTER TABLE active_sessions ENABLE ROW LEVEL SECURITY;

-- Access policy
CREATE POLICY "Enable anonymous access" ON active_sessions
  FOR ALL
  USING (true);
```

## Step 3: Realtime Configuration

To enable live updates:

1. Went to "Database" → "Replication"
2. Enabled realtime for the `active_sessions` table
3. Saved changes

## Step 4: API Key Setup

My API credentials are located at:

- Project Settings → API
- Saved my URL and anon key for the next step

## Step 5: Environment Config

For local development, I created a `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=my-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=my-anon-key
CLEANUP_SECRET_TOKEN=my-secret-token
SUPABASE_SERVICE_ROLE_KEY=my-service-role-key
```

For Vercel deployment, I added these same environment variables in the Vercel dashboard.

## Step 6: Cleanup Job Setup

I set up a Vercel cron job to clear inactive sessions:

- Name: "Cleanup inactive sessions"
- Schedule: Every 5 minutes (`*/5 * * * *`)
- Command: `curl -X GET "https://pomodoro-timer-alpha-gilt.vercel.app/api/cleanup-sessions?token=MY_SECRET_TOKEN"`

## Step 7: Testing Notes

My testing process:

1. Started local server with `npm run dev`
2. Verified counter functionality
3. Tested with multiple browsers
4. Confirmed counter decreases after closing tabs
5. Checked database to ensure data was stored correctly

## Implementation Details

My implementation works like this:

1. Creates unique browser ID on visit (stored in localStorage)
2. Registers presence in active_sessions table
3. Sends 30-second heartbeats to keep session active
4. Removes session on page unload
5. Auto-cleans sessions inactive for 2+ minutes
6. Only shows users active within the last minute

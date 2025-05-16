# Setting Up Supabase for Pomodoro User Counter

This guide explains how to set up Supabase for the live user counter feature in the Pomodoro Timer application.

## Step 1: Create a Supabase Account and Project

1. Go to [supabase.com](https://supabase.com/) and sign up
2. Create a new organization if needed
3. Start a new project and give it a name (e.g., "pomodoro-timer")
4. Choose a strong database password and save it for later
5. Choose a region closest to your target audience
6. Wait for your database to be provisioned (usually takes ~2 minutes)

## Step 2: Create Database Tables and Functions

1. In the Supabase dashboard, go to the "SQL Editor"
2. Create a new query and paste the contents of the `supabase-active-users.sql` file or use the SQL below:

```sql
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
```

3. Run the query to create the tables and functions

## Step 3: Configure Supabase for Realtime

1. Go to "Database" → "Replication" in the Supabase dashboard
2. Enable realtime for the `active_sessions` table
3. Click "Save" to apply changes

## Step 4: Get Your API Keys

1. Go to "Project Settings" → "API" in the Supabase dashboard
2. You'll need two values:
   - URL: `https://[your-project-id].supabase.co`
   - `anon` public key: Starts with `eyJh...`

## Step 5: Configure Environment Variables

For local development:

1. Create a `.env.local` file at your project root
2. Add these variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
# For the cleanup API endpoint (optional)
CLEANUP_SECRET_TOKEN=your-secret-token
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

For Vercel deployment:

1. Go to your project on Vercel
2. Navigate to "Settings" → "Environment Variables"
3. Add the same environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `CLEANUP_SECRET_TOKEN` (create a secure random string)
   - `SUPABASE_SERVICE_ROLE_KEY` (from Supabase dashboard)
4. Deploy your project

## Step 6: Set Up a Cron Job for Session Cleanup (Optional)

1. Go to your project on Vercel
2. Navigate to "Settings" → "Cron Jobs"
3. Create a new cron job:
   - Name: "Clean up inactive sessions"
   - Schedule: `*/5 * * * *` (every 5 minutes)
   - Command: `curl -X GET "https://your-domain.vercel.app/api/cleanup-sessions?token=YOUR_CLEANUP_SECRET_TOKEN"`

## Step 7: Test the Implementation

1. Start your local development server: `npm run dev`
2. Open your app and check if the user counter is working
3. Open multiple tabs/browsers to see if the counter increases
4. Close a tab and wait ~1 minute to see if the counter decreases
5. Check the Supabase dashboard to verify the data is being stored correctly

## How It Works

1. When a user visits the site, a unique browser ID is generated and stored in localStorage
2. The user's presence is registered in the active_sessions table
3. A heartbeat is sent every 30 seconds to keep the session active
4. When the user leaves, their session is removed (via beforeunload event)
5. Any sessions without activity for more than 2 minutes are automatically removed by the cleanup function
6. The counter shows only users active within the last 60 seconds

## Troubleshooting

- If the counter doesn't update, check the browser console for errors
- Verify your environment variables are set correctly
- Ensure realtime is enabled for the `active_sessions` table
- Check if the beforeunload event is triggering correctly in your browser
- Missing user counts after closing tab: This is normal if users close their browsers without triggering beforeunload

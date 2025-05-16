# Setting Up Supabase for Pomodoro User Counter

This guide explains how to set up Supabase for the live user counter feature in the Pomodoro Timer application.

## Step 1: Create a Supabase Account and Project

1. Go to [supabase.com](https://supabase.com/) and sign up
2. Create a new organization if needed
3. Start a new project and give it a name (e.g., "pomodoro-timer")
4. Choose a strong database password and save it for later
5. Choose a region closest to your target audience
6. Wait for your database to be provisioned (usually takes ~2 minutes)

## Step 2: Create Database Table and Function

1. In the Supabase dashboard, go to the "SQL Editor"
2. Create a new query with this SQL:

```sql
-- Create a table for tracking page visits
CREATE TABLE page_visits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page VARCHAR NOT NULL,
    count BIGINT DEFAULT 1,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial record for the homepage
INSERT INTO page_visits (page, count) VALUES ('home', 0);

-- Create a function to increment the counter
CREATE OR REPLACE FUNCTION increment_page_visit(page_name VARCHAR)
RETURNS BIGINT AS $$
DECLARE
    new_count BIGINT;
BEGIN
    UPDATE page_visits
    SET count = count + 1,
        last_updated = NOW()
    WHERE page = page_name
    RETURNING count INTO new_count;

    IF NOT FOUND THEN
        INSERT INTO page_visits (page, count)
        VALUES (page_name, 1)
        RETURNING count INTO new_count;
    END IF;

    RETURN new_count;
END;
$$ LANGUAGE plpgsql;
```

3. Run the query to create the table and function

## Step 3: Configure Supabase for Realtime

1. Go to "Database" → "Replication" in the Supabase dashboard
2. Enable realtime for the `page_visits` table
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
```

For Vercel deployment:

1. Go to your project on Vercel
2. Navigate to "Settings" → "Environment Variables"
3. Add the same environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy your project

## Step 6: Test the Implementation

1. Start your local development server: `npm run dev`
2. Open your app and check if the user counter is working
3. Open multiple tabs/browsers to see if the counter increases
4. Check the Supabase dashboard to verify the data is being stored correctly

## Troubleshooting

- If the counter doesn't update, check the browser console for errors
- Verify your environment variables are set correctly
- Check that the Supabase function was created successfully
- Ensure realtime is enabled for the `page_visits` table

import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

// Endpoint for removing stale user sessions
// Called by Vercel cron job every 5 minutes

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check for secret token to prevent unauthorized access
  const { token } = req.query;
  
  if (!token || token !== process.env.CLEANUP_SECRET_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  try {
    // Create Supabase client with server-side credentials
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return res.status(500).json({ error: 'Missing Supabase credentials' });
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Call the cleanup function (default: remove sessions inactive for more than 2 minutes)
    const { data, error } = await supabase.rpc(
      'cleanup_inactive_sessions',
      { p_seconds: 120 }
    );
    
    if (error) {
      throw error;
    }
    
    // Return success with the number of deleted sessions
    return res.status(200).json({ 
      success: true, 
      deletedSessions: data,
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('Error cleaning up sessions:', error);
    return res.status(500).json({ 
      error: 'Failed to clean up sessions', 
      details: error.message 
    });
  }
} 
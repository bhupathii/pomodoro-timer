import { useState, useEffect, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { getBrowserId } from '@/lib/browserIdUtils';
import { RealtimeChannel } from '@supabase/supabase-js';

// Configuration
const HEARTBEAT_INTERVAL = 30000; // Send heartbeat every 30 seconds
const ACTIVE_THRESHOLD = 60; // Consider users active within 60 seconds
const PAGE_ID = 'home'; // Page identifier

export const useActiveUsers = () => {
  const [activeUsers, setActiveUsers] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [subscription, setSubscription] = useState<RealtimeChannel | null>(null);
  
  // Store the browser ID in a ref to keep it consistent across renders
  const browserIdRef = useRef<string | null>(null);
  // Track if we've registered this session
  const isRegisteredRef = useRef<boolean>(false);
  // Store the heartbeat interval in a ref so we can clear it later
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Skip if we're not running in browser or Supabase isn't configured
    if (typeof window === 'undefined' || !isSupabaseConfigured) {
      if (!isSupabaseConfigured) {
        // Show mock data if Supabase isn't configured
        setActiveUsers(Math.floor(Math.random() * 10) + 5);
        setLoading(false);
      }
      return;
    }

    // Get or generate browser ID
    if (!browserIdRef.current) {
      browserIdRef.current = getBrowserId();
    }
    const browserId = browserIdRef.current;

    // Function to register or update session
    const registerSession = async () => {
      try {
        if (!browserId) return;
        
        await supabase.rpc('register_active_session', {
          p_user_id: browserId,
          p_page: PAGE_ID
        });
        
        isRegisteredRef.current = true;
      } catch (err) {
        console.error('Error registering session:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      }
    };

    // Function to end session
    const endSession = async () => {
      try {
        if (!browserId || !isRegisteredRef.current) return;
        
        await supabase.rpc('end_session', {
          p_user_id: browserId,
          p_page: PAGE_ID
        });
      } catch (err) {
        console.error('Error ending session:', err);
      }
    };

    // Function to get active users count
    const getActiveUsersCount = async () => {
      try {
        setLoading(true);
        
        const { data, error: countError } = await supabase.rpc('count_active_users', {
          p_page: PAGE_ID,
          p_seconds: ACTIVE_THRESHOLD
        });
        
        if (countError) {
          throw new Error(`Failed to get users count: ${countError.message}`);
        }
        
        setActiveUsers(data || 0);
        setLoading(false);
      } catch (err) {
        console.error('Error getting active users:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setLoading(false);
      }
    };

    // Setup heartbeat interval
    const setupHeartbeat = () => {
      // Clear any existing interval
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
      
      // Register session immediately
      registerSession();
      
      // Then setup interval for heartbeats
      heartbeatIntervalRef.current = setInterval(() => {
        registerSession();
      }, HEARTBEAT_INTERVAL);
    };

    // Set up a real-time subscription for count updates
    const setupRealtimeSubscription = async () => {
      try {
        // Subscribe to changes on the active_sessions table for real-time updates
        const channel = supabase
          .channel('active_sessions_changes')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'active_sessions' },
            async () => {
              // Get updated count when sessions change
              await getActiveUsersCount();
            }
          )
          .subscribe();
        
        setSubscription(channel);
      } catch (err) {
        console.error('Error setting up realtime subscription:', err);
      }
    };

    // Initialize
    setupHeartbeat();
    setupRealtimeSubscription();
    getActiveUsersCount();

    // Set up cleanup when page is unloaded
    const handleBeforeUnload = () => {
      endSession();
    };

    // Add unload event listener
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup function
    return () => {
      // Remove event listener
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      // Clear heartbeat interval
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
      
      // End session
      endSession();
      
      // Remove realtime subscription
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, []);

  return { activeUsers, loading, error };
}; 
import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { RealtimeChannel } from '@supabase/supabase-js';

type PayloadType = {
  new: {
    count?: number;
    [key: string]: any;
  };
  old?: any;
  [key: string]: any;
};

export const useViewCounter = () => {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [subscription, setSubscription] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    // If Supabase is not configured, show a dummy count
    if (!isSupabaseConfigured) {
      console.warn('Supabase is not configured. Using mock data for visitor counter.');
      setCount(Math.floor(Math.random() * 10) + 5); // Random number between 5-15
      setLoading(false);
      return;
    }

    const fetchAndIncrementCount = async () => {
      try {
        setLoading(true);
        
        // Call the function to increment the page visit count
        const { data, error: rpcError } = await supabase.rpc(
          'increment_page_visit',
          { page_name: 'home' }
        );
        
        if (rpcError) {
          throw new Error(`Failed to increment count: ${rpcError.message}`);
        }
        
        // Set the count from the function result
        setCount(data || 0);
        setLoading(false);
      } catch (err) {
        console.error('Error incrementing page visit:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setLoading(false);
      }
    };

    // Set up a real-time subscription for count updates
    const setupRealtimeSubscription = async () => {
      try {
        // Subscribe to changes on the page_visits table for real-time updates
        const channel = supabase
          .channel('page_visits_changes')
          .on(
            'postgres_changes',
            { event: 'UPDATE', schema: 'public', table: 'page_visits', filter: 'page=eq.home' },
            (payload: PayloadType) => {
              // Update the count when it changes
              if (payload.new && typeof payload.new.count === 'number') {
                setCount(payload.new.count);
              }
            }
          )
          .subscribe();
        
        setSubscription(channel);
      } catch (err) {
        console.error('Error setting up realtime subscription:', err);
      }
    };

    fetchAndIncrementCount();
    setupRealtimeSubscription();

    // Clean up subscription when component unmounts
    return () => {
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, []);

  return { count, loading, error, isSupabaseConfigured };
}; 
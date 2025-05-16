import { useState, useEffect } from 'react';

type CountResponse = {
  value: number;
};

export const useViewCounter = () => {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        setLoading(true);
        
        // Get the current count
        const getResponse = await fetch(
          'https://api.countapi.xyz/get/pomodoro-timer-alpha-gilt/visits'
        );
        
        if (!getResponse.ok) {
          throw new Error('Failed to fetch count');
        }
        
        const getData: CountResponse = await getResponse.json();
        setCount(getData.value);
        
        // Increment the count
        const hitResponse = await fetch(
          'https://api.countapi.xyz/hit/pomodoro-timer-alpha-gilt/visits'
        );
        
        if (!hitResponse.ok) {
          throw new Error('Failed to increment count');
        }
        
        const hitData: CountResponse = await hitResponse.json();
        setCount(hitData.value);
        
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setLoading(false);
      }
    };
    
    fetchCount();
  }, []);

  return { count, loading, error };
}; 
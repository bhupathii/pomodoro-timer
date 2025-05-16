import React, { useEffect, useState } from 'react';
import { useViewCounter } from '@/hooks/useViewCounter';

const LiveUserCounter: React.FC = () => {
  const { count, loading, isSupabaseConfigured } = useViewCounter();
  const [animate, setAnimate] = useState(false);
  const [prevCount, setPrevCount] = useState(0);

  // Add a subtle animation effect when count changes
  useEffect(() => {
    // Only animate when count changes and is not the initial load
    if (count > 0 && !loading && prevCount > 0 && count !== prevCount) {
      setAnimate(true);
      const timeout = setTimeout(() => setAnimate(false), 1000);
      return () => clearTimeout(timeout);
    }
    
    // Update previous count for comparison
    if (count > 0) {
      setPrevCount(count);
    }
  }, [count, loading, prevCount]);

  if (loading && count === 0) {
    return null; // Don't show until we have a count
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div 
        className={`flex items-center gap-1.5 px-3 py-1.5 bg-pomo-dark border-2 border-pomo-light rounded-md 
        font-pixel text-pomo-light transition-all duration-300 shadow-pixel-sm
        ${animate ? 'scale-110' : 'scale-100'}`}
      >
        <div className={`h-2 w-2 rounded-full ${count > 0 ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
        <span className="text-xs">
          {loading ? '--' : count} {!isSupabaseConfigured && '(demo)'} online
        </span>
      </div>
    </div>
  );
};

export default LiveUserCounter; 
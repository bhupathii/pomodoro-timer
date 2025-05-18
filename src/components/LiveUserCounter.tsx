import React, { useEffect, useState } from 'react';
import { useActiveUsers } from '@/hooks/useActiveUsers';

type ThemeColor = 'red' | 'blue' | 'green';

interface LiveUserCounterProps {
  themeColor?: ThemeColor;
}

const LiveUserCounter: React.FC<LiveUserCounterProps> = ({ themeColor = 'red' }) => {
  const { activeUsers, loading, error } = useActiveUsers();
  const [animate, setAnimate] = useState(false);
  const [prevCount, setPrevCount] = useState(0);

  // Get theme-appropriate colors
  const getStatusColor = () => {
    if (activeUsers <= 0) return 'bg-red-500';
    return themeColor === 'red' 
      ? 'bg-red-400' 
      : themeColor === 'blue' 
        ? 'bg-blue-400' 
        : 'bg-green-400';
  };

  // Add a subtle animation effect when count changes
  useEffect(() => {
    // Only animate when count changes and is not the initial load
    if (activeUsers > 0 && !loading && prevCount > 0 && activeUsers !== prevCount) {
      setAnimate(true);
      const timeout = setTimeout(() => setAnimate(false), 1000);
      return () => clearTimeout(timeout);
    }
    
    // Update previous count for comparison
    if (activeUsers > 0) {
      setPrevCount(activeUsers);
    }
  }, [activeUsers, loading, prevCount]);

  if (loading && activeUsers === 0) {
    return null; // Don't show until we have a count
  }

  return (
    <div className="inline-block">
      <div 
        className={`flex items-center gap-1.5 px-2 py-1 bg-pomo-dark/80 backdrop-blur-sm rounded-md 
        font-pixel text-pomo-light transition-all duration-300
        ${animate ? 'scale-110' : 'scale-100'}`}
      >
        <div className={`h-2 w-2 rounded-full ${getStatusColor()} animate-pulse`}></div>
        <span className="text-xs whitespace-nowrap">
          {loading ? '--' : activeUsers} online
        </span>
      </div>
    </div>
  );
};

export default LiveUserCounter; 
import { useMemo } from 'react';

export function useFormatTime() {
  const formatTime = useMemo(() => {
    return (timeInSeconds: number) => {
      const minutes = Math.floor(timeInSeconds / 60);
      const seconds = timeInSeconds % 60;
      
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };
  }, []);
  
  return { formatTime };
} 
import React, { useState, useEffect } from 'react';
import { Clock as ClockIcon } from 'lucide-react';

interface ClockProps {
  showSeconds?: boolean;
  themeColor?: 'red' | 'blue' | 'green';
}

const Clock: React.FC<ClockProps> = ({ 
  showSeconds = true, 
  themeColor = 'red'
}) => {
  const [time, setTime] = useState(new Date());
  
  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    
    return () => {
      clearInterval(timer);
    };
  }, []);
  
  // Format time as 12-hour format with AM/PM
  const formatTime = () => {
    let hours = time.getHours();
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const seconds = time.getSeconds().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // If hour is 0, make it 12
    const hoursStr = hours.toString().padStart(2, '0');
    
    return showSeconds 
      ? `${hoursStr}:${minutes}:${seconds} ${ampm}`
      : `${hoursStr}:${minutes} ${ampm}`;
  };
  
  // Map theme color to actual CSS color
  const getThemeColor = () => {
    switch (themeColor) {
      case 'blue':
        return 'text-blue-500';
      case 'green':
        return 'text-green-500';
      case 'red':
      default:
        return 'text-red-500';
    }
  };
  
  return (
    <div className="flex justify-center mb-3">
      <div className="bg-[#1a1a1a] px-3 py-2 rounded flex items-center gap-2">
        <ClockIcon className={`w-4 h-4 ${getThemeColor()}`} />
        <span className="font-pixel-2p text-white">{formatTime()}</span>
      </div>
    </div>
  );
};

export default Clock; 
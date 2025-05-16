import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Maximize, Minimize } from 'lucide-react';

interface FullscreenButtonProps {
  themeColor?: 'red' | 'blue' | 'green';
}

const FullscreenButton: React.FC<FullscreenButtonProps> = ({ themeColor = 'red' }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Update fullscreen state when it changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      // Enter fullscreen - target the document body instead of just the timer
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      // Exit fullscreen
      document.exitFullscreen().catch(err => {
        console.error(`Error attempting to exit fullscreen: ${err.message}`);
      });
    }
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={toggleFullscreen}
      className="border-2 border-white rounded-md p-2 sm:p-3 md:p-4 flex items-center justify-center transition-all duration-200"
      aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
    >
      {isFullscreen ? (
        <Minimize className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
      ) : (
        <Maximize className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
      )}
    </motion.button>
  );
};

export default FullscreenButton; 
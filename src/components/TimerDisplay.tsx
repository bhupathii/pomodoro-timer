import React from 'react';
import { useFormatTime } from '@/hooks/useFormatTime';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnimations } from '@/hooks/useAnimations';

type ThemeColor = 'red' | 'blue' | 'green';

interface TimerDisplayProps {
  timeLeft: number;
  totalTime: number;
  themeColor: ThemeColor;
  showRecordingIndicator?: boolean;
  isRunning: boolean;
  mode: 'pomodoro' | 'shortBreak' | 'longBreak';
  modeLabel?: string;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ 
  timeLeft, 
  totalTime, 
  themeColor,
  showRecordingIndicator = true,
  isRunning,
  mode,
  modeLabel
}) => {
  const { formatTime } = useFormatTime();
  const { isGlitching, glitchAnimation } = useAnimations();
  const progressPercentage = (timeLeft / totalTime) * 100;
  const formattedTime = formatTime(timeLeft);
  
  // Determine the right color for the mode indicator
  const getModeColor = () => {
    switch(themeColor) {
      case 'red': return 'bg-red-500';
      case 'blue': return 'bg-blue-500';
      case 'green': return 'bg-green-500';
      default: return 'bg-red-500';
    }
  };

  // Default mode labels if custom ones aren't provided
  const getDefaultModeLabel = () => {
    switch(mode) {
      case 'pomodoro': return 'WORK';
      case 'shortBreak': return 'SHORT BREAK';
      case 'longBreak': return 'LONG BREAK';
      default: return 'WORK';
    }
  };

  // Use custom label if provided, otherwise use default
  const displayLabel = modeLabel || getDefaultModeLabel();
  
  return (
    <div className="timer-display relative mb-4 md:mb-6 crt scanlines">
      {/* Mode indicator - moved to top-left corner with padding */}
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          className={`absolute top-2 left-2 md:top-3 md:left-3 z-20 px-2 md:px-4 py-1 font-pixel-2p text-[10px] md:text-xs ${getModeColor()} text-white rounded`}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.3 }}
        >
          {displayLabel}
        </motion.div>
      </AnimatePresence>

      {/* Progress bar with animated transition */}
      <motion.div 
        className={`absolute bottom-0 left-0 h-2 progress-bar`}
        initial={{ width: `${progressPercentage}%` }}
        animate={{ width: `${progressPercentage}%` }}
        transition={{ ease: "easeInOut", duration: 0.5 }}
      />

      {/* Timer display background with scanlines effect */}
      <div className="flex justify-center items-center h-32 sm:h-40 md:h-48 bg-pomo-dark py-6 md:py-12 px-4 md:px-8">
        {/* Timer text with glitch effect only on occasion */}
        <motion.div
          key={timeLeft}
          variants={isGlitching ? glitchAnimation : undefined}
          initial={isGlitching ? "normal" : undefined}
          animate={isGlitching ? "glitch" : undefined}
          className="timer-text text-center relative"
        >
          {formattedTime}
          
          {/* Sound wave visualization when running - more subtle and aligned */}
          {isRunning && (
            <motion.div 
              className="absolute -bottom-6 md:-bottom-8 left-0 right-0 flex justify-center space-x-2"
              initial={{ opacity: 0.3 }}
              animate={{ opacity: 0.6 }}
              transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
            >
              {[...Array(5)].map((_, i) => (
                <motion.div 
                  key={i}
                  className={`w-1 ${themeColor === 'red' ? 'bg-red-500/30' : themeColor === 'blue' ? 'bg-blue-500/30' : 'bg-green-500/30'}`}
                  style={{ height: [4, 8, 12, 8, 4][i] }}
                />
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
      
      {/* Recording indicator */}
      {showRecordingIndicator && (
        <div className="absolute top-2 right-2 md:top-4 md:right-4">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "loop"
            }}
            className={`h-4 w-4 md:h-6 md:w-6 rounded-full record-indicator`}
          />
        </div>
      )}
    </div>
  );
};

export default TimerDisplay; 
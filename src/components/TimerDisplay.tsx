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
      case 'red': return 'bg-red-600/90';
      case 'blue': return 'bg-blue-600/90';
      case 'green': return 'bg-green-600/90';
      default: return 'bg-red-600/90';
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
      {/* Glass overlay effect */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px] pointer-events-none z-1"></div>
      
      {/* Mode indicator - upgraded with pill shape and animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          className={`absolute top-2 left-2 md:top-3 md:left-3 z-20 px-3 md:px-4 py-1 font-pixel-2p text-[10px] md:text-xs ${getModeColor()} text-white rounded-full shadow-lg`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4, type: "spring", stiffness: 300, damping: 25 }}
        >
          {displayLabel}
        </motion.div>
      </AnimatePresence>

      {/* Progress bar with improved animated transition */}
      <motion.div 
        className={`absolute bottom-0 left-0 h-3 progress-bar z-10`}
        style={{
          boxShadow: '0 -1px 8px rgba(255,255,255,0.3)'
        }}
        initial={{ width: `${progressPercentage}%` }}
        animate={{ width: `${progressPercentage}%` }}
        transition={{ ease: "easeInOut", duration: 0.5 }}
      />

      {/* Timer display background with improved effects */}
      <div className="flex justify-center items-center h-36 sm:h-44 md:h-52 bg-pomo-dark py-6 md:py-12 px-4 md:px-8 relative">
        {/* Subtle background grid pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
          style={{ 
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)', 
            backgroundSize: '20px 20px' 
          }}>
        </div>
        
        {/* Timer text with enhanced glow and animations */}
        <motion.div
          key={timeLeft}
          variants={isGlitching ? glitchAnimation : undefined}
          initial={isGlitching ? "normal" : undefined}
          animate={isGlitching ? "glitch" : undefined}
          className="timer-text text-center relative"
          style={{ 
            textShadow: themeColor === 'red' ? '0 0 10px rgba(220,38,38,0.4)' : 
                       themeColor === 'blue' ? '0 0 10px rgba(37,99,235,0.4)' : 
                       '0 0 10px rgba(34,197,94,0.4)'
          }}
        >
          {formattedTime}
          
          {/* Enhanced sound wave visualization when running */}
          {isRunning && (
            <motion.div 
              className="absolute -bottom-6 md:-bottom-8 left-0 right-0 flex justify-center space-x-1.5"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 0.8 }}
              transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
            >
              {[...Array(7)].map((_, i) => (
                <motion.div 
                  key={i}
                  className={`w-1 rounded-full ${themeColor === 'red' ? 'bg-red-400/50' : themeColor === 'blue' ? 'bg-blue-400/50' : 'bg-green-400/50'}`}
                  animate={{ 
                    height: [4, 8, 16, 24, 16, 8, 4][i],
                    opacity: [0.7, 0.9, 0.7]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: i * 0.1
                  }}
                />
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
      
      {/* Recording indicator with pulsing animation */}
      {showRecordingIndicator && (
        <div className="absolute top-2 right-2 md:top-4 md:right-4">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              boxShadow: [
                '0 0 0 0 rgba(239, 68, 68, 0.7)',
                '0 0 0 4px rgba(239, 68, 68, 0)',
                '0 0 0 0 rgba(239, 68, 68, 0.7)'
              ]
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
      
      {/* Dynamic scan line */}
      <div className="scan-line"></div>
    </div>
  );
};

export default TimerDisplay; 
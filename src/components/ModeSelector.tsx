import React from 'react';
import { motion } from 'framer-motion';

interface ModeSelectorProps {
  currentMode: 'pomodoro' | 'shortBreak' | 'longBreak';
  onModeChange: (mode: 'pomodoro' | 'shortBreak' | 'longBreak') => void;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ currentMode, onModeChange }) => {
  return (
    <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        onClick={() => onModeChange('pomodoro')}
        className={`pixel-btn text-xs sm:text-sm md:text-base py-1 px-2 sm:py-2 sm:px-3 md:px-4 ${currentMode === 'pomodoro' ? 'pixel-btn-active' : 'pixel-btn-inactive'}`}
        aria-label="Pomodoro timer mode"
      >
        Pomodoro
      </motion.button>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        onClick={() => onModeChange('shortBreak')}
        className={`pixel-btn text-xs sm:text-sm md:text-base py-1 px-2 sm:py-2 sm:px-3 md:px-4 ${currentMode === 'shortBreak' ? 'pixel-btn-active' : 'pixel-btn-inactive'}`}
        aria-label="Short break mode"
      >
        Short
      </motion.button>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        onClick={() => onModeChange('longBreak')}
        className={`pixel-btn text-xs sm:text-sm md:text-base py-1 px-2 sm:py-2 sm:px-3 md:px-4 ${currentMode === 'longBreak' ? 'pixel-btn-active' : 'pixel-btn-inactive'}`}
        aria-label="Long break mode"
      >
        Long
      </motion.button>
    </div>
  );
};

export default ModeSelector; 
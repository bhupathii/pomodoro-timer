import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Volume2, VolumeX, BellOff } from 'lucide-react';

interface TimerControlsProps {
  isRunning: boolean;
  isMuted: boolean;
  isAlarmRinging: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onToggleMute: () => void;
  onStopAlarm: () => void;
}

const TimerControls: React.FC<TimerControlsProps> = ({ 
  isRunning, 
  isMuted, 
  isAlarmRinging,
  onStart, 
  onPause, 
  onReset, 
  onToggleMute,
  onStopAlarm
}) => {
  return (
    <div className="flex flex-col items-center gap-2 md:gap-3">
      {/* Main timer controls */}
      <motion.div 
        className="flex justify-center items-center gap-2 md:gap-3 mt-2 md:mt-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0px 5px 0px rgba(0, 0, 0, 0.3)" }}
          whileTap={{ scale: 0.95, y: 3, boxShadow: "0px 2px 0px rgba(0, 0, 0, 0.2)" }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          onClick={onStart}
          className={`pixel-icon-btn p-2.5 md:p-3 theme-accent ${(isRunning || isAlarmRinging) ? 'opacity-50 cursor-not-allowed' : ''} relative overflow-hidden`}
          disabled={isRunning || isAlarmRinging}
          aria-label="Start timer"
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          <Play className="w-4 h-4 md:w-5 md:h-5" />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0px 5px 0px rgba(0, 0, 0, 0.3)" }}
          whileTap={{ scale: 0.95, y: 3, boxShadow: "0px 2px 0px rgba(0, 0, 0, 0.2)" }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          onClick={onPause}
          className={`pixel-icon-btn p-2.5 md:p-3 bg-pomo-dark ${(!isRunning || isAlarmRinging) ? 'opacity-50 cursor-not-allowed' : ''} relative overflow-hidden`}
          disabled={!isRunning || isAlarmRinging}
          aria-label="Pause timer"
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          <Pause className="w-4 h-4 md:w-5 md:h-5" />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0px 5px 0px rgba(0, 0, 0, 0.3)" }}
          whileTap={{ scale: 0.95, y: 3, boxShadow: "0px 2px 0px rgba(0, 0, 0, 0.2)" }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          onClick={onReset}
          className="pixel-icon-btn p-2.5 md:p-3 bg-pomo-dark relative overflow-hidden"
          aria-label="Reset timer"
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          <RotateCcw className="w-4 h-4 md:w-5 md:h-5" />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0px 5px 0px rgba(0, 0, 0, 0.3)" }}
          whileTap={{ scale: 0.95, y: 3, boxShadow: "0px 2px 0px rgba(0, 0, 0, 0.2)" }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          onClick={onToggleMute}
          className="pixel-icon-btn p-2.5 md:p-3 bg-pomo-dark relative overflow-hidden"
          aria-label={isMuted ? "Unmute notifications" : "Mute notifications"}
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          {isMuted ? <VolumeX className="w-4 h-4 md:w-5 md:h-5" /> : <Volume2 className="w-4 h-4 md:w-5 md:h-5" />}
        </motion.button>
      </motion.div>
      
      {/* Stop Alarm Button - Highly visible when alarm is ringing */}
      <AnimatePresence>
        {isAlarmRinging && (
          <motion.button
            initial={{ scale: 0.8, opacity: 0, y: 10 }}
            animate={{ 
              scale: [0.95, 1.05, 0.95], 
              opacity: 1,
              y: 0,
              boxShadow: [
                '0 4px 8px rgba(255, 65, 65, 0.3)',
                '0 5px 12px rgba(255, 65, 65, 0.6)',
                '0 4px 8px rgba(255, 65, 65, 0.3)'
              ]
            }}
            exit={{ scale: 0.8, opacity: 0, y: 10 }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              repeatType: "loop"
            }}
            onClick={onStopAlarm}
            className="mt-2 md:mt-3 py-2 md:py-2.5 px-4 md:px-6 rounded-lg border-2 border-white/80 text-white font-pixel-2p text-xs md:text-sm flex items-center gap-2 md:gap-3 backdrop-blur-sm"
            style={{ 
              backgroundColor: 'rgba(255, 65, 65, 0.8)',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}
            aria-label="Stop alarm sound"
          >
            <BellOff className="w-4 h-4 md:w-5 md:h-5" />
            <span>STOP ALARM</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TimerControls; 
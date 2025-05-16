import React from 'react';
import { motion } from 'framer-motion';
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
    <div className="flex flex-col items-center gap-4">
      {/* Main timer controls */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          onClick={onStart}
          className={`pixel-icon-btn theme-accent ${(isRunning || isAlarmRinging) ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isRunning || isAlarmRinging}
          aria-label="Start timer"
        >
          <Play className="w-6 h-6" />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          onClick={onPause}
          className={`pixel-icon-btn bg-pomo-dark ${(!isRunning || isAlarmRinging) ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!isRunning || isAlarmRinging}
          aria-label="Pause timer"
        >
          <Pause className="w-6 h-6" />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          onClick={onReset}
          className="pixel-icon-btn bg-pomo-dark"
          aria-label="Reset timer"
        >
          <RotateCcw className="w-6 h-6" />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          onClick={onToggleMute}
          className="pixel-icon-btn bg-pomo-dark"
          aria-label={isMuted ? "Unmute notifications" : "Mute notifications"}
        >
          {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
        </motion.button>
      </div>
      
      {/* Stop Alarm Button - Highly visible when alarm is ringing */}
      {isAlarmRinging && (
        <motion.button
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: [0.9, 1.1, 0.9], 
            opacity: 1,
            backgroundColor: ['#ff4141', '#ff8f8f', '#ff4141']
          }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            repeatType: "loop"
          }}
          onClick={onStopAlarm}
          className="mt-6 py-3 px-8 rounded-md border-2 border-white text-white font-pixel-2p text-xl flex items-center gap-3"
          style={{ backgroundColor: '#ff4141' }}
          aria-label="Stop alarm sound"
        >
          <BellOff className="w-6 h-6" />
          <span>STOP ALARM</span>
        </motion.button>
      )}
    </div>
  );
};

export default TimerControls; 
'use client';

import { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useTimer } from '@/hooks/useTimer';
import { useAnimations } from '@/hooks/useAnimations';
import TimerDisplay from '@/components/TimerDisplay';
import ModeSelector from '@/components/ModeSelector';
import TimerControls from '@/components/TimerControls';
import ProgressIndicator from '@/components/ProgressIndicator';
import SettingsModal from '@/components/SettingsModal';
import FullscreenButton from '@/components/FullscreenButton';
import FocusMode from '@/components/FocusMode';
import Clock from '@/components/Clock';
import AmbientEffects from '@/components/AmbientEffects';
import CompletionEffects from '@/components/CompletionEffects';
import LiveUserCounter from '@/components/LiveUserCounter';

export default function Home() {
  const {
    timeLeft,
    isRunning,
    mode,
    completedPomodoros,
    isMuted,
    settings,
    isAlarmRinging,
    startTimer,
    pauseTimer,
    resetTimer,
    setMode,
    updateSettings,
    toggleMute,
    stopAlarm,
  } = useTimer();
  
  const { isGlitching } = useAnimations();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  
  // Only show UI after mount to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Detect timer completion and trigger completion effect
  useEffect(() => {
    if (timeLeft === 0 && isAlarmRinging) {
      setShowCompletion(true);
    }
  }, [timeLeft, isAlarmRinging]);
  
  // Get the total time for the current mode (for progress calculation)
  const totalTime = settings[mode];
  
  // Handle theme transitions
  const getThemeTransitionStyle = {
    transition: 'background-color 0.5s ease-in-out, color 0.5s ease-in-out, border-color 0.5s ease-in-out'
  };
  
  // Handle completion dismissed
  const handleCompletionDismissed = () => {
    setShowCompletion(false);
    stopAlarm();
    
    // If we just completed a pomodoro session, transition to the next mode
    if (mode === 'pomodoro' && timeLeft === 0) {
      // Determine whether to start a short or long break
      const nextMode = completedPomodoros % 4 === 3 ? 'longBreak' : 'shortBreak';
      setMode(nextMode);
    } else if ((mode === 'shortBreak' || mode === 'longBreak') && timeLeft === 0) {
      // Move back to pomodoro mode after a break
      setMode('pomodoro');
    }
  };
  
  if (!mounted) return null;
  
  return (
    <main 
      className={`min-h-screen w-screen flex flex-col items-center justify-center relative overflow-hidden ${isFocusMode ? 'bg-black focus-mode' : `theme-${settings.themeColor}`}`}
      style={{...getThemeTransitionStyle, margin: 0, padding: 0}}
    >
      {/* Enhanced ambient weather effects - disabled in focus mode */}
      {!isFocusMode && <AmbientEffects themeColor={settings.themeColor} />}
      
      {/* Background grid pattern with subtle shimmer - hidden in focus mode */}
      {!isFocusMode && (
        <>
          <motion.div 
            className="absolute inset-0 bg-[#1a1a1a] z-0 pointer-events-none opacity-20" 
            style={{ 
              backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
              backgroundSize: '20px 20px',
              ...getThemeTransitionStyle
            }} 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/20 pointer-events-none z-0"></div>
          <motion.div 
            className="absolute inset-0 shimmer pointer-events-none opacity-30 z-0"
            animate={{
              opacity: [0.2, 0.3, 0.2]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "mirror"
            }}
          />
        </>
      )}
      
      {/* Fullscreen and focus mode buttons with improved styling */}
      <div className="fixed top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 z-30 flex gap-2">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="glass-card p-1 rounded-lg"
        >
          <FocusMode 
            isActive={isFocusMode} 
            onToggle={() => setIsFocusMode(!isFocusMode)} 
            themeColor={settings.themeColor} 
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.3 }}
          className="glass-card p-1 rounded-lg"
        >
          <FullscreenButton themeColor={settings.themeColor} />
        </motion.div>
      </div>
      
      {/* Border frame for focus mode - now positioned to absolute edges */}
      {isFocusMode && (
        <div className="fixed inset-0 pointer-events-none z-20">
          {/* Simple black border with subtle glow */}
          <div className="absolute top-0 left-0 right-0 h-1 md:h-2 bg-black"></div>
          <div className="absolute bottom-0 left-0 right-0 h-1 md:h-2 bg-black"></div>
          <div className="absolute left-0 top-0 bottom-0 w-1 md:w-2 bg-black"></div>
          <div className="absolute right-0 top-0 bottom-0 w-1 md:w-2 bg-black"></div>
        </div>
      )}
      
      {/* More compact container layout */}
      <div className="flex flex-col items-center justify-center h-screen w-full">
        {/* Main timer container with improved effects */}
        <motion.div 
          id="timer-container"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: 1,
            transition: { duration: 0.5, ease: "easeOut" }
          }}
          className={`timer-container relative z-10 w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto ${isFocusMode ? 'border-0 shadow-none bg-transparent' : ''}`}
          style={{...getThemeTransitionStyle, padding: '0.75rem'}}
        >
          {/* System time display at top of timer container - hidden in focus mode */}
          {!isFocusMode && <Clock showSeconds={true} themeColor={settings.themeColor} />}
          
          {/* Controls and mode selector - hidden in focus mode */}
          <AnimatePresence>
            {!isFocusMode && (
              <motion.div 
                className="flex justify-center items-center gap-2 mb-2 md:mb-3 mt-1 md:mt-2"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ModeSelector
                  currentMode={mode}
                  onModeChange={setMode}
                />
                
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0px 5px 0px rgba(0, 0, 0, 0.3)" }}
                  whileTap={{ scale: 0.95, y: 3, boxShadow: "0px 2px 0px rgba(0, 0, 0, 0.2)" }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  onClick={() => setIsSettingsOpen(true)}
                  className="pixel-icon-btn p-2.5 md:p-3 bg-pomo-dark relative overflow-hidden"
                  aria-label="Open settings"
                >
                  <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  <Settings className="w-4 h-4 md:w-5 md:h-5" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Timer display with glass morphism and glitch effects */}
          <motion.div 
            className="relative"
            animate={isGlitching ? {
              x: [-1, 1, 0],
              opacity: [1, 0.95, 1]
            } : {}}
            transition={{ duration: 0.1 }}
          >
            <TimerDisplay 
              timeLeft={timeLeft} 
              totalTime={totalTime}
              themeColor={settings.themeColor}
              showRecordingIndicator={false}
              isRunning={isRunning}
              mode={mode}
              modeLabel={mode === 'pomodoro' ? settings.pomodoroLabel : mode === 'shortBreak' ? settings.shortBreakLabel : settings.longBreakLabel}
            />
          </motion.div>
          
          {/* Timer controls */}
          <TimerControls
            isRunning={isRunning}
            isMuted={isMuted}
            isAlarmRinging={isAlarmRinging}
            onStart={startTimer}
            onPause={pauseTimer}
            onReset={resetTimer}
            onToggleMute={toggleMute}
            onStopAlarm={stopAlarm}
          />
        
          {/* Progress indicator - hidden in focus mode */}
          <AnimatePresence>
            {!isFocusMode && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className="mt-2 md:mt-3"
              >
                <ProgressIndicator 
                  completedPomodoros={completedPomodoros} 
                  themeColor={settings.themeColor} 
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      
      {/* Settings modal with enhanced styling */}
      <AnimatePresence>
        {isSettingsOpen && (
          <SettingsModal
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            settings={settings}
            onSave={updateSettings}
          />
        )}
      </AnimatePresence>
      
      {/* Completion effects */}
      <CompletionEffects
        isCompleted={showCompletion}
        mode={mode}
        themeColor={settings.themeColor}
        onComplete={handleCompletionDismissed}
      />

      {/* Live user counter with glass morphism and theme consistency */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-20"
      >
        <div className={`glass-card p-1.5 rounded-lg border border-${settings.themeColor === 'red' ? 'red' : settings.themeColor === 'blue' ? 'blue' : 'green'}-500/30`}>
          <LiveUserCounter themeColor={settings.themeColor} />
        </div>
      </motion.div>
    </main>
  );
} 
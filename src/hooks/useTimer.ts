import { useState, useEffect, useRef, useCallback } from 'react';

type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak';
type ThemeColor = 'red' | 'blue' | 'green';

interface TimerSettings {
  pomodoro: number;
  shortBreak: number;
  longBreak: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  volume: number;
  themeColor: ThemeColor;
  pomodoroLabel: string;
  shortBreakLabel: string;
  longBreakLabel: string;
}

const DEFAULT_SETTINGS: TimerSettings = {
  pomodoro: 25 * 60, // 25 minutes in seconds
  shortBreak: 5 * 60, // 5 minutes in seconds
  longBreak: 15 * 60, // 15 minutes in seconds
  autoStartBreaks: false,
  autoStartPomodoros: false,
  volume: 0.5,
  themeColor: 'red',
  pomodoroLabel: 'WORK',
  shortBreakLabel: 'SHORT BREAK',
  longBreakLabel: 'LONG BREAK',
};

export function useTimer() {
  const [mode, setMode] = useState<TimerMode>('pomodoro');
  const [settings, setSettings] = useState<TimerSettings>(() => {
    // Try to load settings from localStorage
    if (typeof window !== 'undefined') {
      const savedSettings = localStorage.getItem('timerSettings');
      if (savedSettings) {
        return JSON.parse(savedSettings);
      }
    }
    return DEFAULT_SETTINGS;
  });
  
  const [timeLeft, setTimeLeft] = useState(settings.pomodoro);
  const [isRunning, setIsRunning] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isAlarmRinging, setIsAlarmRinging] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Track if alarm has been triggered for this session
  const alarmTriggeredRef = useRef(false);
  const userInteractedRef = useRef(false);
  const pomodoroCountedRef = useRef(false);
  
  // Initialize audio element if we're in the browser
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio('/notification.mp3');
      audioRef.current.volume = settings.volume;
      audioRef.current.loop = true;
      audioRef.current.preload = 'auto';
      audioRef.current.addEventListener('canplaythrough', () => setAudioReady(true));
      audioRef.current.load();
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);
  
  // Save settings to localStorage when they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('timerSettings', JSON.stringify(settings));
    }
  }, [settings]);
  
  // Reset timer when mode changes
  useEffect(() => {
    setTimeLeft(settings[mode]);
    setIsRunning(false);
  }, [mode, settings]);
  
  // Update volume when settings change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = settings.volume;
    }
  }, [settings.volume]);
  
  // Preload audio on first user interaction (e.g., Start button)
  const ensureAudioReady = useCallback(() => {
    if (!userInteractedRef.current && audioRef.current) {
      userInteractedRef.current = true;
      audioRef.current.load();
      setTimeout(() => setAudioReady(true), 200); // Give it a moment to load
    }
  }, []);
  
  // Main timer logic
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            if (!alarmTriggeredRef.current) {
              alarmTriggeredRef.current = true;
              if (!isMuted && audioRef.current && audioReady) {
                try {
                  audioRef.current.currentTime = 0;
                  audioRef.current.play()
                    .then(() => {
                      setIsAlarmRinging(true);
                    })
                    .catch(error => {
                      setIsAlarmRinging(true);
                    });
                } catch (err: any) {
                  setIsAlarmRinging(true);
                }
              } else {
                setIsAlarmRinging(true); // Still show UI even if muted or not ready
              }
            }
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isMuted, audioReady]);
  
  // Reset alarm trigger flag when timer is reset or mode changes
  useEffect(() => {
    alarmTriggeredRef.current = false;
    pomodoroCountedRef.current = false;
  }, [timeLeft, mode, isRunning]);
  
  // Function to stop the alarm
  const stopAlarm = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsAlarmRinging(false);
    
    // If the timer reached zero in pomodoro mode and we haven't counted it yet,
    // increment when the alarm is stopped
    if (timeLeft === 0 && mode === 'pomodoro' && !pomodoroCountedRef.current) {
      console.log("Incrementing pomodoro count on alarm stop");
      setCompletedPomodoros(prev => prev + 1);
      pomodoroCountedRef.current = true;
    }
  }, [timeLeft, mode]);
  
  // Separate timer completion logic for mode changes and counter increments
  useEffect(() => {
    // This effect runs when timeLeft becomes 0
    if (timeLeft === 0 && !isRunning && !isAlarmRinging) {
      console.log("Timer reached zero, mode:", mode);
      
      // Increment completed pomodoros ONLY if we just completed a pomodoro session
      // and haven't counted it yet
      if (mode === 'pomodoro' && !pomodoroCountedRef.current) {
        console.log("Incrementing completed pomodoros");
        setCompletedPomodoros(prev => prev + 1);
        pomodoroCountedRef.current = true;
        
        if (settings.autoStartBreaks) {
          stopAlarm();
          
          // Determine whether to start a short or long break
          const nextMode = completedPomodoros % 4 === 3 ? 'longBreak' : 'shortBreak';
          setMode(nextMode);
          setTimeLeft(settings[nextMode]);
          setIsRunning(true);
        }
      } else if ((mode === 'shortBreak' || mode === 'longBreak') && settings.autoStartPomodoros) {
        stopAlarm();
        
        setMode('pomodoro');
        setTimeLeft(settings.pomodoro);
        setIsRunning(true);
      }
    }
  }, [timeLeft, isRunning, isAlarmRinging, mode, completedPomodoros, settings, stopAlarm]);
  
  // Visibility change handling (pause timer when tab is inactive)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isRunning) {
        setIsRunning(false);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isRunning]);
  
  // Start timer (ensure audio is ready)
  const startTimer = useCallback(() => {
    ensureAudioReady();
    if (isAlarmRinging) {
      stopAlarm();
    }
    setIsRunning(true);
  }, [isAlarmRinging, stopAlarm, ensureAudioReady]);
  
  const pauseTimer = useCallback(() => {
    setIsRunning(false);
  }, []);
  
  const resetTimer = useCallback(() => {
    if (isAlarmRinging) {
      stopAlarm();
    }
    
    setIsRunning(false);
    setTimeLeft(settings[mode]);
  }, [mode, settings, isAlarmRinging, stopAlarm]);
  
  const updateSettings = useCallback((newSettings: Partial<TimerSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);
  
  const toggleMute = useCallback(() => {
    if (!isMuted && isAlarmRinging) {
      stopAlarm();
    }
    
    setIsMuted((prev) => !prev);
  }, [isMuted, isAlarmRinging, stopAlarm]);
  
  return {
    timeLeft,
    isRunning,
    mode,
    completedPomodoros,
    isMuted,
    settings,
    isAlarmRinging,
    audioReady,
    startTimer,
    pauseTimer,
    resetTimer,
    setMode,
    updateSettings,
    toggleMute,
    stopAlarm,
  };
} 
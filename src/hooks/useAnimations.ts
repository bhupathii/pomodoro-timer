import { useState, useEffect } from 'react';
import { Variant, Variants } from 'framer-motion';

type WeatherType = 'rain' | 'snow' | 'sunny' | 'cloudy';
type RepeatType = "loop" | "reverse" | "mirror";

export function useAnimations() {
  const [isGlitching, setIsGlitching] = useState(false);
  const [currentWeather, setCurrentWeather] = useState<WeatherType>('sunny');
  const [isDaytime, setIsDaytime] = useState(true);
  
  // Random glitch effect that happens occasionally
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      // 5% chance of glitch every 10 seconds
      if (Math.random() < 0.05) {
        setIsGlitching(true);
        // Glitch lasts between 100-300ms
        setTimeout(() => setIsGlitching(false), 100 + Math.random() * 200);
      }
    }, 10000);
    
    return () => clearInterval(glitchInterval);
  }, []);
  
  // Day/night cycle based on actual time
  useEffect(() => {
    const updateTimeOfDay = () => {
      const hour = new Date().getHours();
      setIsDaytime(hour >= 6 && hour < 18);
    };
    
    // Initial call
    updateTimeOfDay();
    
    // Update every 15 minutes
    const dayNightInterval = setInterval(updateTimeOfDay, 15 * 60 * 1000);
    
    return () => clearInterval(dayNightInterval);
  }, []);
  
  // Weather effect that changes occasionally
  useEffect(() => {
    const weatherTypes: WeatherType[] = ['rain', 'snow', 'sunny', 'cloudy'];
    
    const changeWeather = () => {
      const newWeather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
      setCurrentWeather(newWeather);
    };
    
    // Initial call
    changeWeather();
    
    // Change weather every 5-10 minutes
    const weatherInterval = setInterval(
      changeWeather, 
      (5 * 60 * 1000) + (Math.random() * 5 * 60 * 1000)
    );
    
    return () => clearInterval(weatherInterval);
  }, []);
  
  // Animation variants for Framer Motion
  const pulseAnimation: Variants = {
    hidden: { opacity: 0.7, scale: 0.95 },
    visible: { opacity: 1, scale: 1 }
  };
  
  const glitchAnimation: Variants = {
    normal: { x: 0, opacity: 1 },
    glitch: { 
      x: [-2, 2, -2, 0], 
      opacity: [1, 0.8, 0.9, 1],
      transition: { duration: 0.2, ease: "linear" }
    }
  };
  
  const timerCompletionAnimation: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5, 
        ease: "easeOut" 
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { 
        duration: 0.3, 
        ease: "easeIn" 
      }
    }
  };
  
  const scanLineAnimation: Variants = {
    hidden: { y: 0 },
    visible: { 
      y: [0, 100, 0], 
      opacity: [0.05, 0.1, 0.05],
      transition: { 
        repeat: Infinity, 
        duration: 15, 
        ease: "linear"
      }
    }
  };
  
  // Dynamic weather animation variants
  const getWeatherAnimationVariants = (): Variants => {
    switch (currentWeather) {
      case 'rain':
        return {
          start: { y: -10, opacity: 0 },
          end: { 
            y: 110, 
            opacity: [0, 0.5, 0], 
            transition: { 
              duration: 0.8, 
              ease: "easeIn",
              repeat: Infinity,
              repeatType: "loop" as RepeatType
            }
          }
        };
      case 'snow':
        return {
          start: { y: -10, x: 0, opacity: 0 },
          end: { 
            y: 110, 
            x: [-5, 5, -3, 2, 0],
            opacity: [0, 0.5, 0], 
            transition: { 
              duration: 3,
              ease: "easeIn",
              repeat: Infinity,
              repeatType: "loop" as RepeatType
            }
          }
        };
      case 'sunny':
        return {
          start: { rotate: 0, scale: 1 },
          end: { 
            rotate: 360,
            scale: [1, 1.1, 1], 
            transition: { 
              duration: 10,
              ease: "linear",
              repeat: Infinity,
              repeatType: "loop" as RepeatType
            }
          }
        };
      case 'cloudy':
      default:
        return {
          start: { x: -20, opacity: 0.8 },
          end: { 
            x: 20, 
            opacity: [0.8, 0.9, 0.8], 
            transition: { 
              duration: 20,
              ease: "linear",
              repeat: Infinity,
              repeatType: "loop" as RepeatType,
              repeatDelay: 5
            }
          }
        };
    }
  };
  
  return {
    isGlitching,
    currentWeather,
    isDaytime,
    pulseAnimation,
    glitchAnimation,
    timerCompletionAnimation,
    scanLineAnimation,
    getWeatherAnimationVariants
  };
} 
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAnimations } from '@/hooks/useAnimations';

interface AmbientEffectsProps {
  themeColor: 'red' | 'blue' | 'green';
}

const AmbientEffects: React.FC<AmbientEffectsProps> = ({ themeColor }) => {
  const { 
    currentWeather, 
    isDaytime,
    scanLineAnimation,
    getWeatherAnimationVariants
  } = useAnimations();
  
  const weatherVariants = getWeatherAnimationVariants();
  
  // Generate an array of elements for rain/snow effects
  const weatherElements = useMemo(() => {
    if (currentWeather === 'sunny' || currentWeather === 'cloudy') return [];
    
    const count = currentWeather === 'rain' ? 50 : 30;
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      size: currentWeather === 'rain' ? 
        Math.random() * 2 + 1 : 
        Math.random() * 3 + 2,
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 5
    }));
  }, [currentWeather]);
  
  // Get background style based on time of day and weather
  const getBackgroundStyle = () => {
    // Base styles for day/night
    const baseStyle = isDaytime ? 
      'opacity-10' : 
      'opacity-20 brightness-50';
      
    // Add weather-specific styles
    switch(currentWeather) {
      case 'rain': 
        return `${baseStyle} bg-blue-900/10`;
      case 'snow': 
        return `${baseStyle} bg-blue-50/10`;
      case 'cloudy': 
        return `${baseStyle} bg-gray-400/10`;
      case 'sunny':
      default:
        return `${baseStyle} bg-yellow-500/10`;
    }
  };
  
  return (
    <>
      {/* Moving scanlines effect */}
      <motion.div 
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-10"
        variants={scanLineAnimation}
        initial="hidden"
        animate="visible"
        style={{
          backgroundImage: 'linear-gradient(transparent, transparent 50%, rgba(0,0,0,0.05) 50%, transparent 51%, transparent)',
          backgroundSize: '100% 4px'
        }}
      />
      
      {/* Weather overlay */}
      <div className={`fixed inset-0 pointer-events-none z-0 ${getBackgroundStyle()}`}>
        {/* For sunny weather - sun element */}
        {currentWeather === 'sunny' && (
          <motion.div 
            className={`absolute top-10 right-10 w-16 h-16 rounded-full bg-yellow-400 opacity-70 shadow-lg`}
            variants={weatherVariants}
            initial="start"
            animate="end"
          />
        )}
        
        {/* For cloudy weather - cloud element */}
        {currentWeather === 'cloudy' && (
          <motion.div 
            className="absolute top-20 w-32 h-16 opacity-40"
            variants={weatherVariants}
            initial="start"
            animate="end"
            style={{
              backgroundImage: 'radial-gradient(ellipse at center, rgba(255,255,255,0.5) 0%, rgba(200,200,200,0.3) 70%, transparent 100%)'
            }}
          />
        )}
        
        {/* Rain/snow drops */}
        {weatherElements.map(element => (
          <motion.div
            key={element.id}
            className={`absolute top-0 rounded-full ${currentWeather === 'rain' ? 'bg-blue-300/40' : 'bg-white/60'}`}
            style={{
              left: element.left,
              width: `${element.size}px`,
              height: currentWeather === 'rain' ? `${element.size * 4}px` : `${element.size}px`
            }}
            variants={weatherVariants}
            initial="start"
            animate="end"
            transition={{
              delay: element.delay,
              duration: currentWeather === 'rain' ? 0.8 + (Math.random() * 0.3) : 3 + (Math.random() * 2)
            }}
          />
        ))}
      </div>
    </>
  );
};

export default AmbientEffects; 
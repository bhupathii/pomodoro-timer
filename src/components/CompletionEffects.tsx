import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CompletionEffectsProps {
  isCompleted: boolean;
  mode: 'pomodoro' | 'shortBreak' | 'longBreak';
  themeColor: 'red' | 'blue' | 'green';
  onComplete: () => void;
}

const CompletionEffects: React.FC<CompletionEffectsProps> = ({
  isCompleted,
  mode,
  themeColor,
  onComplete
}) => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: string;
    y: string;
    size: number;
    rotation: number;
    delay: number;
    shape: 'square' | 'circle' | 'triangle';
  }>>([]);
  
  // Get theme color for particles
  const getThemeColor = () => {
    switch(themeColor) {
      case 'red': return '#e44041';
      case 'blue': return '#4060e4';
      case 'green': return '#2eb857';
      default: return '#e44041';
    }
  };

  // Message to show on completion
  const getMessage = () => {
    if (mode === 'pomodoro') {
      return "Great job!";
    } else if (mode === 'shortBreak') {
      return "Break complete!";
    } else {
      return "Long break done!";
    }
  };

  // Generate confetti particles when completed
  useEffect(() => {
    if (isCompleted) {
      const shapes: Array<'square' | 'circle' | 'triangle'> = ['square', 'circle', 'triangle'];
      const newParticles = Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: `${Math.random() * 100}%`,
        y: `${Math.random() * 100}%`,
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
        delay: Math.random() * 0.5,
        shape: shapes[Math.floor(Math.random() * shapes.length)]
      }));
      
      setParticles(newParticles);
      
      // Reset after animation completes
      const timer = setTimeout(() => {
        onComplete();
        setParticles([]);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isCompleted, onComplete]);

  if (!isCompleted) return null;
  
  return (
    <AnimatePresence>
      {isCompleted && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onComplete}
          >
            {/* Message */}
            <motion.div
              className="pixel-border p-8 bg-pomo-dark relative overflow-hidden"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
            >
              <motion.h2
                className="font-pixel-2p text-4xl text-center mb-4"
                animate={{ 
                  scale: [1, 1.05, 1],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{ color: getThemeColor() }}
              >
                {getMessage()}
              </motion.h2>
              
              <motion.p 
                className="text-center text-white opacity-80 font-pixel"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 0.8, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {mode === 'pomodoro' ? 
                  "Time for a well-deserved break!" : 
                  "Ready to focus again?"}
              </motion.p>
            </motion.div>
            
            {/* Confetti particles */}
            {particles.map(particle => (
              <motion.div
                key={particle.id}
                className={`fixed`}
                style={{
                  left: particle.x,
                  top: particle.y,
                  width: particle.shape === 'circle' ? `${particle.size}px` : undefined,
                  height: particle.shape === 'circle' ? `${particle.size}px` : undefined,
                  borderRadius: particle.shape === 'circle' ? '50%' : '0',
                  borderBottom: particle.shape === 'triangle' ? `${particle.size}px solid ${getThemeColor()}` : undefined,
                  borderLeft: particle.shape === 'triangle' ? `${particle.size/2}px solid transparent` : undefined,
                  borderRight: particle.shape === 'triangle' ? `${particle.size/2}px solid transparent` : undefined,
                  backgroundColor: particle.shape !== 'triangle' ? getThemeColor() : undefined,
                  rotate: `${particle.rotation}deg`
                }}
                initial={{ 
                  scale: 0, 
                  y: 0,
                  opacity: 1
                }}
                animate={{ 
                  scale: 1, 
                  y: [0, -100, 100],
                  opacity: [1, 1, 0],
                  rotate: [`${particle.rotation}deg`, `${particle.rotation + 180}deg`]
                }}
                transition={{ 
                  duration: 1.5 + Math.random(),
                  delay: particle.delay,
                  ease: "easeOut"
                }}
              />
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CompletionEffects; 
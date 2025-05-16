import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnimations } from '@/hooks/useAnimations';

interface ProgressIndicatorProps {
  completedPomodoros: number;
  themeColor: 'red' | 'blue' | 'green';
}

// SVG pixel art tomato
const TomatoIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={className}>
    <rect x="6" y="2" width="4" height="2" fill="darkgreen" />
    <rect x="4" y="4" width="2" height="2" fill="darkgreen" />
    <rect x="6" y="4" width="4" height="2" fill="green" />
    <rect x="10" y="4" width="2" height="2" fill="darkgreen" />
    <rect x="4" y="6" width="8" height="2" fill="#cc0000" />
    <rect x="2" y="8" width="12" height="4" fill="#ff0000" />
    <rect x="4" y="12" width="8" height="2" fill="#cc0000" />
  </svg>
);

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ 
  completedPomodoros,
  themeColor 
}) => {
  const { timerCompletionAnimation } = useAnimations();
  
  // Calculate completed sets and remaining pomodoros in current set
  const completedSets = Math.floor(completedPomodoros / 4);
  const currentSetProgress = completedPomodoros % 4;

  // Generate pixel art growth stages for tomatoes
  const growthStages = useMemo(() => {
    return [0, 1, 2, 3].map(index => {
      const isCompleted = index < currentSetProgress;
      // Different growth stage based on completion
      if (isCompleted) {
        return 100; // Full tomato
      } else if (index === currentSetProgress) {
        return completedPomodoros > 0 ? 50 : 0; // Growing or empty
      } else {
        return 0; // Empty spot
      }
    });
  }, [currentSetProgress, completedPomodoros]);
  
  return (
    <div className="mt-8 text-center">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="font-pixel-2p text-pomo-light text-xl mb-3"
      >
        <span className="mr-2">Set {completedSets + 1}</span>
        {completedSets > 0 && (
          <motion.span 
            className="text-sm opacity-70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
          >
            ({completedPomodoros} total)
          </motion.span>
        )}
      </motion.div>
      
      <div className="flex justify-center gap-4 mt-4 relative">
        {/* Soil ground */}
        <div className="absolute -bottom-4 left-0 right-0 h-4 bg-[#5d4037]/30 rounded-lg" />
        
        {/* Growth indicators */}
        {growthStages.map((growth, index) => {
          const isCompleted = index < currentSetProgress;
          const isCurrentPosition = index === currentSetProgress;
          
          return (
            <div key={index} className="relative">
              <AnimatePresence>
                {growth > 0 && (
                  <motion.div
                    variants={timerCompletionAnimation}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="relative"
                  >
                    {/* Completed tomato */}
                    {isCompleted && (
                      <motion.div
                        initial={{ scale: 0.5, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                      >
                        <TomatoIcon size={32} className={themeColor !== 'red' ? 'grayscale-[30%] brightness-75' : ''} />
                      </motion.div>
                    )}
                    
                    {/* Growing tomato */}
                    {isCurrentPosition && !isCompleted && (
                      <motion.div
                        initial={{ scale: 0.5, y: 10 }}
                        animate={{ 
                          scale: [0.5, 0.55, 0.5], 
                          y: [10, 8, 10]
                        }}
                        transition={{ 
                          repeat: Infinity,
                          repeatType: "reverse",
                          duration: 2
                        }}
                      >
                        <TomatoIcon 
                          size={24} 
                          className={`opacity-50 ${themeColor !== 'red' ? 'grayscale-[50%] brightness-75' : ''}`} 
                        />
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Empty spot or ground */}
              <motion.div
                className={`h-3 w-8 rounded-sm bg-[#5d4037]/50 relative bottom-0`}
                initial={{ scale: 0.8 }}
                animate={isCurrentPosition && !isCompleted ? 
                  { scale: [0.8, 0.9, 0.8] } : 
                  { scale: 0.8 }
                }
                transition={isCurrentPosition ? {
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 1.5
                } : {}}
              />
            </div>
          );
        })}
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 0.5 }}
        className="text-pomo-light opacity-60 text-xs mt-10 font-pixel"
      >
        {completedPomodoros > 0 ? 
          `You've grown ${completedPomodoros} tomato${completedPomodoros !== 1 ? 's' : ''}. Keep going!` 
          : 'Complete your first pomodoro to start growing tomatoes.'}
      </motion.div>
    </div>
  );
};

export default ProgressIndicator; 
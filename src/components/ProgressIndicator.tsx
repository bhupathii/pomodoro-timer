import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnimations } from '@/hooks/useAnimations';

interface ProgressIndicatorProps {
  completedPomodoros: number;
  themeColor: 'red' | 'blue' | 'green';
}

// Enhanced SVG pixel art tomato with better detail
const TomatoIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={className}>
    <rect x="6" y="2" width="4" height="2" fill="darkgreen" />
    <rect x="4" y="4" width="2" height="2" fill="darkgreen" />
    <rect x="6" y="4" width="4" height="2" fill="green" />
    <rect x="10" y="4" width="2" height="2" fill="darkgreen" />
    <rect x="4" y="6" width="8" height="2" fill="#cc0000" />
    <rect x="2" y="8" width="12" height="4" fill="#ff0000" />
    <rect x="4" y="12" width="8" height="2" fill="#cc0000" />
    {/* Highlights for 3D effect */}
    <rect x="4" y="8" width="2" height="2" fill="#ff3333" opacity="0.7" />
    <rect x="6" y="8" width="2" height="2" fill="#ff5555" opacity="0.5" />
  </svg>
);

// New leaf component that appears on completed tomatoes
const LeafIcon = ({ size = 8, position = "left" }) => (
  <motion.svg 
    width={size} 
    height={size} 
    viewBox="0 0 8 8" 
    className={`absolute ${position === "left" ? "-left-2 top-1" : "-right-2 top-1"}`}
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 1, scale: 1, rotate: position === "left" ? -15 : 15 }}
    transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
  >
    <rect x="2" y="0" width="4" height="2" fill="#4CAF50" />
    <rect x="0" y="2" width="6" height="4" fill="#388E3C" />
    <rect x="2" y="6" width="4" height="2" fill="#2E7D32" />
  </motion.svg>
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
    <div className="mt-10 text-center">
      {/* Glass card container */}
      <motion.div
        className="bg-white/5 backdrop-blur-sm rounded-xl px-6 py-5 border border-white/10 shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="font-pixel-2p text-pomo-light text-lg mb-5 flex items-center justify-center gap-2"
        >
          <span 
            className={`px-3 py-1 rounded-md ${
              themeColor === 'red' ? 'bg-red-600/30' : 
              themeColor === 'blue' ? 'bg-blue-600/30' : 
              'bg-green-600/30'
            }`}
          >
            Set {completedSets + 1}
          </span>
          
          {completedSets > 0 && (
            <motion.span 
              className="text-sm opacity-80 font-pixel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
            >
              ({completedPomodoros} total)
            </motion.span>
          )}
        </motion.div>
        
        <div className="flex justify-center gap-6 mt-6 mb-2 relative">
          {/* Enhanced soil ground with texture */}
          <div 
            className="absolute -bottom-5 left-0 right-0 h-5 rounded-lg"
            style={{ 
              background: 'linear-gradient(to bottom, #5d4037 0%, #3E2723 100%)',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)',
              opacity: 0.5
            }} 
          />
          
          {/* Small decorative rocks */}
          <motion.div 
            className="absolute -bottom-3 left-5 w-2 h-1 bg-gray-400 rounded-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 1.2 }}
          />
          <motion.div 
            className="absolute -bottom-2 right-10 w-3 h-2 bg-gray-500 rounded-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ delay: 1.5 }}
          />
          
          {/* Growth indicators with improved visuals */}
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
                      {/* Completed tomato with leaves */}
                      {isCompleted && (
                        <motion.div
                          initial={{ scale: 0.5, y: 20 }}
                          animate={{ scale: 1, y: 0 }}
                          transition={{ type: "spring", stiffness: 300, damping: 15 }}
                          className="relative"
                        >
                          <motion.div
                            animate={{ 
                              y: [0, -2, 0],
                              rotate: [0, 1, 0, -1, 0]
                            }}
                            transition={{
                              duration: 3,
                              ease: "easeInOut",
                              repeat: Infinity,
                              repeatType: "mirror"
                            }}
                          >
                            <TomatoIcon 
                              size={36} 
                              className={themeColor !== 'red' ? 'grayscale-[30%] brightness-75' : ''} 
                            />
                            {/* Add leaves to completed tomatoes */}
                            <LeafIcon position="left" />
                            <LeafIcon position="right" />
                          </motion.div>
                          
                          {/* Glow effect underneath */}
                          <div className={`absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-6 h-2 rounded-full blur-sm ${
                            themeColor === 'red' ? 'bg-red-500/30' : 
                            themeColor === 'blue' ? 'bg-blue-500/30' : 
                            'bg-green-500/30'
                          }`}></div>
                        </motion.div>
                      )}
                      
                      {/* Growing tomato with enhanced animations */}
                      {isCurrentPosition && !isCompleted && (
                        <motion.div
                          initial={{ scale: 0.5, y: 10 }}
                          animate={{ 
                            scale: [0.5, 0.6, 0.5], 
                            y: [10, 7, 10]
                          }}
                          transition={{ 
                            repeat: Infinity,
                            repeatType: "reverse",
                            duration: 2
                          }}
                        >
                          <TomatoIcon 
                            size={28} 
                            className={`${themeColor !== 'red' ? 'grayscale-[50%] brightness-75' : ''}`} 
                          />
                          
                          {/* Pulsing growth indicator */}
                          <motion.div 
                            className={`absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-5 h-5 rounded-full opacity-30 ${
                              themeColor === 'red' ? 'bg-red-500' : 
                              themeColor === 'blue' ? 'bg-blue-500' : 
                              'bg-green-500'
                            }`}
                            animate={{
                              scale: [1, 1.5, 1],
                              opacity: [0.2, 0.3, 0.2]
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity
                            }}
                          />
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Enhanced soil plots with better texture */}
                <motion.div
                  className="h-4 w-10 rounded-lg relative bottom-0"
                  style={{
                    background: 'linear-gradient(to bottom, #6D4C41 0%, #5D4037 100%)', 
                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)'
                  }}
                  initial={{ scale: 0.8, opacity: 0.6 }}
                  animate={isCurrentPosition && !isCompleted ? 
                    { scale: [0.8, 0.9, 0.8], opacity: 0.9 } : 
                    { scale: 0.8, opacity: 0.6 }
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
          animate={{ opacity: 0.8 }}
          transition={{ delay: 0.8 }}
          className="text-pomo-light text-xs mt-12 font-pixel backdrop-blur-sm py-2 px-4 rounded-lg border border-white/5 inline-block"
        >
          {completedPomodoros > 0 ? 
            `You've grown ${completedPomodoros} tomato${completedPomodoros !== 1 ? 's' : ''}. Keep going!` 
            : 'Complete your first pomodoro to start growing tomatoes.'}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ProgressIndicator; 
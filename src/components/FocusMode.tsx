import React from 'react';
import { motion } from 'framer-motion';
import { Maximize, X } from 'lucide-react';

interface FocusModeProps {
  isActive: boolean;
  onToggle: () => void;
  themeColor: 'red' | 'blue' | 'green';
}

const FocusMode: React.FC<FocusModeProps> = ({ 
  isActive,
  onToggle,
  themeColor
}) => {
  // Get theme colors for various states
  const getThemeStyles = () => {
    const baseStyles = {
      color: '#fff',
      borderColor: '#fff'
    };
    
    if (isActive) {
      switch(themeColor) {
        case 'red':
          return { 
            color: 'rgb(var(--theme-red))', 
            borderColor: 'rgb(var(--theme-red))'
          };
        case 'blue':
          return { 
            color: 'rgb(var(--theme-blue))', 
            borderColor: 'rgb(var(--theme-blue))'
          };
        case 'green':
          return { 
            color: 'rgb(var(--theme-green))', 
            borderColor: 'rgb(var(--theme-green))'
          };
        default:
          return baseStyles;
      }
    }
    
    return baseStyles;
  };
  
  const themeStyles = getThemeStyles();
  
  return (
    <motion.button
      className={`${isActive ? 'bg-black' : ''} border-2 rounded-md p-4 flex items-center justify-center gap-2 transition-all duration-200`}
      style={{
        borderColor: themeStyles.borderColor,
        boxShadow: isActive ? `0 0 5px ${themeStyles.borderColor}` : 'none'
      }}
      onClick={onToggle}
      whileTap={{ scale: 0.95 }}
      title={isActive ? "Exit focus mode" : "Enter focus mode"}
      aria-label={isActive ? "Exit focus mode" : "Enter focus mode"}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isActive ? 180 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ color: themeStyles.color }}
      >
        {isActive ? (
          <X className="w-5 h-5" />
        ) : (
          <Maximize className="w-5 h-5" />
        )}
      </motion.div>
      
      {!isActive && (
        <motion.span 
          className="text-xs uppercase font-medium tracking-wide"
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: 'auto' }}
          exit={{ opacity: 0, width: 0 }}
        >
          Focus
        </motion.span>
      )}
    </motion.button>
  );
};

export default FocusMode; 
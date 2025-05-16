import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

type ThemeColor = 'red' | 'blue' | 'green';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: {
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
  };
  onSave: (settings: {
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
  }) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
}) => {
  const [formValues, setFormValues] = useState({ ...settings });

  // Reset form values when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormValues({ ...settings });
    }
  }, [isOpen, settings]);

  const handleSave = () => {
    onSave(formValues);
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === 'checkbox') {
      setFormValues({ ...formValues, [name]: (e.target as HTMLInputElement).checked });
    } else if (type === 'range') {
      setFormValues({ ...formValues, [name]: parseFloat(value) });
    } else if (name === 'themeColor' && (value === 'red' || value === 'blue' || value === 'green')) {
      setFormValues({ ...formValues, [name]: value as ThemeColor });
    } else if (name === 'pomodoroLabel' || name === 'shortBreakLabel' || name === 'longBreakLabel') {
      setFormValues({ ...formValues, [name]: value });
    } else {
      // Convert the string input values to minutes, then to seconds
      const minutes = parseInt(value, 10) || 0;
      setFormValues({ ...formValues, [name]: minutes * 60 });
    }
  };

  // Get current theme color values
  const getThemeColorValue = () => {
    switch (formValues.themeColor) {
      case 'red': return 'rgb(var(--theme-red))';
      case 'blue': return 'rgb(var(--theme-blue))';
      case 'green': return 'rgb(var(--theme-green))';
      default: return 'rgb(var(--theme-red))';
    }
  };

  // Custom checkbox style
  const customCheckboxStyle = {
    accentColor: getThemeColorValue()
  };
  
  // Custom slider style
  const customSliderStyle = {
    accentColor: getThemeColorValue(),
    background: `linear-gradient(to right, ${getThemeColorValue()} 0%, ${getThemeColorValue()} ${formValues.volume * 100}%, #666 ${formValues.volume * 100}%, #666 100%)`
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-pomo-dark w-full max-w-md p-6 rounded-md border-4 border-pomo-light"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-pixel text-pomo-light">Settings</h2>
              <button
                onClick={onClose}
                className="text-pomo-light hover:opacity-70"
                aria-label="Close settings"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-pixel text-pomo-light mb-3">Timer (minutes)</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label
                      htmlFor="pomodoro"
                      className="block text-sm text-pomo-light mb-1"
                    >
                      Pomodoro
                    </label>
                    <input
                      type="number"
                      id="pomodoro"
                      name="pomodoro"
                      min="1"
                      max="60"
                      value={formValues.pomodoro / 60}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-pomo-dark border-2 border-pomo-light text-pomo-light rounded-md focus:outline-none focus:ring-2"
                      style={{ 
                        outlineColor: getThemeColorValue(),
                        boxShadow: `0 0 0 1px ${getThemeColorValue()}05` 
                      }}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="shortBreak"
                      className="block text-sm text-pomo-light mb-1"
                    >
                      Short Break
                    </label>
                    <input
                      type="number"
                      id="shortBreak"
                      name="shortBreak"
                      min="1"
                      max="60"
                      value={formValues.shortBreak / 60}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-pomo-dark border-2 border-pomo-light text-pomo-light rounded-md focus:outline-none focus:ring-2"
                      style={{ 
                        outlineColor: getThemeColorValue(),
                        boxShadow: `0 0 0 1px ${getThemeColorValue()}05` 
                      }}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="longBreak"
                      className="block text-sm text-pomo-light mb-1"
                    >
                      Long Break
                    </label>
                    <input
                      type="number"
                      id="longBreak"
                      name="longBreak"
                      min="1"
                      max="60"
                      value={formValues.longBreak / 60}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-pomo-dark border-2 border-pomo-light text-pomo-light rounded-md focus:outline-none focus:ring-2"
                      style={{ 
                        outlineColor: getThemeColorValue(),
                        boxShadow: `0 0 0 1px ${getThemeColorValue()}05` 
                      }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-pixel text-pomo-light mb-3">Timer Labels</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label
                      htmlFor="pomodoroLabel"
                      className="block text-sm text-pomo-light mb-1"
                    >
                      Pomodoro Label
                    </label>
                    <input
                      type="text"
                      id="pomodoroLabel"
                      name="pomodoroLabel"
                      value={formValues.pomodoroLabel}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-pomo-dark border-2 border-pomo-light text-pomo-light rounded-md focus:outline-none focus:ring-2"
                      style={{ 
                        outlineColor: getThemeColorValue(),
                        boxShadow: `0 0 0 1px ${getThemeColorValue()}05` 
                      }}
                      maxLength={10}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="shortBreakLabel"
                      className="block text-sm text-pomo-light mb-1"
                    >
                      Short Break Label
                    </label>
                    <input
                      type="text"
                      id="shortBreakLabel"
                      name="shortBreakLabel"
                      value={formValues.shortBreakLabel}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-pomo-dark border-2 border-pomo-light text-pomo-light rounded-md focus:outline-none focus:ring-2"
                      style={{ 
                        outlineColor: getThemeColorValue(),
                        boxShadow: `0 0 0 1px ${getThemeColorValue()}05` 
                      }}
                      maxLength={12}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="longBreakLabel"
                      className="block text-sm text-pomo-light mb-1"
                    >
                      Long Break Label
                    </label>
                    <input
                      type="text"
                      id="longBreakLabel"
                      name="longBreakLabel"
                      value={formValues.longBreakLabel}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-pomo-dark border-2 border-pomo-light text-pomo-light rounded-md focus:outline-none focus:ring-2"
                      style={{ 
                        outlineColor: getThemeColorValue(),
                        boxShadow: `0 0 0 1px ${getThemeColorValue()}05` 
                      }}
                      maxLength={12}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-pixel text-pomo-light mb-3">Theme Color</h3>
                <div className="flex gap-4 mb-3">
                  <label className="relative cursor-pointer flex items-center">
                    <input
                      type="radio"
                      name="themeColor"
                      value="red"
                      checked={formValues.themeColor === 'red'}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className="w-8 h-8 rounded-full bg-[rgb(var(--theme-red))] border-2 border-pomo-light flex items-center justify-center">
                      {formValues.themeColor === 'red' && (
                        <div className="w-3 h-3 rounded-full bg-white" />
                      )}
                    </div>
                    <span className="ml-2 text-pomo-light">Red</span>
                  </label>
                  
                  <label className="relative cursor-pointer flex items-center">
                    <input
                      type="radio"
                      name="themeColor"
                      value="blue"
                      checked={formValues.themeColor === 'blue'}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className="w-8 h-8 rounded-full bg-[rgb(var(--theme-blue))] border-2 border-pomo-light flex items-center justify-center">
                      {formValues.themeColor === 'blue' && (
                        <div className="w-3 h-3 rounded-full bg-white" />
                      )}
                    </div>
                    <span className="ml-2 text-pomo-light">Blue</span>
                  </label>
                  
                  <label className="relative cursor-pointer flex items-center">
                    <input
                      type="radio"
                      name="themeColor"
                      value="green"
                      checked={formValues.themeColor === 'green'}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className="w-8 h-8 rounded-full bg-[rgb(var(--theme-green))] border-2 border-pomo-light flex items-center justify-center">
                      {formValues.themeColor === 'green' && (
                        <div className="w-3 h-3 rounded-full bg-white" />
                      )}
                    </div>
                    <span className="ml-2 text-pomo-light">Green</span>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-pixel text-pomo-light mb-3">Auto Start</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="autoStartBreaks"
                      name="autoStartBreaks"
                      checked={formValues.autoStartBreaks}
                      onChange={handleInputChange}
                      className="mr-3 h-5 w-5"
                      style={customCheckboxStyle}
                    />
                    <label
                      htmlFor="autoStartBreaks"
                      className="text-sm text-pomo-light"
                    >
                      Auto-start breaks
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="autoStartPomodoros"
                      name="autoStartPomodoros"
                      checked={formValues.autoStartPomodoros}
                      onChange={handleInputChange}
                      className="mr-3 h-5 w-5"
                      style={customCheckboxStyle}
                    />
                    <label
                      htmlFor="autoStartPomodoros"
                      className="text-sm text-pomo-light"
                    >
                      Auto-start pomodoros
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-pixel text-pomo-light mb-3">Sound Volume</h3>
                <input
                  type="range"
                  id="volume"
                  name="volume"
                  min="0"
                  max="1"
                  step="0.1"
                  value={formValues.volume}
                  onChange={handleInputChange}
                  className="w-full cursor-pointer"
                  style={customSliderStyle}
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-pomo-light opacity-60">Off</span>
                  <span className="text-xs text-pomo-light opacity-60">Max</span>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={handleSave}
                  className="text-white font-pixel px-6 py-3 rounded-md"
                  style={{ backgroundColor: getThemeColorValue() }}
                  aria-label="Save settings"
                >
                  Save
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SettingsModal; 
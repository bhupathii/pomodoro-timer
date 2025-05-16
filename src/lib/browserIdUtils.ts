/**
 * Generate a unique browser identifier for tracking user sessions
 * This will be stored in localStorage to identify the browser across visits
 */

// Generate a random ID with specified length
const generateRandomId = (length: number = 16) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  
  return result;
};

// Get or create a browser ID
export const getBrowserId = (): string => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return 'server';
  }

  // Try to get existing ID from localStorage
  const localStorageKey = 'pomodoro_browser_id';
  let browserId = localStorage.getItem(localStorageKey);
  
  // If no ID exists, generate a new one and store it
  if (!browserId) {
    browserId = `${generateRandomId(8)}-${Date.now()}`;
    localStorage.setItem(localStorageKey, browserId);
  }
  
  return browserId;
}; 
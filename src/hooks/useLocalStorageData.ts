
import { useState, useEffect } from "react";

/**
 * A hook for storing and retrieving data from localStorage with type safety.
 * This hook follows the useState pattern of [value, setValue].
 */
export function useLocalStorageData<T>(
  key: string, 
  initialValue: T
): [T, (value: T) => void] {
  // Get stored value from localStorage or use initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      console.log(`Initializing localStorage for key: ${key}`);
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Update localStorage when storedValue changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

// For backwards compatibility
export default useLocalStorageData;

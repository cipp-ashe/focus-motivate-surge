
import { useEffect } from 'react';

interface HabitDebugLoggerProps {
  templates: any[];
  todaysHabits: any[];
}

const HabitDebugLogger: React.FC<HabitDebugLoggerProps> = ({ 
  templates, 
  todaysHabits 
}) => {
  // Debug to see what data we have
  useEffect(() => {
    console.log("HabitsPage - templates from context:", templates);
    console.log("HabitsPage - today's habits:", todaysHabits);
    
    // Check localStorage directly
    try {
      const storedTemplates = localStorage.getItem('habit-templates');
      console.log("HabitsPage - templates from localStorage:", storedTemplates ? JSON.parse(storedTemplates) : "none");
      
      // Also check habit progress
      const storedProgress = localStorage.getItem('habit-progress');
      console.log("HabitsPage - habit progress from localStorage:", storedProgress ? JSON.parse(storedProgress) : "none");
    } catch (error) {
      console.error("Error parsing data from localStorage:", error);
    }
  }, [templates, todaysHabits]);

  return null; // This is a utility component that doesn't render anything
};

export default HabitDebugLogger;

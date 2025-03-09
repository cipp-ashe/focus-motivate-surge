
import { useEffect } from 'react';
import { ActiveTemplate, HabitDetail } from './types';

interface HabitDebugLoggerProps {
  templates: ActiveTemplate[];
  todaysHabits: HabitDetail[];
}

// This component doesn't render anything - it just logs debug info
const HabitDebugLogger: React.FC<HabitDebugLoggerProps> = ({ 
  templates, 
  todaysHabits 
}) => {
  useEffect(() => {
    console.log("HabitDebugLogger - Active templates:", templates);
    console.log("HabitDebugLogger - Today's habits:", todaysHabits);
  }, [templates, todaysHabits]);
  
  return null;
};

export default HabitDebugLogger;

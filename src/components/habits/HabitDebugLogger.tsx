
import { useEffect } from 'react';
import { ActiveTemplate, HabitDetail } from './types';
import { logger } from '@/utils/logManager';

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
    logger.debug("HabitDebugLogger", "Active templates:", templates);
    logger.debug("HabitDebugLogger", "Today's habits:", todaysHabits);
  }, [templates, todaysHabits]);
  
  return null;
};

export default HabitDebugLogger;

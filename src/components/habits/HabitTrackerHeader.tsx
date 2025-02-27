
import React from 'react';
import { Button } from "@/components/ui/button";
import { useHabitsPanel } from '@/hooks/useHabitsPanel';

const HabitTrackerHeader: React.FC = () => {
  const { close } = useHabitsPanel();
  
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold">Habit Tracking</h2>
      <Button 
        variant="outline" 
        size="sm"
        onClick={close}
      >
        Close
      </Button>
    </div>
  );
};

export default HabitTrackerHeader;

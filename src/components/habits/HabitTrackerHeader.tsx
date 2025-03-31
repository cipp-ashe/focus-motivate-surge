
import React from 'react';
import { Button } from "@/components/ui/button";
import { usePanel } from '@/contexts/ui/PanelContext';

const HabitTrackerHeader: React.FC = () => {
  const panel = usePanel();
  
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold">Habit Tracking</h2>
      <Button 
        variant="outline" 
        size="sm"
        onClick={panel.closePanel}
      >
        Close
      </Button>
    </div>
  );
};

export default HabitTrackerHeader;


import React from 'react';
import { Settings } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface HabitTrackerHeaderProps {
  onConfigureTemplates: () => void;
}

const HabitTrackerHeader: React.FC<HabitTrackerHeaderProps> = ({ onConfigureTemplates }) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold tracking-tight">Habit Configuration</h2>
      <Button
        onClick={onConfigureTemplates}
        variant="outline"
        size="sm"
        className="gap-2"
      >
        <Settings className="h-4 w-4" />
        Configure Habit Templates
      </Button>
    </div>
  );
};

export default HabitTrackerHeader;

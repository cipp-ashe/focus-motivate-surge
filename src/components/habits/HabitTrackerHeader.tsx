
import React from 'react';
import { Settings } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface HabitTrackerHeaderProps {
  onConfigureTemplates: () => void;
}

const HabitTrackerHeader: React.FC<HabitTrackerHeaderProps> = ({ onConfigureTemplates }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <h2 className="text-4xl font-bold text-primary tracking-tight">Habit Configuration</h2>
      <Button
        onClick={onConfigureTemplates}
        variant="outline"
        size="sm"
        className="w-full sm:w-auto gap-2"
      >
        <Settings className="h-4 w-4" />
        <span className="whitespace-nowrap">Configure Templates</span>
      </Button>
    </div>
  );
};

export default HabitTrackerHeader;


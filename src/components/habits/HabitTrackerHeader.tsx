
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface HabitTrackerHeaderProps {
  onAddTemplate: () => void;
}

const HabitTrackerHeader: React.FC<HabitTrackerHeaderProps> = ({ onAddTemplate }) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold tracking-tight">Habit Configuration</h2>
      <Button
        onClick={onAddTemplate}
        variant="outline"
        size="sm"
        className="gap-2"
      >
        <Plus className="h-4 w-4" />
        Add Template
      </Button>
    </div>
  );
};

export default HabitTrackerHeader;


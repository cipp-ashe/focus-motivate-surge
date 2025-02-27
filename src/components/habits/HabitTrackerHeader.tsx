
import React from 'react';
import { Button } from "@/components/ui/button";
import { Settings2 } from "lucide-react";

interface HabitTrackerHeaderProps {
  onConfigureTemplates?: () => void;
}

// Simplified component that doesn't directly access context
const HabitTrackerHeader: React.FC<HabitTrackerHeaderProps> = ({ onConfigureTemplates }) => {
  const handleConfigureClick = () => {
    console.log("Configure Templates button clicked");
    if (onConfigureTemplates) {
      onConfigureTemplates();
    }
  };

  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold">Habit Tracking</h2>
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleConfigureClick}
        className="flex items-center gap-2"
      >
        <Settings2 className="h-4 w-4" />
        Configure Templates
      </Button>
    </div>
  );
};

export default HabitTrackerHeader;

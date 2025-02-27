
import React from 'react';
import { Button } from "@/components/ui/button";
import { Settings2 } from "lucide-react";
import { useHabitsPanel } from "@/hooks/useHabitsPanel";

interface HabitTrackerHeaderProps {
  onConfigureTemplates?: () => void;
}

const HabitTrackerHeader: React.FC<HabitTrackerHeaderProps> = ({ onConfigureTemplates }) => {
  const { close, startConfiguring } = useHabitsPanel();
  
  const handleConfigureClick = () => {
    console.log("Configure Templates button clicked");
    
    // First close the drawer panel
    close();
    
    // Then start configuring (after a small delay to ensure drawer is closed)
    setTimeout(() => {
      if (onConfigureTemplates) {
        console.log("Starting template configuration");
        onConfigureTemplates();
      } else {
        startConfiguring();
      }
    }, 300);
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

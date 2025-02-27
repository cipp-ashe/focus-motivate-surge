
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
    
    // Close the habits panel first
    close();
    
    // Wait for the drawer to finish closing before attempting to open the configuration
    setTimeout(() => {
      if (onConfigureTemplates) {
        console.log("Calling onConfigureTemplates callback");
        onConfigureTemplates();
      } else {
        console.log("Using startConfiguring from context");
        startConfiguring();
      }
    }, 500); // Increased timeout to ensure drawer is fully closed
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

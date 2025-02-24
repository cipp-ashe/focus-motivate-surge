
import React from 'react';
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { SheetTrigger } from "@/components/ui/sheet";

interface HabitTrackerHeaderProps {
  onConfigureTemplates?: () => void;
}

const HabitTrackerHeader: React.FC<HabitTrackerHeaderProps> = ({ 
  onConfigureTemplates 
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <h2 className="text-lg font-semibold">Habit Tracker</h2>
      {onConfigureTemplates && (
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Configure Templates
          </Button>
        </SheetTrigger>
      )}
    </div>
  );
};

export default HabitTrackerHeader;

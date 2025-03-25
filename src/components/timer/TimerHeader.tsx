
import { memo } from "react";
import { useIsMobile } from "@/hooks/ui/useIsMobile";
import { cn } from "@/lib/utils";

interface TimerHeaderProps {
  taskName: string;
  onCloseTimer?: () => void;
}

export const TimerHeader = memo(({ taskName, onCloseTimer }: TimerHeaderProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="text-center mb-2">
      <h2 
        className={cn(
          "font-medium break-words whitespace-pre-wrap max-w-full tracking-tight text-primary",
          isMobile ? "text-lg" : "text-xl"
        )}
      >
        {taskName}
      </h2>
    </div>
  );
});

TimerHeader.displayName = 'TimerHeader';

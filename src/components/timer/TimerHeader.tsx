
import { memo } from "react";
import { useIsMobile } from "@/hooks/ui/useIsMobile";

interface TimerHeaderProps {
  taskName: string;
  onCloseTimer?: () => void;
}

export const TimerHeader = memo(({ taskName, onCloseTimer }: TimerHeaderProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="text-center">
      <h2 
        className={`${isMobile ? 'text-xl' : 'text-2xl sm:text-3xl'} font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500 break-words whitespace-pre-wrap max-w-full px-2 tracking-tight`}
      >
        {taskName}
      </h2>
    </div>
  );
});

TimerHeader.displayName = 'TimerHeader';

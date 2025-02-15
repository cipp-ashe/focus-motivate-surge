
import { memo } from "react";

interface TimerHeaderProps {
  taskName: string;
  onCloseTimer?: () => void;
}

export const TimerHeader = memo(({ taskName, onCloseTimer }: TimerHeaderProps) => {
  return (
    <h2 
      className="text-xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500 break-words whitespace-pre-wrap max-w-full px-2"
    >
      {taskName}
    </h2>
  );
});

TimerHeader.displayName = 'TimerHeader';

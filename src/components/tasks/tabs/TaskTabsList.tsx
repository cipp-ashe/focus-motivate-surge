
import React from 'react';
import { TaskType } from '@/types/tasks';
import { FileText, Timer, Image, BookOpen, CheckSquare, Mic } from 'lucide-react';
import { useIsMobile } from '@/hooks/ui/useIsMobile';
import { cn } from '@/lib/utils';

interface TaskTabsListProps {
  taskCounts: {
    all: number;
    timer: number;
    screenshot: number;
    journal: number;
    checklist: number;
    voicenote: number;
    regular: number;
  };
  activeTaskType?: 'all' | TaskType;
  onTaskTypeChange?: (type: string) => void;
}

export const TaskTabsList: React.FC<TaskTabsListProps> = ({ 
  taskCounts, 
  activeTaskType = 'all',
  onTaskTypeChange = () => {}
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex w-full justify-between overflow-x-auto py-1 px-1 gap-1 bg-muted rounded-md">
      <button
        onClick={() => onTaskTypeChange('all')}
        className={cn(
          "flex-1 flex items-center justify-center gap-1 rounded-sm px-2 py-1 text-xs whitespace-nowrap",
          activeTaskType === 'all' 
            ? "bg-primary/10 text-primary" 
            : "bg-transparent text-muted-foreground hover:bg-muted/80"
        )}
      >
        <FileText className={cn("h-3 w-3", isMobile && "mr-0.5")} />
        <span className={cn(isMobile ? "text-[10px]" : "text-xs")}>{isMobile ? taskCounts.all : `All (${taskCounts.all})`}</span>
      </button>
      
      <button
        onClick={() => onTaskTypeChange('regular')}
        className={cn(
          "flex-1 flex items-center justify-center gap-1 rounded-sm px-2 py-1 text-xs whitespace-nowrap",
          activeTaskType === 'regular' 
            ? "bg-primary/10 text-primary" 
            : "bg-transparent text-muted-foreground hover:bg-muted/80"
        )}
      >
        <FileText className={cn("h-3 w-3 text-primary", isMobile && "mr-0.5")} />
        <span className={cn(isMobile ? "text-[10px]" : "text-xs")}>{isMobile ? taskCounts.regular : `Regular (${taskCounts.regular})`}</span>
      </button>
      
      <button
        onClick={() => onTaskTypeChange('timer')}
        className={cn(
          "flex-1 flex items-center justify-center gap-1 rounded-sm px-2 py-1 text-xs whitespace-nowrap",
          activeTaskType === 'timer' 
            ? "bg-purple-500/15 text-purple-500" 
            : "bg-transparent text-muted-foreground hover:bg-muted/80"
        )}
      >
        <Timer className={cn("h-3 w-3 text-purple-400", isMobile && "mr-0.5")} />
        <span className={cn(isMobile ? "text-[10px]" : "text-xs")}>{isMobile ? taskCounts.timer : `Timer (${taskCounts.timer})`}</span>
      </button>
      
      <button
        onClick={() => onTaskTypeChange('journal')}
        className={cn(
          "flex-1 flex items-center justify-center gap-1 rounded-sm px-2 py-1 text-xs whitespace-nowrap",
          activeTaskType === 'journal' 
            ? "bg-amber-500/15 text-amber-500" 
            : "bg-transparent text-muted-foreground hover:bg-muted/80"
        )}
      >
        <BookOpen className={cn("h-3 w-3 text-amber-400", isMobile && "mr-0.5")} />
        <span className={cn(isMobile ? "text-[10px]" : "text-xs")}>{isMobile ? taskCounts.journal : `Journal (${taskCounts.journal})`}</span>
      </button>
      
      <button
        onClick={() => onTaskTypeChange('checklist')}
        className={cn(
          "flex-1 flex items-center justify-center gap-1 rounded-sm px-2 py-1 text-xs whitespace-nowrap",
          activeTaskType === 'checklist' 
            ? "bg-cyan-500/15 text-cyan-500" 
            : "bg-transparent text-muted-foreground hover:bg-muted/80"
        )}
      >
        <CheckSquare className={cn("h-3 w-3 text-cyan-400", isMobile && "mr-0.5")} />
        <span className={cn(isMobile ? "text-[10px]" : "text-xs")}>{isMobile ? taskCounts.checklist : `Checklist (${taskCounts.checklist})`}</span>
      </button>
      
      <button
        onClick={() => onTaskTypeChange('screenshot')}
        className={cn(
          "flex-1 flex items-center justify-center gap-1 rounded-sm px-2 py-1 text-xs whitespace-nowrap",
          activeTaskType === 'screenshot' 
            ? "bg-blue-500/15 text-blue-500" 
            : "bg-transparent text-muted-foreground hover:bg-muted/80"
        )}
      >
        <Image className={cn("h-3 w-3 text-blue-400", isMobile && "mr-0.5")} />
        <span className={cn(isMobile ? "text-[10px]" : "text-xs")}>{isMobile ? taskCounts.screenshot : `Screenshot (${taskCounts.screenshot})`}</span>
      </button>
      
      <button
        onClick={() => onTaskTypeChange('voicenote')}
        className={cn(
          "flex-1 flex items-center justify-center gap-1 rounded-sm px-2 py-1 text-xs whitespace-nowrap",
          activeTaskType === 'voicenote' 
            ? "bg-rose-500/15 text-rose-500" 
            : "bg-transparent text-muted-foreground hover:bg-muted/80"
        )}
      >
        <Mic className={cn("h-3 w-3 text-rose-400", isMobile && "mr-0.5")} />
        <span className={cn(isMobile ? "text-[10px]" : "text-xs")}>{isMobile ? taskCounts.voicenote : `Voice (${taskCounts.voicenote})`}</span>
      </button>
    </div>
  );
};

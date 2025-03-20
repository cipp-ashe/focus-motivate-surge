
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
    <div className="flex w-full overflow-x-auto py-2 px-1 gap-2 border-b border-border/10 bg-card/30">
      <button
        onClick={() => onTaskTypeChange('all')}
        className={cn(
          "flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm whitespace-nowrap",
          activeTaskType === 'all' 
            ? "bg-purple-500/20 text-purple-400" 
            : "bg-transparent text-muted-foreground hover:bg-muted/50"
        )}
      >
        <FileText className="h-4 w-4" />
        <span>{`All (${taskCounts.all})`}</span>
      </button>
      
      <button
        onClick={() => onTaskTypeChange('regular')}
        className={cn(
          "flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm whitespace-nowrap",
          activeTaskType === 'regular' 
            ? "bg-primary/10 text-primary" 
            : "bg-transparent text-muted-foreground hover:bg-muted/50"
        )}
      >
        <FileText className="h-4 w-4 text-primary" />
        <span>{`Regular (${taskCounts.regular})`}</span>
      </button>
      
      <button
        onClick={() => onTaskTypeChange('timer')}
        className={cn(
          "flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm whitespace-nowrap",
          activeTaskType === 'timer' 
            ? "bg-purple-500/20 text-purple-400" 
            : "bg-transparent text-muted-foreground hover:bg-muted/50"
        )}
      >
        <Timer className="h-4 w-4 text-purple-400" />
        <span>{`Timer (${taskCounts.timer})`}</span>
      </button>
      
      <button
        onClick={() => onTaskTypeChange('journal')}
        className={cn(
          "flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm whitespace-nowrap",
          activeTaskType === 'journal' 
            ? "bg-amber-500/20 text-amber-400" 
            : "bg-transparent text-muted-foreground hover:bg-muted/50"
        )}
      >
        <BookOpen className="h-4 w-4 text-amber-400" />
        <span>{`Journal (${taskCounts.journal})`}</span>
      </button>
      
      <button
        onClick={() => onTaskTypeChange('checklist')}
        className={cn(
          "flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm whitespace-nowrap",
          activeTaskType === 'checklist' 
            ? "bg-cyan-500/20 text-cyan-400" 
            : "bg-transparent text-muted-foreground hover:bg-muted/50"
        )}
      >
        <CheckSquare className="h-4 w-4 text-cyan-400" />
        <span>{`Checklists (${taskCounts.checklist})`}</span>
      </button>
      
      <button
        onClick={() => onTaskTypeChange('screenshot')}
        className={cn(
          "flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm whitespace-nowrap",
          activeTaskType === 'screenshot' 
            ? "bg-blue-500/20 text-blue-400" 
            : "bg-transparent text-muted-foreground hover:bg-muted/50"
        )}
      >
        <Image className="h-4 w-4 text-blue-400" />
        <span>{`Screenshots (${taskCounts.screenshot})`}</span>
      </button>
      
      <button
        onClick={() => onTaskTypeChange('voicenote')}
        className={cn(
          "flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm whitespace-nowrap",
          activeTaskType === 'voicenote' 
            ? "bg-rose-500/20 text-rose-400" 
            : "bg-transparent text-muted-foreground hover:bg-muted/50"
        )}
      >
        <Mic className="h-4 w-4 text-rose-400" />
        <span>{`Voice Notes (${taskCounts.voicenote})`}</span>
      </button>
    </div>
  );
};

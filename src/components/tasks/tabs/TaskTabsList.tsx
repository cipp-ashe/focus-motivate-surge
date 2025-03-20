
import React from 'react';
import { TaskType } from '@/types/tasks';
import { FileText, Timer, Image, BookOpen, CheckSquare, Mic, Sparkles } from 'lucide-react';
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
    focus: number;
  };
  activeTaskType: 'all' | TaskType;
  onTaskTypeChange: (type: string) => void;
  // Legacy prop names removed
}

export const TaskTabsList: React.FC<TaskTabsListProps> = ({ 
  taskCounts, 
  activeTaskType = 'all',
  onTaskTypeChange,
  // Check for legacy props and throw errors
  ...props
}) => {
  const isMobile = useIsMobile();
  
  // Throw errors if legacy props are present
  if ('activeFilter' in props) {
    throw new Error('LEGACY PROP DETECTED: "activeFilter" is deprecated. Use "activeTaskType" instead.');
  }
  
  if ('onFilterChange' in props) {
    throw new Error('LEGACY PROP DETECTED: "onFilterChange" is deprecated. Use "onTaskTypeChange" instead.');
  }
  
  if ('counts' in props) {
    throw new Error('LEGACY PROP DETECTED: "counts" is deprecated. Use "taskCounts" instead.');
  }
  
  return (
    <div className="flex w-full overflow-x-auto py-2 px-1 gap-2 border-b">
      <button
        onClick={() => onTaskTypeChange('all')}
        className={cn(
          "flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm whitespace-nowrap",
          activeTaskType === 'all' 
            ? "bg-primary/20 text-primary" 
            : "bg-transparent text-muted-foreground hover:bg-muted/80"
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
            ? "bg-primary/20 text-primary" 
            : "bg-transparent text-muted-foreground hover:bg-muted/80"
        )}
      >
        <FileText className="h-4 w-4" />
        <span>{`Regular (${taskCounts.regular})`}</span>
      </button>
      
      <button
        onClick={() => onTaskTypeChange('timer')}
        className={cn(
          "flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm whitespace-nowrap",
          activeTaskType === 'timer' 
            ? "bg-purple-500/20 text-purple-400" 
            : "bg-transparent text-muted-foreground hover:bg-muted/80"
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
            : "bg-transparent text-muted-foreground hover:bg-muted/80"
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
            : "bg-transparent text-muted-foreground hover:bg-muted/80"
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
            : "bg-transparent text-muted-foreground hover:bg-muted/80"
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
            : "bg-transparent text-muted-foreground hover:bg-muted/80"
        )}
      >
        <Mic className="h-4 w-4 text-rose-400" />
        <span>{`Voice Notes (${taskCounts.voicenote})`}</span>
      </button>
      
      <button
        onClick={() => onTaskTypeChange('focus')}
        className={cn(
          "flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm whitespace-nowrap",
          activeTaskType === 'focus' 
            ? "bg-emerald-500/20 text-emerald-400" 
            : "bg-transparent text-muted-foreground hover:bg-muted/80"
        )}
      >
        <Sparkles className="h-4 w-4 text-emerald-400" />
        <span>{`Focus (${taskCounts.focus})`}</span>
      </button>
    </div>
  );
};

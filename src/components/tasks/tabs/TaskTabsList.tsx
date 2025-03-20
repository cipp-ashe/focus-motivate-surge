
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
  // Legacy prop names for compatibility
  activeFilter?: 'all' | TaskType;
  onFilterChange?: (type: string) => void;
  counts?: {
    all: number;
    timer: number;
    screenshot: number;
    journal: number;
    checklist: number;
    voicenote: number;
    regular: number;
    focus: number;
  };
}

export const TaskTabsList: React.FC<TaskTabsListProps> = ({ 
  taskCounts, 
  activeTaskType = 'all',
  onTaskTypeChange = () => {},
  // Support for legacy props
  activeFilter,
  onFilterChange,
  counts
}) => {
  const isMobile = useIsMobile();
  
  // Use legacy props if provided, otherwise use new props
  const effectiveTaskCounts = counts || taskCounts;
  const effectiveActiveType = activeFilter !== undefined ? activeFilter : activeTaskType;
  const effectiveOnChange = onFilterChange || onTaskTypeChange;
  
  return (
    <div className="flex w-full overflow-x-auto py-2 px-1 gap-2 border-b border-[#6E59A5]/20 bg-[#1A1F2C]/80">
      <button
        onClick={() => effectiveOnChange('all')}
        className={cn(
          "flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm whitespace-nowrap",
          effectiveActiveType === 'all' 
            ? "bg-purple-500/20 text-purple-400" 
            : "bg-transparent text-muted-foreground hover:bg-[#6E59A5]/20"
        )}
      >
        <FileText className="h-4 w-4" />
        <span>{`All (${effectiveTaskCounts.all})`}</span>
      </button>
      
      <button
        onClick={() => effectiveOnChange('regular')}
        className={cn(
          "flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm whitespace-nowrap",
          effectiveActiveType === 'regular' 
            ? "bg-[#9b87f5]/20 text-[#9b87f5]" 
            : "bg-transparent text-muted-foreground hover:bg-[#6E59A5]/20"
        )}
      >
        <FileText className="h-4 w-4 text-[#9b87f5]" />
        <span>{`Regular (${effectiveTaskCounts.regular})`}</span>
      </button>
      
      <button
        onClick={() => effectiveOnChange('timer')}
        className={cn(
          "flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm whitespace-nowrap",
          effectiveActiveType === 'timer' 
            ? "bg-purple-500/20 text-purple-400" 
            : "bg-transparent text-muted-foreground hover:bg-[#6E59A5]/20"
        )}
      >
        <Timer className="h-4 w-4 text-purple-400" />
        <span>{`Timer (${effectiveTaskCounts.timer})`}</span>
      </button>
      
      <button
        onClick={() => effectiveOnChange('journal')}
        className={cn(
          "flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm whitespace-nowrap",
          effectiveActiveType === 'journal' 
            ? "bg-amber-500/20 text-amber-400" 
            : "bg-transparent text-muted-foreground hover:bg-[#6E59A5]/20"
        )}
      >
        <BookOpen className="h-4 w-4 text-amber-400" />
        <span>{`Journal (${effectiveTaskCounts.journal})`}</span>
      </button>
      
      <button
        onClick={() => effectiveOnChange('checklist')}
        className={cn(
          "flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm whitespace-nowrap",
          effectiveActiveType === 'checklist' 
            ? "bg-cyan-500/20 text-cyan-400" 
            : "bg-transparent text-muted-foreground hover:bg-[#6E59A5]/20"
        )}
      >
        <CheckSquare className="h-4 w-4 text-cyan-400" />
        <span>{`Checklists (${effectiveTaskCounts.checklist})`}</span>
      </button>
      
      <button
        onClick={() => effectiveOnChange('screenshot')}
        className={cn(
          "flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm whitespace-nowrap",
          effectiveActiveType === 'screenshot' 
            ? "bg-blue-500/20 text-blue-400" 
            : "bg-transparent text-muted-foreground hover:bg-[#6E59A5]/20"
        )}
      >
        <Image className="h-4 w-4 text-blue-400" />
        <span>{`Screenshots (${effectiveTaskCounts.screenshot})`}</span>
      </button>
      
      <button
        onClick={() => effectiveOnChange('voicenote')}
        className={cn(
          "flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm whitespace-nowrap",
          effectiveActiveType === 'voicenote' 
            ? "bg-rose-500/20 text-rose-400" 
            : "bg-transparent text-muted-foreground hover:bg-[#6E59A5]/20"
        )}
      >
        <Mic className="h-4 w-4 text-rose-400" />
        <span>{`Voice Notes (${effectiveTaskCounts.voicenote})`}</span>
      </button>
    </div>
  );
};

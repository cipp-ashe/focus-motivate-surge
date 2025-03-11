
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Timer, BookOpen, CheckSquare } from 'lucide-react';
import { useIsMobile } from '@/hooks/ui/useIsMobile';

interface TaskTabsListProps {
  taskCounts: {
    all: number;
    timer: number;
    journal: number;
    checklist: number;
    regular: number;
  };
}

export const TaskTabsList: React.FC<TaskTabsListProps> = ({ taskCounts }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="w-full border-b border-border/20 overflow-x-auto bg-background/60">
      <TabsList className={`${isMobile ? 'flex w-full justify-between px-1 py-1' : 'w-full justify-start'} bg-background/10`}>
        <TabsTrigger value="all" className={`flex items-center gap-1 ${isMobile ? 'flex-1 justify-center' : ''} data-[state=active]:bg-primary/10 data-[state=active]:text-primary`}>
          <FileText className="h-4 w-4" />
          {!isMobile && <span>All ({taskCounts.all})</span>}
          {isMobile && <span className="sr-only">All tasks</span>}
          {isMobile && <span className="text-xs">{taskCounts.all}</span>}
        </TabsTrigger>
        <TabsTrigger value="timer" className={`flex items-center gap-1 ${isMobile ? 'flex-1 justify-center' : ''} data-[state=active]:bg-purple-500/10 data-[state=active]:text-purple-500`}>
          <Timer className="h-4 w-4 text-purple-400" />
          {!isMobile && <span>Timer ({taskCounts.timer})</span>}
          {isMobile && <span className="sr-only">Timer tasks</span>}
          {isMobile && <span className="text-xs">{taskCounts.timer}</span>}
        </TabsTrigger>
        <TabsTrigger value="journal" className={`flex items-center gap-1 ${isMobile ? 'flex-1 justify-center' : ''} data-[state=active]:bg-amber-500/10 data-[state=active]:text-amber-500`}>
          <BookOpen className="h-4 w-4 text-amber-400" />
          {!isMobile && <span>Journal ({taskCounts.journal})</span>}
          {isMobile && <span className="sr-only">Journal tasks</span>}
          {isMobile && <span className="text-xs">{taskCounts.journal}</span>}
        </TabsTrigger>
        <TabsTrigger value="checklist" className={`flex items-center gap-1 ${isMobile ? 'flex-1 justify-center' : ''} data-[state=active]:bg-cyan-500/10 data-[state=active]:text-cyan-500`}>
          <CheckSquare className="h-4 w-4 text-cyan-400" />
          {!isMobile && <span>Checklists ({taskCounts.checklist})</span>}
          {isMobile && <span className="sr-only">Checklist tasks</span>}
          {isMobile && <span className="text-xs">{taskCounts.checklist}</span>}
        </TabsTrigger>
        <TabsTrigger value="regular" className={`flex items-center gap-1 ${isMobile ? 'flex-1 justify-center' : ''} data-[state=active]:bg-primary/10 data-[state=active]:text-primary`}>
          <FileText className="h-4 w-4 text-primary" />
          {!isMobile && <span>Regular ({taskCounts.regular})</span>}
          {isMobile && <span className="sr-only">Regular tasks</span>}
          {isMobile && <span className="text-xs">{taskCounts.regular}</span>}
        </TabsTrigger>
      </TabsList>
    </div>
  );
};

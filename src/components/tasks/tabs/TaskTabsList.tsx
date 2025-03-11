
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Timer, Image, BookOpen, CheckSquare, Mic } from 'lucide-react';
import { useIsMobile } from '@/hooks/ui/useIsMobile';

interface TaskTabsListProps {
  taskCounts: {
    all: number;
    timer: number;
    screenshot: number;
    habit: number;
    journal: number;
    checklist: number;
    voicenote: number;
    regular: number;
  };
}

export const TaskTabsList: React.FC<TaskTabsListProps> = ({ taskCounts }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="w-full border-b border-border/20 bg-background/60">
      <TabsList className={`${isMobile ? 'flex w-full justify-between px-1 py-1 flex-wrap' : 'w-full justify-start grid grid-cols-4 md:grid-cols-7'} bg-background/10`}>
        <TabsTrigger value="all" className={`flex items-center gap-1 ${isMobile ? 'flex-1 justify-center' : ''} data-[state=active]:bg-primary/10 data-[state=active]:text-primary`}>
          <FileText className="h-4 w-4" />
          {!isMobile && <span>All ({taskCounts.all})</span>}
          {isMobile && <span className="sr-only">All tasks</span>}
          {isMobile && <span className="text-xs">{taskCounts.all}</span>}
        </TabsTrigger>
        <TabsTrigger value="regular" className={`flex items-center gap-1 ${isMobile ? 'flex-1 justify-center' : ''} data-[state=active]:bg-primary/10 data-[state=active]:text-primary`}>
          <FileText className="h-4 w-4 text-primary" />
          {!isMobile && <span>Regular ({taskCounts.regular})</span>}
          {isMobile && <span className="sr-only">Regular tasks</span>}
          {isMobile && <span className="text-xs">{taskCounts.regular}</span>}
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
        <TabsTrigger value="screenshot" className={`flex items-center gap-1 ${isMobile ? 'flex-1 justify-center' : ''} data-[state=active]:bg-blue-500/10 data-[state=active]:text-blue-500`}>
          <Image className="h-4 w-4 text-blue-400" />
          {!isMobile && <span>Screenshots ({taskCounts.screenshot})</span>}
          {isMobile && <span className="sr-only">Screenshot tasks</span>}
          {isMobile && <span className="text-xs">{taskCounts.screenshot}</span>}
        </TabsTrigger>
        <TabsTrigger value="voicenote" className={`flex items-center gap-1 ${isMobile ? 'flex-1 justify-center' : ''} data-[state=active]:bg-rose-500/10 data-[state=active]:text-rose-500`}>
          <Mic className="h-4 w-4 text-rose-400" />
          {!isMobile && <span>Voice Notes ({taskCounts.voicenote})</span>}
          {isMobile && <span className="sr-only">Voice note tasks</span>}
          {isMobile && <span className="text-xs">{taskCounts.voicenote}</span>}
        </TabsTrigger>
      </TabsList>
    </div>
  );
};

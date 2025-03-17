
import React, { useState, useEffect } from 'react';
import { Task, TaskType } from '@/types/tasks';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { TaskList } from './TaskList';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Timer, BookOpen, CheckSquare, Image, Mic } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UnifiedTaskViewProps {
  activeTasks: Task[];
  completedTasks: Task[];
  selectedTaskId: string | null;
  dialogOpeners?: {
    checklist: (taskId: string, taskName: string, items: any[]) => void;
    journal: (taskId: string, taskName: string, entry: string) => void;
    screenshot: (imageUrl: string, taskName: string) => void;
    voicenote: (taskId: string, taskName: string) => void;
  };
  onTaskAdd: (task: Task) => void;
  onTasksAdd: (tasks: Task[]) => void;
}

export const UnifiedTaskView: React.FC<UnifiedTaskViewProps> = ({
  activeTasks,
  completedTasks,
  selectedTaskId,
  dialogOpeners,
  onTaskAdd,
  onTasksAdd
}) => {
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  const [activeTaskType, setActiveTaskType] = useState<'all' | TaskType>('all');
  
  // Task counts for filtering
  const [taskCounts, setTaskCounts] = useState({
    all: 0,
    timer: 0,
    screenshot: 0,
    journal: 0,
    checklist: 0,
    voicenote: 0,
    regular: 0
  });
  
  // Calculate counts whenever tasks change
  useEffect(() => {
    const currentTasks = activeTab === 'active' ? activeTasks : completedTasks;
    
    const counts = {
      all: currentTasks.length,
      timer: currentTasks.filter(t => t.taskType === 'timer').length,
      screenshot: currentTasks.filter(t => t.taskType === 'screenshot').length,
      journal: currentTasks.filter(t => t.taskType === 'journal').length,
      checklist: currentTasks.filter(t => t.taskType === 'checklist').length,
      voicenote: currentTasks.filter(t => t.taskType === 'voicenote').length,
      regular: currentTasks.filter(t => t.taskType === 'regular' || !t.taskType).length
    };
    
    setTaskCounts(counts);
  }, [activeTasks, completedTasks, activeTab]);
  
  // Filter tasks based on active type
  const getFilteredTasks = () => {
    const currentTasks = activeTab === 'active' ? activeTasks : completedTasks;
    
    if (activeTaskType === 'all') return currentTasks;
    return currentTasks.filter(task => task.taskType === activeTaskType);
  };

  return (
    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'active' | 'completed')} className="w-full">
      <TabsList className="grid grid-cols-2 mb-4">
        <TabsTrigger value="active">
          Active Tasks ({activeTasks.length})
        </TabsTrigger>
        <TabsTrigger value="completed">
          Completed Tasks ({completedTasks.length})
        </TabsTrigger>
      </TabsList>
      
      {/* Task type filters */}
      <div className="flex justify-center mb-4 overflow-x-auto py-2 gap-1">
        <button
          onClick={() => setActiveTaskType('all')}
          className={cn(
            "flex items-center gap-1 rounded-full px-3 py-1 text-xs",
            activeTaskType === 'all' 
              ? "bg-primary/10 text-primary" 
              : "bg-muted/50 text-muted-foreground hover:bg-muted"
          )}
        >
          <FileText className="h-3 w-3" />
          <span>All ({taskCounts.all})</span>
        </button>
        
        <button
          onClick={() => setActiveTaskType('regular')}
          className={cn(
            "flex items-center gap-1 rounded-full px-3 py-1 text-xs",
            activeTaskType === 'regular' 
              ? "bg-primary/10 text-primary" 
              : "bg-muted/50 text-muted-foreground hover:bg-muted"
          )}
        >
          <FileText className="h-3 w-3 text-primary" />
          <span>Regular ({taskCounts.regular})</span>
        </button>
        
        <button
          onClick={() => setActiveTaskType('timer')}
          className={cn(
            "flex items-center gap-1 rounded-full px-3 py-1 text-xs",
            activeTaskType === 'timer' 
              ? "bg-purple-500/15 text-purple-500" 
              : "bg-muted/50 text-muted-foreground hover:bg-muted"
          )}
        >
          <Timer className="h-3 w-3 text-purple-400" />
          <span>Timer ({taskCounts.timer})</span>
        </button>
        
        <button
          onClick={() => setActiveTaskType('journal')}
          className={cn(
            "flex items-center gap-1 rounded-full px-3 py-1 text-xs",
            activeTaskType === 'journal' 
              ? "bg-amber-500/15 text-amber-500" 
              : "bg-muted/50 text-muted-foreground hover:bg-muted"
          )}
        >
          <BookOpen className="h-3 w-3 text-amber-400" />
          <span>Journal ({taskCounts.journal})</span>
        </button>
        
        <button
          onClick={() => setActiveTaskType('checklist')}
          className={cn(
            "flex items-center gap-1 rounded-full px-3 py-1 text-xs",
            activeTaskType === 'checklist' 
              ? "bg-cyan-500/15 text-cyan-500" 
              : "bg-muted/50 text-muted-foreground hover:bg-muted"
          )}
        >
          <CheckSquare className="h-3 w-3 text-cyan-400" />
          <span>Checklist ({taskCounts.checklist})</span>
        </button>
        
        <button
          onClick={() => setActiveTaskType('screenshot')}
          className={cn(
            "flex items-center gap-1 rounded-full px-3 py-1 text-xs",
            activeTaskType === 'screenshot' 
              ? "bg-blue-500/15 text-blue-500" 
              : "bg-muted/50 text-muted-foreground hover:bg-muted"
          )}
        >
          <Image className="h-3 w-3 text-blue-400" />
          <span>Screenshot ({taskCounts.screenshot})</span>
        </button>
        
        <button
          onClick={() => setActiveTaskType('voicenote')}
          className={cn(
            "flex items-center gap-1 rounded-full px-3 py-1 text-xs",
            activeTaskType === 'voicenote' 
              ? "bg-rose-500/15 text-rose-500" 
              : "bg-muted/50 text-muted-foreground hover:bg-muted"
          )}
        >
          <Mic className="h-3 w-3 text-rose-400" />
          <span>Voice ({taskCounts.voicenote})</span>
        </button>
      </div>
      
      <TabsContent value="active" className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4">
            <TaskList
              tasks={getFilteredTasks()}
              selectedTaskId={selectedTaskId}
              dialogOpeners={dialogOpeners}
            />
          </div>
        </ScrollArea>
      </TabsContent>
      
      <TabsContent value="completed" className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4">
            <TaskList
              tasks={getFilteredTasks()}
              selectedTaskId={selectedTaskId}
              dialogOpeners={dialogOpeners}
            />
          </div>
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
};

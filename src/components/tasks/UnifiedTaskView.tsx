
import React, { useState } from 'react';
import { Task } from '@/types/tasks';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { TaskList } from './TaskList';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TaskManagerContent } from './TaskManagerContent';

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
      
      <TabsContent value="active" className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4">
            <TaskList
              tasks={activeTasks}
              selectedTaskId={selectedTaskId}
              dialogOpeners={dialogOpeners}
            />
          </div>
        </ScrollArea>
      </TabsContent>
      
      <TabsContent value="completed" className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4">
            <TaskManagerContent
              tasks={[]}
              completedTasks={completedTasks}
              selectedTaskId={selectedTaskId}
              dialogOpeners={dialogOpeners}
              onTaskAdd={onTaskAdd}
              onTasksAdd={onTasksAdd}
            />
          </div>
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
};

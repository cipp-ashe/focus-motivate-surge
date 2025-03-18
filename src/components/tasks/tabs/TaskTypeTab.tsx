
import React from 'react';
import { Task } from '@/types/tasks';
import { TaskList } from '../TaskList';
import { TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { eventBus } from '@/lib/eventBus';

interface TaskTypeTabProps {
  value: string;
  tasks: Task[];
  selectedTaskId: string | null;
  dialogOpeners?: {
    checklist: (taskId: string, taskName: string, items: any[]) => void;
    journal: (taskId: string, taskName: string, entry: string) => void;
    screenshot: (imageUrl: string, taskName: string) => void;
    voicenote: (taskId: string, taskName: string) => void;
  };
}

export const TaskTypeTab: React.FC<TaskTypeTabProps> = ({ 
  value, 
  tasks, 
  selectedTaskId,
  dialogOpeners
}) => {
  const handleTaskSelect = (taskId: string) => {
    eventBus.emit('task:select', taskId);
  };

  const handleTaskDelete = (data: { taskId: string }) => {
    eventBus.emit('task:delete', data);
  };

  const handleTaskUpdate = (data: { taskId: string; updates: Partial<Task> }) => {
    eventBus.emit('task:update', data);
  };

  const handleTaskComplete = (data: { taskId: string; metrics?: any }) => {
    eventBus.emit('task:complete', data);
  };

  return (
    <TabsContent value={value} className="flex-1 overflow-hidden">
      <ScrollArea className="h-full">
        <div className="p-4">
          <TaskList 
            tasks={tasks} 
            selectedTaskId={selectedTaskId}
            dialogOpeners={dialogOpeners}
            handleTaskSelect={handleTaskSelect}
            handleDelete={handleTaskDelete}
            handleTaskUpdate={handleTaskUpdate}
            handleTaskComplete={handleTaskComplete}
          />
        </div>
      </ScrollArea>
    </TabsContent>
  );
};

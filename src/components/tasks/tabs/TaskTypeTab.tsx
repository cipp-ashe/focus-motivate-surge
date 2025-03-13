
import React from 'react';
import { Task } from '@/types/tasks';
import { TaskList } from '../TaskList';
import { TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  return (
    <TabsContent value={value} className="flex-1 overflow-hidden">
      <ScrollArea className="h-full">
        <div className="p-4">
          <TaskList 
            tasks={tasks} 
            selectedTaskId={selectedTaskId}
            dialogOpeners={dialogOpeners}
          />
        </div>
      </ScrollArea>
    </TabsContent>
  );
};

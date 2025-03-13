
import React, { useState } from 'react';
import TaskManager from '@/components/tasks/TaskManager';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/ui/useIsMobile';
import { ChecklistItem, Task } from '@/types/tasks';
import { eventBus } from '@/lib/eventBus';
import { TaskEventListener } from '@/components/tasks/TaskEventListener';
import { ChecklistDialog } from '@/components/tasks/dialogs/ChecklistDialog';
import { JournalDialog } from '@/components/tasks/dialogs/JournalDialog';

const TaskPage = () => {
  const isMobile = useIsMobile();
  
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);
  const [currentChecklistTask, setCurrentChecklistTask] = useState<{
    taskId: string;
    taskName: string;
    items: ChecklistItem[];
  } | null>(null);
  
  const [isJournalOpen, setIsJournalOpen] = useState(false);
  const [currentJournalTask, setCurrentJournalTask] = useState<{
    taskId: string;
    taskName: string;
    entry: string;
  } | null>(null);
  
  // Event handlers
  const handleShowImage = (imageUrl: string, taskName: string) => {
    toast.info(`Viewing image for: ${taskName}`, {
      description: "Image viewer functionality is not yet implemented",
      duration: 2000
    });
    console.log("Tasks.tsx - Handled show-image event for:", taskName);
  };
  
  const handleOpenChecklist = (taskId: string, taskName: string, items: ChecklistItem[]) => {
    console.log('Tasks.tsx - Opening checklist for task:', { taskId, taskName, items });
    setCurrentChecklistTask({
      taskId,
      taskName,
      items
    });
    setIsChecklistOpen(true);
    toast.info(`Opening checklist for: ${taskName}`, { duration: 1500 });
  };
  
  const handleOpenJournal = (taskId: string, taskName: string, entry: string) => {
    console.log('Tasks.tsx - Opening journal for task:', { taskId, taskName, entry });
    setCurrentJournalTask({
      taskId,
      taskName,
      entry
    });
    setIsJournalOpen(true);
    toast.info(`Opening journal for: ${taskName}`, { duration: 1500 });
  };
  
  const handleOpenVoiceRecorder = (taskId: string, taskName: string) => {
    toast.info(`Recording for: ${taskName}`, {
      description: "Voice recorder functionality is not yet implemented",
      duration: 2000
    });
    console.log("Tasks.tsx - Handled open-voice-recorder event for:", taskName);
  };
  
  const handleTaskUpdate = (taskId: string, updates: Partial<Task>) => {
    console.log('Tasks.tsx - Task update received:', { taskId, updates });
    // Don't forward journal or checklist updates to avoid loops
    if (!updates.journalEntry && !updates.checklistItems) {
      eventBus.emit('task:update', { taskId, updates });
    }
  };

  return (
    <div className={`container mx-auto ${isMobile ? 'p-2' : 'py-3 px-4 sm:py-5 sm:px-6'} max-w-6xl`}>
      <h1 className={`${isMobile ? 'text-xl mb-2' : 'text-2xl sm:text-3xl mb-3 sm:mb-5'} font-bold text-primary`}>
        Task Manager
      </h1>
      
      <TaskEventListener 
        onShowImage={handleShowImage}
        onOpenChecklist={handleOpenChecklist}
        onOpenJournal={handleOpenJournal}
        onOpenVoiceRecorder={handleOpenVoiceRecorder}
        onTaskUpdate={handleTaskUpdate}
      />
      
      <TaskManager />
      
      <ChecklistDialog 
        isOpen={isChecklistOpen}
        onOpenChange={setIsChecklistOpen}
        currentTask={currentChecklistTask}
      />
      
      <JournalDialog 
        isOpen={isJournalOpen}
        onOpenChange={setIsJournalOpen}
        currentTask={currentJournalTask}
      />
    </div>
  );
};

export default TaskPage;


import React, { useState } from 'react';
import TaskManager from '@/components/tasks/TaskManager';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/ui/useIsMobile';
import { ChecklistItem, Task } from '@/types/tasks';
import { eventBus } from '@/lib/eventBus';
import { TaskEventListener } from '@/components/tasks/TaskEventListener';
import { ChecklistSheet } from '@/components/tasks/sheets/ChecklistSheet';
import { JournalSheet } from '@/components/tasks/sheets/JournalSheet';

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
      description: "Image viewer functionality is not yet implemented"
    });
    console.log("Tasks.tsx - Handled show-image event for:", taskName);
  };
  
  const handleOpenChecklist = (taskId: string, taskName: string, items: ChecklistItem[]) => {
    setCurrentChecklistTask({
      taskId,
      taskName,
      items
    });
    setIsChecklistOpen(true);
    console.log('Tasks.tsx - Opened checklist for task:', taskName);
    toast.info(`Opening checklist for: ${taskName}`);
  };
  
  const handleOpenJournal = (taskId: string, taskName: string, entry: string) => {
    setCurrentJournalTask({
      taskId,
      taskName,
      entry
    });
    setIsJournalOpen(true);
    console.log('Tasks.tsx - Opened journal for task:', taskName);
    toast.info(`Opening journal for: ${taskName}`);
  };
  
  const handleOpenVoiceRecorder = (taskId: string, taskName: string) => {
    toast.info(`Recording for: ${taskName}`, {
      description: "Voice recorder functionality is not yet implemented"
    });
    console.log("Tasks.tsx - Handled open-voice-recorder event for:", taskName);
  };
  
  const handleTaskUpdate = (taskId: string, updates: Partial<Task>) => {
    console.log('Tasks.tsx - Forwarding task-update event:', { taskId, updates });
    eventBus.emit('task:update', { taskId, updates });
  };

  // Create an object with all the dialog opener functions
  const taskDialogOpeners = {
    checklist: handleOpenChecklist,
    journal: handleOpenJournal,
    screenshot: handleShowImage,
    voicenote: handleOpenVoiceRecorder,
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
      
      <TaskManager dialogOpeners={taskDialogOpeners} />
      
      <ChecklistSheet 
        isOpen={isChecklistOpen}
        onOpenChange={setIsChecklistOpen}
        currentTask={currentChecklistTask}
      />
      
      <JournalSheet 
        isOpen={isJournalOpen}
        onOpenChange={setIsJournalOpen}
        currentTask={currentJournalTask}
      />
    </div>
  );
};

export default TaskPage;

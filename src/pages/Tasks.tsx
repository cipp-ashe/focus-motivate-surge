
import React, { useState } from 'react';
import TaskManager from '@/components/tasks/TaskManager';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/ui/useIsMobile';
import { ChecklistItem, Task } from '@/types/tasks';
import { eventBus } from '@/lib/eventBus';
import { TaskEventListener } from '@/components/tasks/TaskEventListener';
import { ChecklistDialog } from '@/components/tasks/dialogs/ChecklistDialog';
import { JournalDialog } from '@/components/tasks/dialogs/JournalDialog';
import { ScreenshotDialog } from '@/components/tasks/components/ScreenshotDialog';
import { VoiceNoteDialog } from '@/components/tasks/components/VoiceNoteDialog';

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
  
  const [isScreenshotOpen, setIsScreenshotOpen] = useState(false);
  const [currentScreenshotTask, setCurrentScreenshotTask] = useState<{
    taskId: string;
    taskName: string;
    imageUrl: string;
  } | null>(null);
  
  const [isVoiceNoteOpen, setIsVoiceNoteOpen] = useState(false);
  const [currentVoiceNoteTask, setCurrentVoiceNoteTask] = useState<{
    taskId: string;
    taskName: string;
  } | null>(null);
  
  // Event handlers
  const handleShowImage = (imageUrl: string, taskName: string) => {
    console.log("Tasks.tsx - Opening screenshot for:", taskName, imageUrl);
    setCurrentScreenshotTask({
      taskId: 'screenshot',
      taskName,
      imageUrl
    });
    setIsScreenshotOpen(true);
    toast.info(`Viewing image for: ${taskName}`, { duration: 1500 });
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
    console.log('Tasks.tsx - Opening voice recorder for task:', { taskId, taskName });
    setCurrentVoiceNoteTask({
      taskId,
      taskName
    });
    setIsVoiceNoteOpen(true);
    toast.info(`Recording for: ${taskName}`, { duration: 1500 });
  };
  
  // Handle task updates, but make sure we don't change the task type unless specifically requested
  const handleTaskUpdate = (data: { taskId: string, updates: Partial<Task> }) => {
    console.log('Tasks.tsx - Task update received:', data);
    
    // Only forward updates that don't have journal, checklist, or taskType changes to avoid loops
    // and unwanted type conversions
    const updatesToForward = { ...data.updates };
    delete updatesToForward.journalEntry;
    delete updatesToForward.checklistItems;
    
    // Only forward if there are remaining updates
    if (Object.keys(updatesToForward).length > 0) {
      eventBus.emit('task:update', {
        taskId: data.taskId,
        updates: updatesToForward
      });
    }
  };

  // Dialog openers to pass to TaskManager
  const dialogOpeners = {
    checklist: handleOpenChecklist,
    journal: handleOpenJournal,
    screenshot: handleShowImage,
    voicenote: handleOpenVoiceRecorder
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
      
      <TaskManager dialogOpeners={dialogOpeners} />
      
      {currentChecklistTask && (
        <ChecklistDialog 
          isOpen={isChecklistOpen}
          onOpenChange={setIsChecklistOpen}
          currentTask={currentChecklistTask}
        />
      )}
      
      {currentJournalTask && (
        <JournalDialog 
          isOpen={isJournalOpen}
          onOpenChange={setIsJournalOpen}
          currentTask={currentJournalTask}
        />
      )}
      
      {currentScreenshotTask && (
        <ScreenshotDialog 
          isOpen={isScreenshotOpen}
          onOpenChange={setIsScreenshotOpen}
          task={{
            id: currentScreenshotTask.taskId,
            name: currentScreenshotTask.taskName,
            imageUrl: currentScreenshotTask.imageUrl,
            createdAt: new Date().toISOString()
          }}
        />
      )}
      
      {currentVoiceNoteTask && (
        <VoiceNoteDialog 
          isOpen={isVoiceNoteOpen}
          onOpenChange={setIsVoiceNoteOpen}
          task={{
            id: currentVoiceNoteTask.taskId,
            name: currentVoiceNoteTask.taskName,
            createdAt: new Date().toISOString()
          }}
        />
      )}
    </div>
  );
};

export default TaskPage;

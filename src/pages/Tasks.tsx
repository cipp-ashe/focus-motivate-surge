
import React, { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/ui/useIsMobile';
import { ChecklistItem, Task } from '@/types/tasks';
import { TaskEventListener } from '@/components/tasks/event-handlers/TaskEventListener';
import { ChecklistDialog } from '@/components/tasks/dialogs/ChecklistDialog';
import { JournalDialog } from '@/components/tasks/dialogs/JournalDialog';
import { ScreenshotDialog } from '@/components/tasks/dialogs/ScreenshotDialog';
import { VoiceNoteDialog } from '@/components/tasks/dialogs/VoiceNoteDialog';
import { useTaskContext } from '@/contexts/tasks/TaskContext';
import { ErrorBoundary } from 'react-error-boundary';
import { UnifiedTaskView } from '@/components/tasks/UnifiedTaskView';
import { TaskInput } from '@/components/tasks/TaskInput';
import { Card, CardContent } from '@/components/ui/card';

const ErrorFallback = () => (
  <div className="p-4 m-4 border border-red-300 bg-red-50 dark:bg-red-900/20 rounded-md text-center">
    <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">Error Loading Tasks</h2>
    <p>There was a problem loading the task manager. Please try again later or refresh the page.</p>
  </div>
);

const TaskPage = () => {
  const isMobile = useIsMobile();
  const taskContext = useTaskContext();
  
  // Dialog state
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
  
  // Dialog opener handlers
  const handleShowImage = useCallback((imageUrl: string, taskName: string) => {
    console.log("Tasks.tsx - Opening screenshot for:", taskName, imageUrl);
    setCurrentScreenshotTask({
      taskId: 'screenshot',
      taskName,
      imageUrl
    });
    setIsScreenshotOpen(true);
    toast.info(`Viewing image for: ${taskName}`, { duration: 1500 });
  }, []);
  
  const handleOpenChecklist = useCallback((taskId: string, taskName: string, items: ChecklistItem[]) => {
    console.log('Tasks.tsx - Opening checklist for task:', { taskId, taskName, items });
    setCurrentChecklistTask({
      taskId,
      taskName,
      items
    });
    setIsChecklistOpen(true);
    toast.info(`Opening checklist for: ${taskName}`, { duration: 1500 });
  }, []);
  
  const handleOpenJournal = useCallback((taskId: string, taskName: string, entry: string) => {
    console.log('Tasks.tsx - Opening journal for task:', { taskId, taskName, entry });
    setCurrentJournalTask({
      taskId,
      taskName,
      entry
    });
    setIsJournalOpen(true);
    toast.info(`Opening journal for: ${taskName}`, { duration: 1500 });
  }, []);
  
  const handleOpenVoiceRecorder = useCallback((taskId: string, taskName: string) => {
    console.log('Tasks.tsx - Opening voice recorder for task:', { taskId, taskName });
    setCurrentVoiceNoteTask({
      taskId,
      taskName
    });
    setIsVoiceNoteOpen(true);
    toast.info(`Recording for: ${taskName}`, { duration: 1500 });
  }, []);
  
  // Task update handler
  const handleTaskUpdate = useCallback((data: { taskId: string, updates: Partial<Task> }) => {
    console.log('Tasks.tsx - Task update received:', data);
    
    if (!taskContext || !taskContext.updateTask) {
      console.error('Task context or updateTask function is undefined');
      toast.error('Failed to update task: Application error');
      return;
    }
    
    const updatesToForward = { ...data.updates };
    delete updatesToForward.journalEntry;
    delete updatesToForward.checklistItems;
    
    if (Object.keys(updatesToForward).length > 0) {
      taskContext.updateTask(data.taskId, updatesToForward);
    }
  }, [taskContext]);

  const dialogOpeners = {
    checklist: handleOpenChecklist,
    journal: handleOpenJournal,
    screenshot: handleShowImage,
    voicenote: handleOpenVoiceRecorder
  };

  // Added some debugging logs to help identify why UnifiedTaskView might not be rendering
  console.log('Tasks.tsx rendering - Task context:', 
    { 
      items: taskContext?.items?.length || 0,
      completed: taskContext?.completed?.length || 0,
      selected: taskContext?.selected || null
    }
  );

  return (
    <div className="container mx-auto max-w-6xl py-4 px-4">
      <h1 className="text-2xl sm:text-3xl mb-5 font-bold" id="page-title">
        Task Manager
      </h1>
      
      <main aria-labelledby="page-title" className="space-y-4">
        {/* Task Input */}
        <Card>
          <CardContent className="p-4">
            <TaskInput 
              onTaskAdd={(task) => taskContext?.addTask?.(task)}
              onTasksAdd={(tasks) => tasks.forEach(task => taskContext?.addTask?.(task))}
            />
          </CardContent>
        </Card>
        
        <TaskEventListener 
          onShowImage={handleShowImage}
          onOpenChecklist={handleOpenChecklist}
          onOpenJournal={handleOpenJournal}
          onOpenVoiceRecorder={handleOpenVoiceRecorder}
          onTaskUpdate={handleTaskUpdate}
        />
        
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          {taskContext && (
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <UnifiedTaskView 
                  activeTasks={taskContext.items || []}
                  completedTasks={taskContext.completed || []}
                  selectedTaskId={taskContext.selected}
                  dialogOpeners={dialogOpeners}
                  onTaskAdd={(task) => taskContext.addTask?.(task)}
                  onTasksAdd={(tasks) => tasks.forEach(task => taskContext.addTask?.(task))}
                />
              </CardContent>
            </Card>
          )}
        </ErrorBoundary>
      </main>
      
      {/* Task-specific dialogs */}
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
            createdAt: new Date().toISOString(),
            completed: false
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
            createdAt: new Date().toISOString(),
            completed: false
          }}
        />
      )}
    </div>
  );
};

export default TaskPage;

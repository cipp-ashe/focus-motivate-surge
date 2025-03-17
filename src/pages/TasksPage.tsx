
import React, { useState, useEffect, useCallback } from 'react';
import { TaskLayout } from '@/components/tasks/TaskLayout';
import { useTaskContext } from '@/contexts/tasks/TaskContext';
import { Task } from '@/types/tasks';
import { ChecklistDialog } from '@/components/tasks/dialogs/ChecklistDialog';
import { JournalDialog } from '@/components/tasks/dialogs/JournalDialog';
import { ScreenshotDialog } from '@/components/tasks/dialogs/ScreenshotDialog';
import { VoiceNoteDialog } from '@/components/tasks/dialogs/VoiceNoteDialog';
import { toast } from 'sonner';
import { TaskInput } from '@/components/tasks/TaskInput';
import { eventManager } from '@/lib/events/EventManager';
import { TaskEventHandler } from '@/components/tasks/TaskEventHandler';
import { UnifiedTaskView } from '@/components/tasks/UnifiedTaskView';

const TasksPage: React.FC = () => {
  const taskContext = useTaskContext();
  const tasks = taskContext?.items || [];
  const completedTasks = taskContext?.completed || [];
  
  // State for dialogs
  const [checklistDialogOpen, setChecklistDialogOpen] = useState(false);
  const [journalDialogOpen, setJournalDialogOpen] = useState(false);
  const [screenshotDialogOpen, setScreenshotDialogOpen] = useState(false);
  const [voiceNoteDialogOpen, setVoiceNoteDialogOpen] = useState(false);
  
  // State for UI updates
  const [, setForceUpdate] = useState(0);
  
  // Force update handler with debouncing to prevent excessive re-renders
  const forceUpdateHandlerRef = React.useRef<NodeJS.Timeout | null>(null);
  const forceUpdateHandler = useCallback(() => {
    if (forceUpdateHandlerRef.current) {
      clearTimeout(forceUpdateHandlerRef.current);
    }
    
    forceUpdateHandlerRef.current = setTimeout(() => {
      setForceUpdate(prev => prev + 1);
      forceUpdateHandlerRef.current = null;
    }, 50);
  }, []);
  
  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (forceUpdateHandlerRef.current) {
        clearTimeout(forceUpdateHandlerRef.current);
      }
    };
  }, []);
  
  // Dialog content state
  const [activeTaskId, setActiveTaskId] = useState<string>('');
  const [activeTaskName, setActiveTaskName] = useState<string>('');
  const [checklistItems, setChecklistItems] = useState<any[]>([]);
  const [journalEntry, setJournalEntry] = useState<string>('');
  const [screenshotUrl, setScreenshotUrl] = useState<string>('');
  
  // Debug: Log task context on component mount
  useEffect(() => {
    console.log("TasksPage mounted, taskContext:", taskContext);
    console.log("Tasks available:", tasks);
  }, [taskContext, tasks]);
  
  // Dialog openers
  const dialogOpeners = {
    checklist: (taskId: string, taskName: string, items: any[]) => {
      console.log("Opening checklist dialog:", { taskId, taskName, items });
      setActiveTaskId(taskId);
      setActiveTaskName(taskName);
      setChecklistItems(items || []);
      setChecklistDialogOpen(true);
      toast.info(`Opening checklist for: ${taskName}`);
    },
    journal: (taskId: string, taskName: string, entry: string) => {
      console.log("Opening journal dialog:", { taskId, taskName, entry });
      setActiveTaskId(taskId);
      setActiveTaskName(taskName);
      setJournalEntry(entry || '');
      setJournalDialogOpen(true);
      toast.info(`Opening journal for: ${taskName}`);
    },
    screenshot: (imageUrl: string, taskName: string) => {
      console.log("Opening screenshot dialog:", { imageUrl, taskName });
      setScreenshotUrl(imageUrl);
      setActiveTaskName(taskName);
      setScreenshotDialogOpen(true);
      toast.info(`Viewing image for: ${taskName}`);
    },
    voicenote: (taskId: string, taskName: string) => {
      console.log("Opening voice note dialog:", { taskId, taskName });
      setActiveTaskId(taskId);
      setActiveTaskName(taskName);
      setVoiceNoteDialogOpen(true);
      toast.info(`Recording for: ${taskName}`);
    }
  };
  
  // Handle task creation using taskContext directly 
  const handleAddTask = useCallback((task: Task) => {
    try {
      console.log("Adding task to context:", task);
      if (taskContext && taskContext.addTask) {
        taskContext.addTask(task);
        toast.success(`Task created: ${task.name}`);
      } else {
        console.error("Task context or addTask function is undefined");
        toast.error("Failed to create task: Application error");
      }
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task");
    }
  }, [taskContext]);
  
  // Handle multiple tasks addition with error handling
  const handleAddMultipleTasks = useCallback((tasks: Task[]) => {
    try {
      console.log("Adding multiple tasks:", tasks);
      if (taskContext && taskContext.addTask) {
        tasks.forEach(task => {
          taskContext.addTask(task);
        });
        toast.success(`Added ${tasks.length} tasks`);
      } else {
        console.error("Task context or addTask function is undefined");
        toast.error("Failed to add tasks: Application error");
      }
    } catch (error) {
      console.error("Error adding multiple tasks:", error);
      toast.error("Failed to add tasks");
    }
  }, [taskContext]);
  
  // If no task context, show loading or error
  if (!taskContext) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          </div>
          <p className="text-muted-foreground">Loading task context...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen">
      {/* Include the TaskEventHandler to listen for task events */}
      <TaskEventHandler
        onForceUpdate={forceUpdateHandler}
        onTaskCreate={task => taskContext.addTask(task)}
        onTaskUpdate={({taskId, updates}) => taskContext.updateTask(taskId, updates)}
        onTaskDelete={({taskId}) => taskContext.deleteTask(taskId)}
        tasks={tasks}
      />
      
      <TaskLayout
        mainContent={
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-hidden border border-border/20 rounded-lg">
              <UnifiedTaskView
                activeTasks={tasks}
                completedTasks={completedTasks}
                selectedTaskId={taskContext?.selected || null}
                dialogOpeners={dialogOpeners}
                onTaskAdd={handleAddTask}
                onTasksAdd={handleAddMultipleTasks}
              />
            </div>
          </div>
        }
        asideContent={
          <div className="space-y-4">
            <div className="mb-4 p-4 bg-card rounded-lg border border-border">
              <h3 className="text-lg font-medium mb-2">Add New Task</h3>
              <TaskInput 
                onTaskAdd={handleAddTask} 
                onTasksAdd={handleAddMultipleTasks}
                defaultTaskType="regular"
              />
            </div>
          </div>
        }
      />
      
      <ChecklistDialog
        isOpen={checklistDialogOpen}
        onOpenChange={setChecklistDialogOpen}
        currentTask={{
          taskId: activeTaskId,
          taskName: activeTaskName,
          items: checklistItems
        }}
      />
      
      <JournalDialog
        isOpen={journalDialogOpen}
        onOpenChange={setJournalDialogOpen}
        currentTask={{
          taskId: activeTaskId,
          taskName: activeTaskName,
          entry: journalEntry
        }}
      />
      
      <ScreenshotDialog
        isOpen={screenshotDialogOpen}
        onOpenChange={setScreenshotDialogOpen}
        task={{
          id: activeTaskId,
          name: activeTaskName,
          imageUrl: screenshotUrl,
          createdAt: new Date().toISOString(),
          completed: false
        } as Task}
      />
      
      <VoiceNoteDialog
        isOpen={voiceNoteDialogOpen}
        onOpenChange={setVoiceNoteDialogOpen}
        task={{
          id: activeTaskId,
          name: activeTaskName,
          createdAt: new Date().toISOString(),
          completed: false
        } as Task}
      />
    </div>
  );
};

export default TasksPage;

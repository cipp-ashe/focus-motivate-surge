
import React, { useState, useEffect, useCallback } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { TaskTabsList } from '@/components/tasks/tabs/TaskTabsList';
import { TaskTypeTab } from '@/components/tasks/tabs/TaskTypeTab';
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

const TasksPage: React.FC = () => {
  const taskContext = useTaskContext();
  const tasks = taskContext?.items || [];
  const completedTasks = taskContext?.completed || [];
  
  // State for dialogs
  const [activeTab, setActiveTab] = useState('all');
  const [checklistDialogOpen, setChecklistDialogOpen] = useState(false);
  const [journalDialogOpen, setJournalDialogOpen] = useState(false);
  const [screenshotDialogOpen, setScreenshotDialogOpen] = useState(false);
  const [voiceNoteDialogOpen, setVoiceNoteDialogOpen] = useState(false);
  
  // State for UI updates
  const [, setForceUpdate] = useState(0);
  const forceUpdateHandler = useCallback(() => {
    setForceUpdate(prev => prev + 1);
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
  
  // Update task counts
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
    if (!tasks) return;
    
    const counts = {
      all: tasks.length,
      timer: tasks.filter(t => t.taskType === 'timer').length,
      screenshot: tasks.filter(t => t.taskType === 'screenshot').length,
      journal: tasks.filter(t => t.taskType === 'journal').length,
      checklist: tasks.filter(t => t.taskType === 'checklist').length,
      voicenote: tasks.filter(t => t.taskType === 'voicenote').length,
      regular: tasks.filter(t => t.taskType === 'regular' || !t.taskType).length
    };
    
    setTaskCounts(counts);
    console.log("Task counts updated:", counts);
  }, [tasks]);
  
  // Filter tasks based on active tab
  const getFilteredTasks = (): Task[] => {
    if (!tasks) return [];
    
    if (activeTab === 'all') return tasks;
    return tasks.filter(task => task.taskType === activeTab);
  };
  
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
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    console.log("Tab changed to:", value);
    setActiveTab(value);
  };
  
  // Handle task creation using event manager
  const handleAddTask = (task: Task) => {
    console.log("Emitting task:create event:", task);
    eventManager.emit('task:create', task);
    toast.success(`Task created: ${task.name}`);
  };
  
  // Handle multiple tasks addition
  const handleAddMultipleTasks = (tasks: Task[]) => {
    console.log("Adding multiple tasks:", tasks);
    tasks.forEach(task => {
      eventManager.emit('task:create', task);
    });
    toast.success(`Added ${tasks.length} tasks`);
  };
  
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
          <Tabs value={activeTab} onValueChange={handleTabChange} className="h-full flex flex-col">
            <TaskTabsList taskCounts={taskCounts} />
            
            <div className="flex-1 overflow-hidden">
              <TaskTypeTab 
                value="all" 
                tasks={getFilteredTasks()} 
                selectedTaskId={taskContext?.selected || null}
                dialogOpeners={dialogOpeners}
              />
              <TaskTypeTab 
                value="regular" 
                tasks={getFilteredTasks()} 
                selectedTaskId={taskContext?.selected || null}
                dialogOpeners={dialogOpeners}
              />
              <TaskTypeTab 
                value="timer" 
                tasks={getFilteredTasks()} 
                selectedTaskId={taskContext?.selected || null}
                dialogOpeners={dialogOpeners}
              />
              <TaskTypeTab 
                value="journal" 
                tasks={getFilteredTasks()} 
                selectedTaskId={taskContext?.selected || null}
                dialogOpeners={dialogOpeners}
              />
              <TaskTypeTab 
                value="checklist" 
                tasks={getFilteredTasks()} 
                selectedTaskId={taskContext?.selected || null}
                dialogOpeners={dialogOpeners}
              />
              <TaskTypeTab 
                value="screenshot" 
                tasks={getFilteredTasks()} 
                selectedTaskId={taskContext?.selected || null}
                dialogOpeners={dialogOpeners}
              />
              <TaskTypeTab 
                value="voicenote" 
                tasks={getFilteredTasks()} 
                selectedTaskId={taskContext?.selected || null}
                dialogOpeners={dialogOpeners}
              />
            </div>
          </Tabs>
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
            
            {/* Removed the duplicate TaskManager component that was displaying the task list twice */}
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


import React from 'react';
import { TaskInput } from './TaskInput';
import { Task } from '@/types/tasks';
import { toast } from 'sonner';
import { taskStorage } from '@/lib/storage/taskStorage';
import { Tabs } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/ui/useIsMobile';
import { TaskTypeTab } from './tabs/TaskTypeTab';
import { TaskTabsList } from './tabs/TaskTabsList';
import { TimerView } from './TimerView';
import { eventBus } from '@/lib/eventBus';
import { CompletedTasks } from './CompletedTasks';

interface TaskManagerContentProps {
  tasks: Task[];
  completedTasks: Task[];
  selectedTaskId: string | null;
  onTaskAdd: (task: Task) => void;
  onTasksAdd: (tasks: Task[]) => void;
  isTimerView?: boolean;
  dialogOpeners?: {
    checklist: (taskId: string, taskName: string, items: any[]) => void;
    journal: (taskId: string, taskName: string, entry: string) => void;
    screenshot: (imageUrl: string, taskName: string) => void;
    voicenote: (taskId: string, taskName: string) => void;
  };
}

export const TaskManagerContent: React.FC<TaskManagerContentProps> = ({
  tasks,
  completedTasks,
  selectedTaskId,
  onTaskAdd,
  onTasksAdd,
  isTimerView = false,
  dialogOpeners
}) => {
  const isMobile = useIsMobile();
  
  const handleTaskAdd = (task: Task) => {
    console.log("TaskManagerContent - Adding task:", task);
    
    // Add to storage first
    taskStorage.addTask(task);
    
    // Call the parent handler
    onTaskAdd(task);
    
    // Show toast
    toast.success(`Added ${task.taskType || 'regular'} task: ${task.name}`, { duration: 2000 });
    
    // Force refresh the UI
    setTimeout(() => {
      window.dispatchEvent(new Event('force-task-update'));
      
      // For timer view, also emit task:select event to automatically select the task
      if (isTimerView && task.taskType === 'timer') {
        eventBus.emit('task:select', task.id);
      }
    }, 100);
  };

  const handleTasksAdd = (tasks: Task[]) => {
    console.log(`TaskManagerContent - Adding ${tasks.length} tasks`);
    
    // Add all tasks to storage
    tasks.forEach(task => taskStorage.addTask(task));
    
    // Call the parent handler
    onTasksAdd(tasks);
    
    // Show toast
    toast.success(`Added ${tasks.length} tasks`, { duration: 2000 });
    
    // Force refresh the UI
    setTimeout(() => {
      window.dispatchEvent(new Event('force-task-update'));
      
      // For timer view, find first timer task and select it
      if (isTimerView) {
        const timerTask = tasks.find(task => task.taskType === 'timer');
        if (timerTask) {
          console.log("TaskManagerContent: Auto-selecting first timer task", timerTask.id);
          eventBus.emit('task:select', timerTask.id);
        }
      }
    }, 100);
  };

  // Filter tasks by type for display
  // Ensure we're properly categorizing each task type
  const timerTasks = tasks.filter(task => task.taskType === 'timer');
  const journalTasks = tasks.filter(task => task.taskType === 'journal');
  const checklistTasks = tasks.filter(task => task.taskType === 'checklist');
  const regularTasks = tasks.filter(task => !task.taskType || task.taskType === 'regular');
  const screenshotTasks = tasks.filter(task => task.taskType === 'screenshot');
  const voicenoteTasks = tasks.filter(task => task.taskType === 'voicenote');
  
  console.log("TaskManagerContent - Task counts:", {
    all: tasks.length,
    timer: timerTasks.length, 
    journal: journalTasks.length,
    checklist: checklistTasks.length,
    regular: regularTasks.length,
    screenshot: screenshotTasks.length,
    voicenote: voicenoteTasks.length
  });
  
  // Debug tasks by type
  if (journalTasks.length > 0) {
    console.log("Journal tasks:", journalTasks);
  }
  if (voicenoteTasks.length > 0) {
    console.log("Voice note tasks:", voicenoteTasks);
  }
  
  const allTasks = tasks;

  // Collect counts for the tab list
  const taskCounts = {
    all: allTasks.length,
    timer: timerTasks.length,
    screenshot: screenshotTasks.length,
    journal: journalTasks.length,
    checklist: checklistTasks.length,
    voicenote: voicenoteTasks.length,
    regular: regularTasks.length
  };

  // For timer view, we show a simplified interface with only timer tasks
  if (isTimerView) {
    return (
      <TimerView
        tasks={tasks}
        selectedTaskId={selectedTaskId}
        onTaskAdd={handleTaskAdd}
        onTasksAdd={handleTasksAdd}
      />
    );
  }

  // Mobile-optimized tabs for task types
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col h-full bg-background rounded-xl overflow-hidden shadow-sm border border-border/30">
        <div className={`${isMobile ? 'px-0 pt-0' : 'p-0'}`}>
          <TaskInput 
            onTaskAdd={handleTaskAdd} 
            onTasksAdd={handleTasksAdd}
          />
        </div>
        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="all" className="h-full flex flex-col">
            <TaskTabsList taskCounts={taskCounts} />

            <TaskTypeTab value="all" tasks={allTasks} selectedTaskId={selectedTaskId} dialogOpeners={dialogOpeners} />
            <TaskTypeTab value="regular" tasks={regularTasks} selectedTaskId={selectedTaskId} dialogOpeners={dialogOpeners} />
            <TaskTypeTab value="timer" tasks={timerTasks} selectedTaskId={selectedTaskId} dialogOpeners={dialogOpeners} />
            <TaskTypeTab value="journal" tasks={journalTasks} selectedTaskId={selectedTaskId} dialogOpeners={dialogOpeners} />
            <TaskTypeTab value="checklist" tasks={checklistTasks} selectedTaskId={selectedTaskId} dialogOpeners={dialogOpeners} />
            <TaskTypeTab value="screenshot" tasks={screenshotTasks} selectedTaskId={selectedTaskId} dialogOpeners={dialogOpeners} />
            <TaskTypeTab value="voicenote" tasks={voicenoteTasks} selectedTaskId={selectedTaskId} dialogOpeners={dialogOpeners} />
          </Tabs>
        </div>
      </div>
      
      {/* Add the CompletedTasks component */}
      {completedTasks.length > 0 && (
        <CompletedTasks tasks={completedTasks} />
      )}
    </div>
  );
};

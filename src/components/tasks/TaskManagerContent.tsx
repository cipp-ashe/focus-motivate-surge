
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

interface TaskManagerContentProps {
  tasks: Task[];
  selectedTaskId: string | null;
  onTaskAdd: (task: Task) => void;
  onTasksAdd: (tasks: Task[]) => void;
  isTimerView?: boolean;
}

export const TaskManagerContent: React.FC<TaskManagerContentProps> = ({
  tasks,
  selectedTaskId,
  onTaskAdd,
  onTasksAdd,
  isTimerView = false
}) => {
  const isMobile = useIsMobile();
  
  const handleTaskAdd = (task: Task) => {
    console.log("TaskManagerContent - Adding task:", task);
    
    // Add to storage first
    taskStorage.addTask(task);
    
    // Call the parent handler
    onTaskAdd(task);
    
    // Show toast
    toast.success(`Added ${task.taskType || 'regular'} task: ${task.name}`);
    
    // Force refresh the UI
    setTimeout(() => {
      window.dispatchEvent(new Event('force-task-update'));
    }, 100);
  };

  const handleTasksAdd = (tasks: Task[]) => {
    console.log(`TaskManagerContent - Adding ${tasks.length} tasks`);
    
    // Add all tasks to storage
    tasks.forEach(task => taskStorage.addTask(task));
    
    // Call the parent handler
    onTasksAdd(tasks);
    
    // Show toast
    toast.success(`Added ${tasks.length} tasks`);
    
    // Force refresh the UI
    setTimeout(() => {
      window.dispatchEvent(new Event('force-task-update'));
    }, 100);
  };

  // Filter tasks by type for display
  const timerTasks = tasks.filter(task => task.taskType === 'timer');
  const journalTasks = tasks.filter(task => task.taskType === 'journal');
  const checklistTasks = tasks.filter(task => task.taskType === 'checklist');
  const regularTasks = tasks.filter(task => !task.taskType || task.taskType === 'regular');
  const screenshotTasks = tasks.filter(task => task.taskType === 'screenshot');
  const habitTasks = tasks.filter(task => task.taskType === 'habit');
  const voicenoteTasks = tasks.filter(task => task.taskType === 'voicenote');
  const allTasks = tasks;

  // Collect counts for the tab list
  const taskCounts = {
    all: allTasks.length,
    timer: timerTasks.length,
    screenshot: screenshotTasks.length,
    habit: habitTasks.length,
    journal: journalTasks.length,
    checklist: checklistTasks.length,
    voicenote: voicenoteTasks.length,
    regular: regularTasks.length
  };

  // For timer view, we show a simplified interface with only timer tasks
  if (isTimerView) {
    return (
      <TimerView
        tasks={timerTasks}
        selectedTaskId={selectedTaskId}
        onTaskAdd={handleTaskAdd}
        onTasksAdd={handleTasksAdd}
      />
    );
  }

  // Mobile-optimized tabs for task types
  return (
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

          <TaskTypeTab value="all" tasks={allTasks} selectedTaskId={selectedTaskId} />
          <TaskTypeTab value="timer" tasks={timerTasks} selectedTaskId={selectedTaskId} />
          <TaskTypeTab value="screenshot" tasks={screenshotTasks} selectedTaskId={selectedTaskId} />
          <TaskTypeTab value="habit" tasks={habitTasks} selectedTaskId={selectedTaskId} />
          <TaskTypeTab value="journal" tasks={journalTasks} selectedTaskId={selectedTaskId} />
          <TaskTypeTab value="checklist" tasks={checklistTasks} selectedTaskId={selectedTaskId} />
          <TaskTypeTab value="voicenote" tasks={voicenoteTasks} selectedTaskId={selectedTaskId} />
          <TaskTypeTab value="regular" tasks={regularTasks} selectedTaskId={selectedTaskId} />
        </Tabs>
      </div>
    </div>
  );
};

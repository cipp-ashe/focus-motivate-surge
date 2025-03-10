
import React, { useEffect, useState } from 'react';
import { useTaskContext } from '@/contexts/tasks/TaskContext';
import TaskManager from '@/components/tasks/TaskManager';
import { TaskLayout } from '@/components/tasks/TaskLayout';
import { Quote } from "@/types/timer";
import { eventBus } from '@/lib/eventBus';
import { TimerErrorBoundary } from '@/components/timer/TimerErrorBoundary';
import { HabitsPanelProvider } from '@/hooks/ui/useHabitsPanel';
import { toast } from 'sonner';
import { TimerSection } from '@/components/timer/TimerSection';

const TimerPage = () => {
  const { items: tasks, selected: selectedTaskId } = useTaskContext();
  const selectedTask = tasks.find(task => task.id === selectedTaskId) || null;
  const [favorites, setFavorites] = useState<Quote[]>([]);
  const [habitCheckDone, setHabitCheckDone] = useState(false);
  
  // Track when TimerPage is mounted and ready - only run once
  useEffect(() => {
    console.log("TimerPage mounted and ready");
    
    // Notify that the timer page is ready
    eventBus.emit('page:timer-ready', {
      timestamp: new Date().toISOString()
    });
    
    if (!habitCheckDone) {
      setHabitCheckDone(true);
      
      // Check for pending habits
      setTimeout(() => {
        console.log(`Checking for pending habits from TimerPage (one-time check)`);
        eventBus.emit('habits:check-pending', {});
        
        // Check localStorage directly for habit tasks
        const storedTasks = JSON.parse(localStorage.getItem('taskList') || '[]');
        const habitTasks = storedTasks.filter((task) => task.relationships?.habitId);
        
        if (habitTasks.length > 0) {
          console.log(`Found ${habitTasks.length} habit tasks in localStorage`);
          
          // Only force update if there are tasks in storage that aren't in memory
          if (tasks.length === 0 || habitTasks.some((storageTask) => 
              !tasks.some(memTask => memTask.id === storageTask.id))) {
            
            window.dispatchEvent(new Event('force-task-update'));
            
            toast.info(`Found ${habitTasks.length} scheduled tasks`, {
              description: "Loading your habit tasks..."
            });
          } else {
            console.log(`All habit tasks are properly loaded`);
          }
        } else {
          console.log('No habit tasks found in localStorage');
          // Signal that we've processed habits
          eventBus.emit('habits:processed', {});
        }
      }, 500);
    }
  }, [tasks, habitCheckDone]);

  return (
    <HabitsPanelProvider>
      <TimerErrorBoundary>
        <TaskLayout
          mainContent={
            <div className="flex flex-col h-full space-y-4">
              <TimerSection
                selectedTask={selectedTask}
                onTaskComplete={(metrics) => {
                  eventBus.emit('task:complete', { taskId: selectedTaskId, metrics });
                }}
                onDurationChange={(seconds) => {
                  if (selectedTaskId) {
                    eventBus.emit('task:update', {
                      taskId: selectedTaskId,
                      updates: { duration: seconds }
                    });
                  }
                }}
                favorites={favorites}
                setFavorites={setFavorites}
              />
            </div>
          }
          asideContent={<TaskManager />}
        />
      </TimerErrorBoundary>
    </HabitsPanelProvider>
  );
};

export default TimerPage;

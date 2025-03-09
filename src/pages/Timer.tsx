
import React from 'react';
import { TimerSection } from '@/components/timer/TimerSection';
import { useTaskContext } from '@/contexts/tasks/TaskContext';
import TaskManager from '@/components/tasks/TaskManager';
import { TaskLayout } from '@/components/tasks/TaskLayout';
import { Quote } from "@/types/timer";
import { useTasksInitializer } from '@/hooks/tasks/useTasksInitializer';

const TimerPage = () => {
  const { items: tasks, selected: selectedTaskId } = useTaskContext();
  const selectedTask = tasks.find(task => task.id === selectedTaskId) || null;
  const [favorites, setFavorites] = React.useState<Quote[]>([]);
  
  // Initialize tasks and handle page load events
  useTasksInitializer();

  const handleTaskComplete = (metrics: any) => {
    if (selectedTask) {
      console.log("Task completed:", selectedTask.name, metrics);
    }
  };

  const handleDurationChange = (seconds: number) => {
    if (selectedTask) {
      console.log("Duration changed for task:", selectedTask.name, seconds);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <TaskLayout
          timer={
            <TimerSection
              selectedTask={selectedTask}
              onTaskComplete={handleTaskComplete}
              onDurationChange={handleDurationChange}
              favorites={favorites}
              setFavorites={setFavorites}
            />
          }
          taskList={<TaskManager />}
        />
      </div>
    </div>
  );
};

export default TimerPage;

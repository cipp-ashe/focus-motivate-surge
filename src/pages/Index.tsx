
import React from 'react';
import { Link } from "react-router-dom";
import { Moon, Sun, StickyNote, ActivitySquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
import { TimerSection } from '@/components/timer/TimerSection';
import { useTaskContext } from '@/contexts/tasks/TaskContext';
import TaskManager from '@/components/tasks/TaskManager';
import { TaskLayout } from '@/components/tasks/TaskLayout';
import { useState } from 'react';
import { Quote } from "@/types/timer";
import { HabitsPanelProvider } from '@/hooks/useHabitsPanel';

const IndexPage = () => {
  const { isDark, toggleTheme } = useTheme();
  const { items: tasks, selected: selectedTaskId } = useTaskContext();
  const selectedTask = tasks.find(task => task.id === selectedTaskId) || null;
  const [favorites, setFavorites] = useState<Quote[]>([]);

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
    <HabitsPanelProvider>
      <div className="min-h-screen bg-background">
        {/* App Header */}
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
              Focus Timer
            </h1>
            <div className="flex items-center gap-4">
              <nav className="flex items-center space-x-1">
                <Link 
                  to="/habits"
                  className="px-3 py-2 rounded-md hover:bg-muted transition-colors flex items-center gap-2"
                  title="Habits"
                >
                  <ActivitySquare className="h-5 w-5" />
                  <span className="hidden sm:inline">Habits</span>
                </Link>
                <Link 
                  to="/notes"
                  className="px-3 py-2 rounded-md hover:bg-muted transition-colors flex items-center gap-2"
                  title="Notes"
                >
                  <StickyNote className="h-5 w-5" />
                  <span className="hidden sm:inline">Notes</span>
                </Link>
              </nav>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full hover:bg-primary/20"
              >
                {isDark ? (
                  <Sun className="h-5 w-5 sm:h-6 sm:w-6" />
                ) : (
                  <Moon className="h-5 w-5 sm:h-6 sm:w-6" />
                )}
              </Button>
            </div>
          </div>

          {/* Timer and Task components */}
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
    </HabitsPanelProvider>
  );
};

export default IndexPage;

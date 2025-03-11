
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HabitDetail } from './types';
import { TodaysHabitCard } from './TodaysHabitCard';
import { eventBus } from '@/lib/eventBus';
import { taskStorage } from '@/lib/storage/taskStorage';

interface TodaysHabitsSectionProps {
  todaysHabits: HabitDetail[];
  completedHabits: string[];
  onHabitComplete: (habitId: string, completed: boolean) => void;
  onAddHabitToTasks: (habit: HabitDetail) => void;
  templateId?: string;
}

export const TodaysHabitsSection: React.FC<TodaysHabitsSectionProps> = ({
  todaysHabits,
  completedHabits,
  onHabitComplete,
  onAddHabitToTasks,
  templateId
}) => {
  const [activeTab, setActiveTab] = useState('all');
  const [habitTaskStatus, setHabitTaskStatus] = useState<Record<string, boolean>>({});
  
  // Check which habits already have tasks
  useEffect(() => {
    const today = new Date().toDateString();
    const status: Record<string, boolean> = {};
    
    // Check each habit if a task already exists
    todaysHabits.forEach(habit => {
      const task = taskStorage.taskExists(habit.id, today);
      status[habit.id] = !!task;
    });
    
    setHabitTaskStatus(status);
    
    // Listen for task create/delete events to update status
    const handleTaskCreate = (task: any) => {
      if (task.relationships?.habitId && todaysHabits.some(h => h.id === task.relationships.habitId)) {
        setHabitTaskStatus(prev => ({
          ...prev,
          [task.relationships.habitId]: true
        }));
      }
    };
    
    const handleTaskDelete = (data: { taskId: string }) => {
      // We'd need to look up the habit ID from the task - for now we'll just refresh
      setTimeout(() => {
        const newStatus: Record<string, boolean> = {};
        todaysHabits.forEach(habit => {
          const task = taskStorage.taskExists(habit.id, today);
          newStatus[habit.id] = !!task;
        });
        setHabitTaskStatus(newStatus);
      }, 100);
    };
    
    // Subscribe to events
    const unsubCreate = eventBus.on('task:create', handleTaskCreate);
    const unsubDelete = eventBus.on('task:delete', handleTaskDelete);
    
    return () => {
      unsubCreate();
      unsubDelete();
    };
  }, [todaysHabits]);
  
  // Filter habits by type
  const timerHabits = todaysHabits.filter(h => h.metrics.type === 'timer');
  const journalHabits = todaysHabits.filter(h => h.metrics.type === 'journal');
  const otherHabits = todaysHabits.filter(h => 
    h.metrics.type !== 'timer' && h.metrics.type !== 'journal'
  );
  
  // Handle adding a habit to tasks
  const handleAddToTasks = (habit: HabitDetail) => {
    onAddHabitToTasks(habit);
    
    // Update local state immediately for better UX
    setHabitTaskStatus(prev => ({
      ...prev,
      [habit.id]: true
    }));
  };

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle>Today's Habits</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="all">All ({todaysHabits.length})</TabsTrigger>
            <TabsTrigger value="timer">Timer ({timerHabits.length})</TabsTrigger>
            <TabsTrigger value="journal">Journal ({journalHabits.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            {todaysHabits.map(habit => (
              <TodaysHabitCard
                key={habit.id}
                habit={habit}
                completed={completedHabits.includes(habit.id)}
                onComplete={(completed) => onHabitComplete(habit.id, completed)}
                onAddToTasks={() => handleAddToTasks(habit)}
                hasTask={habitTaskStatus[habit.id] || false}
              />
            ))}
          </TabsContent>
          
          <TabsContent value="timer" className="space-y-4">
            {timerHabits.map(habit => (
              <TodaysHabitCard
                key={habit.id}
                habit={habit}
                completed={completedHabits.includes(habit.id)}
                onComplete={(completed) => onHabitComplete(habit.id, completed)}
                onAddToTasks={() => handleAddToTasks(habit)}
                hasTask={habitTaskStatus[habit.id] || false}
              />
            ))}
          </TabsContent>
          
          <TabsContent value="journal" className="space-y-4">
            {journalHabits.map(habit => (
              <TodaysHabitCard
                key={habit.id}
                habit={habit}
                completed={completedHabits.includes(habit.id)}
                onComplete={(completed) => onHabitComplete(habit.id, completed)}
                onAddToTasks={() => handleAddToTasks(habit)}
                hasTask={habitTaskStatus[habit.id] || false}
              />
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};


import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HabitDetail } from './types';
import { TodaysHabitCard } from './TodaysHabitCard';
import { eventBus } from '@/lib/eventBus';
import { taskStorage } from '@/lib/storage/taskStorage';
import { motion } from 'framer-motion';

interface TodaysHabitsSectionProps {
  todaysHabits: HabitDetail[];
  completedHabits: string[]; // Changed to string array
  dismissedHabits?: string[]; // Changed to string array
  onHabitComplete: (habitId: string) => boolean; // Updated signature
  onAddHabitToTasks: (habit: HabitDetail) => void; // Updated signature
  templateId?: string;
}

export const TodaysHabitsSection: React.FC<TodaysHabitsSectionProps> = ({
  todaysHabits,
  completedHabits,
  dismissedHabits = [],
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

  // Animation variants for list items
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <Card className="h-full overflow-hidden flex flex-col bg-background/90 backdrop-blur-sm border-border/50 shadow-sm rounded-xl">
      <CardHeader className="pb-2 border-b border-border/20">
        <CardTitle className="text-lg font-medium bg-clip-text text-transparent bg-gradient-to-br from-primary/90 to-purple-500/90">
          Today's Habits
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto p-3">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid grid-cols-3 mb-3 bg-muted/50 p-1 rounded-lg">
            <TabsTrigger 
              value="all"
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200 rounded-md"
            >
              All ({todaysHabits.length})
            </TabsTrigger>
            <TabsTrigger 
              value="timer"
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200 rounded-md"
            >
              Timer ({timerHabits.length})
            </TabsTrigger>
            <TabsTrigger 
              value="journal"
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200 rounded-md"
            >
              Journal ({journalHabits.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-3 flex-1 overflow-auto px-1 py-2">
            <motion.div 
              className="space-y-3"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {todaysHabits.map(habit => (
                <motion.div key={habit.id} variants={itemVariants}>
                  <TodaysHabitCard
                    habit={habit}
                    completed={completedHabits.includes(habit.id)}
                    dismissed={dismissedHabits.includes(habit.id)}
                    onComplete={() => onHabitComplete(habit.id)}
                    onAddToTasks={() => handleAddToTasks(habit)}
                    hasTask={habitTaskStatus[habit.id] || false}
                  />
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>
          
          <TabsContent value="timer" className="space-y-3 flex-1 overflow-auto px-1 py-2">
            <motion.div 
              className="space-y-3"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {timerHabits.map(habit => (
                <motion.div key={habit.id} variants={itemVariants}>
                  <TodaysHabitCard
                    habit={habit}
                    completed={completedHabits.includes(habit.id)}
                    dismissed={dismissedHabits.includes(habit.id)}
                    onComplete={() => onHabitComplete(habit.id)}
                    onAddToTasks={() => handleAddToTasks(habit)}
                    hasTask={habitTaskStatus[habit.id] || false}
                  />
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>
          
          <TabsContent value="journal" className="space-y-3 flex-1 overflow-auto px-1 py-2">
            <motion.div 
              className="space-y-3"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {journalHabits.map(habit => (
                <motion.div key={habit.id} variants={itemVariants}>
                  <TodaysHabitCard
                    habit={habit}
                    completed={completedHabits.includes(habit.id)}
                    dismissed={dismissedHabits.includes(habit.id)}
                    onComplete={() => onHabitComplete(habit.id)}
                    onAddToTasks={() => handleAddToTasks(habit)}
                    hasTask={habitTaskStatus[habit.id] || false}
                  />
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

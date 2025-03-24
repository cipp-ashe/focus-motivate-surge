import React, { useState } from 'react';
import { useTaskContext } from '@/contexts/tasks/TaskContext';
import { Task } from '@/types/tasks';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { eventManager } from '@/lib/events/EventManager';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CompletedTasksList from './completed/CompletedTasksList';
import { Button } from '@/components/ui/button';
import { RefreshCw, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Props for the CompletedTasks component
 */
interface CompletedTasksProps {
  /** Optional array of completed tasks to display */
  tasks?: Task[];
  /** Optional callback for clearing all completed tasks */
  onTasksClear?: () => void;
}

/**
 * A component that displays completed and dismissed tasks
 * 
 * This component shows tabs for 'All', 'Completed', and 'Dismissed' tasks,
 * allowing the user to filter and view tasks in different states.
 * It also provides functionality for deleting individual tasks.
 *
 * @param {CompletedTasksProps} props - The component props
 * @returns {JSX.Element} The rendered component
 */
export const CompletedTasks: React.FC<CompletedTasksProps> = ({ 
  tasks: propTasks,
  onTasksClear
}) => {
  const { completed } = useTaskContext();
  const [activeTab, setActiveTab] = useState<'all' | 'completed' | 'dismissed'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Use props tasks if provided, otherwise use from context
  const tasksToUse = propTasks || completed;
  
  // Separate completed tasks from dismissed tasks
  const completedTasks = tasksToUse.filter(task => !task.dismissedAt);
  const dismissedTasks = tasksToUse.filter(task => task.dismissedAt);
  
  const displayTasks = activeTab === 'completed' 
    ? completedTasks 
    : activeTab === 'dismissed' 
      ? dismissedTasks 
      : tasksToUse;

  // Handle deleting a completed/dismissed task
  const handleDeleteTask = (taskId: string) => {
    eventManager.emit('task:delete', { 
      taskId, 
      reason: 'manual',
      suppressToast: false 
    });
  };
  
  // Handle refresh to force reload tasks
  const handleRefresh = () => {
    setIsRefreshing(true);
    window.dispatchEvent(new Event('force-task-update'));
    
    // Reset refreshing state after animation
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
    
    toast.info('Refreshing task list', {
      duration: 1500
    });
  };
  
  // Handle clearing all tasks in the current view
  const handleClearAll = () => {
    if (onTasksClear) {
      onTasksClear();
      return;
    }
    
    // Fallback implementation if no onTasksClear provided
    if (displayTasks.length === 0) {
      toast.info('No tasks to clear');
      return;
    }
    
    // Confirm before deleting
    if (window.confirm(`Are you sure you want to delete all ${displayTasks.length} tasks in this view?`)) {
      // Delete all displayed tasks
      displayTasks.forEach(task => {
        eventManager.emit('task:delete', {
          taskId: task.id,
          reason: 'manual',
          suppressToast: true
        });
      });
      
      toast.success(`Cleared ${displayTasks.length} tasks`);
    }
  };
  
  return (
    <Card className="bg-card/90 backdrop-blur-sm border-border/40 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            Completed Tasks
            {tasksToUse.length > 0 && (
              <Badge variant="outline" className="bg-secondary/50 text-secondary-foreground">
                {tasksToUse.length}
              </Badge>
            )}
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="h-8 w-8 p-0"
              aria-label="Refresh tasks"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
            
            {displayTasks.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleClearAll}
                className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                aria-label="Clear all tasks"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                <span className="text-xs">Clear All</span>
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4 bg-secondary/50 p-1 rounded-md">
            <TabsTrigger 
              value="all"
              className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              All ({tasksToUse.length})
            </TabsTrigger>
            <TabsTrigger 
              value="completed"
              className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              Completed ({completedTasks.length})
            </TabsTrigger>
            <TabsTrigger 
              value="dismissed"
              className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              Dismissed ({dismissedTasks.length})
            </TabsTrigger>
          </TabsList>
          
          <CompletedTasksList 
            tasks={displayTasks}
            activeTab={activeTab}
            onDeleteTask={handleDeleteTask}
          />
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CompletedTasks;

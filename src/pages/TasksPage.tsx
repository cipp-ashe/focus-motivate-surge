
import React, { useState, useEffect, useCallback } from 'react';
import { Task } from '@/types/tasks';
import { TaskProvider, useTaskContext } from '@/contexts/tasks/TaskContext';
import { Card, CardContent } from '@/components/ui/card';
import { TaskEventHandler } from '@/components/tasks/TaskEventHandler';
import { UnifiedTaskView } from '@/components/tasks/UnifiedTaskView';
import { TaskInput } from '@/components/tasks/TaskInput';

// Inner component that has access to TaskContext
const TasksPageContent = () => {
  const taskContext = useTaskContext();
  
  // For debugging purposes
  console.log('TasksPageContent rendering with context:', { 
    activeTasks: taskContext?.items?.length || 0,
    completedTasks: taskContext?.completed?.length || 0,
    selectedTaskId: taskContext?.selected
  });

  // Event handlers
  const onTaskCreate = useCallback((task: Task) => {
    console.log('TasksPage: Task created', task);
    if (taskContext?.addTask) {
      taskContext.addTask(task);
    }
    // Refresh the task list
    setTimeout(() => {
      window.dispatchEvent(new Event('task-ui-refresh'));
    }, 100);
  }, [taskContext]);
  
  const onTaskUpdate = useCallback(({ taskId, updates }: { taskId: string; updates: Partial<Task> }) => {
    console.log('TasksPage: Task updated', taskId, updates);
    if (taskContext?.updateTask) {
      taskContext.updateTask(taskId, updates);
    }
    // Refresh the task list
    setTimeout(() => {
      window.dispatchEvent(new Event('task-ui-refresh'));
    }, 100);
  }, [taskContext]);
  
  const onTaskDelete = useCallback(({ taskId }: { taskId: string }) => {
    console.log('TasksPage: Task deleted', taskId);
    if (taskContext?.deleteTask) {
      taskContext.deleteTask(taskId);
    }
    // Refresh the task list
    setTimeout(() => {
      window.dispatchEvent(new Event('task-ui-refresh'));
    }, 100);
  }, [taskContext]);
  
  const onTaskComplete = useCallback(({ taskId, metrics }: { taskId: string; metrics?: any }) => {
    console.log('TasksPage: Task complete', taskId, metrics);
    if (taskContext?.completeTask) {
      taskContext.completeTask(taskId, metrics);
    }
    // Refresh the task list
    setTimeout(() => {
      window.dispatchEvent(new Event('task-ui-refresh'));
    }, 100);
  }, [taskContext]);
  
  const onForceUpdate = useCallback(() => {
    console.log('TasksPage: Force update');
  }, []);

  // Calculate task statistics
  const totalTasks = (taskContext?.items?.length || 0) + (taskContext?.completed?.length || 0);
  const completedTasks = taskContext?.completed?.length || 0;
  const pendingTasks = taskContext?.items?.length || 0;

  return (
    <>
      <div className="mb-6">
        <div className="bg-card rounded-md p-4">
          <h2 className="text-xl font-semibold mb-2">Task Statistics</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-muted/50 p-3 rounded-md">
              <h3 className="text-sm font-medium">Total Tasks</h3>
              <p className="text-2xl font-bold">{totalTasks}</p>
            </div>
            <div className="bg-muted/50 p-3 rounded-md">
              <h3 className="text-sm font-medium">Completed</h3>
              <p className="text-2xl font-bold text-green-500">{completedTasks}</p>
            </div>
            <div className="bg-muted/50 p-3 rounded-md">
              <h3 className="text-sm font-medium">Pending</h3>
              <p className="text-2xl font-bold text-amber-500">{pendingTasks}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardContent className="p-4">
            <TaskInput 
              onTaskAdd={onTaskCreate}
              onTasksAdd={(tasks) => tasks.forEach(task => onTaskCreate(task))}
            />
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <UnifiedTaskView 
              activeTasks={taskContext?.items || []}
              completedTasks={taskContext?.completed || []}
              selectedTaskId={taskContext?.selected}
              onTaskAdd={onTaskCreate}
              onTasksAdd={(tasks) => tasks.forEach(task => onTaskCreate(task))}
            />
          </CardContent>
        </Card>
      </div>
      
      <TaskEventHandler
        onForceUpdate={onForceUpdate}
        onTaskCreate={onTaskCreate}
        onTaskUpdate={onTaskUpdate}
        onTaskDelete={onTaskDelete}
        onTaskComplete={onTaskComplete}
        tasks={taskContext?.items || []}
      />
    </>
  );
};

// The main wrapper component that provides the TaskContext
export default function TasksPage() {
  console.log('TasksPage.tsx main component rendering');
  
  return (
    <div className="container max-w-6xl mx-auto p-4">
      <TaskProvider>
        <TasksPageContent />
      </TaskProvider>
    </div>
  );
}

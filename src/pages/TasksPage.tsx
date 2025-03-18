
import React, { useState, useCallback } from 'react';
import { Task } from '@/types/tasks';
import { TaskProvider } from '@/contexts/tasks/TaskContext';
import { TaskManager } from '@/components/tasks/TaskManager';
import { Card, CardContent } from '@/components/ui/card';
import { useSearchParams, useRouter } from 'next/navigation';
import { TaskEventHandler } from '@/components/tasks/TaskEventHandler';

export default function TasksPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedTag = searchParams.get('tag');
  
  const onForceUpdate = useCallback(() => {
    console.log('TasksPage: Force update');
    router.refresh();
  }, [router]);
  
  const onTaskCreate = useCallback((task: Task) => {
    console.log('TasksPage: Task created', task);
    // Refresh the task list
    setTimeout(() => {
      window.dispatchEvent(new Event('task-ui-refresh'));
    }, 100);
  }, []);
  
  const onTaskUpdate = useCallback(({ taskId, updates }: { taskId: string; updates: Partial<Task> }) => {
    console.log('TasksPage: Task updated', taskId, updates);
    // Refresh the task list
    setTimeout(() => {
      window.dispatchEvent(new Event('task-ui-refresh'));
    }, 100);
  }, []);
  
  const onTaskDelete = useCallback(({ taskId }: { taskId: string }) => {
    console.log('TasksPage: Task deleted', taskId);
    // Refresh the task list
    setTimeout(() => {
      window.dispatchEvent(new Event('task-ui-refresh'));
    }, 100);
  }, []);
  
  // Add the missing onTaskComplete function
  function onTaskComplete({ taskId, metrics }: { taskId: string; metrics?: any }) {
    console.log('TasksPage: Task complete', taskId, metrics);
    // Refresh the task list
    setTimeout(() => {
      window.dispatchEvent(new Event('task-ui-refresh'));
    }, 100);
  }

  return (
    <div className="container max-w-6xl mx-auto p-4">
      
      <TaskProvider>
        <div className="mb-6">
          <div className="bg-card rounded-md p-4">
            <h2 className="text-xl font-semibold mb-2">Task Statistics</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-muted/50 p-3 rounded-md">
                <h3 className="text-sm font-medium">Total Tasks</h3>
                <p className="text-2xl font-bold">0</p>
              </div>
              <div className="bg-muted/50 p-3 rounded-md">
                <h3 className="text-sm font-medium">Completed</h3>
                <p className="text-2xl font-bold text-green-500">0</p>
              </div>
              <div className="bg-muted/50 p-3 rounded-md">
                <h3 className="text-sm font-medium">Pending</h3>
                <p className="text-2xl font-bold text-amber-500">0</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <TaskManager 
                initialFilter={selectedTag ? 'tag' : 'all'}
                initialTag={selectedTag}
                hasTasks={true}
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
          tasks={[]} // Empty array as placeholder
        />
      </TaskProvider>
    </div>
  );
}

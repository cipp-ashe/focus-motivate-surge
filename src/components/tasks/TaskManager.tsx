import React, { useState, useEffect, useCallback } from 'react';
import { Task } from '@/types/tasks';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTaskContext } from '@/contexts/TaskContext';
import { Timer } from './Timer';
import { TimerMetrics } from '@/types/metrics';
import { TaskMetrics } from '@/types/tasks';

interface TaskManagerProps {
  selectedHabitId?: string;
  selectedTemplateId?: string;
}

const TaskManager: React.FC<TaskManagerProps> = ({ selectedHabitId, selectedTemplateId }) => {
  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    completeTask,
  } = useTaskContext();

  const [newTaskName, setNewTaskName] = useState('');
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  useEffect(() => {
    if (tasks && tasks.length > 0) {
      setActiveTask(tasks.find(task => !task.completed) || null);
    } else {
      setActiveTask(null);
    }
  }, [tasks]);

  const handleAddTask = () => {
    if (newTaskName.trim()) {
      const newTask: Omit<Task, 'id' | 'createdAt'> = {
        name: newTaskName.trim(),
        completed: false,
        relationships: {
          habitId: selectedHabitId,
          templateId: selectedTemplateId,
        },
      };
      addTask(newTask);
      setNewTaskName('');
    }
  };

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    updateTask(taskId, updates);
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
  };

  const handleCompleteTask = (taskId: string, metrics?: TimerMetrics) => {
    const taskMetrics: TaskMetrics = {
      expectedTime: metrics?.expectedTime || 0,
      actualDuration: metrics?.actualDuration || 0,
      pauseCount: metrics?.pauseCount || 0,
      favoriteQuotes: metrics?.favoriteQuotes || 0,
      pausedTime: metrics?.pausedTime || 0,
      extensionTime: metrics?.extensionTime || 0,
      netEffectiveTime: metrics?.netEffectiveTime || 0,
      efficiencyRatio: metrics?.efficiencyRatio || 0,
      completionStatus: metrics?.completionStatus || 'Completed On Time',
      endTime: metrics?.endTime || null,
    };
    completeTask(taskId, taskMetrics);
  };

  const handleTaskNameChange = (taskId: string, newName: string) => {
    updateTask(taskId, { name: newName });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Add a new task..."
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleAddTask} variant="outline">Add Task</Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between p-3 rounded-md shadow-sm border">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id={`task-${task.id}`}
                  checked={task.completed}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      handleCompleteTask(task.id);
                    } else {
                      handleUpdateTask(task.id, { completed: false });
                    }
                  }}
                />
                <Label htmlFor={`task-${task.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
                  <Input
                    type="text"
                    value={task.name}
                    onChange={(e) => handleTaskNameChange(task.id, e.target.value)}
                    className="text-sm"
                  />
                </Label>
              </div>
              <div>
                <Button variant="destructive" size="icon" onClick={() => handleDeleteTask(task.id)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {activeTask && (
        <div className="p-4 border-t">
          <Timer
            taskId={activeTask.id}
            onComplete={handleCompleteTask}
          />
        </div>
      )}
    </div>
  );
};

export default TaskManager;

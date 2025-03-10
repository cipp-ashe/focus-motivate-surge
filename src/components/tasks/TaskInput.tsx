
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Task, TaskType, ChecklistItem } from '@/types/tasks';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { TaskTypeSelector } from './TaskTypeSelector';
import { Plus, Trash2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TaskInputProps {
  onTaskAdd: (task: Task) => void;
  onTasksAdd: (tasks: Task[]) => void;
}

export const TaskInput: React.FC<TaskInputProps> = ({ onTaskAdd, onTasksAdd }) => {
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskType, setTaskType] = useState<TaskType>('regular');
  const [duration, setDuration] = useState(25); // Default 25 minutes
  const [journalEntry, setJournalEntry] = useState('');
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([
    { id: uuidv4(), text: '', completed: false }
  ]);

  const handleAddTask = () => {
    if (!taskName.trim()) return;

    const newTask: Task = {
      id: uuidv4(),
      name: taskName.trim(),
      description: taskDescription.trim() || undefined,
      taskType: taskType,
      completed: false,
      createdAt: new Date().toISOString(),
      // Add specific properties based on task type
      ...(taskType === 'timer' ? { 
        duration: duration * 60  // Convert minutes to seconds
      } : {}),
      ...(taskType === 'journal' ? { 
        journalEntry: journalEntry.trim() 
      } : {}),
      ...(taskType === 'checklist' ? { 
        checklistItems: checklistItems.filter(item => item.text.trim())
      } : {})
    };

    onTaskAdd(newTask);
    resetForm();
  };

  const resetForm = () => {
    setTaskName('');
    setTaskDescription('');
    setTaskType('regular');
    setDuration(25);
    setJournalEntry('');
    setChecklistItems([{ id: uuidv4(), text: '', completed: false }]);
  };

  const addChecklistItem = () => {
    setChecklistItems([...checklistItems, { id: uuidv4(), text: '', completed: false }]);
  };

  const updateChecklistItem = (id: string, text: string) => {
    setChecklistItems(items => 
      items.map(item => item.id === id ? { ...item, text } : item)
    );
  };

  const removeChecklistItem = (id: string) => {
    if (checklistItems.length <= 1) return;
    setChecklistItems(items => items.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="task-name">Task Name</Label>
          <Input
            id="task-name"
            placeholder="Enter task name"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="task-description">Description (Optional)</Label>
          <Textarea
            id="task-description"
            placeholder="Add details about this task"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            rows={2}
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="task-type">Task Type</Label>
          <TaskTypeSelector 
            value={taskType} 
            onChange={setTaskType} 
          />
        </div>
        
        {taskType === 'timer' && (
          <div className="grid gap-2">
            <Label htmlFor="task-duration">Duration (minutes)</Label>
            <Input
              id="task-duration"
              type="number"
              min={1}
              max={120}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
            />
          </div>
        )}
        
        {taskType === 'journal' && (
          <div className="grid gap-2">
            <Label htmlFor="journal-entry">Journal Entry</Label>
            <Textarea
              id="journal-entry"
              placeholder="Write your journal entry here..."
              value={journalEntry}
              onChange={(e) => setJournalEntry(e.target.value)}
              rows={4}
            />
          </div>
        )}
        
        {taskType === 'checklist' && (
          <div className="grid gap-2">
            <div className="flex justify-between items-center">
              <Label>Checklist Items</Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={addChecklistItem}
                className="flex items-center gap-1"
              >
                <Plus className="h-3 w-3" /> Add Item
              </Button>
            </div>
            <div className="space-y-2 mt-1">
              {checklistItems.map((item, index) => (
                <div key={item.id} className="flex items-center gap-2">
                  <Input
                    placeholder={`Item ${index + 1}`}
                    value={item.text}
                    onChange={(e) => updateChecklistItem(item.id, e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeChecklistItem(item.id)}
                    disabled={checklistItems.length <= 1}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <Button onClick={handleAddTask} disabled={!taskName.trim()}>
        Add Task
      </Button>
    </div>
  );
};

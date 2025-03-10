import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Task, Tag } from '@/types/tasks';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useEventBus } from '@/hooks/useEventBus';
import { useEvent } from '@/hooks/useEvent';
import { useTaskManager } from '@/hooks/tasks/useTaskManager';
import { useTaskContext } from '@/contexts/tasks/TaskContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast'; // Fixed import
import { useTaskEvents } from '@/hooks/tasks/useTaskEvents';
import { eventManager } from '@/lib/events/EventManager';
import { TimerEventType } from '@/types/events';

interface TaskInputProps {
  onTaskAdd: (task: Task) => void;
  onTasksAdd: (tasks: Task[]) => void;
  defaultTaskType?: 'timer' | 'screenshot' | 'habit' | 'journal' | 'checklist' | 'regular';
  simplifiedView?: boolean;
}

// Add HabitTemplate type
interface HabitTemplate {
  id: string;
  name: string;
  description: string;
  schedule: string;
  tags: string[];
  active: boolean;
}

export const TaskInput: React.FC<TaskInputProps> = ({ onTaskAdd, onTasksAdd, defaultTaskType, simplifiedView }) => {
  const [taskName, setTaskName] = useState('');
  const [taskType, setTaskType] = useState<Task['taskType']>(defaultTaskType || 'regular');
  const [isAddingMultiple, setIsAddingMultiple] = useState(false);
  const [multipleTasksInput, setMultipleTasksInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { forceTaskUpdate } = useTaskEvents();
  
  // Habit Template
  const [open, setOpen] = React.useState(false)
  const [selectedTemplate, setSelectedTemplate] = React.useState<HabitTemplate | null>(null)
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [templateSchedule, setTemplateSchedule] = useState('');
  const [templateTags, setTemplateTags] = useState<string[]>([]);
  const [templateActive, setTemplateActive] = useState(true);
  const [templateId, setTemplateId] = useState(uuidv4());
  const [isNewTemplate, setIsNewTemplate] = useState(true);
  
  // Habit Schedule
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  
  // Tags
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [availableTags, setAvailableTags] = useState(['Work', 'Personal', 'Health', 'Finance']);
  
  // Task Relationships
  const [habitId, setHabitId] = useState<string | null>(null);
  const [checklistId, setChecklistId] = useState<string | null>(null);
  
  // Task Context
  const { items: tasks } = useTaskContext();
  
  // Task Manager
  const { createTask, updateTask, deleteTask } = useTaskManager();
  
  // Event Handlers
  useEvent('task:create', (task: Task) => {
    console.log('Task created:', task);
  });
  
  useEvent('task:update', (data: { taskId: string; updates: Partial<Task> }) => {
    console.log('Task updated:', data);
  });
  
  useEvent('task:delete', (data: { taskId: string }) => {
    console.log('Task deleted:', data);
  });
  
  // Task Input Handlers
  const handleTaskNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaskName(e.target.value);
  };
  
  const handleTaskTypeChange = (value: string) => {
    setTaskType(value as Task['taskType']);
  };
  
  const handleMultipleTasksInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMultipleTasksInput(e.target.value);
  };
  
  // Task Creation Handlers
  const handleAddTask = () => {
    if (!taskName.trim()) {
      toast({
        title: "Error",
        description: "Task name cannot be empty.",
        duration: 3000,
      });
      return;
    }
    
    const newTask: Task = {
      id: uuidv4(),
      name: taskName,
      taskType: taskType || 'regular',
      completed: false,
      createdAt: new Date().toISOString(),
      tags: tags.map(tag => ({ id: uuidv4(), name: tag })),
      relationships: {
        habitId: habitId || undefined,
        date: date ? date.toISOString() : undefined
      }
    };
    
    onTaskAdd(newTask);
    setTaskName('');
    setTags([]);
    setHabitId(null);
    
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  const handleAddMultipleTasks = () => {
    if (!multipleTasksInput.trim()) {
      toast({
        title: "Error",
        description: "Multiple tasks input cannot be empty.",
        duration: 3000,
      })
      return;
    }
    
    const taskNames = multipleTasksInput.split('\n').filter(name => name.trim() !== '');
    const newTasks: Task[] = taskNames.map(name => ({
      id: uuidv4(),
      name: name.trim(),
      taskType: taskType || 'regular',
      completed: false,
      createdAt: new Date().toISOString(), // Fixed: Convert Date to string
      tags: tags.map(tag => ({ id: uuidv4(), name: tag })), // Fixed: Convert string[] to Tag[]
      relationships: {
        habitId: habitId || undefined,
        date: date ? date.toISOString() : undefined
      }
    }));
    
    // Call the onTasksAdd prop to add the tasks to the parent component's state
    onTasksAdd(newTasks);
    
    // Clear the input field
    setMultipleTasksInput('');
    setIsAddingMultiple(false);
    setTags([]);
    setHabitId(null);
    setChecklistId(null);
  };
  
  // Tag Handlers
  const handleTagAdd = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };
  
  const handleTagRemove = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  // Habit Template Handlers
  const handleTemplateSelect = (template: HabitTemplate) => {
    setSelectedTemplate(template);
    setTemplateName(template.name);
    setTemplateDescription(template.description);
    setTemplateSchedule(template.schedule);
    setTemplateTags(template.tags);
    setTemplateActive(template.active);
    setTemplateId(template.id);
    setIsNewTemplate(false);
  };
  
  const handleTemplateCreate = () => {
    setTemplateName('');
    setTemplateDescription('');
    setTemplateSchedule('');
    setTemplateTags([]);
    setTemplateActive(true);
    setTemplateId(uuidv4());
    setIsNewTemplate(true);
    setOpen(true);
  };
  
  const handleTemplateSave = () => {
    const newTemplate: HabitTemplate = {
      id: templateId,
      name: templateName,
      description: templateDescription,
      schedule: templateSchedule,
      tags: templateTags,
      active: templateActive,
    };
    
    if (isNewTemplate) {
      eventManager.emit('habit:template-add' as TimerEventType, newTemplate);
      toast({
        title: "Success",
        description: "Habit template created.",
        duration: 3000,
      });
    } else {
      eventManager.emit('habit:template-update' as TimerEventType, newTemplate);
      toast({
        title: "Success",
        description: "Habit template updated.",
        duration: 3000,
      });
    }
    
    setOpen(false);
  };
  
  const handleTemplateDelete = () => {
    if (selectedTemplate) {
      console.log('Deleting template:', selectedTemplate);
      eventManager.emit('habit:template-delete', { templateId: selectedTemplate.id });
      setOpen(false);
      toast({
        title: "Success",
        description: "Habit template deleted.",
        duration: 3000,
      });
    }
  };
  
  // Habit Schedule Handlers
  const handleDateSelect = (date: Date | undefined) => {
    setDate(date);
  };
  
  // Task Relationship Handlers
  const handleHabitSelect = (habitId: string | null) => {
    setHabitId(habitId);
  };
  
  const handleChecklistSelect = (checklistId: string | null) => {
    setChecklistId(checklistId);
  };
  
  // UI Rendering
  return (
    <div className="flex flex-col gap-2">
      {/* Task Input */}
      <div className="flex items-center gap-2">
        <Input
          type="text"
          placeholder="Enter task name"
          value={taskName}
          onChange={handleTaskNameChange}
          ref={inputRef}
          className="flex-grow"
        />
        <Select onValueChange={handleTaskTypeChange} defaultValue={taskType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select task type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="regular">Regular</SelectItem>
            <SelectItem value="timer">Timer</SelectItem>
            <SelectItem value="screenshot">Screenshot</SelectItem>
            <SelectItem value="habit">Habit</SelectItem>
            <SelectItem value="journal">Journal</SelectItem>
            <SelectItem value="checklist">Checklist</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleAddTask}>Add Task</Button>
      </div>
      
      {/* Multiple Tasks Input Toggle */}
      <Button variant="outline" size="sm" onClick={() => setIsAddingMultiple(!isAddingMultiple)}>
        {isAddingMultiple ? 'Hide Multiple Tasks Input' : 'Add Multiple Tasks'}
      </Button>
      
      {/* Multiple Tasks Input */}
      {isAddingMultiple && (
        <div className="flex flex-col gap-2">
          <Textarea
            placeholder="Enter multiple tasks, each on a new line"
            value={multipleTasksInput}
            onChange={handleMultipleTasksInputChange}
            className="flex-grow"
          />
          <Button onClick={handleAddMultipleTasks}>Add Multiple Tasks</Button>
        </div>
      )}
      
      {/* Tags Input */}
      <div className="flex items-center gap-2">
        <Input
          type="text"
          placeholder="Enter tag name"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          className="flex-grow"
        />
        <Button onClick={handleTagAdd}>Add Tag</Button>
      </div>
      
      {/* Tags Display */}
      <div className="flex items-center gap-2">
        {tags.map(tag => (
          <Badge key={tag} variant="secondary" className="flex items-center gap-1">
            {tag}
            <button onClick={() => handleTagRemove(tag)} className="hover:text-destructive">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="M6 6 18 18"/></svg>
            </button>
          </Badge>
        ))}
      </div>
      
      {/* Habit Template */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Open Habit Template</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Habit Template</DialogTitle>
            <DialogDescription>
              Create or update a habit template.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" value={templateName} className="col-span-3" onChange={(e) => setTemplateName(e.target.value)} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea id="description" value={templateDescription} className="col-span-3" onChange={(e) => setTemplateDescription(e.target.value)} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="schedule" className="text-right">
                Schedule
              </Label>
              <Input id="schedule" value={templateSchedule} className="col-span-3" onChange={(e) => setTemplateSchedule(e.target.value)} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tags" className="text-right">
                Tags
              </Label>
              <Input id="tags" value={templateTags.join(',')} className="col-span-3" onChange={(e) => setTemplateTags(e.target.value.split(','))} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="active" className="text-right">
                Active
              </Label>
              <Checkbox 
                id="active" 
                checked={templateActive} 
                onCheckedChange={(checked) => setTemplateActive(checked === true)}
              />
            </div>
          </div>
          <div className="flex justify-between">
            <Button variant="destructive" onClick={handleTemplateDelete}>Delete</Button>
            <Button type="submit" onClick={handleTemplateSave}>
              Save changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Habit Schedule */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[280px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="center">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            disabled={(date) =>
              date > new Date() || date < new Date("1900-01-01")
            }
            initialFocus
          />
        </PopoverContent>
      </Popover>
      
      {/* Task Relationships */}
      <div className="flex items-center gap-2">
        <Select onValueChange={(value) => handleHabitSelect(value ? value : null)} defaultValue={habitId || ''}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select habit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">None</SelectItem>
            {tasks.filter(task => task.taskType === 'habit').map(habit => (
              <SelectItem key={habit.id} value={habit.id}>{habit.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

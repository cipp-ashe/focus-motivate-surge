
import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Task, TaskType } from '@/types/tasks';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Upload, Send, Plus } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { TagInputSection } from './inputs/TagInputSection';
import { DatePickerSection } from './inputs/DatePickerSection';
import { HabitRelationshipSelector } from './inputs/HabitRelationshipSelector';
import { MultipleTasksInput } from './inputs/MultipleTasksInput';
import { HabitTemplateDialog } from './inputs/HabitTemplateDialog';
import { useTaskContext } from '@/contexts/tasks/TaskContext';
import { useTaskEvents } from '@/hooks/tasks/useTaskEvents';
import { eventBus } from '@/lib/eventBus';
import { TaskTypeSelector } from './TaskTypeSelector';

interface TaskInputProps {
  onTaskAdd: (task: Task) => void;
  onTasksAdd: (tasks: Task[]) => void;
  defaultTaskType?: TaskType;
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

export const TaskInput: React.FC<TaskInputProps> = ({ 
  onTaskAdd, 
  onTasksAdd, 
  defaultTaskType, 
  simplifiedView 
}) => {
  const [taskName, setTaskName] = useState('');
  const [taskType, setTaskType] = useState<TaskType>(defaultTaskType || 'regular');
  const [isAddingMultiple, setIsAddingMultiple] = useState(false);
  const [multipleTasksInput, setMultipleTasksInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { forceTaskUpdate } = useTaskEvents();
  
  // Tags state
  const [tags, setTags] = useState<string[]>([]);
  
  // Date state
  const [date, setDate] = useState<Date | undefined>(new Date())
  
  // Habit relationship state
  const [habitId, setHabitId] = useState<string | null>(null);
  
  // Template dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [templateData, setTemplateData] = useState<HabitTemplate>({
    id: uuidv4(),
    name: '',
    description: '',
    schedule: '',
    tags: [],
    active: true
  });
  const [isNewTemplate, setIsNewTemplate] = useState(true);
  
  // Task Context for getting habit tasks
  const { items: tasks } = useTaskContext();
  
  // Task Input Handlers
  const handleTaskNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaskName(e.target.value);
  };
  
  const handleTaskTypeChange = (value: string) => {
    setTaskType(value as TaskType);
  };
  
  const handleMultipleTasksInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMultipleTasksInput(e.target.value);
  };
  
  // Tag handlers
  const handleAddTag = (newTag: string) => {
    setTags([...tags, newTag]);
  };
  
  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };
  
  // Task Creation Handlers
  const handleAddTask = () => {
    if (!taskName.trim()) {
      toast.error("Task name cannot be empty.", {
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
      toast.error("Multiple tasks input cannot be empty.", {
        duration: 3000,
      });
      return;
    }
    
    const taskNames = multipleTasksInput.split('\n').filter(name => name.trim() !== '');
    const newTasks: Task[] = taskNames.map(name => ({
      id: uuidv4(),
      name: name.trim(),
      taskType: taskType || 'regular',
      completed: false,
      createdAt: new Date().toISOString(),
      tags: tags.map(tag => ({ id: uuidv4(), name: tag })),
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
  };
  
  // Habit Template Handlers
  const handleTemplateSave = () => {
    const newTemplate: HabitTemplate = {
      id: templateData.id,
      name: templateData.name,
      description: templateData.description,
      schedule: templateData.schedule,
      tags: templateData.tags,
      active: templateData.active,
    };
    
    if (isNewTemplate) {
      eventBus.emit('habit:template-add' as any, newTemplate);
      toast.success("Habit template created.", {
        duration: 3000,
      });
    } else {
      eventBus.emit('habit:template-update' as any, newTemplate);
      toast.success("Habit template updated.", {
        duration: 3000,
      });
    }
    
    setDialogOpen(false);
  };
  
  const handleTemplateDelete = () => {
    console.log('Deleting template:', templateData);
    eventBus.emit('habit:template-delete' as any, { templateId: templateData.id });
    setDialogOpen(false);
    toast.success("Habit template deleted.", {
      duration: 3000,
    });
  };
  
  const handleTemplateCreate = () => {
    setTemplateData({
      id: uuidv4(),
      name: '',
      description: '',
      schedule: '',
      tags: [],
      active: true
    });
    setIsNewTemplate(true);
    setDialogOpen(true);
  };
  
  // UI Rendering for simplified view (Timer page)
  if (simplifiedView) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Add a timer task"
            value={taskName}
            onChange={handleTaskNameChange}
            ref={inputRef}
            className="flex-grow"
          />
          <Button onClick={handleAddTask}>Add Timer</Button>
        </div>
      </div>
    );
  }
  
  // UI Rendering for full view with improved styling
  return (
    <div className="flex flex-col gap-4 bg-background/80 p-4 rounded-xl shadow-sm border border-border/30">
      {/* Main Task Input Row */}
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Enter task name"
          value={taskName}
          onChange={handleTaskNameChange}
          ref={inputRef}
          className="flex-grow bg-background/50 border-input/50 focus-visible:border-primary"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleAddTask();
            }
          }}
        />
        
        <div className="flex-shrink-0 w-[140px]">
          <TaskTypeSelector 
            value={taskType} 
            onChange={handleTaskTypeChange} 
          />
        </div>
        
        <Button 
          onClick={handleAddTask}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          size="icon"
        >
          <Send size={18} />
        </Button>
        
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => setIsAddingMultiple(!isAddingMultiple)}
          title="Bulk Import Tasks"
          className="border-input/50 hover:bg-accent"
        >
          <Upload size={18} />
        </Button>
      </div>
      
      {/* Tags Component */}
      <TagInputSection 
        tags={tags}
        onAddTag={handleAddTag}
        onRemoveTag={handleRemoveTag}
      />
      
      {/* Multiple Tasks Input */}
      {isAddingMultiple && (
        <MultipleTasksInput
          value={multipleTasksInput}
          onChange={handleMultipleTasksInputChange}
          onSubmit={handleAddMultipleTasks}
          onCancel={() => setIsAddingMultiple(false)}
        />
      )}
      
      {/* Task Settings Row */}
      <div className="flex flex-wrap gap-2 items-center">
        {/* Date Picker Component */}
        <DatePickerSection 
          date={date} 
          onDateSelect={setDate} 
        />
        
        {/* Habit Relationship Selector Component */}
        <HabitRelationshipSelector
          habitId={habitId}
          onHabitSelect={(value) => setHabitId(value)}
          habitTasks={tasks.filter(task => task.taskType === 'habit')}
        />
      </div>
      
      {/* Habit Template Dialog */}
      <HabitTemplateDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        template={templateData}
        isNewTemplate={isNewTemplate}
        onNameChange={(name) => setTemplateData({...templateData, name})}
        onDescriptionChange={(description) => setTemplateData({...templateData, description})}
        onScheduleChange={(schedule) => setTemplateData({...templateData, schedule})}
        onTagsChange={(tags) => setTemplateData({...templateData, tags})}
        onActiveChange={(active) => setTemplateData({...templateData, active})}
        onSave={handleTemplateSave}
        onDelete={handleTemplateDelete}
      />
    </div>
  );
};

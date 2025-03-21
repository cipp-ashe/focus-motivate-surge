
import React from 'react';
import { Task, TaskType } from '@/types/tasks';
import { TagInputSection } from './inputs/TagInputSection';
import { MultipleTasksInput } from './inputs/MultipleTasksInput';
import { HabitTemplateDialog } from './inputs/HabitTemplateDialog';
import { useTaskContext } from '@/contexts/tasks/TaskContext';
import { useTaskEvents } from '@/hooks/tasks/useTaskEvents';
import { TaskInputRow } from './inputs/TaskInputRow';
import { useTaskCreation } from './hooks/useTaskCreation';
import { useTemplateManagement } from './hooks/useTemplateManagement';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface TaskInputProps {
  onTaskAdd: (task: Task) => void;
  onTasksAdd: (tasks: Task[]) => void;
  defaultTaskType?: TaskType;
  simplifiedView?: boolean;
}

export const TaskInput: React.FC<TaskInputProps> = ({ 
  onTaskAdd, 
  onTasksAdd, 
  defaultTaskType, 
  simplifiedView 
}) => {
  const { toast } = useToast();
  const { forceTaskUpdate } = useTaskEvents();
  
  // Task Context for getting habit tasks
  const { items: tasks } = useTaskContext();
  
  // Use our custom hooks
  const {
    taskName,
    taskType,
    isAddingMultiple,
    multipleTasksInput,
    tags,
    handleTaskNameChange,
    handleTaskTypeChange,
    handleMultipleTasksInputChange,
    handleAddTag,
    handleRemoveTag,
    handleAddTask,
    handleAddMultipleTasks,
    toggleMultipleInput
  } = useTaskCreation({ onTaskAdd, onTasksAdd, defaultTaskType });
  
  const {
    dialogOpen,
    setDialogOpen,
    templateData,
    setTemplateData,
    isNewTemplate,
    handleTemplateSave,
    handleTemplateDelete,
    handleTemplateCreate
  } = useTemplateManagement();
  
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
            className="flex-grow bg-[#1A1F2C]/60 dark:bg-[#1A1F2C] border-[#6E59A5]/30 text-foreground"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAddTask();
              }
            }}
          />
          <Button 
            onClick={handleAddTask}
            variant="default"
            className="bg-[#9b87f5] text-white hover:bg-[#7E69AB]"
          >
            Add Timer
          </Button>
        </div>
      </div>
    );
  }
  
  // UI Rendering for full view with improved styling
  return (
    <div className="flex flex-col gap-4">
      {/* Main Task Input Row */}
      <TaskInputRow
        taskName={taskName}
        taskType={taskType}
        onTaskNameChange={handleTaskNameChange}
        onTaskTypeChange={handleTaskTypeChange}
        onAddTask={handleAddTask}
        onToggleMultipleInput={toggleMultipleInput}
      />
      
      {/* Tags Component - only show if user has started typing */}
      {taskName.trim().length > 0 && (
        <TagInputSection 
          tags={tags}
          onAddTag={handleAddTag}
          onRemoveTag={handleRemoveTag}
        />
      )}
      
      {/* Multiple Tasks Input */}
      {isAddingMultiple && (
        <MultipleTasksInput
          value={multipleTasksInput}
          onChange={handleMultipleTasksInputChange}
          onSubmit={handleAddMultipleTasks}
          onCancel={() => toggleMultipleInput()}
        />
      )}
      
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

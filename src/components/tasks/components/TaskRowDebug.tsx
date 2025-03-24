import React, { useState, useEffect } from "react";
import { Task } from "@/types/tasks";
import { eventManager } from "@/lib/events/EventManager";
import { Card } from "@/components/ui/card";
import { TaskContent } from "./TaskContent";
import { useDataFlow } from "@/hooks/debug/useDataFlow";
import { usePerformance } from "@/hooks/debug/usePerformance";
import { useStateTracking } from "@/hooks/debug/useStateTracking";
import { useValidation } from "@/hooks/debug/useValidation";

/**
 * Props for the TaskRow component with debug validation
 */
interface TaskRowProps {
  /** The task this row represents */
  task: Task;
  /** Whether this task is currently selected */
  isSelected: boolean;
  /** ID of the task currently being edited, if any */
  editingTaskId: string | null;
  /** Callback when the task is clicked */
  onTaskClick: (task: Task, event: React.MouseEvent<HTMLDivElement>) => void;
  /** Callback when the task is deleted */
  onTaskDelete: (taskId: string) => void;
  /** Callback when the task duration is changed */
  onDurationChange: (taskId: string, newDuration: string) => void;
  /** Callback when the duration element is clicked */
  onDurationClick: (e: React.MouseEvent<HTMLElement>, taskId: string) => void;
  /** Callback when an input field loses focus */
  onInputBlur: () => void;
  /** Dialog openers for specific task types */
  dialogOpeners?: {
    checklist: (taskId: string, taskName: string, items: any[]) => void;
    journal: (taskId: string, taskName: string, entry: string) => void;
    screenshot: (imageUrl: string, taskName: string) => void;
    voicenote: (taskId: string, taskName: string) => void;
  };
}

/**
 * A component that renders a single task row with comprehensive debug instrumentation
 */
export const TaskRowDebug: React.FC<TaskRowProps> = (props) => {
  const {
    task,
    isSelected,
    editingTaskId,
    onTaskClick,
    onTaskDelete,
    onDurationChange,
    onDurationClick,
    onInputBlur,
    dialogOpeners,
  } = props;

  // Initialize data tracing
  const dataFlow = useDataFlow(props, {
    module: 'tasks',
    component: `TaskRow:${task.id.slice(0, 6)}`,
    traceProps: true
  });
  
  // Initialize performance measurement
  const { measureFunction } = usePerformance({
    module: 'tasks',
    component: `TaskRow:${task.id.slice(0, 6)}`,
    trackRenders: true
  });
  
  // Data validation
  const { validate, assert, checkNullOrUndefined } = useValidation({
    module: 'tasks',
    component: `TaskRow:${task.id.slice(0, 6)}`
  });
  
  // Validate task data
  useEffect(() => {
    validate(task, ['id', 'name', 'taskType']);
    
    // Verify task has valid structure
    if (task) {
      assert(
        typeof task.id === 'string' && task.id.length > 0,
        'Task ID must be a non-empty string',
        { taskId: task.id }
      );
      
      assert(
        typeof task.name === 'string',
        'Task name must be a string',
        { taskName: task.name }
      );
    }
  }, [task, validate, assert]);

  const durationInMinutes = Math.round(Number(task.duration || 1500) / 60);
  const [inputValue, setInputValue] = useState(durationInMinutes.toString());

  // Track state changes
  useStateTracking('inputValue', inputValue, {
    module: 'tasks',
    component: `TaskRow:${task.id.slice(0, 6)}`
  });
  
  useStateTracking('isSelected', isSelected, {
    module: 'tasks',
    component: `TaskRow:${task.id.slice(0, 6)}`
  });

  // Update input value when task duration changes
  useEffect(() => {
    dataFlow.traceEvent('taskDurationUpdated', { 
      taskId: task.id, 
      newDuration: task.duration,
      durationInMinutes 
    });
    
    if (task.duration) {
      const minutes = Math.round(task.duration / 60);
      setInputValue(minutes.toString());
    }
  }, [task.duration, task.id]);

  // Prevent click events from bubbling up from interactive elements
  const preventPropagation = measureFunction('preventPropagation', 
    (e: React.MouseEvent | React.TouchEvent) => {
      e.stopPropagation();
    }
  );

  // Handle key down in input fields
  const handleKeyDown = measureFunction('handleKeyDown',
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      dataFlow.traceEvent('keyDown', { key: e.key });
      
      if (e.key === 'Enter') {
        handleBlur();
      }
      e.stopPropagation();
    }
  );

  // Handle changes to input values
  const handleChange = measureFunction('handleChange',
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      
      dataFlow.traceEvent('inputChanged', { 
        prevValue: inputValue, 
        newValue: value 
      });
      
      // Only allow numeric input
      if (value === '' || /^\d+$/.test(value)) {
        setInputValue(value);
      }
    }
  );

  // Handle input blur events
  const handleBlur = measureFunction('handleBlur', () => {
    const numValue = parseInt(inputValue, 10);
    let finalValue = inputValue;
    
    dataFlow.traceEvent('inputBlur', { 
      inputValue, 
      numValue,
      isValid: !isNaN(numValue) && numValue >= 1 && numValue <= 60
    });
    
    // Validate input value
    if (isNaN(numValue) || numValue < 1) {
      finalValue = '25'; // Default to 25 minutes if invalid
    } else if (numValue > 60) {
      finalValue = '60'; // Cap at 60 minutes
    }
    
    setInputValue(finalValue);
    
    // Convert minutes to seconds and update task
    const newDurationInSeconds = (parseInt(finalValue) * 60).toString();
    
    eventManager.emit('task:update', {
      taskId: task.id,
      updates: { duration: parseInt(newDurationInSeconds) }
    });
    
    onInputBlur();
  });

  // Handle task deletion
  const handleDelete = measureFunction('handleDelete',
    (e: React.MouseEvent | React.TouchEvent) => {
      dataFlow.traceEvent('deleteRequested', { taskId: task.id });
      
      e.stopPropagation();
      e.preventDefault();
      eventManager.emit('task:delete', { taskId: task.id, reason: 'manual' });
    }
  );

  // Handle task actions
  const handleTaskAction = measureFunction('handleTaskAction',
    (e: React.MouseEvent<HTMLElement>, actionType?: string) => {
      dataFlow.traceEvent('taskAction', { 
        action: actionType, 
        taskId: task.id 
      });
      
      e.stopPropagation();
      if (actionType === 'complete') {
        eventManager.emit('task:complete', { taskId: task.id });
      } else if (actionType === 'uncomplete') {
        eventManager.emit('task:update', { 
          taskId: task.id, 
          updates: { completed: false, completedAt: null } 
        });
      } else if (actionType === 'delete') {
        handleDelete(e);
      }
    }
  );

  // Handle clicks on the task row
  const handleTaskClick = measureFunction('handleTaskClick',
    (e: React.MouseEvent<HTMLDivElement>) => {
      const start = performance.now();
      
      // Check for clicks on interactive elements to prevent task selection
      const target = e.target as HTMLElement;
      const isInteractive = 
        target.tagName === 'BUTTON' || 
        target.closest('button') || 
        target.tagName === 'INPUT' || 
        target.closest('input') ||
        target.getAttribute('role') === 'button' ||
        target.getAttribute('data-action') === 'true' ||
        target.closest('[data-action="true"]');
      
      dataFlow.traceEvent('taskClicked', { 
        taskId: task.id,
        isInteractive,
        targetElement: target.tagName,
        taskType: task.taskType
      });
      
      if (isInteractive) {
        e.stopPropagation();
        return;
      }
      
      // Special handling for journal and checklist tasks
      if ((task.taskType === 'journal' || task.taskType === 'checklist') && !isSelected) {
        e.stopPropagation();
        
        // Select the task without triggering conversion
        eventManager.emit('task:select', task.id);
        return;
      }
      
      onTaskClick(task, e);
      
      const end = performance.now();
      dataFlow.traceEvent('taskClickComplete', { duration: end - start });
    }
  );

  return (
    <Card
      className={`
        relative cursor-pointer transition-all duration-300 group overflow-visible
        ${isSelected 
          ? 'bg-accent/20 border-primary/40 shadow-lg shadow-primary/5' 
          : 'bg-card/40 border-primary/10 hover:border-primary/30 hover:bg-accent/10 hover:shadow-md hover:scale-[1.01]'
        }
      `}
      onClick={handleTaskClick}
      data-task-id={task.id}
      data-task-type={task.taskType}
    >
      <TaskContent
        task={task}
        isSelected={isSelected}
        onSelect={() => handleTaskClick as any}
        editingTaskId={editingTaskId}
        inputValue={inputValue}
        onDelete={handleDelete}
        onDurationClick={(e) => onDurationClick(e, task.id)}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        preventPropagation={preventPropagation}
        dialogOpeners={dialogOpeners}
        handleTaskAction={handleTaskAction}
      />
    </Card>
  );
};

export default TaskRowDebug;

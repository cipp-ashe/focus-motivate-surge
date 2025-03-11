
import React, { useEffect, useRef, useState } from 'react';
import TaskManager from '@/components/tasks/TaskManager';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/ui/useIsMobile';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ChecklistItem, Task } from '@/types/tasks';
import { X, Plus, Save } from 'lucide-react';
import { eventBus } from '@/lib/eventBus';
import { v4 as uuidv4 } from 'uuid';

const TaskPage = () => {
  // Keep track of mounted state to prevent callbacks on unmounted component
  const isMounted = useRef(true);
  const isMobile = useIsMobile();
  
  // State for checklist management
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);
  const [currentChecklistTask, setCurrentChecklistTask] = useState<{
    taskId: string;
    taskName: string;
    items: ChecklistItem[];
  } | null>(null);
  const [newItemText, setNewItemText] = useState('');
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  
  // Set up event listeners for task actions with proper cleanup
  useEffect(() => {
    const handleShowImage = (event: Event) => {
      if (!isMounted.current) return;
      
      const customEvent = event as CustomEvent;
      const { imageUrl, taskName } = customEvent.detail;
      
      toast.info(`Viewing image for: ${taskName}`, {
        description: "Image viewer functionality is not yet implemented"
      });
    };
    
    const handleOpenChecklist = (event: Event) => {
      if (!isMounted.current) return;
      
      const customEvent = event as CustomEvent;
      const { taskId, taskName, items } = customEvent.detail;
      
      console.log('Tasks.tsx - Received open-checklist event:', { taskId, taskName, items });
      
      // Set current checklist task and open the sheet
      setCurrentChecklistTask({
        taskId,
        taskName,
        items: Array.isArray(items) ? items : []
      });
      setChecklistItems(Array.isArray(items) ? items : []);
      setIsChecklistOpen(true);
    };
    
    const handleOpenVoiceRecorder = (event: Event) => {
      if (!isMounted.current) return;
      
      const customEvent = event as CustomEvent;
      const { taskId, taskName } = customEvent.detail;
      
      toast.info(`Recording for: ${taskName}`, {
        description: "Voice recorder functionality is not yet implemented"
      });
    };
    
    console.log('Tasks.tsx - Setting up event listeners');
    
    // Add event listeners
    window.addEventListener('show-image', handleShowImage);
    window.addEventListener('open-checklist', handleOpenChecklist);
    window.addEventListener('open-voice-recorder', handleOpenVoiceRecorder);
    
    // Cleanup
    return () => {
      isMounted.current = false;
      window.removeEventListener('show-image', handleShowImage);
      window.removeEventListener('open-checklist', handleOpenChecklist);
      window.removeEventListener('open-voice-recorder', handleOpenVoiceRecorder);
    };
  }, []); // Empty dependency array ensures this only runs once

  // Add a new checklist item
  const handleAddItem = () => {
    if (!newItemText.trim()) return;
    
    const newItem: ChecklistItem = {
      id: uuidv4(),
      text: newItemText.trim(),
      completed: false
    };
    
    console.log('Adding new checklist item:', newItem);
    setChecklistItems([...checklistItems, newItem]);
    setNewItemText('');
  };

  // Toggle item completion status
  const toggleItemCompletion = (itemId: string) => {
    console.log('Toggling item completion:', itemId);
    setChecklistItems(
      checklistItems.map(item => 
        item.id === itemId 
          ? { ...item, completed: !item.completed }
          : item
      )
    );
  };

  // Delete a checklist item
  const deleteItem = (itemId: string) => {
    console.log('Deleting checklist item:', itemId);
    setChecklistItems(checklistItems.filter(item => item.id !== itemId));
  };

  // Save checklist items to the task
  const saveChecklist = () => {
    if (currentChecklistTask) {
      console.log('Saving checklist items for task:', {
        taskId: currentChecklistTask.taskId,
        items: checklistItems
      });
      
      eventBus.emit('task:update', {
        taskId: currentChecklistTask.taskId,
        updates: { 
          checklistItems: checklistItems,
          taskType: 'checklist' // Ensure task type is set to checklist
        }
      });
      
      toast.success(`Saved checklist for: ${currentChecklistTask.taskName}`);
      setIsChecklistOpen(false);
    }
  };

  // Handle key press in the new item input
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddItem();
    }
  };

  return (
    <div className={`container mx-auto ${isMobile ? 'p-2' : 'py-3 px-4 sm:py-5 sm:px-6'} max-w-6xl`}>
      <h1 className={`${isMobile ? 'text-xl mb-2' : 'text-2xl sm:text-3xl mb-3 sm:mb-5'} font-bold text-primary`}>
        Task Manager
      </h1>
      <TaskManager />
      
      {/* Checklist Sheet */}
      <Sheet 
        open={isChecklistOpen} 
        onOpenChange={(open) => {
          console.log('Sheet open state changed:', open);
          setIsChecklistOpen(open);
        }}
      >
        <SheetContent className="w-full md:max-w-md overflow-y-auto">
          <SheetHeader className="mb-4">
            <SheetTitle>{currentChecklistTask?.taskName || 'Checklist'}</SheetTitle>
          </SheetHeader>
          
          {/* Add new item input */}
          <div className="flex gap-2 mb-6">
            <Input
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              placeholder="Add new item..."
              className="flex-1"
              onKeyDown={handleKeyPress}
              autoFocus
            />
            <Button onClick={handleAddItem}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Checklist items */}
          <div className="space-y-2">
            {checklistItems.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No checklist items yet. Add some above!
              </p>
            ) : (
              checklistItems.map(item => (
                <div key={item.id} className="flex items-center gap-2 p-2 border rounded-md">
                  <Checkbox 
                    id={`item-${item.id}`}
                    checked={item.completed}
                    onCheckedChange={() => toggleItemCompletion(item.id)}
                  />
                  <label 
                    htmlFor={`item-${item.id}`}
                    className={`flex-1 cursor-pointer ${item.completed ? 'line-through text-muted-foreground' : ''}`}
                  >
                    {item.text}
                  </label>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => deleteItem(item.id)}
                    className="h-7 w-7 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
          
          {/* Save button */}
          <div className="mt-6">
            <Button onClick={saveChecklist} className="w-full">
              <Save className="h-4 w-4 mr-2" /> Save Checklist
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default TaskPage;

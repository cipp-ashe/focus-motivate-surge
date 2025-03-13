
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ChecklistItem } from '@/types/tasks';
import { X, Plus, Save } from 'lucide-react';
import { eventBus } from '@/lib/eventBus';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

interface ChecklistSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentTask: {
    taskId: string;
    taskName: string;
    items: ChecklistItem[];
  } | null;
}

export const ChecklistSheet: React.FC<ChecklistSheetProps> = ({
  isOpen,
  onOpenChange,
  currentTask
}) => {
  const [newItemText, setNewItemText] = useState('');
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);

  // Set items when the current task changes
  React.useEffect(() => {
    if (currentTask) {
      setChecklistItems(Array.isArray(currentTask.items) ? currentTask.items : []);
    }
  }, [currentTask]);

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

  const deleteItem = (itemId: string) => {
    console.log('Deleting checklist item:', itemId);
    setChecklistItems(checklistItems.filter(item => item.id !== itemId));
  };

  const saveChecklist = () => {
    if (currentTask) {
      console.log('Saving checklist items for task:', {
        taskId: currentTask.taskId,
        items: checklistItems
      });
      
      eventBus.emit('task:update', {
        taskId: currentTask.taskId,
        updates: { 
          checklistItems: checklistItems,
          taskType: 'checklist' 
        }
      });
      
      toast.success(`Saved checklist for: ${currentTask.taskName}`);
      onOpenChange(false);
    }
  };

  const handleSheetOpenChange = (open: boolean) => {
    console.log('Checklist sheet open state changed:', open, 'current:', isOpen);
    if (!open && isOpen) {
      saveChecklist();
    }
    onOpenChange(open);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddItem();
    }
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Sheet 
      open={isOpen} 
      onOpenChange={handleSheetOpenChange}
    >
      <SheetContent className="w-full md:max-w-md overflow-y-auto" side="right">
        <SheetHeader className="mb-4 flex justify-between items-center relative">
          <SheetTitle>{currentTask?.taskName || 'Checklist'}</SheetTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleClose}
            className="absolute right-4 top-0"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </SheetHeader>
        
        <div className="flex gap-2 mb-6">
          <Input
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            placeholder="Add new item..."
            className="flex-1"
            onKeyDown={handleKeyPress}
            autoFocus
          />
          <Button onClick={handleAddItem} type="button">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
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
        
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={saveChecklist} className="w-full" type="button">
            <Save className="h-4 w-4 mr-2" /> Save Checklist
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

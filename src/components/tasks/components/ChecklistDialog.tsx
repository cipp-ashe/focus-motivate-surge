
import React, { useState, useEffect } from 'react';
import { Task, ChecklistItem } from '@/types/tasks';
import { eventBus } from '@/lib/eventBus';
import { toast } from 'sonner';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Edit, Save, X, Plus, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface ChecklistDialogProps {
  task: Task;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const ChecklistDialog: React.FC<ChecklistDialogProps> = ({
  task,
  isOpen,
  setIsOpen,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(task.name);
  const [editedItems, setEditedItems] = useState<ChecklistItem[]>(task.checklistItems || []);
  const [newItemText, setNewItemText] = useState('');

  useEffect(() => {
    if (isOpen) {
      setEditedName(task.name);
      setEditedItems(task.checklistItems || []);
      setIsEditing(false);
      setNewItemText('');
    }
  }, [isOpen, task.name, task.checklistItems]);

  const handleSaveEdit = () => {
    if (!editedName.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    const updates = {
      name: editedName.trim(),
      checklistItems: editedItems
    };

    eventBus.emit('task:update', { 
      taskId: task.id, 
      updates 
    });

    setIsEditing(false);
    toast.success('Checklist updated');
  };

  const handleCancelEdit = () => {
    setEditedName(task.name);
    setEditedItems(task.checklistItems || []);
    setIsEditing(false);
    setNewItemText('');
  };

  const handleAddItem = () => {
    if (!newItemText.trim()) return;
    
    const newItem: ChecklistItem = {
      id: uuidv4(),
      text: newItemText.trim(),
      completed: false
    };
    
    setEditedItems([...editedItems, newItem]);
    setNewItemText('');
  };

  const handleRemoveItem = (id: string) => {
    setEditedItems(editedItems.filter(item => item.id !== id));
  };

  const handleToggleItem = (id: string) => {
    setEditedItems(editedItems.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const handleItemTextChange = (id: string, text: string) => {
    setEditedItems(editedItems.map(item => 
      item.id === id ? { ...item, text } : item
    ));
  };

  // Calculate completion percentage
  const completedCount = editedItems.filter(item => item.completed).length;
  const totalCount = editedItems.length;
  const completionPercentage = totalCount > 0 
    ? Math.round((completedCount / totalCount) * 100) 
    : 0;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-col space-y-1.5 pb-2">
          {isEditing ? (
            <div className="space-y-2">
              <Input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                placeholder="Checklist name"
                className="font-medium"
                autoFocus
              />
            </div>
          ) : (
            <DialogTitle className="text-xl">{task.name}</DialogTitle>
          )}
          
          {/* Progress indicator */}
          {!isEditing && totalCount > 0 && (
            <div className="text-sm text-muted-foreground">
              {completedCount} of {totalCount} completed ({completionPercentage}%)
            </div>
          )}
          
          {/* Edit/Save buttons */}
          <div className="flex justify-end space-x-2 mt-2">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-8"
                  onClick={handleCancelEdit}
                >
                  <X className="h-3 w-3 mr-1" />
                  Cancel
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="text-xs h-8"
                  onClick={handleSaveEdit}
                >
                  <Save className="h-3 w-3 mr-1" />
                  Save
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-8"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="h-3 w-3 mr-1" />
                Edit
              </Button>
            )}
          </div>
        </DialogHeader>
        
        <div className="mt-4 space-y-4">
          {/* Checklist items */}
          <div className="space-y-2">
            {editedItems.length === 0 ? (
              <div className="text-center text-muted-foreground py-4">
                {isEditing ? 'Add items below' : 'No items in this checklist'}
              </div>
            ) : (
              editedItems.map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  <Checkbox 
                    checked={item.completed}
                    onCheckedChange={() => handleToggleItem(item.id)}
                    id={`item-${item.id}`}
                    disabled={!isEditing && task.completed}
                  />
                  {isEditing ? (
                    <div className="flex flex-1 items-center gap-2">
                      <Input
                        value={item.text}
                        onChange={(e) => handleItemTextChange(item.id, e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveItem(item.id)}
                        className="h-8 w-8 text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <label 
                      htmlFor={`item-${item.id}`}
                      className={`flex-1 ${item.completed ? 'line-through text-muted-foreground' : ''}`}
                    >
                      {item.text}
                    </label>
                  )}
                </div>
              ))
            )}
          </div>
          
          {/* Add new item form */}
          {isEditing && (
            <div className="flex items-center gap-2 mt-4">
              <Input
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                placeholder="Add new item"
                onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
              />
              <Button onClick={handleAddItem} size="sm" className="whitespace-nowrap">
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

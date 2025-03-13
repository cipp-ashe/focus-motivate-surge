
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
import { MarkdownEditor } from '@/components/ui/markdown-editor';

const TaskPage = () => {
  const isMounted = useRef(true);
  const isMobile = useIsMobile();
  
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);
  const [currentChecklistTask, setCurrentChecklistTask] = useState<{
    taskId: string;
    taskName: string;
    items: ChecklistItem[];
  } | null>(null);
  const [newItemText, setNewItemText] = useState('');
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  
  const [isJournalOpen, setIsJournalOpen] = useState(false);
  const [currentJournalTask, setCurrentJournalTask] = useState<{
    taskId: string;
    taskName: string;
    entry: string;
  } | null>(null);
  const [journalContent, setJournalContent] = useState('');
  
  useEffect(() => {
    const handleShowImage = (event: Event) => {
      if (!isMounted.current) return;
      
      const customEvent = event as CustomEvent;
      const { imageUrl, taskName } = customEvent.detail;
      
      toast.info(`Viewing image for: ${taskName}`, {
        description: "Image viewer functionality is not yet implemented"
      });
      
      console.log("Tasks.tsx - Received show-image event for:", taskName);
    };
    
    const handleOpenChecklist = (event: Event) => {
      if (!isMounted.current) return;
      
      const customEvent = event as CustomEvent;
      const { taskId, taskName, items } = customEvent.detail;
      
      console.log('Tasks.tsx - Received open-checklist event:', { taskId, taskName, items });
      
      setCurrentChecklistTask({
        taskId,
        taskName,
        items: Array.isArray(items) ? items : []
      });
      setChecklistItems(Array.isArray(items) ? items : []);
      setIsChecklistOpen(true);
      
      console.log('Tasks.tsx - Opened checklist for task:', taskName);
      toast.info(`Opening checklist for: ${taskName}`);
    };
    
    const handleOpenJournal = (event: Event) => {
      if (!isMounted.current) return;
      
      const customEvent = event as CustomEvent;
      const { taskId, taskName, entry } = customEvent.detail;
      
      console.log('Tasks.tsx - Received open-journal event:', { taskId, taskName, entry });
      
      setCurrentJournalTask({
        taskId,
        taskName,
        entry: entry || ''
      });
      setJournalContent(entry || '');
      setIsJournalOpen(true);
      
      console.log('Tasks.tsx - Opened journal for task:', taskName);
      toast.info(`Opening journal for: ${taskName}`);
    };
    
    const handleOpenVoiceRecorder = (event: Event) => {
      if (!isMounted.current) return;
      
      const customEvent = event as CustomEvent;
      const { taskId, taskName } = customEvent.detail;
      
      toast.info(`Recording for: ${taskName}`, {
        description: "Voice recorder functionality is not yet implemented"
      });
      
      console.log("Tasks.tsx - Received open-voice-recorder event for:", taskName);
    };
    
    const handleTaskUpdate = (event: Event) => {
      if (!isMounted.current) return;
      
      const customEvent = event as CustomEvent;
      const { taskId, updates } = customEvent.detail;
      
      console.log('Tasks.tsx - Received task-update event:', { taskId, updates });
      
      // Forward to eventBus
      eventBus.emit('task:update', { taskId, updates });
    };
    
    console.log('Tasks.tsx - Setting up event listeners');
    
    window.addEventListener('show-image', handleShowImage);
    window.addEventListener('open-checklist', handleOpenChecklist);
    window.addEventListener('open-journal', handleOpenJournal);
    window.addEventListener('open-voice-recorder', handleOpenVoiceRecorder);
    window.addEventListener('task-update', handleTaskUpdate);
    
    return () => {
      isMounted.current = false;
      window.removeEventListener('show-image', handleShowImage);
      window.removeEventListener('open-checklist', handleOpenChecklist);
      window.removeEventListener('open-journal', handleOpenJournal);
      window.removeEventListener('open-voice-recorder', handleOpenVoiceRecorder);
      window.removeEventListener('task-update', handleTaskUpdate);
    };
  }, []);
  
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
    if (currentChecklistTask) {
      console.log('Saving checklist items for task:', {
        taskId: currentChecklistTask.taskId,
        items: checklistItems
      });
      
      eventBus.emit('task:update', {
        taskId: currentChecklistTask.taskId,
        updates: { 
          checklistItems: checklistItems,
          taskType: 'checklist' 
        }
      });
      
      toast.success(`Saved checklist for: ${currentChecklistTask.taskName}`);
      setIsChecklistOpen(false);
    }
  };

  const saveJournal = () => {
    if (currentJournalTask) {
      console.log('Saving journal entry for task:', {
        taskId: currentJournalTask.taskId,
        entry: journalContent
      });
      
      eventBus.emit('task:update', {
        taskId: currentJournalTask.taskId,
        updates: { 
          journalEntry: journalContent,
          taskType: 'journal' 
        }
      });
      
      toast.success(`Saved journal entry for: ${currentJournalTask.taskName}`);
      setIsJournalOpen(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddItem();
    }
  };

  const handleChecklistSheetOpenChange = (open: boolean) => {
    console.log('Checklist sheet open state changed:', open, 'current:', isChecklistOpen);
    if (!open && isChecklistOpen) {
      saveChecklist();
    }
    setIsChecklistOpen(open);
  };

  const handleJournalSheetOpenChange = (open: boolean) => {
    console.log('Journal sheet open state changed:', open, 'current:', isJournalOpen);
    if (!open && isJournalOpen) {
      saveJournal();
    }
    setIsJournalOpen(open);
  };

  return (
    <div className={`container mx-auto ${isMobile ? 'p-2' : 'py-3 px-4 sm:py-5 sm:px-6'} max-w-6xl`}>
      <h1 className={`${isMobile ? 'text-xl mb-2' : 'text-2xl sm:text-3xl mb-3 sm:mb-5'} font-bold text-primary`}>
        Task Manager
      </h1>
      <TaskManager />
      
      <Sheet 
        open={isChecklistOpen} 
        onOpenChange={handleChecklistSheetOpenChange}
      >
        <SheetContent className="w-full md:max-w-md overflow-y-auto" side="right">
          <SheetHeader className="mb-4">
            <SheetTitle>{currentChecklistTask?.taskName || 'Checklist'}</SheetTitle>
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
          
          <div className="mt-6">
            <Button onClick={saveChecklist} className="w-full" type="button">
              <Save className="h-4 w-4 mr-2" /> Save Checklist
            </Button>
          </div>
        </SheetContent>
      </Sheet>
      
      <Sheet 
        open={isJournalOpen} 
        onOpenChange={handleJournalSheetOpenChange}
      >
        <SheetContent className="w-full md:max-w-xl overflow-y-auto p-0" side="right">
          <SheetHeader className="p-4 pb-2 border-b">
            <SheetTitle>{currentJournalTask?.taskName || 'Journal Entry'}</SheetTitle>
          </SheetHeader>
          
          <div className="h-[calc(100vh-10rem)]">
            <MarkdownEditor
              value={journalContent}
              onChange={(value) => setJournalContent(value || '')}
              placeholder="Write your thoughts here..."
              height="100%"
            />
          </div>
          
          <div className="p-4 border-t">
            <Button onClick={saveJournal} className="w-full" type="button">
              <Save className="h-4 w-4 mr-2" /> Save Journal Entry
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default TaskPage;

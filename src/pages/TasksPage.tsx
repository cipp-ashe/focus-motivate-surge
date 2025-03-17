
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { TaskTabsList } from '@/components/tasks/tabs/TaskTabsList';
import { TaskTypeTab } from '@/components/tasks/tabs/TaskTypeTab';
import { TaskLayout } from '@/components/tasks/TaskLayout';
import TaskManager from '@/components/tasks/TaskManager';
import { useTaskContext } from '@/contexts/tasks/TaskContext';
import { Task } from '@/types/tasks';
import { ChecklistDialog } from '@/components/tasks/dialogs/ChecklistDialog';
import { JournalDialog } from '@/components/tasks/dialogs/JournalDialog';
import { ScreenshotDialog } from '@/components/tasks/dialogs/ScreenshotDialog';
import { VoiceNoteDialog } from '@/components/tasks/dialogs/VoiceNoteDialog';

const TasksPage: React.FC = () => {
  const taskContext = useTaskContext();
  const tasks = taskContext?.items || [];
  const completedTasks = taskContext?.completed || [];
  
  // State for dialogs
  const [activeTab, setActiveTab] = useState('all');
  const [checklistDialogOpen, setChecklistDialogOpen] = useState(false);
  const [journalDialogOpen, setJournalDialogOpen] = useState(false);
  const [screenshotDialogOpen, setScreenshotDialogOpen] = useState(false);
  const [voiceNoteDialogOpen, setVoiceNoteDialogOpen] = useState(false);
  
  // Dialog content state
  const [activeTaskId, setActiveTaskId] = useState<string>('');
  const [activeTaskName, setActiveTaskName] = useState<string>('');
  const [checklistItems, setChecklistItems] = useState<any[]>([]);
  const [journalEntry, setJournalEntry] = useState<string>('');
  const [screenshotUrl, setScreenshotUrl] = useState<string>('');
  
  // Update task counts
  const [taskCounts, setTaskCounts] = useState({
    all: 0,
    timer: 0,
    screenshot: 0,
    journal: 0,
    checklist: 0,
    voicenote: 0,
    regular: 0
  });
  
  // Calculate counts whenever tasks change
  useEffect(() => {
    if (!tasks) return;
    
    const counts = {
      all: tasks.length,
      timer: tasks.filter(t => t.taskType === 'timer').length,
      screenshot: tasks.filter(t => t.taskType === 'screenshot').length,
      journal: tasks.filter(t => t.taskType === 'journal').length,
      checklist: tasks.filter(t => t.taskType === 'checklist').length,
      voicenote: tasks.filter(t => t.taskType === 'voicenote').length,
      regular: tasks.filter(t => t.taskType === 'regular' || !t.taskType).length
    };
    
    setTaskCounts(counts);
  }, [tasks]);
  
  // Filter tasks based on active tab
  const getFilteredTasks = (): Task[] => {
    if (!tasks) return [];
    
    if (activeTab === 'all') return tasks;
    return tasks.filter(task => task.taskType === activeTab);
  };
  
  // Dialog openers
  const dialogOpeners = {
    checklist: (taskId: string, taskName: string, items: any[]) => {
      setActiveTaskId(taskId);
      setActiveTaskName(taskName);
      setChecklistItems(items || []);
      setChecklistDialogOpen(true);
    },
    journal: (taskId: string, taskName: string, entry: string) => {
      setActiveTaskId(taskId);
      setActiveTaskName(taskName);
      setJournalEntry(entry || '');
      setJournalDialogOpen(true);
    },
    screenshot: (imageUrl: string, taskName: string) => {
      setScreenshotUrl(imageUrl);
      setActiveTaskName(taskName);
      setScreenshotDialogOpen(true);
    },
    voicenote: (taskId: string, taskName: string) => {
      setActiveTaskId(taskId);
      setActiveTaskName(taskName);
      setVoiceNoteDialogOpen(true);
    }
  };
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  return (
    <div className="min-h-screen">
      <TaskLayout
        mainContent={
          <Tabs value={activeTab} onValueChange={handleTabChange} className="h-full flex flex-col">
            <TaskTabsList taskCounts={taskCounts} />
            
            <div className="flex-1 overflow-hidden">
              <TaskTypeTab 
                value="all" 
                tasks={getFilteredTasks()} 
                selectedTaskId={taskContext?.selected || null}
                dialogOpeners={dialogOpeners}
              />
              <TaskTypeTab 
                value="regular" 
                tasks={getFilteredTasks()} 
                selectedTaskId={taskContext?.selected || null}
                dialogOpeners={dialogOpeners}
              />
              <TaskTypeTab 
                value="timer" 
                tasks={getFilteredTasks()} 
                selectedTaskId={taskContext?.selected || null}
                dialogOpeners={dialogOpeners}
              />
              <TaskTypeTab 
                value="journal" 
                tasks={getFilteredTasks()} 
                selectedTaskId={taskContext?.selected || null}
                dialogOpeners={dialogOpeners}
              />
              <TaskTypeTab 
                value="checklist" 
                tasks={getFilteredTasks()} 
                selectedTaskId={taskContext?.selected || null}
                dialogOpeners={dialogOpeners}
              />
              <TaskTypeTab 
                value="screenshot" 
                tasks={getFilteredTasks()} 
                selectedTaskId={taskContext?.selected || null}
                dialogOpeners={dialogOpeners}
              />
              <TaskTypeTab 
                value="voicenote" 
                tasks={getFilteredTasks()} 
                selectedTaskId={taskContext?.selected || null}
                dialogOpeners={dialogOpeners}
              />
            </div>
          </Tabs>
        }
        asideContent={
          <TaskManager 
            dialogOpeners={dialogOpeners}
          />
        }
      />
      
      {/* Dialogs */}
      <ChecklistDialog
        open={checklistDialogOpen}
        onOpenChange={setChecklistDialogOpen}
        taskId={activeTaskId}
        taskName={activeTaskName}
        initialItems={checklistItems}
      />
      
      <JournalDialog
        open={journalDialogOpen}
        onOpenChange={setJournalDialogOpen}
        taskId={activeTaskId}
        taskName={activeTaskName}
        initialEntry={journalEntry}
      />
      
      <ScreenshotDialog
        open={screenshotDialogOpen}
        onOpenChange={setScreenshotDialogOpen}
        imageUrl={screenshotUrl}
        taskName={activeTaskName}
      />
      
      <VoiceNoteDialog
        open={voiceNoteDialogOpen}
        onOpenChange={setVoiceNoteDialogOpen}
        taskId={activeTaskId}
        taskName={activeTaskName}
      />
    </div>
  );
};

export default TasksPage;

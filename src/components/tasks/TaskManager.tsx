
import React, { useState, useEffect } from 'react';
import { TaskManagerContent } from './TaskManagerContent';
import { useTaskContext } from '@/contexts/tasks/TaskContext';
import { Task } from '@/types/tasks';
import { eventBus } from '@/lib/eventBus';
import { TaskEventListener } from './TaskEventListener';
import { TaskEventHandler } from './TaskEventHandler';
import { JournalDialog } from './components/JournalDialog';
import { ChecklistDialog } from './components/ChecklistDialog';
import { ScreenshotDialog } from './components/ScreenshotDialog';
import { VoiceNoteDialog } from './components/VoiceNoteDialog';

interface TaskManagerProps {
  isTimerView?: boolean;
}

const TaskManager: React.FC<TaskManagerProps> = ({ isTimerView = false }) => {
  const { items, selected } = useTaskContext();
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [currentImage, setCurrentImage] = useState('');
  const [currentImageTitle, setCurrentImageTitle] = useState('');
  
  const [showJournal, setShowJournal] = useState(false);
  const [journalTaskId, setJournalTaskId] = useState('');
  const [journalTaskName, setJournalTaskName] = useState('');
  const [journalContent, setJournalContent] = useState('');
  
  const [showChecklist, setShowChecklist] = useState(false);
  const [checklistTaskId, setChecklistTaskId] = useState('');
  const [checklistTaskName, setChecklistTaskName] = useState('');
  const [checklistItems, setChecklistItems] = useState<any[]>([]);
  
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [voiceNoteTaskId, setVoiceNoteTaskId] = useState('');
  const [voiceNoteTaskName, setVoiceNoteTaskName] = useState('');
  
  console.log("TaskManager: Rendering with dialogOpeners:", !!showJournal || !!showChecklist || !!showImageViewer || !!showVoiceRecorder);
  
  const handleTaskAdd = (task: Task) => {
    console.log("TaskManager: Adding task", task);
    eventBus.emit('task:create', task);
    
    // For timer view, automatically select the new task
    if (isTimerView) {
      setTimeout(() => {
        console.log("TaskManager: Auto-selecting newly created task in timer view", task.id);
        eventBus.emit('task:select', task.id);
      }, 100);
    }
  };
  
  const handleTasksAdd = (tasks: Task[]) => {
    console.log(`TaskManager: Adding ${tasks.length} tasks`);
    tasks.forEach(task => {
      eventBus.emit('task:create', task);
    });
    
    // For timer view, automatically select the first task
    if (isTimerView && tasks.length > 0) {
      setTimeout(() => {
        console.log("TaskManager: Auto-selecting first of multiple tasks in timer view", tasks[0].id);
        eventBus.emit('task:select', tasks[0].id);
      }, 100);
    }
  };
  
  // Show image viewer (for screenshots)
  const handleShowImage = (imageUrl: string, taskName: string) => {
    setCurrentImage(imageUrl);
    setCurrentImageTitle(taskName);
    setShowImageViewer(true);
  };
  
  // Open journal dialog
  const handleOpenJournal = (taskId: string, taskName: string, entry: string) => {
    setJournalTaskId(taskId);
    setJournalTaskName(taskName);
    setJournalContent(entry || '');
    setShowJournal(true);
  };
  
  // Open checklist dialog
  const handleOpenChecklist = (taskId: string, taskName: string, items: any[]) => {
    setChecklistTaskId(taskId);
    setChecklistTaskName(taskName);
    setChecklistItems(items || []);
    setShowChecklist(true);
  };
  
  // Open voice recorder dialog
  const handleOpenVoiceRecorder = (taskId: string, taskName: string) => {
    setVoiceNoteTaskId(taskId);
    setVoiceNoteTaskName(taskName);
    setShowVoiceRecorder(true);
  };
  
  // Handle task updates from dialogs
  const handleTaskUpdate = (taskId: string, updates: any) => {
    console.log("TaskManager: Updating task", taskId, updates);
    eventBus.emit('task:update', { taskId, updates });
  };

  // TaskEventHandler props
  const handleTaskCreate = (task: Task) => {
    console.log("TaskEventHandler: Task create", task);
  };

  const handleTaskDelete = (data: { taskId: string }) => {
    console.log("TaskEventHandler: Task delete", data);
  };

  const handleForceUpdate = () => {
    console.log("TaskEventHandler: Force update");
  };
  
  return (
    <>
      <TaskManagerContent
        tasks={items}
        selectedTaskId={selected}
        onTaskAdd={handleTaskAdd}
        onTasksAdd={handleTasksAdd}
        isTimerView={isTimerView}
      />
      
      <TaskEventListener
        onShowImage={handleShowImage}
        onOpenChecklist={handleOpenChecklist}
        onOpenJournal={handleOpenJournal}
        onOpenVoiceRecorder={handleOpenVoiceRecorder}
        onTaskUpdate={handleTaskUpdate}
      />
      
      <TaskEventHandler 
        tasks={items}
        onTaskCreate={handleTaskCreate}
        onTaskUpdate={handleTaskUpdate}
        onTaskDelete={handleTaskDelete}
        onForceUpdate={handleForceUpdate}
      />
      
      <JournalDialog
        isOpen={showJournal}
        onOpenChange={setShowJournal}
        task={{
          id: journalTaskId,
          name: journalTaskName,
          journalEntry: journalContent,
          completed: false,
          createdAt: new Date().toISOString()
        }}
      />
      
      <ChecklistDialog
        isOpen={showChecklist}
        onOpenChange={setShowChecklist}
        currentTask={checklistTaskId ? {
          taskId: checklistTaskId,
          taskName: checklistTaskName,
          items: checklistItems
        } : null}
      />
      
      <ScreenshotDialog
        isOpen={showImageViewer}
        onOpenChange={setShowImageViewer}
        task={{
          id: 'screenshot',
          name: currentImageTitle,
          imageUrl: currentImage,
          completed: false,
          createdAt: new Date().toISOString()
        }}
      />
      
      <VoiceNoteDialog
        isOpen={showVoiceRecorder}
        onOpenChange={setShowVoiceRecorder}
        task={{
          id: voiceNoteTaskId,
          name: voiceNoteTaskName,
          completed: false,
          createdAt: new Date().toISOString()
        }}
      />
    </>
  );
};

export default TaskManager;


import React from 'react';
import { TaskList } from './TaskList';
import { TaskInput } from './TaskInput';
import { Task } from '@/types/tasks';
import { toast } from 'sonner';
import { taskStorage } from '@/lib/storage/taskStorage';
import { eventManager } from '@/lib/events/EventManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Timer, Image, Calendar, BookOpen, CheckSquare, Mic, FileText } from 'lucide-react';
import { useIsMobile } from '@/hooks/ui/useIsMobile';

interface TaskManagerContentProps {
  tasks: Task[];
  selectedTaskId: string | null;
  onTaskAdd: (task: Task) => void;
  onTasksAdd: (tasks: Task[]) => void;
  isTimerView?: boolean;
}

export const TaskManagerContent: React.FC<TaskManagerContentProps> = ({
  tasks,
  selectedTaskId,
  onTaskAdd,
  onTasksAdd,
  isTimerView = false
}) => {
  const isMobile = useIsMobile();
  
  const handleTaskAdd = (task: Task) => {
    console.log("TaskManagerContent - Adding task:", task);
    
    // Add to storage first
    taskStorage.addTask(task);
    
    // Call the parent handler
    onTaskAdd(task);
    
    // Show toast
    toast.success(`Added ${task.taskType || 'regular'} task: ${task.name}`);
  };

  const handleTasksAdd = (tasks: Task[]) => {
    console.log(`TaskManagerContent - Adding ${tasks.length} tasks`);
    
    // Add all tasks to storage
    tasks.forEach(task => taskStorage.addTask(task));
    
    // Call the parent handler
    onTasksAdd(tasks);
    
    // Show toast
    toast.success(`Added ${tasks.length} tasks`);
  };

  // Filter tasks by type
  const timerTasks = tasks.filter(task => task.taskType === 'timer');
  const screenshotTasks = tasks.filter(task => task.taskType === 'screenshot');
  const habitTasks = tasks.filter(task => task.taskType === 'habit');
  const journalTasks = tasks.filter(task => task.taskType === 'journal');
  const checklistTasks = tasks.filter(task => task.taskType === 'checklist');
  const voiceNoteTasks = tasks.filter(task => task.taskType === 'voicenote');
  const regularTasks = tasks.filter(task => !task.taskType || task.taskType === 'regular');
  const allTasks = tasks;

  // For timer view, we show a simplified interface with only timer tasks
  if (isTimerView) {
    return (
      <div className="flex flex-col h-full bg-background rounded-xl overflow-hidden shadow-sm border border-border/30">
        <div className="p-4 border-b border-border/10">
          <TaskInput 
            onTaskAdd={handleTaskAdd} 
            onTasksAdd={handleTasksAdd}
            defaultTaskType="timer"
            simplifiedView
          />
        </div>
        <div className="flex-1 overflow-auto">
          <TaskList
            tasks={timerTasks}
            selectedTasks={selectedTaskId ? [selectedTaskId] : []}
            onTaskClick={(taskId) => eventManager.emit('task:select', taskId)}
            simplifiedView
          />
        </div>
      </div>
    );
  }

  // Mobile-optimized tabs for task types
  return (
    <div className="flex flex-col h-full bg-background rounded-xl overflow-hidden shadow-sm border border-border/30">
      <div className={`${isMobile ? 'px-0 pt-0' : 'p-0'}`}>
        <TaskInput 
          onTaskAdd={handleTaskAdd} 
          onTasksAdd={handleTasksAdd}
        />
      </div>
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="all" className="h-full flex flex-col">
          <div className="w-full border-b border-border/20 overflow-x-auto bg-background/60">
            <TabsList className={`${isMobile ? 'flex w-full justify-between px-1 py-1' : 'w-full justify-start'} bg-background/10`}>
              <TabsTrigger value="all" className={`flex items-center gap-1 ${isMobile ? 'flex-1 justify-center' : ''} data-[state=active]:bg-primary/10 data-[state=active]:text-primary`}>
                <FileText className="h-4 w-4" />
                {!isMobile && <span>All ({allTasks.length})</span>}
                {isMobile && <span className="sr-only">All tasks</span>}
                {isMobile && <span className="text-xs">{allTasks.length}</span>}
              </TabsTrigger>
              <TabsTrigger value="timer" className={`flex items-center gap-1 ${isMobile ? 'flex-1 justify-center' : ''} data-[state=active]:bg-purple-500/10 data-[state=active]:text-purple-500`}>
                <Timer className="h-4 w-4 text-purple-400" />
                {!isMobile && <span>Timer ({timerTasks.length})</span>}
                {isMobile && <span className="sr-only">Timer tasks</span>}
                {isMobile && <span className="text-xs">{timerTasks.length}</span>}
              </TabsTrigger>
              <TabsTrigger value="screenshot" className={`flex items-center gap-1 ${isMobile ? 'flex-1 justify-center' : ''} data-[state=active]:bg-blue-500/10 data-[state=active]:text-blue-500`}>
                <Image className="h-4 w-4 text-blue-400" />
                {!isMobile && <span>Screenshots ({screenshotTasks.length})</span>}
                {isMobile && <span className="sr-only">Screenshot tasks</span>}
                {isMobile && <span className="text-xs">{screenshotTasks.length}</span>}
              </TabsTrigger>
              <TabsTrigger value="habit" className={`flex items-center gap-1 ${isMobile ? 'flex-1 justify-center' : ''} data-[state=active]:bg-green-500/10 data-[state=active]:text-green-500`}>
                <Calendar className="h-4 w-4 text-green-400" />
                {!isMobile && <span>Habits ({habitTasks.length})</span>}
                {isMobile && <span className="sr-only">Habit tasks</span>}
                {isMobile && <span className="text-xs">{habitTasks.length}</span>}
              </TabsTrigger>
              <TabsTrigger value="journal" className={`flex items-center gap-1 ${isMobile ? 'flex-1 justify-center' : ''} data-[state=active]:bg-amber-500/10 data-[state=active]:text-amber-500`}>
                <BookOpen className="h-4 w-4 text-amber-400" />
                {!isMobile && <span>Journal ({journalTasks.length})</span>}
                {isMobile && <span className="sr-only">Journal tasks</span>}
                {isMobile && <span className="text-xs">{journalTasks.length}</span>}
              </TabsTrigger>
              <TabsTrigger value="checklist" className={`flex items-center gap-1 ${isMobile ? 'flex-1 justify-center' : ''} data-[state=active]:bg-cyan-500/10 data-[state=active]:text-cyan-500`}>
                <CheckSquare className="h-4 w-4 text-cyan-400" />
                {!isMobile && <span>Checklists ({checklistTasks.length})</span>}
                {isMobile && <span className="sr-only">Checklist tasks</span>}
                {isMobile && <span className="text-xs">{checklistTasks.length}</span>}
              </TabsTrigger>
              <TabsTrigger value="voicenote" className={`flex items-center gap-1 ${isMobile ? 'flex-1 justify-center' : ''} data-[state=active]:bg-rose-500/10 data-[state=active]:text-rose-500`}>
                <Mic className="h-4 w-4 text-rose-400" />
                {!isMobile && <span>Voice Notes ({voiceNoteTasks.length})</span>}
                {isMobile && <span className="sr-only">Voice note tasks</span>}
                {isMobile && <span className="text-xs">{voiceNoteTasks.length}</span>}
              </TabsTrigger>
              <TabsTrigger value="regular" className={`flex items-center gap-1 ${isMobile ? 'flex-1 justify-center' : ''} data-[state=active]:bg-primary/10 data-[state=active]:text-primary`}>
                <FileText className="h-4 w-4 text-primary" />
                {!isMobile && <span>Regular ({regularTasks.length})</span>}
                {isMobile && <span className="sr-only">Regular tasks</span>}
                {isMobile && <span className="text-xs">{regularTasks.length}</span>}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="flex-1 overflow-auto p-0 m-0">
            <TaskList
              tasks={allTasks}
              selectedTasks={selectedTaskId ? [selectedTaskId] : []}
              onTaskClick={(taskId) => eventManager.emit('task:select', taskId)}
            />
          </TabsContent>
          
          <TabsContent value="timer" className="flex-1 overflow-auto p-0 m-0">
            <TaskList
              tasks={timerTasks}
              selectedTasks={selectedTaskId ? [selectedTaskId] : []}
              onTaskClick={(taskId) => eventManager.emit('task:select', taskId)}
            />
          </TabsContent>
          
          <TabsContent value="screenshot" className="flex-1 overflow-auto p-0 m-0">
            <TaskList
              tasks={screenshotTasks}
              selectedTasks={selectedTaskId ? [selectedTaskId] : []}
              onTaskClick={(taskId) => eventManager.emit('task:select', taskId)}
            />
          </TabsContent>
          
          <TabsContent value="habit" className="flex-1 overflow-auto p-0 m-0">
            <TaskList
              tasks={habitTasks}
              selectedTasks={selectedTaskId ? [selectedTaskId] : []}
              onTaskClick={(taskId) => eventManager.emit('task:select', taskId)}
            />
          </TabsContent>
          
          <TabsContent value="journal" className="flex-1 overflow-auto p-0 m-0">
            <TaskList
              tasks={journalTasks}
              selectedTasks={selectedTaskId ? [selectedTaskId] : []}
              onTaskClick={(taskId) => eventManager.emit('task:select', taskId)}
            />
          </TabsContent>
          
          <TabsContent value="checklist" className="flex-1 overflow-auto p-0 m-0">
            <TaskList
              tasks={checklistTasks}
              selectedTasks={selectedTaskId ? [selectedTaskId] : []}
              onTaskClick={(taskId) => eventManager.emit('task:select', taskId)}
            />
          </TabsContent>
          
          <TabsContent value="voicenote" className="flex-1 overflow-auto p-0 m-0">
            <TaskList
              tasks={voiceNoteTasks}
              selectedTasks={selectedTaskId ? [selectedTaskId] : []}
              onTaskClick={(taskId) => eventManager.emit('task:select', taskId)}
            />
          </TabsContent>
          
          <TabsContent value="regular" className="flex-1 overflow-auto p-0 m-0">
            <TaskList
              tasks={regularTasks}
              selectedTasks={selectedTaskId ? [selectedTaskId] : []}
              onTaskClick={(taskId) => eventManager.emit('task:select', taskId)}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

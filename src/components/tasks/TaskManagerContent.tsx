
import React from 'react';
import { TaskList } from './TaskList';
import { TaskInput } from './TaskInput';
import { Task } from '@/types/tasks';
import { toast } from 'sonner';
import { taskStorage } from '@/lib/storage/taskStorage';
import { eventManager } from '@/lib/events/EventManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Timer, Image, Calendar, FileText, CheckSquare, BookOpen } from 'lucide-react';

interface TaskManagerContentProps {
  tasks: Task[];
  selectedTaskId: string | null;
  onTaskAdd: (task: Task) => void;
  onTasksAdd: (tasks: Task[]) => void;
}

export const TaskManagerContent: React.FC<TaskManagerContentProps> = ({
  tasks,
  selectedTaskId,
  onTaskAdd,
  onTasksAdd
}) => {
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
  const regularTasks = tasks.filter(task => !task.taskType || task.taskType === 'regular');
  const allTasks = tasks;

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border/10">
        <TaskInput 
          onTaskAdd={handleTaskAdd} 
          onTasksAdd={handleTasksAdd}
        />
      </div>
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="all" className="h-full flex flex-col">
          <div className="border-b border-border/10 px-4">
            <TabsList className="my-2">
              <TabsTrigger value="all" className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                <span>All ({allTasks.length})</span>
              </TabsTrigger>
              <TabsTrigger value="timer" className="flex items-center gap-1">
                <Timer className="h-4 w-4 text-purple-400" />
                <span>Timer ({timerTasks.length})</span>
              </TabsTrigger>
              <TabsTrigger value="screenshot" className="flex items-center gap-1">
                <Image className="h-4 w-4 text-blue-400" />
                <span>Screenshots ({screenshotTasks.length})</span>
              </TabsTrigger>
              <TabsTrigger value="habit" className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-green-400" />
                <span>Habits ({habitTasks.length})</span>
              </TabsTrigger>
              <TabsTrigger value="journal" className="flex items-center gap-1">
                <BookOpen className="h-4 w-4 text-amber-400" />
                <span>Journal ({journalTasks.length})</span>
              </TabsTrigger>
              <TabsTrigger value="checklist" className="flex items-center gap-1">
                <CheckSquare className="h-4 w-4 text-cyan-400" />
                <span>Checklists ({checklistTasks.length})</span>
              </TabsTrigger>
              <TabsTrigger value="regular" className="flex items-center gap-1">
                <FileText className="h-4 w-4 text-primary" />
                <span>Regular ({regularTasks.length})</span>
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

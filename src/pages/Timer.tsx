
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/layout/PageHeader';
import { PageTitle } from '@/components/layout/PageTitle';
import { Clock } from 'lucide-react';
import { TimerSection } from '@/components/timer/TimerSection';
import { TaskSelectionProvider } from '@/components/timer/providers/TaskSelectionProvider';
import { UnifiedTaskEventListener } from '@/components/tasks/event-handlers/UnifiedTaskEventListener';
import { Quote } from '@/types/timer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { logger } from '@/utils/logManager';
import { TimerConfigModalListener } from '@/components/timer/TimerConfigModalListener';
import { FilteredTimerTaskList } from '@/components/timer/FilteredTimerTaskList';
import { TimerTaskInput } from '@/components/timer/TimerTaskInput';

const TimerPage = () => {
  logger.debug('TimerPage', 'Rendering Timer page');
  const [favorites, setFavorites] = useState<Quote[]>([]);

  // Event handlers for task management dialogs
  const handleShowImage = (imageUrl: string, taskName: string) => {
    logger.debug('TimerPage', 'Showing image for task', taskName);
    // Implementation for showing a task image
  };

  const handleOpenChecklist = (taskId: string, taskName: string, items: any[]) => {
    logger.debug('TimerPage', 'Opening checklist for task', taskName);
    // Implementation for opening a task checklist
  };

  const handleOpenJournal = (taskId: string, taskName: string, entry: string) => {
    logger.debug('TimerPage', 'Opening journal for task', taskName);
    // Implementation for opening a task journal
  };

  const handleOpenVoiceRecorder = (taskId: string, taskName: string) => {
    logger.debug('TimerPage', 'Opening voice recorder for task', taskName);
    // Implementation for opening a voice recorder for a task
  };

  const handleTaskUpdate = (data: { taskId: string, updates: any }) => {
    logger.debug('TimerPage', 'Updating task', data.taskId, data.updates);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl animate-fade-in">
      <PageHeader>
        <PageTitle 
          icon={<Clock className="h-5 w-5" />}
          title="Timer"
          subtitle="Focus and track your time"
        />
      </PageHeader>
      
      <TaskSelectionProvider>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Timer Task Input */}
          <div className="md:col-span-12">
            <TimerTaskInput />
          </div>
          
          {/* Timer Task List - Now with more space */}
          <div className="md:col-span-5 md:order-2">
            <Card className="dark:bg-card/90 border-border/40 dark:border-border/20 h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                  Timer Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-full max-h-[70vh]">
                  <FilteredTimerTaskList />
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
          
          {/* Timer Section - Now with less space */}
          <div className="md:col-span-7 md:order-1">
            <Card className="dark:bg-card/90 border-border/40 dark:border-border/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <Clock className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                  Task Timer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-full max-h-[70vh]">
                  <TimerSection 
                    favorites={favorites} 
                    setFavorites={setFavorites} 
                  />
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Event listeners */}
        <UnifiedTaskEventListener
          onShowImage={handleShowImage}
          onOpenChecklist={handleOpenChecklist}
          onOpenJournal={handleOpenJournal}
          onOpenVoiceRecorder={handleOpenVoiceRecorder}
          onTaskUpdate={handleTaskUpdate}
        />
        
        {/* Timer modal listener */}
        <TimerConfigModalListener />
      </TaskSelectionProvider>
    </div>
  );
};

export default TimerPage;

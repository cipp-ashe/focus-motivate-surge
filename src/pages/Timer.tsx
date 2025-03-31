
import React, { useState, useEffect } from 'react';
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
import { useTaskContext } from '@/contexts/tasks/TaskContext';
import { eventManager } from '@/lib/events/EventManager';
import ErrorBoundary from '@/utils/debug/errorBoundary';

const TimerPage = () => {
  logger.debug('TimerPage', 'Rendering Timer page');
  const [favorites, setFavorites] = useState<Quote[]>([]);
  const taskContext = useTaskContext();

  // Force a task refresh when the Timer page loads
  useEffect(() => {
    logger.debug('TimerPage', 'Initializing Timer page with fresh task data');

    // Emit a task reload event to ensure all components have the latest data
    eventManager.emit('task:reload', {});

    // Trigger a UI refresh
    window.dispatchEvent(new Event('force-task-update'));
  }, []);

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

  const handleTaskUpdate = (data: { taskId: string; updates: any }) => {
    logger.debug('TimerPage', 'Updating task', data.taskId, data.updates);
  };

  return (
    <div className="container mx-auto px-2 py-4 max-w-6xl animate-fade-in">
      <PageHeader>
        <PageTitle
          icon={<Clock className="h-5 w-5" />}
          title="Timer"
          subtitle="Focus and track your time"
        />
      </PageHeader>

      <ErrorBoundary module="timer" component="TimerPage">
        <TaskSelectionProvider>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Timer Task Input - Spans full width */}
            <div className="lg:col-span-12">
              <TimerTaskInput />
            </div>

            {/* Timer Section - Main focus, larger on all screens */}
            <div className="lg:col-span-8 order-1">
              <div className="bg-card/30 border border-border/20 rounded-lg shadow-sm overflow-hidden dark:bg-slate-900/40 dark:border-slate-800/50">
                <div className="bg-card/50 dark:bg-slate-900/70 border-b border-border/10 dark:border-slate-800/30 p-3">
                  <h3 className="text-base font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4 text-purple-500 dark:text-purple-400" />
                    Task Timer
                  </h3>
                </div>
                <div className="max-h-[70vh] overflow-auto">
                  <TimerSection favorites={favorites} setFavorites={setFavorites} />
                </div>
              </div>
            </div>

            {/* Timer Task List - Secondary focus, smaller */}
            <div className="lg:col-span-4 order-2">
              <div className="bg-card/30 border border-border/20 rounded-lg shadow-sm overflow-hidden h-full dark:bg-slate-900/40 dark:border-slate-800/50">
                <div className="bg-card/50 dark:bg-slate-900/70 border-b border-border/10 dark:border-slate-800/30 p-3">
                  <h3 className="text-base font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4 text-purple-500 dark:text-purple-400" />
                    Timer Tasks
                  </h3>
                </div>
                <div className="p-3 max-h-[60vh] overflow-auto">
                  <FilteredTimerTaskList />
                </div>
              </div>
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
      </ErrorBoundary>
    </div>
  );
};

export default TimerPage;

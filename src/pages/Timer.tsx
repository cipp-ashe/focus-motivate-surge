
import React, { useEffect } from 'react';
import { eventManager } from '@/lib/events/EventManager';
import { TimerSection } from '@/components/timer/TimerSection';
import { useState } from 'react';
import { Quote } from '@/types/timer';
import { TaskSelectionProvider } from '@/components/timer/providers/TaskSelectionProvider';
import { TaskManager } from '@/contexts/tasks/TaskContext';

// Timer page component with default export
export default function TimerPage() {
  const [favorites, setFavorites] = useState<Quote[]>([]);

  // Fix the initialization event with a timestamp
  useEffect(() => {
    eventManager.emit('app:initialized', {
      timestamp: new Date().toISOString()
    });
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Timer</h1>
      <TaskManager>
        <TaskSelectionProvider>
          <TimerSection favorites={favorites} setFavorites={setFavorites} />
        </TaskSelectionProvider>
      </TaskManager>
    </div>
  );
}

// Keep the existing function for backward compatibility
export const fixTimerPageEmission = () => {
  useEffect(() => {
    // Fix the initialization event with a timestamp
    eventManager.emit('app:initialized', {
      timestamp: new Date().toISOString()
    });
  }, []);
};

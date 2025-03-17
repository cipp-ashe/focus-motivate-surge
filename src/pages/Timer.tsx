// This is a minimal stub for Timer.tsx to fix the initialization event timestamp

import React, { useEffect } from 'react';
import { eventManager } from '@/lib/events/EventManager';
import { TimerSection } from '@/components/timer/TimerSection';
import { useState } from 'react';
import { Quote } from '@/types/timer';

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
      <TimerSection favorites={favorites} setFavorites={setFavorites} />
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


import { useState, useEffect } from 'react';
import { useDebug } from '@/utils/debug';
import { debugStore } from '@/utils/debug/types';

export const useDebugPanel = () => {
  const { isDebugMode, toggleDebugMode } = useDebug();
  const [isOpen, setIsOpen] = useState(false);
  const [activeEvents, setActiveEvents] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  // Load debug events
  useEffect(() => {
    if (isOpen) {
      setActiveEvents(debugStore.getEvents());

      // Refresh debug events every second when panel is open
      const interval = setInterval(() => {
        setActiveEvents(debugStore.getEvents());
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  // Calculate event counts
  const eventCounts = {
    dataFlow: activeEvents.filter(e => e.type === 'data-flow').length,
    performance: activeEvents.filter(e => e.type === 'performance').length,
    state: activeEvents.filter(e => e.type === 'state-change').length,
    errors: activeEvents.filter(e => e.type === 'error').length,
    warnings: activeEvents.filter(e => 
      e.type === 'warning' || e.type === 'assertion' || e.type === 'validation'
    ).length,
    assertions: activeEvents.filter(e => e.type === 'assertion').length,
    validations: activeEvents.filter(e => e.type === 'validation').length,
  };

  const totalErrors = eventCounts.errors;
  const totalWarnings = eventCounts.warnings;

  return {
    isDebugMode,
    toggleDebugMode,
    isOpen,
    setIsOpen,
    activeEvents,
    activeTab,
    setActiveTab,
    eventCounts,
    totalErrors,
    totalWarnings
  };
};

export default useDebugPanel;

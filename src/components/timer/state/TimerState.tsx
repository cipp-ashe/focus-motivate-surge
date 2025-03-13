
// Modified useTimerState hook - we only need to update the completeTimer function:

const completeTimer = useCallback(async () => {
  await timerComplete();
  eventBus.emit('timer:complete', { 
    taskName, 
    metrics 
  });
  
  // Ensure we collapse the timer after completion
  setIsExpanded(false);
  
  if (onComplete) onComplete(metrics);
}, [timerComplete, taskName, metrics, onComplete, setIsExpanded]);

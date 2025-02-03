export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const calculateEfficiencyRatio = (expectedTime: number, netEffectiveTime: number): number => {
  if (netEffectiveTime === 0 || expectedTime === 0) return 0;
  // Calculate as defined in TimerMetrics type: (netEffectiveTime / expectedTime) * 100
  const ratio = (netEffectiveTime / expectedTime) * 100;
  return Math.min(ratio, 200);
};

export const determineCompletionStatus = (expectedTime: number, netEffectiveTime: number) => {
  if (netEffectiveTime < expectedTime) return 'Completed Early';
  if (netEffectiveTime === expectedTime) return 'Completed On Time';
  return 'Completed Late';
};
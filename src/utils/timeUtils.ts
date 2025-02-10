
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const calculateEfficiencyRatio = (expectedTime: number, netEffectiveTime: number): number => {
  if (netEffectiveTime === 0 || expectedTime === 0) return 0;
  const ratio = (netEffectiveTime / expectedTime) * 100;
  return Math.min(ratio, 100);
};

export const determineCompletionStatus = (expectedTime: number, netEffectiveTime: number) => {
  if (netEffectiveTime < expectedTime) return 'Completed Early';
  if (netEffectiveTime === expectedTime) return 'Completed On Time';
  return 'Completed Late';
};

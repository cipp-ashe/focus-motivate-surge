export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const calculateEfficiencyRatio = (originalDuration: number, netEffectiveTime: number): number => {
  if (netEffectiveTime === 0) return 0;
  const ratio = (originalDuration / netEffectiveTime) * 100;
  return Math.min(ratio, 100);
};

export const determineCompletionStatus = (originalDuration: number, netEffectiveTime: number) => {
  if (netEffectiveTime < originalDuration) return 'Completed Early';
  if (netEffectiveTime === originalDuration) return 'Completed On Time';
  return 'Completed Late';
};
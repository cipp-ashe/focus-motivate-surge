
export const formatDuration = (seconds: number): string => {
  if (seconds === 0) return '0s';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  }
  if (minutes > 0) {
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  }
  return `${remainingSeconds}s`;
};

export const formatDate = (dateString?: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getCompletionStatusColor = (status: string) => {
  switch (status) {
    case 'Completed Early':
      return 'text-green-500';
    case 'Completed On Time':
      return 'text-blue-500';
    case 'Completed Late':
      return 'text-yellow-500';
    default:
      return 'text-muted-foreground';
  }
};

export const getCompletionIcon = (status: string) => {
  switch (status) {
    case 'Completed Early':
      return 'CheckCircle2';
    case 'Completed On Time':
      return 'Timer';
    case 'Completed Late':
      return 'AlertTriangle';
    default:
      return 'Timer';
  }
};

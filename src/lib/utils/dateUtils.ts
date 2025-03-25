
/**
 * Date utility functions for the application
 */

export function toISOString(date: Date): string {
  return date.toISOString();
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export function minutesToSeconds(minutes: number): number {
  return minutes * 60;
}

export function secondsToMinutes(seconds: number): number {
  return Math.floor(seconds / 60);
}

export function getCurrentDateTime(): string {
  return new Date().toISOString();
}

export function getFormattedDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString();
}

export function getFormattedTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleTimeString();
}

export function getTimeDifferenceInSeconds(startDate: Date | string, endDate: Date | string): number {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  return Math.floor((end.getTime() - start.getTime()) / 1000);
}

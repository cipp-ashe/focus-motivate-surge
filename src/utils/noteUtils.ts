
// Note utilities

// Storage key for notes in localStorage
export const STORAGE_KEY = 'notes';

// Function to format date in readable format
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  } catch (e) {
    console.error('Error formatting date:', e);
    return 'Unknown date';
  }
};

// Function to get excerpt from note content
export const getExcerpt = (content: string, maxLength: number = 100): string => {
  if (!content) return '';
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength) + '...';
};

// Function to sanitize content for safe storage
export const sanitizeContent = (content: string): string => {
  if (!content) return '';
  
  // Basic sanitization - strip potentially unsafe HTML
  return content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .trim();
};

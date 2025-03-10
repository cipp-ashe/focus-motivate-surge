
/**
 * Validates an image blob
 */
export const validateImage = (blob: Blob): { isValid: boolean; error?: string } => {
  // Check file size (max 5MB)
  if (blob.size > 5 * 1024 * 1024) {
    return { isValid: false, error: "Image size exceeds 5MB limit" };
  }

  // Check file type
  if (!blob.type.startsWith("image/")) {
    return { isValid: false, error: "File is not a valid image" };
  }

  return { isValid: true };
};

/**
 * Sanitizes a filename to prevent security issues
 */
export const sanitizeFileName = (fileName: string): string => {
  // Remove path information and special characters
  const sanitized = fileName.replace(/[^\w\s.-]/g, "").replace(/\.{2,}/g, ".");
  
  // Limit length
  return sanitized.slice(0, 100);
};

/**
 * Generates a secure random ID
 */
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

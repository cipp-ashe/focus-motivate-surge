
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

/**
 * Formats a file size in bytes to a human-readable string
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Extracts image metadata from an Image element
 */
export const extractImageMetadata = async (imageUrl: string): Promise<{
  dimensions: { width: number; height: number };
  fileSize: number;
  format: string;
}> => {
  // Default values
  const metadata = {
    dimensions: { width: 0, height: 0 },
    fileSize: 0,
    format: 'Unknown'
  };
  
  try {
    // Get dimensions
    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = imageUrl;
    });
    
    metadata.dimensions = {
      width: img.naturalWidth,
      height: img.naturalHeight
    };
    
    // Get file size and format
    if (imageUrl.startsWith('data:')) {
      // For data URLs, estimate the size
      const base64 = imageUrl.split(',')[1];
      metadata.fileSize = base64 ? Math.ceil(base64.length * 0.75) : 0;
      
      // Extract format from the data URL
      const formatMatch = imageUrl.match(/data:image\/([a-zA-Z0-9]+);/);
      metadata.format = formatMatch ? formatMatch[1].toUpperCase() : 'Unknown';
    } else {
      // For regular URLs, we need to fetch the file
      try {
        const response = await fetch(imageUrl, { method: 'HEAD' });
        const contentLength = response.headers.get('content-length');
        if (contentLength) {
          metadata.fileSize = parseInt(contentLength, 10);
        }
        
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.startsWith('image/')) {
          metadata.format = contentType.replace('image/', '').toUpperCase();
        }
      } catch (error) {
        console.error('Error fetching image metadata:', error);
      }
    }
    
    return metadata;
  } catch (error) {
    console.error('Error extracting image metadata:', error);
    return metadata;
  }
};

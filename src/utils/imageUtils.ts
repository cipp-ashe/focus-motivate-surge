
/**
 * Formats a file size in bytes to a human-readable string
 * @param bytes The file size in bytes
 * @returns Formatted file size string (e.g., "1.5 MB")
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

/**
 * Compresses an image and returns the compressed data as a blob
 * @param file The image file to compress
 * @param maxWidth The maximum width of the compressed image
 * @param quality The quality of the compressed image (0-1)
 * @returns A promise that resolves to a compressed image blob
 */
export const compressImage = (
  file: File, 
  maxWidth = 1600, 
  quality = 0.8
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Scale down if width exceeds maxWidth
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Get the format from the file type
        const format = file.type.includes('png') ? 'image/png' : 'image/jpeg';
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          format,
          quality
        );
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
  });
};

/**
 * Gets the dimensions of an image
 * @param url The URL of the image
 * @returns A promise that resolves to an object containing width and height
 */
export const getImageDimensions = (url: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height
      });
    };
    img.onerror = () => {
      reject(new Error(`Failed to load image: ${url}`));
    };
    img.src = url;
  });
};

/**
 * Extracts metadata from an image URL
 * @param imageUrl The URL of the image
 * @returns A promise that resolves to an object containing image metadata
 */
export const extractImageMetadata = async (imageUrl: string): Promise<any> => {
  try {
    // Get image dimensions
    const dimensions = await getImageDimensions(imageUrl);
    
    // Determine format from data URL if possible
    let format = 'unknown';
    if (imageUrl.startsWith('data:image/')) {
      const formatMatch = imageUrl.match(/data:image\/([a-zA-Z0-9]+);/);
      format = formatMatch ? formatMatch[1].toUpperCase() : 'unknown';
    }
    
    // For base64 data URLs, calculate approximate size
    let size = 0;
    if (imageUrl.startsWith('data:')) {
      // Remove the metadata part and decode base64 to get approximate size
      const base64 = imageUrl.split(',')[1];
      if (base64) {
        // Each base64 character represents 6 bits, so 4 chars are 3 bytes
        size = Math.floor((base64.length * 3) / 4);
      }
    }
    
    return {
      width: dimensions.width,
      height: dimensions.height,
      format,
      size,
      aspectRatio: dimensions.width / dimensions.height,
      dateExtracted: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error extracting image metadata:', error);
    throw error;
  }
};

/**
 * Validates an image file
 * @param file The image file or blob to validate
 * @param maxSizeMB Maximum file size in MB
 * @returns An object indicating if the image is valid and any error message
 */
export const validateImage = (
  file: File | Blob,
  maxSizeMB = 10
): { isValid: boolean; error?: string } => {
  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      isValid: false,
      error: `Image is too large (${formatFileSize(file.size)}). Maximum size is ${maxSizeMB}MB.`
    };
  }

  // Check file type
  if (file instanceof File) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: `Unsupported file type: ${file.type}. Allowed types: JPEG, PNG, GIF, WEBP.`
      };
    }
  }

  return { isValid: true };
};

/**
 * Sanitizes a filename to remove invalid characters
 * @param filename The filename to sanitize
 * @returns A sanitized filename
 */
export const sanitizeFileName = (filename: string): string => {
  // Remove invalid characters for filenames
  let sanitized = filename.replace(/[\\/:*?"<>|]/g, '-');
  
  // Replace multiple spaces/dashes with a single one
  sanitized = sanitized.replace(/\s+/g, ' ').replace(/-+/g, '-');
  
  // Trim spaces and dashes from start and end
  sanitized = sanitized.trim().replace(/^-+|-+$/g, '');
  
  // If filename is empty after sanitization, use a default name
  if (!sanitized) {
    sanitized = 'file';
  }
  
  return sanitized;
};

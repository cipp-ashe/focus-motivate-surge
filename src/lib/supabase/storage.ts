
import { supabase } from './client';
import { toast } from 'sonner';

/**
 * Upload a file to Supabase Storage
 * 
 * @param bucket Bucket name
 * @param path File path
 * @param file File to upload
 * @param options Upload options
 * @returns URL of the uploaded file or null if upload failed
 */
export const uploadFile = async (
  bucket: string,
  path: string,
  file: File | Blob | ArrayBuffer | string,
  options?: {
    contentType?: string;
    upsert?: boolean;
    cacheControl?: string;
  }
): Promise<string | null> => {
  try {
    // Ensure bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(b => b.name === bucket);
    
    if (!bucketExists) {
      // Create bucket if it doesn't exist
      const { error: createError } = await supabase.storage.createBucket(bucket, {
        public: true
      });
      
      if (createError) {
        console.error('Error creating bucket:', createError);
        toast.error('Failed to create storage bucket');
        return null;
      }
    }
    
    // Upload file
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        upsert: options?.upsert || false,
        contentType: options?.contentType,
        cacheControl: options?.cacheControl
      });
    
    if (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
      return null;
    }
    
    // Get public URL
    const { data: publicUrl } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);
    
    return publicUrl.publicUrl;
  } catch (error) {
    console.error('Error in uploadFile:', error);
    toast.error('Failed to upload file');
    return null;
  }
};

/**
 * Download a file from Supabase Storage
 * 
 * @param bucket Bucket name
 * @param path File path
 * @returns Downloaded file or null if download failed
 */
export const downloadFile = async (
  bucket: string,
  path: string
): Promise<Blob | null> => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .download(path);
    
    if (error) {
      console.error('Error downloading file:', error);
      toast.error('Failed to download file');
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in downloadFile:', error);
    toast.error('Failed to download file');
    return null;
  }
};

/**
 * Delete a file from Supabase Storage
 * 
 * @param bucket Bucket name
 * @param path File path
 * @returns true if deletion was successful, false otherwise
 */
export const deleteFile = async (
  bucket: string,
  path: string
): Promise<boolean> => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);
    
    if (error) {
      console.error('Error deleting file:', error);
      toast.error('Failed to delete file');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteFile:', error);
    toast.error('Failed to delete file');
    return false;
  }
};

/**
 * List files in a Supabase Storage bucket
 * 
 * @param bucket Bucket name
 * @param path Optional path prefix
 * @returns Array of files or empty array if request failed
 */
export const listFiles = async (
  bucket: string,
  path?: string
): Promise<any[]> => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(path || '');
    
    if (error) {
      console.error('Error listing files:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in listFiles:', error);
    return [];
  }
};


import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Upload, ImageIcon, Camera, Paperclip } from "lucide-react";
import { uploadFile } from "@/lib/supabase/storage";
import { useAuth } from "@/contexts/auth/AuthContext";
import { useTaskManager } from "@/hooks/tasks/useTaskManager";
import { validateImage, sanitizeFileName } from "@/utils/imageUtils";
import { useIsMobile } from "@/hooks/ui/useIsMobile";

interface ScreenshotUploadProps {
  onImageUpload: (imageData: string, fileName?: string, type?: "screenshot" | "image") => void;
}

export const ScreenshotUpload = ({ onImageUpload }: ScreenshotUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();
  const { createTask } = useTaskManager();
  const isMobile = useIsMobile();

  // Create a reference to the file input element
  const fileInputRef = useCallback((node: HTMLInputElement | null) => {
    if (node) {
      fileInputRef.current = node;
    }
  }, []);
  fileInputRef.current = null;

  const handlePaste = useCallback(
    async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (const item of Array.from(items)) {
        if (item.type.indexOf("image") !== -1) {
          const file = item.getAsFile();
          if (!file) continue;

          await processImage(file, "Pasted Screenshot", "screenshot");
        }
      }
    },
    [user]
  );

  useEffect(() => {
    document.addEventListener("paste", handlePaste);
    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, [handlePaste]);

  const processImage = async (file: File, fileName: string, type: "screenshot" | "image") => {
    if (!user) {
      toast.error("You must be logged in to upload screenshots");
      return;
    }

    try {
      setIsUploading(true);

      // Validate the image
      const validation = await validateImage(file);
      if (!validation.isValid) {
        toast.error(validation.error || "Invalid image");
        return;
      }

      // For mobile, support common image formats
      if (isMobile && !file.type.match(/image\/(jpeg|jpg|png|gif|webp|heic)/i)) {
        toast.error("Please upload a valid image file (JPEG, PNG, GIF, WebP)");
        return;
      }

      // Sanitize filename
      const sanitizedFileName = sanitizeFileName(fileName);
      const path = `screenshots/${user.id}/${Date.now()}_${sanitizedFileName}`;

      // Option 1: Read as DataURL for local storage (handle later with Supabase)
      const reader = new FileReader();
      reader.onload = async (e) => {
        if (e.target?.result) {
          const fileUrl = e.target.result as string;
          onImageUpload(fileUrl, sanitizedFileName, type);
          toast.success("Screenshot uploaded successfully");
        }
      };
      reader.readAsDataURL(file);

      // Option 2: Upload to Supabase Storage (if available)
      try {
        const fileUrl = await uploadFile("screenshots", path, file, {
          contentType: file.type,
          upsert: true
        });

        if (fileUrl) {
          // Create new task (handled in the parent component)
          toast.success("Screenshot uploaded to cloud");
        }
      } catch (error) {
        console.error("Supabase upload error:", error);
        // Continue with local storage option
      }
    } catch (error) {
      console.error("Error processing image:", error);
      toast.error("Failed to process image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    await processImage(file, file.name, "image");
    
    // Reset the input value so the same file can be selected again
    if (e.target) {
      e.target.value = "";
    }
  };

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (!file || !file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      await processImage(file, file.name, "image");
    },
    [user, processImage]
  );

  const handleClick = () => {
    setIsActive(true);
    
    // On mobile, trigger file picker; on desktop, suggest paste
    if (isMobile) {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    } else {
      toast.info("Press Ctrl+V (Cmd+V on Mac) to paste your screenshot");
      setTimeout(() => setIsActive(false), 3000);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  return (
    <>
      <input 
        type="file" 
        ref={fileInputRef}
        accept="image/*" 
        className="hidden" 
        onChange={handleFileSelect}
        capture={isMobile ? "environment" : undefined}
      />
      
      <Card
        className={`p-6 md:p-8 border-2 border-dashed transition-all duration-200 ${
          isUploading 
            ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10" 
            : isDragging 
              ? "border-primary bg-primary/5" 
              : isActive 
                ? "border-primary" 
                : "border-border"
        } rounded-lg cursor-pointer touch-action-manipulation`}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          {isUploading ? (
            <div className="animate-pulse">
              <Upload className="w-10 h-10 md:w-12 md:h-12 text-yellow-500" />
              <p className="text-base md:text-lg font-medium mt-2">Uploading...</p>
            </div>
          ) : isDragging ? (
            <Upload className="w-10 h-10 md:w-12 md:h-12 text-primary animate-bounce" />
          ) : isMobile ? (
            <div className="flex flex-col items-center gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center">
                  <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-full mb-2">
                    <Camera className="w-6 h-6 text-blue-500" />
                  </div>
                  <p className="text-sm">Camera</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-full mb-2">
                    <Paperclip className="w-6 h-6 text-green-500" />
                  </div>
                  <p className="text-sm">Gallery</p>
                </div>
              </div>
            </div>
          ) : (
            <ImageIcon className="w-10 h-10 md:w-12 md:h-12 text-muted-foreground" />
          )}
          
          <div>
            <p className="text-base md:text-lg font-medium">
              {isUploading 
                ? "Uploading screenshot to your account..."
                : isActive 
                  ? "Ready to paste! (Ctrl+V / Cmd+V)"
                  : isMobile
                    ? "Tap to add screenshot" 
                    : "Click here to paste or drop image files"}
            </p>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">
              {isMobile 
                ? "Supports: Camera and gallery images"
                : "Supports: Screenshots (via paste) and image files (via drag & drop)"}
            </p>
          </div>
        </div>
      </Card>
    </>
  );
};

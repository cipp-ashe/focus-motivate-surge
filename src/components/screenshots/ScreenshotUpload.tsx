
import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Upload, ImageIcon } from "lucide-react";
import { uploadFile } from "@/lib/supabase/storage";
import { useAuth } from "@/contexts/auth/AuthContext";
import { useTaskManager } from "@/hooks/tasks/useTaskManager";
import { validateImage, sanitizeFileName } from "@/utils/imageUtils";

interface ScreenshotUploadProps {
  onImageUpload: (imageData: string, fileName?: string, type?: "screenshot" | "image") => void;
}

export const ScreenshotUpload = ({ onImageUpload }: ScreenshotUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();
  const { createTask } = useTaskManager();

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

      // Sanitize filename
      const sanitizedFileName = sanitizeFileName(fileName);
      const path = `screenshots/${user.id}/${Date.now()}_${sanitizedFileName}`;

      // Upload to Supabase Storage
      const fileUrl = await uploadFile("screenshots", path, file, {
        contentType: file.type,
        upsert: true
      });

      if (!fileUrl) {
        toast.error("Failed to upload screenshot");
        return;
      }

      // Create new task
      const task = createTask({
        name: sanitizedFileName,
        description: "Screenshot captured " + new Date().toLocaleString(),
        completed: false,
        taskType: "screenshot",
        imageUrl: fileUrl,
        imageType: type,
        fileName: sanitizedFileName,
      });

      onImageUpload(fileUrl, sanitizedFileName, type);
      toast.success("Screenshot uploaded successfully");
    } catch (error) {
      console.error("Error processing image:", error);
      toast.error("Failed to process image");
    } finally {
      setIsUploading(false);
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
    toast.info("Press Ctrl+V (Cmd+V on Mac) to paste your screenshot");
    setTimeout(() => setIsActive(false), 3000);
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
    <Card
      className={`p-8 border-2 border-dashed transition-all duration-200 ${
        isUploading 
          ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10" 
          : isDragging 
            ? "border-primary bg-primary/5" 
            : isActive 
              ? "border-primary" 
              : "border-border"
      } rounded-lg cursor-pointer`}
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        {isUploading ? (
          <div className="animate-pulse">
            <Upload className="w-12 h-12 text-yellow-500" />
            <p className="text-lg font-medium mt-2">Uploading...</p>
          </div>
        ) : isDragging ? (
          <Upload className="w-12 h-12 text-primary animate-bounce" />
        ) : (
          <ImageIcon className="w-12 h-12 text-muted-foreground" />
        )}
        
        <div>
          <p className="text-lg font-medium">
            {isUploading 
              ? "Uploading screenshot to your account..."
              : isActive 
                ? "Ready to paste! (Ctrl+V / Cmd+V)"
                : "Click here to paste or drop image files"}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Supports: Screenshots (via paste) and image files (via drag & drop)
          </p>
        </div>
      </div>
    </Card>
  );
};

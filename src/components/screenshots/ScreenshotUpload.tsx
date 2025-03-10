
import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Upload, ImageIcon } from "lucide-react";

interface ScreenshotUploadProps {
  onImageUpload: (imageData: string, fileName?: string, type?: "screenshot" | "image") => void;
}

export const ScreenshotUpload = ({ onImageUpload }: ScreenshotUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const handlePaste = useCallback(
    (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (const item of Array.from(items)) {
        if (item.type.indexOf("image") !== -1) {
          const file = item.getAsFile();
          if (!file) continue;

          const reader = new FileReader();
          reader.onload = (event) => {
            if (typeof event.target?.result === "string") {
              onImageUpload(event.target.result, "Pasted Screenshot", "screenshot");
              toast.success("Screenshot uploaded from clipboard");
            }
          };
          reader.readAsDataURL(file);
        }
      }
    },
    [onImageUpload]
  );

  useEffect(() => {
    document.addEventListener("paste", handlePaste);
    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, [handlePaste]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (!file || !file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === "string") {
          onImageUpload(event.target.result, file.name, "image");
          toast.success(`Image "${file.name}" uploaded successfully`);
        }
      };
      reader.readAsDataURL(file);
    },
    [onImageUpload]
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
        isDragging ? "border-primary bg-primary/5" : isActive ? "border-primary" : "border-border"
      } rounded-lg cursor-pointer`}
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        {isDragging ? (
          <Upload className="w-12 h-12 text-primary animate-bounce" />
        ) : (
          <ImageIcon className="w-12 h-12 text-muted-foreground" />
        )}
        <div>
          <p className="text-lg font-medium">
            {isActive 
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

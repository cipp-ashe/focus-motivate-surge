
import React from "react";
import { Task } from "@/types/task";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  FileText, 
  HardDrive, 
  Image as ImageIcon,
  Info
} from "lucide-react";
import { formatDate } from "@/lib/utils/dateUtils";
import { formatFileSize } from "@/utils/imageUtils";

interface ScreenshotDetailsProps {
  task: Task;
}

export const ScreenshotDetails: React.FC<ScreenshotDetailsProps> = ({ task }) => {
  // Extract image dimensions from the Task if available
  const dimensions = task.imageMetadata?.dimensions || { width: 0, height: 0 };
  const fileSize = task.imageMetadata?.fileSize || 0;

  const formatTaskDate = (dateString?: string) => {
    if (!dateString) return "Unknown";
    return formatDate(dateString);
  };

  return (
    <div className="space-y-3 py-2 text-sm">
      <h4 className="font-medium text-sm flex items-center gap-1.5">
        <Info className="h-4 w-4" />
        Screenshot Details
      </h4>
      
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center gap-1.5">
          <ImageIcon className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-muted-foreground">Resolution:</span>
        </div>
        <div className="font-medium">
          {dimensions.width > 0 && dimensions.height > 0 
            ? `${dimensions.width} × ${dimensions.height}`
            : "Unknown"}
        </div>
        
        <div className="flex items-center gap-1.5">
          <HardDrive className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-muted-foreground">File size:</span>
        </div>
        <div className="font-medium">
          {fileSize > 0 ? formatFileSize(fileSize) : "Unknown"}
        </div>
        
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-muted-foreground">Created:</span>
        </div>
        <div className="font-medium">
          {formatTaskDate(task.createdAt)}
        </div>
        
        <div className="flex items-center gap-1.5">
          <FileText className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-muted-foreground">Format:</span>
        </div>
        <div className="font-medium">
          {task.imageMetadata?.format || "Unknown"}
        </div>
      </div>
      
      {task.tags && task.tags.length > 0 && (
        <div className="pt-1">
          <div className="text-muted-foreground mb-1">Tags:</div>
          <div className="flex flex-wrap gap-1">
            {task.tags.map(tag => (
              <Badge key={tag.id} variant="outline" className="text-xs">
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

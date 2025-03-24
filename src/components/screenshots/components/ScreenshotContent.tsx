
import React from "react";
import { Task } from "@/types/tasks";
import { Badge } from "@/components/ui/badge";
import { CardContent } from "@/components/ui/card";
import { Calendar, Download, Tag } from "lucide-react";
import { format } from "date-fns";
import { TimerMetrics } from "@/types/metrics";
import { ScreenshotDetails } from "./ScreenshotDetails";
import { Button } from "@/components/ui/button";
import { downloadContent } from "@/utils/downloadUtils";
import { toast } from "sonner";

interface ScreenshotContentProps {
  task: Task;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
}

export const ScreenshotContent: React.FC<ScreenshotContentProps> = ({
  task,
  isExpanded,
  setIsExpanded,
}) => {
  const formatTaskDate = (dateString?: string) => {
    if (!dateString) return "Unknown";
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (e) {
      return "Invalid date";
    }
  };

  // Format the task's metrics for display if present
  const metrics = task.metrics as TimerMetrics;
  const completionDate = task.completedAt || metrics?.completionDate;

  const handleDownload = async () => {
    if (!task.imageUrl) {
      toast.error("No image available to download");
      return;
    }

    try {
      // Generate a filename based on the task name and date
      const timestamp = format(new Date(task.createdAt), "yyyy-MM-dd-HHmmss");
      const sanitizedName = task.name.replace(/[^a-z0-9]/gi, "-").toLowerCase();
      const filename = `screenshot-${sanitizedName}-${timestamp}.${task.imageMetadata?.format?.toLowerCase() || 'png'}`;
      
      // Fetch the image as blob
      const response = await fetch(task.imageUrl);
      const blob = await response.blob();
      const content = await blob.text();
      
      // Download the file using the utility function
      await downloadContent(content, filename, blob.type);
    } catch (error) {
      console.error("Error downloading screenshot:", error);
      toast.error("Failed to download screenshot");
    }
  };

  return (
    <CardContent className="p-4 pt-3">
      <div className="relative aspect-video bg-muted rounded-md overflow-hidden mb-3">
        {task.imageUrl ? (
          <img
            src={task.imageUrl}
            alt={task.name}
            className={`w-full h-full object-contain transition-all duration-300 ${
              isExpanded ? "cursor-zoom-out" : "cursor-zoom-in"
            }`}
            onClick={() => setIsExpanded(!isExpanded)}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No image
          </div>
        )}
        
        {task.imageUrl && (
          <Button 
            variant="secondary" 
            size="sm" 
            className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm hover:bg-background/90"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
        )}
      </div>
      
      {isExpanded && (
        <>
          {task.capturedText && (
            <div className="mt-3 mb-3 text-sm">
              <h4 className="font-medium mb-1">Captured Text:</h4>
              <p className="text-muted-foreground text-xs whitespace-pre-line">
                {task.capturedText}
              </p>
            </div>
          )}
          
          <ScreenshotDetails task={task} />
        </>
      )}
      
      <div className="flex flex-wrap gap-1 mt-2">
        <Badge variant="outline" className="text-xs flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {formatTaskDate(task.createdAt)}
        </Badge>
        
        {completionDate && (
          <Badge variant="outline" className="text-xs bg-secondary/50 flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Completed: {formatTaskDate(completionDate)}
          </Badge>
        )}
        
        {task.tags && task.tags.length > 0 && (
          <Badge variant="outline" className="text-xs flex items-center gap-1">
            <Tag className="h-3 w-3" />
            {task.tags[0].name}
            {task.tags.length > 1 && `+${task.tags.length - 1}`}
          </Badge>
        )}
      </div>
    </CardContent>
  );
};

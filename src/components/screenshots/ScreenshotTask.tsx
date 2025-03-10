
import { useState } from "react";
import { Task } from "@/types/tasks";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, Maximize, Minimize, ExternalLink } from "lucide-react";
import { eventBus } from "@/lib/eventBus";

interface ScreenshotTaskProps {
  task: Task;
  onComplete?: () => void;
}

export const ScreenshotTask: React.FC<ScreenshotTaskProps> = ({ task, onComplete }) => {
  const [expanded, setExpanded] = useState(false);
  
  const handleComplete = () => {
    eventBus.emit('task:complete', { 
      taskId: task.id,
      metrics: {
        completionDate: new Date().toISOString()
      }
    });
    if (onComplete) onComplete();
  };

  const handleDelete = () => {
    eventBus.emit('task:delete', { taskId: task.id });
  };

  return (
    <Card className="overflow-hidden">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <h3 className="font-medium truncate">{task.name}</h3>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-red-500 hover:text-red-700"
              onClick={handleDelete}
            >
              <X className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-green-500 hover:text-green-700"
              onClick={handleComplete}
            >
              <Check className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {task.imageUrl && (
        <div className={`relative ${expanded ? 'h-96' : 'h-48'} transition-all duration-300`}>
          <img 
            src={task.imageUrl} 
            alt={task.name}
            className="w-full h-full object-contain"
          />
          <div className="absolute bottom-2 right-2">
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={() => window.open(task.imageUrl, '_blank')}
              className="flex items-center gap-1"
            >
              <ExternalLink className="h-3 w-3" />
              <span className="text-xs">View Full</span>
            </Button>
          </div>
        </div>
      )}
      
      {task.description && (
        <div className="p-4 bg-muted/30">
          <p className="text-sm">{task.description}</p>
          {task.capturedText && (
            <div className="mt-2 p-2 border border-border rounded text-xs text-muted-foreground">
              <p className="font-mono">{task.capturedText}</p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

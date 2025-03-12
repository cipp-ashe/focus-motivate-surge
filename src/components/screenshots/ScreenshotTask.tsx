
import { useState } from "react";
import { Task } from "@/types/tasks";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Eye, Trash, Calendar, Tag, Edit, Save, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { TimerMetrics } from "@/types/metrics";
import { toast } from "sonner";
import { eventBus } from "@/lib/eventBus";

interface ScreenshotTaskProps {
  task: Task;
}

export const ScreenshotTask: React.FC<ScreenshotTaskProps> = ({ task }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(task.name);
  const [editedDescription, setEditedDescription] = useState(task.description || "");

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

  const handleDelete = () => {
    eventBus.emit('task:delete', { taskId: task.id });
    toast.success("Screenshot deleted");
  };

  const handleSaveEdit = () => {
    if (!editedName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    const updates = {
      name: editedName.trim(),
      description: editedDescription.trim()
    };

    eventBus.emit('task:update', { 
      taskId: task.id, 
      updates 
    });

    setIsEditing(false);
    toast.success("Screenshot details updated");
  };

  const handleCancelEdit = () => {
    setEditedName(task.name);
    setEditedDescription(task.description || "");
    setIsEditing(false);
  };

  return (
    <Card className="overflow-hidden transition-all duration-200 h-full">
      <CardHeader className="p-4 pb-0">
        {isEditing ? (
          <div className="space-y-2">
            <Input
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              placeholder="Screenshot name"
              className="font-medium"
              autoFocus
            />
            <Textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              placeholder="Add a description"
              className="min-h-[60px] text-sm"
            />
          </div>
        ) : (
          <>
            <CardTitle className="text-base font-medium line-clamp-1">
              {task.name}
            </CardTitle>
            <CardDescription className="line-clamp-1">
              {task.description || "No description"}
            </CardDescription>
          </>
        )}
      </CardHeader>
      
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
        </div>
        
        {isExpanded && task.capturedText && (
          <div className="mt-3 mb-3 text-sm">
            <h4 className="font-medium mb-1">Captured Text:</h4>
            <p className="text-muted-foreground text-xs whitespace-pre-line">
              {task.capturedText}
            </p>
          </div>
        )}
        
        <div className="flex flex-wrap gap-1 mt-2">
          <Badge variant="outline" className="text-xs flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatTaskDate(task.createdAt)}
          </Badge>
          
          {completionDate && (
            <Badge variant="outline" className="text-xs bg-green-50 flex items-center gap-1">
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
      
      <CardFooter className="p-4 pt-0 flex justify-between">
        {isEditing ? (
          <>
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-8"
              onClick={handleCancelEdit}
            >
              <X className="h-3 w-3 mr-1" />
              Cancel
            </Button>
            
            <Button
              variant="default"
              size="sm"
              className="text-xs h-8"
              onClick={handleSaveEdit}
            >
              <Save className="h-3 w-3 mr-1" />
              Save
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-8"
              onClick={() => isExpanded ? setIsExpanded(false) : setIsExpanded(true)}
            >
              <Eye className="h-3 w-3 mr-1" />
              {isExpanded ? "Less" : "More"}
            </Button>
            
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-8"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="h-3 w-3 mr-1" />
                Edit
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-8 text-destructive hover:bg-destructive/10"
                onClick={handleDelete}
              >
                <Trash className="h-3 w-3 mr-1" />
                Delete
              </Button>
            </div>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

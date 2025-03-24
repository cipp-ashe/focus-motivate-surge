
import { useState, useEffect } from "react";
import { Task } from "@/types/task";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { eventManager } from "@/lib/events/EventManager";
import { ScreenshotHeader } from "./components/ScreenshotHeader";
import { ScreenshotContent } from "./components/ScreenshotContent";
import { ScreenshotFooter } from "./components/ScreenshotFooter";
import { extractImageMetadata } from "@/utils/imageUtils";
import { useIsMobile } from "@/hooks/ui/useIsMobile";

interface ScreenshotTaskProps {
  task: Task;
}

export const ScreenshotTask: React.FC<ScreenshotTaskProps> = ({ task }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(task.name);
  const [editedDescription, setEditedDescription] = useState(task.description || "");
  const isMobile = useIsMobile();

  // On mobile, auto-expand the first screenshot if there's only one
  useEffect(() => {
    if (isMobile) {
      setIsExpanded(true);
    }
  }, [isMobile]);

  useEffect(() => {
    // Extract and update image metadata if it doesn't exist
    const updateMetadata = async () => {
      if (task.imageUrl && !task.imageMetadata) {
        try {
          const metadata = await extractImageMetadata(task.imageUrl);
          
          eventManager.emit('task:update', { 
            taskId: task.id, 
            updates: { imageMetadata: metadata }
          });
        } catch (error) {
          console.error("Error extracting image metadata:", error);
        }
      }
    };
    
    updateMetadata();
  }, [task.id, task.imageUrl, task.imageMetadata]);

  const handleDelete = () => {
    eventManager.emit('task:delete', { taskId: task.id });
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

    eventManager.emit('task:update', { 
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

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Card className={`overflow-hidden transition-all duration-200 h-full ${isMobile ? 'shadow-sm' : 'shadow'}`}>
      <ScreenshotHeader 
        task={task}
        isEditing={isEditing}
        editedName={editedName}
        editedDescription={editedDescription}
        setEditedName={setEditedName}
        setEditedDescription={setEditedDescription}
        isMobile={isMobile}
      />
      
      <ScreenshotContent 
        task={task}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
      />
      
      <ScreenshotFooter 
        isExpanded={isExpanded}
        isEditing={isEditing}
        onToggleExpand={toggleExpanded}
        onEdit={() => setIsEditing(true)}
        onSave={handleSaveEdit}
        onCancel={handleCancelEdit}
        onDelete={handleDelete}
        isMobile={isMobile}
      />
    </Card>
  );
};

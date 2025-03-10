import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { ScreenshotUpload } from "@/components/screenshots/ScreenshotUpload";
import { ScreenshotList } from "@/components/screenshots/ScreenshotList";
import { Task } from "@/types/tasks";
import { eventBus } from "@/lib/eventBus";
import { validateImage, sanitizeFileName } from "@/utils/imageUtils";

const Screenshots = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  // Load existing screenshot tasks when the component mounts
  useEffect(() => {
    const allTasks = JSON.parse(localStorage.getItem('taskList') || '[]');
    const screenshotTasks = allTasks.filter((task: Task) => 
      task.taskType === 'screenshot' || task.imageUrl
    );
    setTasks(screenshotTasks);
  }, []);

  const handleImageUpload = async (
    imageData: string,
    fileName?: string,
    type?: "screenshot" | "image"
  ) => {
    try {
      // Convert base64 to blob for validation
      const response = await fetch(imageData);
      const blob = await response.blob();
      
      // Validate the image
      const validation = validateImage(blob);
      if (!validation.isValid) {
        toast.error(validation.error || "Invalid image");
        return;
      }

      // Sanitize filename
      const sanitizedFileName = fileName ? sanitizeFileName(fileName) : "Screenshot";

      // Create new task
      const newTask: Task = {
        id: uuidv4(),
        name: sanitizedFileName,
        description: "Screenshot captured " + new Date().toLocaleString(),
        completed: false,
        taskType: "screenshot",
        createdAt: new Date().toISOString(),
        imageUrl: imageData,
        imageType: type || "screenshot",
        fileName: sanitizedFileName,
      };

      // Add to state
      setTasks(prev => [newTask, ...prev]);
      
      // Add to task system via event bus
      eventBus.emit('task:create', newTask);
      
      toast.success("Screenshot task created");
    } catch (error) {
      console.error("Error processing image:", error);
      toast.error("Failed to process image");
    }
  };

  // Subscribe to task events to keep the list in sync
  useEffect(() => {
    const handleTaskUpdate = (data: { taskId: string, updates: Partial<Task> }) => {
      setTasks(prev => prev.map(task => 
        task.id === data.taskId ? { ...task, ...data.updates } : task
      ));
    };

    const handleTaskDelete = (data: { taskId: string }) => {
      setTasks(prev => prev.filter(task => task.id !== data.taskId));
    };

    const handleTaskComplete = (data: { taskId: string }) => {
      setTasks(prev => prev.filter(task => task.id !== data.taskId));
    };

    // Subscribe to events
    const unsubscribeUpdate = eventBus.on('task:update', handleTaskUpdate);
    const unsubscribeDelete = eventBus.on('task:delete', handleTaskDelete);
    const unsubscribeComplete = eventBus.on('task:complete', handleTaskComplete);

    return () => {
      // Unsubscribe when component unmounts
      unsubscribeUpdate();
      unsubscribeDelete();
      unsubscribeComplete();
    };
  }, []);

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
        Screenshot Manager
      </h1>
      
      <div className="grid grid-cols-1 gap-8">
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Upload Screenshot</h2>
          <ScreenshotUpload onImageUpload={handleImageUpload} />
        </div>
        
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Your Screenshots</h2>
          <ScreenshotList tasks={tasks} />
        </div>
      </div>
    </div>
  );
};

export default Screenshots;

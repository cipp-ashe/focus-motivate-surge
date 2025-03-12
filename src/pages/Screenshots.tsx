import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ScreenshotUpload } from "@/components/screenshots/ScreenshotUpload";
import { ScreenshotList } from "@/components/screenshots/ScreenshotList";
import { Task } from "@/types/tasks";
import { eventBus } from "@/lib/eventBus";
import { validateImage, sanitizeFileName } from "@/utils/imageUtils";
import { taskStorage } from "@/lib/storage/taskStorage";
import { useTaskManager } from "@/hooks/tasks/useTaskManager";

const Screenshots = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { createTask } = useTaskManager();

  // Load existing screenshot tasks when the component mounts
  useEffect(() => {
    loadScreenshotTasks();
    
    // Set up event listeners to keep the list in sync
    const handleTaskUpdate = (data: { taskId: string, updates: Partial<Task> }) => {
      setTasks(prev => prev.map(task => 
        task.id === data.taskId ? { ...task, ...data.updates } : task
      ));
    };

    const handleTaskDelete = (data: { taskId: string }) => {
      setTasks(prev => prev.filter(task => task.id !== data.taskId));
    };

    // Subscribe to events
    const unsubscribeUpdate = eventBus.on('task:update', handleTaskUpdate);
    const unsubscribeDelete = eventBus.on('task:delete', handleTaskDelete);
    
    // Listen for storage changes from other tabs/windows
    const handleStorageChange = () => {
      loadScreenshotTasks();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('tasksUpdated', handleStorageChange);

    return () => {
      unsubscribeUpdate();
      unsubscribeDelete();
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('tasksUpdated', handleStorageChange);
    };
  }, []);

  const loadScreenshotTasks = () => {
    const allTasks = taskStorage.loadTasks();
    const screenshotTasks = allTasks.filter((task: Task) => 
      task.taskType === 'screenshot'
    );
    setTasks(screenshotTasks);
  };

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
      const task = createTask({
        name: sanitizedFileName,
        description: "Screenshot captured " + new Date().toLocaleString(),
        completed: false,
        taskType: "screenshot",
        imageUrl: imageData,
        imageType: type || "screenshot",
        fileName: sanitizedFileName,
      });

      toast.success("Screenshot saved");
      loadScreenshotTasks(); // Reload from storage to ensure consistency
    } catch (error) {
      console.error("Error processing image:", error);
      toast.error("Failed to process image");
    }
  };

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

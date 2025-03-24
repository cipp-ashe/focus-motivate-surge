
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ScreenshotUpload } from "@/components/screenshots/ScreenshotUpload";
import { ScreenshotList } from "@/components/screenshots/ScreenshotList";
import { Task } from "@/types/tasks";
import { eventManager } from "@/lib/events/EventManager";
import { validateImage, sanitizeFileName } from "@/utils/imageUtils";
import { taskStorage } from "@/lib/storage/taskStorage";
import { useTaskManager } from "@/hooks/tasks/useTaskManager";
import { useIsMobile } from "@/hooks/ui/useIsMobile";
import { Info, Camera, Upload, Image } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { GlassCard, GlassCardContent } from "@/components/ui/glass-card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Screenshots = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { createTask } = useTaskManager();
  const isMobile = useIsMobile();

  useEffect(() => {
    loadScreenshotTasks();
    
    const handleTaskUpdate = (data: { taskId: string, updates: Partial<Task> }) => {
      setTasks(prev => prev.map(task => 
        task.id === data.taskId ? { ...task, ...data.updates } : task
      ));
    };

    const handleTaskDelete = (data: { taskId: string }) => {
      setTasks(prev => prev.filter(task => task.id !== data.taskId));
    };

    const unsubscribeUpdate = eventManager.on('task:update', handleTaskUpdate);
    const unsubscribeDelete = eventManager.on('task:delete', handleTaskDelete);
    
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
      const response = await fetch(imageData);
      const blob = await response.blob();
      
      const validation = validateImage(blob);
      if (!validation.isValid) {
        toast.error(validation.error || "Invalid image");
        return;
      }

      const sanitizedFileName = fileName ? sanitizeFileName(fileName) : "Screenshot";

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
      loadScreenshotTasks();
    } catch (error) {
      console.error("Error processing image:", error);
      toast.error("Failed to process image");
    }
  };

  const MobileInstructions = () => (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="flex items-start gap-3 text-sm">
          <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium mb-1">Screenshot tips:</p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2">
                <Camera className="h-4 w-4 text-primary" />
                <span>Take screenshots with your phone's native controls</span>
              </li>
              <li className="flex items-center gap-2">
                <Upload className="h-4 w-4 text-primary" />
                <span>Upload from your gallery by tapping the upload area</span>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isMobile) {
    return (
      <div className="container mx-auto py-4 px-3 animate-fade-in">
        <PageHeader
          title="Screenshot Manager"
          description="Capture and organize screenshots from your device"
          icon={Image}
        />
        
        <MobileInstructions />
        
        <div className="space-y-6">
          <div>
            <h2 className="text-base font-medium mb-2">Upload Screenshot</h2>
            <ScreenshotUpload onImageUpload={handleImageUpload} />
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full mt-2">
                  <Info className="h-4 w-4 mr-2" />
                  How to capture screenshots
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[50vh]">
                <SheetHeader>
                  <SheetTitle>Screenshot Tips</SheetTitle>
                  <SheetDescription>
                    Here's how to capture and manage screenshots on mobile
                  </SheetDescription>
                </SheetHeader>
                <div className="py-4 space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">Option 1: Use native controls</h3>
                    <p className="text-sm text-muted-foreground">
                      Take a screenshot using your phone's built-in controls, then share it to this app or upload from your gallery.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">Option 2: Upload from gallery</h3>
                    <p className="text-sm text-muted-foreground">
                      Tap the upload area to select images from your device's photo library.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">Option 3: Copy & paste</h3>
                    <p className="text-sm text-muted-foreground">
                      Copy an image elsewhere, then tap the upload area and paste it.
                    </p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          
          <div>
            <h2 className="text-base font-medium mb-2">Your Screenshots</h2>
            <ScreenshotList tasks={tasks} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 animate-fade-in">
      <PageHeader
        title="Screenshot Manager"
        description="Capture and organize screenshots from your device"
        icon={Image}
      />
      
      <div className="grid grid-cols-1 gap-8">
        <GlassCard>
          <GlassCardContent>
            <h2 className="text-lg font-medium mb-4">Upload Screenshot</h2>
            <ScreenshotUpload onImageUpload={handleImageUpload} />
          </GlassCardContent>
        </GlassCard>
        
        <GlassCard>
          <GlassCardContent>
            <h2 className="text-lg font-medium mb-4">Your Screenshots</h2>
            <ScreenshotList tasks={tasks} />
          </GlassCardContent>
        </GlassCard>
      </div>
    </div>
  );
};

export default Screenshots;

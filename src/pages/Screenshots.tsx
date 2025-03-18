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
import { Info, Camera, Upload } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  const [activeTab, setActiveTab] = useState<string>("gallery");

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

    // Subscribe to events - using the newer eventManager API
    const unsubscribeUpdate = eventManager.on('task:update', handleTaskUpdate);
    const unsubscribeDelete = eventManager.on('task:delete', handleTaskDelete);
    
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
      
      // Switch to gallery tab after upload on mobile
      if (isMobile) {
        setActiveTab("gallery");
      }
    } catch (error) {
      console.error("Error processing image:", error);
      toast.error("Failed to process image");
    }
  };

  // Mobile instructions content
  const MobileInstructions = () => (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="flex items-start gap-3 text-sm">
          <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium mb-1">Mobile tips:</p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2">
                <Camera className="h-4 w-4 text-primary" />
                <span>Take screenshots with your phone's native controls</span>
              </li>
              <li className="flex items-center gap-2">
                <Upload className="h-4 w-4 text-primary" />
                <span>Upload from your photo library by tapping the upload area</span>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Mobile-specific layout with tabs
  if (isMobile) {
    return (
      <div className="container mx-auto py-4 px-3">
        <h1 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
          Screenshot Manager
        </h1>
        
        <MobileInstructions />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
          </TabsList>
          
          <TabsContent value="gallery" className="mt-0">
            <div className="space-y-4">
              <ScreenshotList tasks={tasks} />
            </div>
          </TabsContent>
          
          <TabsContent value="upload" className="mt-0">
            <div className="space-y-4">
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
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // Desktop layout (original layout with refinements)
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

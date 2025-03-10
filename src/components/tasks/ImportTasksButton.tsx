
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import type { Task } from "@/types/tasks";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

interface ImportTasksButtonProps {
  onTasksImport: (tasks: Omit<Task, 'id' | 'createdAt'>[]) => void;
}

export const ImportTasksButton = ({ onTasksImport }: ImportTasksButtonProps) => {
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      // Basic validation of imported data
      if (!Array.isArray(data)) {
        throw new Error('Imported data must be an array of tasks');
      }

      // Transform the data to match our task format
      const tasks = data.map(item => ({
        name: typeof item.name === 'string' ? item.name : 
              typeof item.title === 'string' ? item.title :
              typeof item.text === 'string' ? item.text :
              'Unnamed Task',
        duration: typeof item.duration === 'number' ? item.duration :
                 typeof item.estimatedMinutes === 'number' ? item.estimatedMinutes * 60 :
                 1500, // Default 25 minutes
        completed: false
      }));

      onTasksImport(tasks);
      toast.success(`Successfully imported ${tasks.length} tasks`);
      event.target.value = ''; // Reset the input
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to import tasks. Please check the file format.');
    }
  };

  return (
    <div className="relative">
      <input
        type="file"
        accept=".json"
        onChange={handleFileSelect}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        aria-label="Import tasks from file"
      />
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="relative border-primary/20 hover:bg-primary/5 transition-all duration-200"
              type="button"
            >
              <Upload className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Import tasks from JSON file</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

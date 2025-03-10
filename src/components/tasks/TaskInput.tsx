
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Task, TaskType, ChecklistItem } from '@/types/tasks';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { TaskTypeSelector } from './TaskTypeSelector';
import { Plus, Trash2, Upload, Mic, Info } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import VoiceRecorder from '@/components/voiceNotes/VoiceRecorder';
import { useVoiceNotes } from '@/contexts/voiceNotes/VoiceNotesContext';
import { toast } from 'sonner';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TaskInputProps {
  onTaskAdd: (task: Task) => void;
  onTasksAdd: (tasks: Task[]) => void;
}

export const TaskInput: React.FC<TaskInputProps> = ({ onTaskAdd, onTasksAdd }) => {
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskType, setTaskType] = useState<TaskType>('regular');
  const [duration, setDuration] = useState(25); // Default 25 minutes
  const [journalEntry, setJournalEntry] = useState('');
  const [voiceNoteText, setVoiceNoteText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([
    { id: uuidv4(), text: '', completed: false }
  ]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { addNote } = useVoiceNotes();

  const handleAddTask = () => {
    if (!taskName.trim()) return;

    // Validate specific task type requirements
    if (taskType === 'screenshot' && !selectedImage) {
      toast.error("Please upload a screenshot image");
      return;
    }

    if (taskType === 'voicenote' && !voiceNoteText.trim()) {
      toast.error("Please record or type a voice note");
      return;
    }

    const newTask: Task = {
      id: uuidv4(),
      name: taskName.trim(),
      description: taskDescription.trim() || undefined,
      taskType: taskType,
      completed: false,
      createdAt: new Date().toISOString(),
      // Add specific properties based on task type
      ...(taskType === 'timer' ? { 
        duration: duration * 60  // Convert minutes to seconds
      } : {}),
      ...(taskType === 'journal' ? { 
        journalEntry: journalEntry.trim() 
      } : {}),
      ...(taskType === 'checklist' ? { 
        checklistItems: checklistItems.filter(item => item.text.trim())
      } : {}),
      ...(taskType === 'voicenote' ? {
        voiceNoteText: voiceNoteText.trim()
      } : {}),
      ...(taskType === 'screenshot' && selectedImage ? {
        imageType: 'image',
        fileName: selectedImage.name
      } : {})
    };

    onTaskAdd(newTask);
    
    // Add to voice notes if it's a voice note task
    if (taskType === 'voicenote' && voiceNoteText.trim()) {
      addNote(voiceNoteText.trim());
    }

    // Handle image upload if it's a screenshot task
    if (taskType === 'screenshot' && selectedImage) {
      handleImageUpload(newTask.id, selectedImage);
    }
    
    resetForm();
  };

  const handleImageUpload = (taskId: string, image: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // In a real app, you might upload to a server here
      // For now, we'll store it in localStorage as base64
      if (typeof reader.result === 'string') {
        localStorage.setItem(`screenshot_${taskId}`, reader.result);
        toast.success('Screenshot saved with task');
      }
    };
    reader.readAsDataURL(image);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setTaskName('');
    setTaskDescription('');
    setTaskType('regular');
    setDuration(25);
    setJournalEntry('');
    setVoiceNoteText('');
    setChecklistItems([{ id: uuidv4(), text: '', completed: false }]);
    setIsRecording(false);
    setSelectedImage(null);
    setImagePreview(null);
  };

  const addChecklistItem = () => {
    setChecklistItems([...checklistItems, { id: uuidv4(), text: '', completed: false }]);
  };

  const updateChecklistItem = (id: string, text: string) => {
    setChecklistItems(items => 
      items.map(item => item.id === id ? { ...item, text } : item)
    );
  };

  const removeChecklistItem = (id: string) => {
    if (checklistItems.length <= 1) return;
    setChecklistItems(items => items.filter(item => item.id !== id));
  };

  // Handler for voice note recording completion
  const handleVoiceRecordingComplete = (text: string) => {
    setVoiceNoteText(text);
    setIsRecording(false);
  };

  // Get task type help text
  const getTaskTypeHelpText = () => {
    switch(taskType) {
      case 'timer':
        return "A task with a timer to track your focused work time";
      case 'screenshot':
        return "Upload a screenshot to create a visual record";
      case 'habit':
        return "A recurring task to build a habit";
      case 'journal':
        return "Write a journal entry to record your thoughts";
      case 'checklist':
        return "Create a list of subtasks to complete";
      case 'voicenote':
        return "Record or type a voice note as a reminder";
      default:
        return "A standard task without special features";
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="task-name">Task Name</Label>
          <Input
            id="task-name"
            placeholder="Enter task name"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="task-description">Description (Optional)</Label>
          <Textarea
            id="task-description"
            placeholder="Add details about this task"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            rows={2}
          />
        </div>
        
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="task-type">Task Type</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-5 w-5">
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{getTaskTypeHelpText()}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <TaskTypeSelector 
            value={taskType} 
            onChange={setTaskType} 
          />
        </div>
        
        {taskType === 'timer' && (
          <div className="grid gap-2">
            <Label htmlFor="task-duration">Duration (minutes)</Label>
            <Input
              id="task-duration"
              type="number"
              min={1}
              max={120}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
            />
          </div>
        )}
        
        {taskType === 'journal' && (
          <div className="grid gap-2">
            <Label htmlFor="journal-entry">Journal Entry</Label>
            <Textarea
              id="journal-entry"
              placeholder="Write your journal entry here..."
              value={journalEntry}
              onChange={(e) => setJournalEntry(e.target.value)}
              rows={4}
            />
          </div>
        )}
        
        {taskType === 'screenshot' && (
          <div className="grid gap-2">
            <Label htmlFor="screenshot-upload">Upload Screenshot</Label>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Input
                  id="screenshot-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('screenshot-upload')?.click()}
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {selectedImage ? 'Change Image' : 'Upload Image'}
                </Button>
              </div>
              
              {imagePreview && (
                <div className="relative mt-2">
                  <img 
                    src={imagePreview} 
                    alt="Screenshot preview" 
                    className="max-h-40 rounded-md object-contain mx-auto border border-border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-1 right-1"
                    onClick={() => {
                      setSelectedImage(null);
                      setImagePreview(null);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              )}
              
              {!selectedImage && (
                <p className="text-sm text-muted-foreground">
                  Upload a screenshot to create a visual task. You can attach notes to this image later.
                </p>
              )}
            </div>
          </div>
        )}
        
        {taskType === 'voicenote' && (
          <div className="grid gap-2">
            <Label htmlFor="voice-note">Voice Note</Label>
            {isRecording ? (
              <div className="p-4 border border-border rounded-md">
                <VoiceRecorder 
                  onComplete={handleVoiceRecordingComplete} 
                  compact={true}
                />
              </div>
            ) : (
              <div className="space-y-4">
                <Textarea
                  id="voice-note"
                  placeholder="Type your voice note or click 'Record Voice Note' to speak"
                  value={voiceNoteText}
                  onChange={(e) => setVoiceNoteText(e.target.value)}
                  rows={4}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsRecording(true)}
                  className="flex items-center gap-2"
                >
                  <Mic className="h-4 w-4" />
                  Record Voice Note
                </Button>
              </div>
            )}
          </div>
        )}
        
        {taskType === 'checklist' && (
          <div className="grid gap-2">
            <div className="flex justify-between items-center">
              <Label>Checklist Items</Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={addChecklistItem}
                className="flex items-center gap-1"
              >
                <Plus className="h-3 w-3" /> Add Item
              </Button>
            </div>
            <div className="space-y-2 mt-1">
              {checklistItems.map((item, index) => (
                <div key={item.id} className="flex items-center gap-2">
                  <Input
                    placeholder={`Item ${index + 1}`}
                    value={item.text}
                    onChange={(e) => updateChecklistItem(item.id, e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeChecklistItem(item.id)}
                    disabled={checklistItems.length <= 1}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <Button 
        onClick={handleAddTask} 
        disabled={!taskName.trim() || (taskType === 'screenshot' && !selectedImage) || (taskType === 'voicenote' && !voiceNoteText.trim())}
        className="w-full"
      >
        Add Task
      </Button>
    </div>
  );
};

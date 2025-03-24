
import React, { useState, useEffect } from 'react';
import { Task } from '@/types/tasks';
import { eventManager } from '@/lib/events/EventManager';
import { toast } from 'sonner';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit, Save, X, Play, Pause, Volume2 } from 'lucide-react';

interface VoiceNoteDialogProps {
  task: Task;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const VoiceNoteDialog: React.FC<VoiceNoteDialogProps> = ({
  task,
  isOpen,
  onOpenChange,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(task.name);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setEditedName(task.name);
      setIsEditing(false);
      
      // Clean up any existing audio element
      if (audioElement) {
        audioElement.pause();
        audioElement.src = '';
      }
      
      // Create a new audio element if we have a URL
      if (task.voiceNoteUrl) {
        const audio = new Audio(task.voiceNoteUrl);
        setAudioElement(audio);
        
        audio.addEventListener('ended', () => {
          setIsPlaying(false);
        });
      }
    }
    
    // Clean up
    return () => {
      if (audioElement) {
        audioElement.pause();
        audioElement.src = '';
      }
    };
  }, [isOpen, task.name, task.voiceNoteUrl]);

  const handleSaveEdit = () => {
    if (!editedName.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    const updates = {
      name: editedName.trim()
    };

    eventManager.emit('task:update', { 
      taskId: task.id, 
      updates 
    });

    setIsEditing(false);
    toast.success('Voice note details updated');
  };

  const handleCancelEdit = () => {
    setEditedName(task.name);
    setIsEditing(false);
  };

  const togglePlayback = () => {
    if (!audioElement) return;
    
    if (isPlaying) {
      audioElement.pause();
    } else {
      audioElement.play().catch(err => {
        console.error('Failed to play audio:', err);
        toast.error('Failed to play voice note');
      });
    }
    
    setIsPlaying(!isPlaying);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader className="flex flex-col space-y-1.5 pb-2">
          {isEditing ? (
            <div className="space-y-2">
              <Input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                placeholder="Voice note name"
                className="font-medium"
                autoFocus
              />
            </div>
          ) : (
            <DialogTitle className="text-xl">{task.name}</DialogTitle>
          )}
          
          {/* Edit/Save buttons */}
          <div className="flex justify-end space-x-2 mt-2">
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
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-8"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="h-3 w-3 mr-1" />
                Edit
              </Button>
            )}
          </div>
        </DialogHeader>

        {task.voiceNoteUrl && (
          <div className="flex flex-col gap-4 mt-4">
            <div className="bg-muted rounded-md p-4 flex items-center justify-between">
              <Volume2 className="h-5 w-5 text-primary mr-2" />
              <div className="flex-1">
                <div className="h-2 bg-primary/20 rounded-full relative">
                  <div className="h-full bg-primary rounded-full" style={{ width: isPlaying ? '50%' : '0%' }} />
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="ml-2"
                onClick={togglePlayback}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
            </div>
            
            <div className="text-sm text-muted-foreground">
              {task.voiceNoteDuration ? (
                <span>Duration: {Math.floor(task.voiceNoteDuration / 60)}:{(task.voiceNoteDuration % 60).toString().padStart(2, '0')}</span>
              ) : (
                <span>Voice note recorded for task</span>
              )}
            </div>
            
            {task.voiceNoteText && (
              <div className="mt-2">
                <h4 className="text-sm font-medium mb-1">Transcription:</h4>
                <div className="bg-muted/50 p-3 rounded text-sm">{task.voiceNoteText}</div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

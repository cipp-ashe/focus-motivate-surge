
import React, { useState, useEffect } from 'react';
import { Task } from '@/types/tasks';
import { eventBus } from '@/lib/eventBus';
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

    eventBus.emit('task:update', { 
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
        
        <div className="mt-6 flex flex-col items-center justify-center space-y-4">
          {task.voiceNoteUrl ? (
            <>
              <div className="w-full max-w-xs bg-muted/40 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-primary h-full"
                  style={{ width: isPlaying ? '100%' : '0%', transition: 'width 0.1s linear' }}
                ></div>
              </div>
              
              <Button
                size="lg"
                variant="outline"
                className="rounded-full h-16 w-16"
                onClick={togglePlayback}
              >
                {isPlaying ? (
                  <Pause className="h-8 w-8" />
                ) : (
                  <Play className="h-8 w-8 ml-1" />
                )}
              </Button>
              
              {task.voiceNoteDuration && (
                <div className="text-sm text-muted-foreground">
                  Duration: {Math.floor(task.voiceNoteDuration / 60)}:{(task.voiceNoteDuration % 60).toString().padStart(2, '0')}
                </div>
              )}
              
              {task.voiceNoteText && (
                <div className="mt-4 p-4 bg-muted/20 rounded-md w-full">
                  <h3 className="text-sm font-medium mb-1">Transcription:</h3>
                  <p className="text-sm text-muted-foreground">{task.voiceNoteText}</p>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Volume2 className="h-12 w-12 mb-2 opacity-30" />
              <p>No voice recording available</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

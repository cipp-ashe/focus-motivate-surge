
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Task } from '@/types/tasks';
import { Separator } from '@/components/ui/separator';
import { X, Mic, Square, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface VoiceNoteDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task;
}

export const VoiceNoteDialog: React.FC<VoiceNoteDialogProps> = ({
  isOpen,
  onOpenChange,
  task
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const handleToggleRecord = () => {
    setIsRecording(!isRecording);
  };
  
  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl">{task.name}</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <Separator className="my-2" />
        
        <div className="mt-4">
          {task.voiceNoteUrl ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleTogglePlay}
                  aria-label={isPlaying ? "Pause voice note" : "Play voice note"}
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
                
                <div className="flex-1 mx-4">
                  <Progress value={progress} max={100} />
                </div>
                
                <div className="text-sm tabular-nums">
                  {task.voiceNoteDuration ? 
                    `${Math.floor(task.voiceNoteDuration / 60)}:${(task.voiceNoteDuration % 60).toString().padStart(2, '0')}` : 
                    '0:00'}
                </div>
              </div>
              
              {task.voiceNoteText && (
                <div className="p-3 rounded-md bg-muted text-sm max-h-40 overflow-y-auto">
                  {task.voiceNoteText}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center p-8">
                <Button
                  variant={isRecording ? "destructive" : "default"}
                  size="icon"
                  className="h-16 w-16 rounded-full"
                  onClick={handleToggleRecord}
                  aria-label={isRecording ? "Stop recording" : "Start recording"}
                >
                  {isRecording ? (
                    <Square className="h-6 w-6" />
                  ) : (
                    <Mic className="h-6 w-6" />
                  )}
                </Button>
                
                <p className="mt-4 text-center text-sm text-muted-foreground">
                  {isRecording ? "Recording... Click to stop" : "Click to start recording"}
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

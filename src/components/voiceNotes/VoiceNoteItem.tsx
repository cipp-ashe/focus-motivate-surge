
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Trash, Edit, Save, CheckSquare, Square, PlayCircle, PauseCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { VoiceNote } from '@/types/voiceNotes';
import { useVoiceNotes } from '@/contexts/voiceNotes/VoiceNotesContext';
import { cn } from '@/lib/utils';

interface VoiceNoteItemProps {
  note: VoiceNote;
  compact?: boolean;
}

const VoiceNoteItem: React.FC<VoiceNoteItemProps> = ({ note, compact = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(note.text);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const { deleteNote, toggleNoteComplete, updateNoteText } = useVoiceNotes();

  // Initialize audio when audio URL is available
  React.useEffect(() => {
    if (note.audioUrl) {
      const audioElement = new Audio(note.audioUrl);
      audioElement.addEventListener('ended', () => setIsPlaying(false));
      setAudio(audioElement);

      return () => {
        audioElement.pause();
        audioElement.removeEventListener('ended', () => setIsPlaying(false));
      };
    }
  }, [note.audioUrl]);

  const handlePlayPause = () => {
    if (!audio) return;
    
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(err => {
        console.error("Error playing audio:", err);
      });
      setIsPlaying(true);
    }
  };

  const handleSave = () => {
    if (editedText.trim()) {
      updateNoteText(note.id, editedText.trim());
      setIsEditing(false);
    }
  };

  const formatNoteText = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.trim().match(/^(-|\*)\s/)) {
        return (
          <div key={i} className="flex items-start pl-2 py-1 text-left">
            <div className="min-w-5 mr-2 mt-0.5">•</div>
            <div>{line.trim().replace(/^(-|\*)\s/, '')}</div>
          </div>
        );
      }
      return <p key={i} className="py-1 text-left">{line}</p>;
    });
  };

  if (compact) {
    return (
      <div className={cn("p-3 border-b border-border/50", note.isComplete && "opacity-60")}>
        <div className="flex justify-between items-start mb-1">
          <span className="text-xs text-muted-foreground">
            {format(note.timestamp, 'MMM d, yyyy - h:mm a')}
          </span>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => toggleNoteComplete(note.id)}
            >
              {note.isComplete ? (
                <CheckSquare className="h-3.5 w-3.5 text-green-500" />
              ) : (
                <Square className="h-3.5 w-3.5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => deleteNote(note.id)}
            >
              <Trash className="h-3.5 w-3.5 text-destructive" />
            </Button>
          </div>
        </div>
        <div className={cn("text-sm line-clamp-2", note.isComplete && "line-through")}>
          {note.text}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("bg-card rounded-lg shadow-sm p-4 mb-4 transition-all", note.isComplete && "opacity-60")}>
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs text-muted-foreground">
          {format(note.timestamp, 'MMM d, yyyy - h:mm a')}
        </span>
        <div className="flex space-x-1">
          {note.audioUrl && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handlePlayPause}
            >
              {isPlaying ? (
                <PauseCircle className="h-4 w-4 text-primary" />
              ) : (
                <PlayCircle className="h-4 w-4 text-primary" />
              )}
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => toggleNoteComplete(note.id)}
          >
            {note.isComplete ? (
              <CheckSquare className="h-4 w-4 text-green-500" />
            ) : (
              <Square className="h-4 w-4" />
            )}
          </Button>
          {!isEditing && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          {isEditing && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleSave}
            >
              <Save className="h-4 w-4 text-primary" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => deleteNote(note.id)}
          >
            <Trash className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </div>

      {isEditing ? (
        <Textarea
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
          className="w-full min-h-[100px] text-sm"
          placeholder="Edit your note..."
          autoFocus
        />
      ) : (
        <div className={cn("text-sm", note.isComplete && "line-through")}>
          {formatNoteText(note.text)}
        </div>
      )}
    </div>
  );
};

export default VoiceNoteItem;

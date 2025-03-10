
import React, { useState } from 'react';
import { format } from 'date-fns';
import { VoiceNote } from '@/types/voiceNotes';
import { Button } from '@/components/ui/button';
import { useVoiceNotes } from '@/contexts/voiceNotes/VoiceNotesContext';
import { cn } from '@/lib/utils';
import { Trash2, Check, Edit, Save, FileText } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface VoiceNoteItemProps {
  note: VoiceNote;
  compact?: boolean;
}

const VoiceNoteItem: React.FC<VoiceNoteItemProps> = ({ note, compact = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(note.text);
  const { deleteNote, toggleNoteComplete, updateNoteText, createNoteFromVoiceNote } = useVoiceNotes();

  const handleEdit = () => {
    setIsEditing(true);
    setEditedText(note.text);
  };

  const handleSave = () => {
    if (editedText.trim()) {
      updateNoteText(note.id, editedText);
      setIsEditing(false);
    } else {
      toast.error("Note cannot be empty");
    }
  };

  const handleCreateNote = () => {
    if (createNoteFromVoiceNote) {
      createNoteFromVoiceNote(note.id);
    } else {
      toast.error("Create note function not available");
    }
  };

  const formattedDate = format(new Date(note.timestamp), compact ? 'MM/dd/yy' : 'MMM d, yyyy · h:mm a');

  return (
    <div 
      className={cn(
        "border border-border rounded-md p-3",
        compact ? "text-sm mb-2" : "mb-4",
        note.isComplete && "bg-muted/30"
      )}
    >
      <div className="flex justify-between items-start gap-2 mb-2">
        <span className="text-xs text-muted-foreground">
          {formattedDate}
        </span>
        <div className="flex items-center gap-1">
          {compact ? (
            <>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6" 
                onClick={() => toggleNoteComplete(note.id)}
                title={note.isComplete ? "Mark as incomplete" : "Mark as complete"}
              >
                <Check className={cn("h-3 w-3", note.isComplete && "text-green-500")} />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6" 
                onClick={() => deleteNote(note.id)}
                title="Delete voice note"
              >
                <Trash2 className="h-3 w-3 text-destructive" />
              </Button>
            </>
          ) : (
            <>
              {!isEditing ? (
                <>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 px-2 text-xs"
                    onClick={handleCreateNote}
                    title="Create note from voice recording"
                  >
                    <FileText className="h-3 w-3 mr-1" />
                    Note
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 px-2 text-xs"
                    onClick={handleEdit}
                    title="Edit transcript"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 px-2 text-xs"
                    onClick={() => toggleNoteComplete(note.id)}
                    title={note.isComplete ? "Mark as incomplete" : "Mark as complete"}
                  >
                    <Check className={cn("h-3 w-3 mr-1", note.isComplete && "text-green-500")} />
                    {note.isComplete ? "Done" : "Complete"}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 px-2 text-xs text-destructive hover:text-destructive"
                    onClick={() => deleteNote(note.id)}
                    title="Delete voice note"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 px-3"
                  onClick={handleSave}
                >
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {isEditing ? (
        <Textarea
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
          className="min-h-[100px] text-sm"
          placeholder="Edit transcript..."
          autoFocus
        />
      ) : (
        <div className={cn(
          "text-sm", 
          note.isComplete && "text-muted-foreground",
          compact ? "line-clamp-2" : ""
        )}>
          {note.text}
        </div>
      )}

      {note.audioUrl && !compact && (
        <div className="mt-3">
          <audio src={note.audioUrl} controls className="w-full h-8" />
        </div>
      )}

      {note.isComplete && !compact && (
        <div className="mt-2 flex items-center">
          <span className="text-xs px-2 py-0.5 bg-green-500/10 text-green-500 rounded-full">
            Completed
          </span>
        </div>
      )}
    </div>
  );
};

export default VoiceNoteItem;

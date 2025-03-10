
import React from 'react';
import { useVoiceNotes } from '@/contexts/voiceNotes/VoiceNotesContext';
import VoiceNoteItem from './VoiceNoteItem';
import { Mic } from 'lucide-react';

interface VoiceNotesListProps {
  compact?: boolean;
  limit?: number;
}

const VoiceNotesList: React.FC<VoiceNotesListProps> = ({ 
  compact = false,
  limit 
}) => {
  const { notes } = useVoiceNotes();
  
  const displayNotes = limit ? notes.slice(0, limit) : notes;
  
  if (displayNotes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <Mic className="h-8 w-8 text-muted-foreground/50 mb-2" />
        <p className="text-muted-foreground">No voice notes yet</p>
        <p className="text-xs text-muted-foreground/70">Create a voice note to see it here</p>
      </div>
    );
  }

  return (
    <div className={compact ? "space-y-0" : "space-y-4"}>
      {displayNotes.map((note) => (
        <VoiceNoteItem key={note.id} note={note} compact={compact} />
      ))}
    </div>
  );
};

export default VoiceNotesList;


import React, { useState } from 'react';
import { NotesEditor } from './NotesEditor';
import { SavedNotes } from './SavedNotes';
import { NotesProps } from '@/types/notes';

export const Notes: React.FC<NotesProps> = ({ hideNotes }) => {
  const [noteContent, setNoteContent] = useState('');

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 min-h-0 mb-4">
        <NotesEditor 
          content={noteContent}
          onChange={setNoteContent}
        />
      </div>

      {!hideNotes && (
        <SavedNotes />
      )}
    </div>
  );
};

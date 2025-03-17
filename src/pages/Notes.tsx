
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NotesTabsView } from '@/components/notes/NotesTabsView';
import { useTheme } from '@/components/theme-provider';
import { useNoteActions, useNoteState } from '@/contexts/notes/NoteContext';

const Notes = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('all');
  const { updateCurrentContent, addNote } = useNoteActions();
  const { content: currentContent } = useNoteState();

  const handleSave = () => {
    if (currentContent?.trim()) {
      addNote();
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold">Notes</h1>
        <p className="text-muted-foreground">Capture and organize your thoughts</p>
        
        <Card>
          <CardHeader className="px-4 py-3 border-b">
            <CardTitle className="text-xl">My Notes</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <NotesTabsView 
              content={currentContent || ''}
              onChange={updateCurrentContent}
              onSave={handleSave}
              isEditing={false}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Notes;

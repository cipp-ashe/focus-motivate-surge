
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NotesTabsView } from '@/components/notes/NotesTabsView';
import { useTheme } from '@/components/theme-provider';
import { useNoteActions, useNoteState } from '@/contexts/notes/NoteContext';
import { NoteContextProvider } from '@/contexts/notes/NoteContext';
import { ErrorBoundary } from 'react-error-boundary';

const NotesContent = () => {
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

const ErrorFallback = ({ error }: { error: Error }) => (
  <div className="p-4 border border-red-300 bg-red-50 dark:bg-red-900/20 rounded-md">
    <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">Error Loading Notes</h2>
    <p className="mb-2">There was a problem loading the notes component.</p>
    <details className="text-sm text-gray-700 dark:text-gray-300">
      <summary>Technical Details</summary>
      <p className="mt-1">{error.message}</p>
    </details>
  </div>
);

const Notes = () => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <NoteContextProvider>
        <NotesContent />
      </NoteContextProvider>
    </ErrorBoundary>
  );
};

export default Notes;

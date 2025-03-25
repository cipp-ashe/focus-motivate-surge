
import React, { useEffect } from 'react';
import { NotesProvider } from '@/contexts/notes/notesContext';
import { NotesList } from '@/components/notes/NotesList';
import { NotesHeader } from '@/components/notes/NotesHeader';
import { NotesEditor } from '@/components/notes/NotesEditor';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useNotesContext } from '@/contexts/notes/notesContext';
import { ThemeProvider } from '@/components/ThemeProvider';
import { cn } from '@/lib/utils';

// Component to handle the actual Notes content
const NotesContent: React.FC = () => {
  const { state } = useNotesContext();
  
  if (state.isLoading) {
    return (
      <div className="flex items-center justify-center h-[90vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  if (state.error) {
    return (
      <div className="flex flex-col items-center justify-center h-[90vh] text-center p-4">
        <h2 className="text-xl font-semibold text-destructive mb-2">Error Loading Notes</h2>
        <p className="text-muted-foreground mb-4">
          {state.error.message || 'An unexpected error occurred while loading your notes.'}
        </p>
        <button 
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          onClick={() => window.location.reload()}
        >
          Reload Page
        </button>
      </div>
    );
  }
  
  const selectedNote = state.selectedNoteId 
    ? state.notes.find(note => note.id === state.selectedNoteId) 
    : null;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 h-[calc(100vh-60px)] bg-background dark:bg-background">
      <div className={cn(
        "col-span-1 md:col-span-1 lg:col-span-1 border-r border-border",
        selectedNote ? "hidden md:block" : "block"
      )}>
        <NotesHeader />
        <NotesList />
      </div>
      
      <div className={cn(
        "col-span-1 md:col-span-2 lg:col-span-3 h-full",
        selectedNote ? "block" : "hidden md:flex md:items-center md:justify-center"
      )}>
        {selectedNote ? (
          <NotesEditor note={selectedNote} />
        ) : (
          <div className="text-center p-8 max-w-md mx-auto">
            <h2 className="text-2xl font-semibold mb-2">No Note Selected</h2>
            <p className="text-muted-foreground mb-4">
              Select a note from the list or create a new one to start editing.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Main Notes Page Component
const NotesPage: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="notes-theme">
      <NotesProvider>
        <div className="w-full h-full animate-fade-in bg-background dark:bg-background text-foreground">
          <NotesContent />
        </div>
      </NotesProvider>
    </ThemeProvider>
  );
};

export default NotesPage;

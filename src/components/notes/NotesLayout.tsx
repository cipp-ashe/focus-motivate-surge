
import React, { useState, useEffect } from 'react';
import { NoteEditor } from '@/components/notes/NoteEditor';
import { NotesList } from '@/components/notes/NotesList';
import { NotesToolbar } from '@/components/notes/NotesToolbar';
import { NoNotesPlaceholder } from '@/components/notes/NoNotesPlaceholder';
import { useNotes } from '@/contexts/notes/NotesContext';
import { NotesSearch } from '@/components/notes/NotesSearch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Note } from '@/types/notes';
import { cn } from '@/lib/utils';

export const NotesLayout: React.FC = () => {
  const { 
    state: { notes, selectedNoteId, isLoading, filter, sortBy, sortDirection },
    selectNote,
    deleteNote,
    addTagToNote,
    removeTagFromNote,
    setFilter,
    setSorting,
    toggleFavorite
  } = useNotes();
  
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Get the selected note
  const selectedNote = selectedNoteId 
    ? notes.find(note => note.id === selectedNoteId) 
    : null;

  // Filter notes based on active tab and search term
  const filteredNotes = notes.filter(note => {
    // Filter by search term
    if (searchTerm && !note.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !note.content.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Filter by tab
    if (activeTab === 'favorites' && !note.favorite) {
      return false;
    }
    
    if (activeTab === 'journal' && note.type !== 'journal' && note.type !== 'habit-journal') {
      return false;
    }
    
    if (activeTab === 'tasks' && note.type !== 'task-journal') {
      return false;
    }
    
    return true;
  });
  
  // Sort notes
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (sortBy === 'title') {
      return sortDirection === 'asc' 
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    } else {
      const dateA = new Date(a[sortBy]).getTime();
      const dateB = new Date(b[sortBy]).getTime();
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    }
  });
  
  // Handle note selection
  const handleSelectNote = (note: Note) => {
    selectNote(note.id);
  };
  
  // Handle search
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };
  
  return (
    <div className="flex flex-col h-full">
      <NotesToolbar 
        onCreateNote={() => selectNote(null)} 
        sortBy={sortBy}
        sortDirection={sortDirection}
        onChangeSorting={(sort, direction) => setSorting(sort, direction)}
      />
      
      <div className="flex flex-col md:flex-row flex-1 h-[calc(100vh-220px)] overflow-hidden">
        <div className={cn(
          "md:w-1/3 lg:w-1/4 p-4 flex flex-col h-full overflow-hidden border-b md:border-r md:border-b-0 border-border/20 dark:border-border/10",
          selectedNote && "hidden md:flex"
        )}>
          <NotesSearch onSearch={handleSearch} />
          
          <Tabs 
            defaultValue="all" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="mt-4"
          >
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
              <TabsTrigger value="journal">Journal</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="mt-4 flex-1 overflow-auto">
            {isLoading ? (
              <LoadingSpinner className="mt-8" />
            ) : sortedNotes.length > 0 ? (
              <NotesList 
                notes={sortedNotes}
                selectedNoteId={selectedNoteId}
                onSelectNote={handleSelectNote}
                onDeleteNote={deleteNote}
                onToggleFavorite={toggleFavorite}
              />
            ) : (
              <NoNotesPlaceholder searchTerm={searchTerm} />
            )}
          </div>
        </div>
        
        <div className={cn(
          "flex-1 md:w-2/3 lg:w-3/4 p-4 flex flex-col h-full overflow-hidden",
          !selectedNote && selectedNoteId && "hidden md:flex"
        )}>
          <NoteEditor 
            note={selectedNote} 
            onAddTag={addTagToNote}
            onRemoveTag={removeTagFromNote}
          />
        </div>
      </div>
    </div>
  );
};

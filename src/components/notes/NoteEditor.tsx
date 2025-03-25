
import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNotes } from '@/contexts/notes/NotesContext';
import { Note, NoteTag } from '@/types/notes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NoteTagList } from '@/components/notes/NoteTagList';
import { NoteTagInput } from '@/components/notes/NoteTagInput';
import { EditorContent } from '@/components/notes/EditorContent';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Save, ArrowLeft, Pencil, Eye, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NoteEditorProps {
  note: Note | null;
  onAddTag: (noteId: string, tag: NoteTag) => void;
  onRemoveTag: (noteId: string, tagName: string) => void;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({
  note,
  onAddTag,
  onRemoveTag
}) => {
  const {
    addNote,
    updateNote,
    clearSelectedNote,
    toggleFavorite
  } = useNotes();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [activeTab, setActiveTab] = useState<string>('edit');
  const [isTitleFocused, setIsTitleFocused] = useState(false);
  
  // Initialize editor content when note changes
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    } else {
      setTitle('');
      setContent('');
    }
    
    // Always start in edit mode when a note changes
    setActiveTab('edit');
  }, [note]);
  
  // Handle content change
  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent);
  }, []);
  
  // Handle saving note
  const handleSave = useCallback(() => {
    if (!title.trim()) {
      setTitle('Untitled Note');
    }
    
    if (note) {
      // Update existing note
      updateNote(note.id, {
        title: title.trim() || 'Untitled Note',
        content
      });
    } else {
      // Create new note
      const newNote = {
        title: title.trim() || 'Untitled Note',
        content,
        type: 'text' as const,
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      addNote(newNote);
    }
  }, [note, title, content, updateNote, addNote]);
  
  // Handle back button click
  const handleBack = useCallback(() => {
    clearSelectedNote();
  }, [clearSelectedNote]);
  
  // Add tag to the note
  const handleAddTag = useCallback((tagName: string, color: string = 'default') => {
    if (!note) return;
    
    onAddTag(note.id, {
      name: tagName,
      color: color as any
    });
  }, [note, onAddTag]);
  
  // Remove tag from the note
  const handleRemoveTag = useCallback((tagName: string) => {
    if (!note) return;
    
    onRemoveTag(note.id, tagName);
  }, [note, onRemoveTag]);
  
  // Toggle favorite status
  const handleToggleFavorite = useCallback(() => {
    if (!note) return;
    
    toggleFavorite(note.id);
  }, [note, toggleFavorite]);
  
  // If no note is selected, show create new note form
  const isNewNote = !note;
  
  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    // Ctrl/Cmd + S to save
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      handleSave();
    }
  }, [handleSave]);
  
  return (
    <div 
      className="flex flex-col h-full animate-fade-in" 
      onKeyDown={handleKeyDown}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="mr-2 md:hidden"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          <div className="relative flex-1">
            <Input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Note title"
              className={cn(
                "text-lg font-medium border-0 p-0 focus-visible:ring-0 bg-transparent",
                isTitleFocused ? "placeholder:opacity-0" : "placeholder:text-muted-foreground"
              )}
              onFocus={() => setIsTitleFocused(true)}
              onBlur={() => setIsTitleFocused(false)}
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {note && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleFavorite}
              className={cn(
                "h-8 w-8",
                note.favorite && "text-yellow-500"
              )}
            >
              <Star className={cn(
                "h-4 w-4",
                note.favorite && "fill-yellow-400"
              )} />
            </Button>
          )}
          
          <Button onClick={handleSave} className="h-8">
            <Save className="h-4 w-4 mr-1" />
            {isNewNote ? "Create" : "Update"}
          </Button>
        </div>
      </div>
      
      {/* Tags */}
      <div className="flex items-center mt-3 mb-4">
        {note ? (
          <>
            <NoteTagList
              tags={note.tags}
              onRemoveTag={handleRemoveTag}
              className="flex-1"
            />
            <NoteTagInput onAddTag={handleAddTag} />
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            Tags can be added after creating the note
          </p>
        )}
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="self-start mb-2">
          <TabsTrigger value="edit" className="flex items-center">
            <Pencil className="h-3.5 w-3.5 mr-1" />
            Edit
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center">
            <Eye className="h-3.5 w-3.5 mr-1" />
            Preview
          </TabsTrigger>
        </TabsList>
        
        <div className="flex-1 overflow-hidden border rounded-md">
          <TabsContent value="edit" className="h-full m-0 p-0">
            <EditorContent
              content={content}
              onChange={handleContentChange}
              placeholder="Start writing your note..."
            />
          </TabsContent>
          
          <TabsContent value="preview" className="h-full m-0 p-0">
            <div className="h-full overflow-auto p-4">
              {content ? (
                <div className="prose prose-sm dark:prose-invert">
                  {/* Simple content for now, could use markdown renderer */}
                  <div style={{ whiteSpace: 'pre-wrap' }}>{content}</div>
                </div>
              ) : (
                <p className="text-muted-foreground italic">No content to preview</p>
              )}
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

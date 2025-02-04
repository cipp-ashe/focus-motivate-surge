import React, { useState, useEffect } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Edit2, Tag, X, Pencil, ChevronLeft, ChevronRight } from "lucide-react";

export interface Note {
  id: string;
  content: string;
  title: string;
  tags: string[];
  createdAt: string;
}

interface NotesProps {
  compact?: boolean;
  className?: string;
}

const NOTES_PER_PAGE = 4;

export function Notes({ compact = false, className }: NotesProps) {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('notes');
    return saved ? JSON.parse(saved) : [];
  });
  const [content, setContent] = useState('');
  const [isMarkdownMode, setIsMarkdownMode] = useState(false);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [activeNoteForTag, setActiveNoteForTag] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = Math.ceil(notes.length / NOTES_PER_PAGE);
  const visibleNotes = notes.slice(
    currentPage * NOTES_PER_PAGE,
    (currentPage + 1) * NOTES_PER_PAGE
  );

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      saveNote();
    }
  };

  const saveNote = () => {
    if (!content.trim()) return;
    
    if (editingNote) {
      setNotes(prev => prev.map(note => 
        note.id === editingNote 
          ? { ...note, content: content }
          : note
      ));
      setEditingNote(null);
    } else {
      const newNote: Note = {
        id: Date.now().toString(),
        content,
        title: content.split('\n')[0].slice(0, 50) || 'Untitled Note',
        tags: [],
        createdAt: new Date().toISOString()
      };
      setNotes(prev => [newNote, ...prev]);
      setCurrentPage(0);
    }
    setContent('');
    setIsMarkdownMode(false);
  };

  const deleteNote = (id: string) => {
    setNotes(prev => {
      const newNotes = prev.filter(note => note.id !== id);
      const maxPage = Math.max(0, Math.ceil(newNotes.length / NOTES_PER_PAGE) - 1);
      setCurrentPage(current => Math.min(current, maxPage));
      return newNotes;
    });
  };

  const editNote = (note: Note) => {
    setContent(note.content);
    setEditingNote(note.id);
    setIsMarkdownMode(false);
    setActiveNoteForTag(null);
  };

  const addTag = (noteId: string, tag: string) => {
    if (!tag.trim()) return;
    setNotes(prev => prev.map(note => {
      if (note.id === noteId && !note.tags.includes(tag)) {
        return { ...note, tags: [...note.tags, tag] };
      }
      return note;
    }));
    setTagInput('');
    setActiveNoteForTag(null);
  };

  const removeTag = (noteId: string, tagToRemove: string) => {
    setNotes(prev => prev.map(note => {
      if (note.id === noteId) {
        return { ...note, tags: note.tags.filter(tag => tag !== tagToRemove) };
      }
      return note;
    }));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent, noteId: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(noteId, tagInput);
    } else if (e.key === 'Escape') {
      setActiveNoteForTag(null);
      setTagInput('');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 min-h-0">
        {isMarkdownMode ? (
          <div data-color-mode="dark" className="h-full">
            <MDEditor
              value={content}
              onChange={(value) => setContent(value || '')}
              preview="edit"
              className="h-full border-none bg-background overflow-hidden"
              textareaProps={{
                placeholder: "Use markdown for rich formatting...",
                className: "h-full overflow-x-hidden"
              }}
            />
          </div>
        ) : (
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a note and press Enter to save..."
            className="h-full resize-none bg-background border-none text-base leading-relaxed overflow-x-hidden"
          />
        )}
      </div>

      <div className="flex justify-between items-center mt-2 text-sm">
        <button
          onClick={() => setIsMarkdownMode(!isMarkdownMode)}
          className="text-muted-foreground hover:text-foreground flex items-center gap-2 px-1 py-0.5 rounded transition-colors"
        >
          <Edit2 className="w-3 h-3" />
          {isMarkdownMode ? "Switch to simple" : "Enable markdown"}
        </button>
        {content && (
          <Button onClick={saveNote} size="sm" className="h-7 px-3">
            {editingNote ? "Update" : "Save"}
          </Button>
        )}
      </div>

      {notes.length > 0 && (
        <div className="mt-auto pt-4">
          <div className="flex flex-col gap-2">
            {visibleNotes.map(note => (
              <div
                key={note.id}
                className="p-2.5 rounded-lg bg-muted/50 hover:bg-muted/80 transition-all cursor-pointer group hover:translate-x-0.5"
                onClick={() => editNote(note)}
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-start gap-2 group">
                    <div 
                      className="prose prose-sm dark:prose-invert flex-1 overflow-hidden [&_*]:text-foreground/80 [&_*]:bg-transparent [&_p]:my-0 [&_p]:leading-relaxed"
                    >
                      <div className="line-clamp-2">
                        <MDEditor.Markdown source={note.content} />
                      </div>
                    </div>
                    <div 
                      className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity ml-2 -mr-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveNoteForTag(note.id)}
                      >
                        <Tag className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editNote(note)}
                      >
                        <Pencil className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteNote(note.id)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  
                  {note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {note.tags.map(tag => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs py-0 h-5 px-1.5 hover:bg-primary/10 transition-colors"
                        >
                          {tag}
                          <X 
                            className="w-3 h-3 ml-1 cursor-pointer" 
                            onClick={(e) => {
                              e.stopPropagation();
                              removeTag(note.id, tag);
                            }}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}

                  {activeNoteForTag === note.id && (
                    <div className="flex gap-2 items-center mt-2 animate-in fade-in slide-in-from-top-1">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => handleTagKeyDown(e, note.id)}
                        placeholder="Add tag..."
                        className="flex-1 bg-background/50 border-none text-sm px-2 py-1 rounded focus:outline-none focus:ring-1 focus:ring-primary/50 placeholder:text-muted-foreground/40"
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-2 bg-muted/50 rounded-lg p-1 self-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage(p => p - 1)}
                disabled={currentPage === 0}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-muted-foreground px-2 py-1">
                {currentPage + 1} / {totalPages}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage(p => p + 1)}
                disabled={currentPage === totalPages - 1}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

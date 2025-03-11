
import React from 'react';
import { Notes } from '@/components/notes/Notes';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Moon, Sun, Mic, Image } from 'lucide-react';
import { useTheme } from "@/hooks/useTheme";

export default function NotesPage() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto p-4">
        <div className="flex items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
            Notes
          </h1>
          
          <div className="flex items-center gap-2 ml-auto">
            <Link to="/voice-notes">
              <Button variant="outline" size="sm" className="gap-2">
                <Mic className="h-4 w-4" />
                <span className="hidden sm:inline">Voice Notes</span>
              </Button>
            </Link>
            
            <Link to="/screenshots">
              <Button variant="outline" size="sm" className="gap-2">
                <Image className="h-4 w-4" />
                <span className="hidden sm:inline">Screenshots</span>
              </Button>
            </Link>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full hover:bg-primary/20"
            >
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        <div className="bg-card/90 backdrop-blur-md shadow-lg rounded-lg border border-primary/20 p-6">
          <Notes />
        </div>
      </div>
    </div>
  );
}

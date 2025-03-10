
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  CalendarCheck, Timer, BookHeart, ScrollText, Image, Mic
} from 'lucide-react';

const IndexPage: React.FC = () => {
  useEffect(() => {
    console.log("Index page mounted");
  }, []);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12 text-primary">
          Productivity Dashboard
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Task card */}
          <Link to="/tasks" className="p-6 rounded-lg shadow-lg bg-card hover:shadow-xl transition-all">
            <div className="flex items-center mb-4">
              <CalendarCheck className="w-8 h-8 text-primary mr-3" />
              <h2 className="text-xl font-semibold">Tasks</h2>
            </div>
            <p className="text-muted-foreground">Manage your daily tasks and to-dos</p>
          </Link>
          
          {/* Timer card */}
          <Link to="/timer" className="p-6 rounded-lg shadow-lg bg-card hover:shadow-xl transition-all">
            <div className="flex items-center mb-4">
              <Timer className="w-8 h-8 text-primary mr-3" />
              <h2 className="text-xl font-semibold">Timer</h2>
            </div>
            <p className="text-muted-foreground">Focus with the Pomodoro technique</p>
          </Link>
          
          {/* Habits card */}
          <Link to="/habits" className="p-6 rounded-lg shadow-lg bg-card hover:shadow-xl transition-all">
            <div className="flex items-center mb-4">
              <BookHeart className="w-8 h-8 text-primary mr-3" />
              <h2 className="text-xl font-semibold">Habits</h2>
            </div>
            <p className="text-muted-foreground">Track and build new habits</p>
          </Link>
          
          {/* Notes card */}
          <Link to="/notes" className="p-6 rounded-lg shadow-lg bg-card hover:shadow-xl transition-all">
            <div className="flex items-center mb-4">
              <ScrollText className="w-8 h-8 text-primary mr-3" />
              <h2 className="text-xl font-semibold">Notes</h2>
            </div>
            <p className="text-muted-foreground">Capture and organize your ideas</p>
          </Link>
          
          {/* Screenshots card */}
          <Link to="/screenshots" className="p-6 rounded-lg shadow-lg bg-card hover:shadow-xl transition-all">
            <div className="flex items-center mb-4">
              <Image className="w-8 h-8 text-primary mr-3" />
              <h2 className="text-xl font-semibold">Screenshots</h2>
            </div>
            <p className="text-muted-foreground">Save and organize visual notes</p>
          </Link>
          
          {/* Voice Notes card */}
          <Link to="/voice-notes" className="p-6 rounded-lg shadow-lg bg-card hover:shadow-xl transition-all">
            <div className="flex items-center mb-4">
              <Mic className="w-8 h-8 text-primary mr-3" />
              <h2 className="text-xl font-semibold">Voice Notes</h2>
            </div>
            <p className="text-muted-foreground">Record and save voice memos</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default IndexPage;

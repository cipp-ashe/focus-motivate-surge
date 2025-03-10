import React from 'react';
import { Link } from 'react-router-dom';
const IndexPage = () => {
  return <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">Focus Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/tasks" className="p-6 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors">
          <h2 className="text-xl font-semibold mb-2">Tasks</h2>
          <p className="text-muted-foreground">Manage your daily tasks</p>
        </Link>
        
        <Link to="/timer" className="p-6 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors">
          <h2 className="text-xl font-semibold mb-2">Timer</h2>
          <p className="text-muted-foreground">Focus with the Pomodoro technique</p>
        </Link>
        
        <Link to="/habits" className="p-6 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors">
          <h2 className="text-xl font-semibold mb-2">Habits</h2>
          <p className="text-muted-foreground">Build consistent daily habits</p>
        </Link>
        
        <Link to="/notes" className="p-6 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors">
          <h2 className="text-xl font-semibold mb-2">Notes</h2>
          <p className="text-muted-foreground">Capture your thoughts</p>
        </Link>
      </div>
    </div>;
};
export default IndexPage;

import React from 'react';
import { Card } from '@/components/ui/card';

const Home: React.FC = () => {
  // Log component rendering for debugging
  console.log('Home page rendering');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-6 dark:text-white">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6 shadow-md bg-background dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-2 dark:text-white">Quick Tasks</h2>
          <p className="text-muted-foreground dark:text-gray-400">View and manage your tasks</p>
          <div className="mt-4">
            <a 
              href="/tasks" 
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
            >
              Go to Tasks
            </a>
          </div>
        </Card>
        
        <Card className="p-6 shadow-md bg-background dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-2 dark:text-white">Habit Tracker</h2>
          <p className="text-muted-foreground dark:text-gray-400">Track your daily habits</p>
          <div className="mt-4">
            <a 
              href="/habits" 
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
            >
              View Habits
            </a>
          </div>
        </Card>
        
        <Card className="p-6 shadow-md bg-background dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-2 dark:text-white">Metrics</h2>
          <p className="text-muted-foreground dark:text-gray-400">Analyze your productivity</p>
          <div className="mt-4">
            <a 
              href="/metrics" 
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
            >
              View Metrics
            </a>
          </div>
        </Card>

        <Card className="p-6 shadow-md bg-background dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-2 dark:text-white">Journal</h2>
          <p className="text-muted-foreground dark:text-gray-400">Record your thoughts</p>
          <div className="mt-4">
            <a 
              href="/journal" 
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
            >
              Open Journal
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Home;

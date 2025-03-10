
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Timer, ListTodo, Notebook, ActivitySquare } from 'lucide-react';

const IndexPage = () => {
  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Task Management App</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Manage your tasks, track time, take notes, and build habits - all in one place.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
              <ListTodo className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Tasks</CardTitle>
            <CardDescription>Create and manage your tasks</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-sm">Organize your daily work with a simple task manager.</p>
          </CardContent>
          <CardFooter>
            <Link to="/tasks" className="w-full">
              <Button className="w-full">Open Tasks</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
              <Timer className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Timer</CardTitle>
            <CardDescription>Track time for your tasks</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-sm">Focus on your work using the built-in timer system.</p>
          </CardContent>
          <CardFooter>
            <Link to="/timer" className="w-full">
              <Button className="w-full">Open Timer</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
              <Notebook className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Notes</CardTitle>
            <CardDescription>Keep track of your ideas</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-sm">Take notes and organize your thoughts efficiently.</p>
          </CardContent>
          <CardFooter>
            <Link to="/notes" className="w-full">
              <Button className="w-full">Open Notes</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
              <ActivitySquare className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Habits</CardTitle>
            <CardDescription>Build consistent habits</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-sm">Track and develop habits to improve your productivity.</p>
          </CardContent>
          <CardFooter>
            <Link to="/habits" className="w-full">
              <Button className="w-full">Open Habits</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default IndexPage;

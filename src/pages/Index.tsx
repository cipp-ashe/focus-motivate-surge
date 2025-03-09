
import React from 'react';
import { Link } from "react-router-dom";
import { Timer, StickyNote, ActivitySquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const IndexPage = () => {
  const { isDark } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
            Focus Timer
          </h1>
          <p className="text-muted-foreground text-lg">
            Get focused, get motivated, surge ahead
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {/* Timer Card */}
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-2">
                <Timer className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Timer</CardTitle>
              <CardDescription>Focus timer and task management</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link to="/timer">
                <Button className="w-full">
                  Go to Timer
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Habits Card */}
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-2">
                <ActivitySquare className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Habits</CardTitle>
              <CardDescription>Track and manage your habits</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link to="/habits">
                <Button className="w-full">
                  Go to Habits
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Notes Card */}
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-2">
                <StickyNote className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Notes</CardTitle>
              <CardDescription>Create and manage your notes</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link to="/notes">
                <Button className="w-full">
                  Go to Notes
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default IndexPage;

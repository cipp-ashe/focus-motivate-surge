
import React from 'react';
import { ListTodo, Timer, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description, 
  link 
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string; 
  link: string; 
}) => {
  return (
    <Card className="shadow-sm border-border/[var(--border-medium)]">
      <CardHeader>
        <Icon className="h-8 w-8 mb-2" />
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline">
          <Link to={link}>Learn more</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

const FeatureCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <FeatureCard 
        icon={ListTodo}
        title="Task Management" 
        description="Organize all your work in one place" 
        link="/tasks"
      />
      
      <FeatureCard 
        icon={Timer}
        title="Focus Timers" 
        description="Track time spent on tasks" 
        link="/timer"
      />
      
      <FeatureCard 
        icon={BookOpen}
        title="Notes & Journals" 
        description="Capture ideas and reflections" 
        link="/notes"
      />
    </div>
  );
};

export default FeatureCards;


import React from 'react';
import { ListTodo, Timer, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
    <div className="border rounded-lg p-6">
      <div className="mb-4">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4">{description}</p>
      <Button asChild variant="outline">
        <Link to={link}>Learn more</Link>
      </Button>
    </div>
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

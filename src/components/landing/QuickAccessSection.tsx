
import React from 'react';
import { Link } from 'react-router-dom';
import { ListTodo, Timer, Activity, Image, BookOpen, Mic, LayoutDashboard } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface QuickAccessItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
}

const QuickAccessItem: React.FC<QuickAccessItemProps> = ({
  to,
  icon: Icon,
  label
}) => {
  return (
    <Link to={to}>
      <Card className="hover:bg-muted/30 transition-colors">
        <CardContent className="flex flex-col items-center justify-center p-4 gap-2">
          <Icon className="w-5 h-5" />
          <span className="text-sm font-medium">{label}</span>
        </CardContent>
      </Card>
    </Link>
  );
};

const QuickAccessSection: React.FC = () => {
  const quickAccessItems: QuickAccessItemProps[] = [
    {
      to: "/tasks",
      icon: ListTodo,
      label: "Tasks"
    },
    {
      to: "/timer",
      icon: Timer,
      label: "Timer"
    },
    {
      to: "/habits",
      icon: Activity,
      label: "Habits"
    },
    {
      to: "/screenshots",
      icon: Image,
      label: "Screenshots"
    },
    {
      to: "/notes",
      icon: BookOpen,
      label: "Notes"
    },
    {
      to: "/voice-notes",
      icon: Mic,
      label: "Voice"
    }
  ];

  return (
    <section className="mb-16">
      <div className="flex items-center gap-3 mb-6">
        <LayoutDashboard className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Quick Access</h2>
      </div>
      
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
        {quickAccessItems.map((item, index) => (
          <QuickAccessItem key={index} {...item} />
        ))}
      </div>
    </section>
  );
};

export default QuickAccessSection;

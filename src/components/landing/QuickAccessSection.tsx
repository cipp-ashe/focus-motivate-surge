
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ListTodo, 
  Timer, 
  Activity,
  Image,
  BookOpen, 
  Mic,
  LayoutDashboard 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickAccessItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  bgColorClass: string;
  iconColorClass: string;
}

const QuickAccessItem: React.FC<QuickAccessItemProps> = ({ 
  to, 
  icon: Icon, 
  label, 
  bgColorClass, 
  iconColorClass 
}) => {
  return (
    <Link to={to} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/80 dark:bg-black/20 backdrop-blur-md border border-gray-100 dark:border-gray-800/50 shadow-sm transform transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:bg-primary/5">
      <div className={cn("rounded-full p-3 mb-1", bgColorClass)}>
        <Icon className={cn("w-5 h-5", iconColorClass)} />
      </div>
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
};

const QuickAccessSection: React.FC = () => {
  const quickAccessItems: QuickAccessItemProps[] = [
    {
      to: "/tasks",
      icon: ListTodo,
      label: "Tasks",
      bgColorClass: "bg-primary/10",
      iconColorClass: "text-primary"
    },
    {
      to: "/timer",
      icon: Timer,
      label: "Timer",
      bgColorClass: "bg-[#9b87f5]/10",
      iconColorClass: "text-[#9b87f5]"
    },
    {
      to: "/habits",
      icon: Activity,
      label: "Habits",
      bgColorClass: "bg-amber-400/10",
      iconColorClass: "text-amber-500"
    },
    {
      to: "/screenshots",
      icon: Image,
      label: "Screenshots",
      bgColorClass: "bg-blue-400/10",
      iconColorClass: "text-blue-400"
    },
    {
      to: "/notes",
      icon: BookOpen,
      label: "Notes",
      bgColorClass: "bg-green-400/10",
      iconColorClass: "text-green-400"
    },
    {
      to: "/voice-notes",
      icon: Mic,
      label: "Voice",
      bgColorClass: "bg-rose-400/10",
      iconColorClass: "text-rose-400"
    }
  ];

  return (
    <section className="mb-16">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <LayoutDashboard className="h-5 w-5 text-primary/70" />
        Quick Access
      </h2>
      
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 md:gap-4">
        {quickAccessItems.map((item, index) => (
          <QuickAccessItem key={index} {...item} />
        ))}
      </div>
    </section>
  );
};

export default QuickAccessSection;


import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CalendarCheck, 
  Timer, 
  BookHeart, 
  ScrollText, 
  Image, 
  Mic, 
  ArrowRight,
  Clock,
  BarChart,
  CheckSquare
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/ui/useIsMobile';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const IndexPage: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen py-4 sm:py-8 px-2 sm:px-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-[5%] left-[5%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] bg-primary/10 rounded-full filter blur-3xl opacity-40 animate-float"></div>
        <div className="absolute bottom-[10%] right-[5%] w-[35vw] h-[35vw] max-w-[500px] max-h-[500px] bg-purple-500/10 rounded-full filter blur-3xl opacity-30" style={{ animationDelay: '2s', animationDuration: '7s' }}></div>
        <div className="absolute top-[40%] right-[15%] w-[25vw] h-[25vw] max-w-[400px] max-h-[400px] bg-violet-400/10 rounded-full filter blur-3xl opacity-20" style={{ animationDelay: '1s', animationDuration: '8s' }}></div>
      </div>
      
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 sm:mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-gradient-primary">
            Focus Dashboard
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Organize your work, improve your productivity, and build better habits
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-2">
          {/* Tasks card */}
          <DashboardCard 
            to="/tasks" 
            title="Tasks" 
            description="Organize and manage your daily tasks and to-dos"
            icon={CalendarCheck}
            iconColor="text-primary"
            metrics={[
              { label: "Categories", value: "7", icon: CheckSquare },
              { label: "Focus", value: "High", icon: BarChart }
            ]}
          />
          
          {/* Timer card */}
          <DashboardCard 
            to="/timer" 
            title="Timer" 
            description="Stay focused with our Pomodoro technique timer"
            icon={Timer}
            iconColor="text-purple-400"
            metrics={[
              { label: "Duration", value: "25 min", icon: Clock },
              { label: "Sessions", value: "4", icon: BarChart }
            ]}
          />
          
          {/* Habits card */}
          <DashboardCard 
            to="/habits" 
            title="Habits" 
            description="Build and track new habits for daily improvement"
            icon={BookHeart}
            iconColor="text-cyan-400"
            metrics={[
              { label: "Consistency", value: "Daily", icon: CalendarCheck },
              { label: "Templates", value: "5+", icon: CheckSquare }
            ]}
          />
          
          {/* Notes card */}
          <DashboardCard 
            to="/notes" 
            title="Notes" 
            description="Capture and organize your thoughts and ideas"
            icon={ScrollText}
            iconColor="text-amber-400"
            metrics={[
              { label: "Format", value: "Markdown", icon: ScrollText },
              { label: "Storage", value: "Secure", icon: CheckSquare }
            ]}
          />
          
          {/* Screenshots card */}
          <DashboardCard 
            to="/screenshots" 
            title="Screenshots" 
            description="Save and organize visual references and information"
            icon={Image}
            iconColor="text-blue-400"
            metrics={[
              { label: "Capture", value: "Easy", icon: Image },
              { label: "Text", value: "OCR", icon: ScrollText }
            ]}
          />
          
          {/* Voice Notes card */}
          <DashboardCard 
            to="/voice-notes" 
            title="Voice Notes" 
            description="Record and transcribe voice memos and ideas"
            icon={Mic}
            iconColor="text-rose-400"
            metrics={[
              { label: "Recording", value: "HD", icon: Mic },
              { label: "Storage", value: "Cloud", icon: CheckSquare }
            ]}
          />
        </div>
        
        <div className="mt-12 sm:mt-16 text-center">
          <Button asChild variant="outline" className="bg-card/80 backdrop-blur-sm rounded-full px-6 shadow-glass border-primary/20 hover:bg-primary/10 button-scale">
            <Link to="/settings" className="flex items-center gap-2">
              Start Customizing Your Experience
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

interface DashboardCardProps {
  to: string;
  title: string;
  description: string;
  icon: React.ElementType;
  iconColor: string;
  metrics?: Array<{
    label: string;
    value: string;
    icon: React.ElementType;
  }>;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ 
  to, 
  title, 
  description,
  icon: Icon,
  iconColor,
  metrics
}) => {
  const isMobile = useIsMobile();
  
  return (
    <Link to={to} className="block h-full">
      <Card className={cn(
        "transition-all duration-300 h-full",
        "bg-card/80 backdrop-blur-sm border-border/30 card-hover-effect hover:border-primary/20",
        "overflow-hidden flex flex-col"
      )}>
        <CardContent className={cn(
          "flex flex-col h-full",
          isMobile ? "p-4" : "p-5 sm:p-6"
        )}>
          <div className="flex items-start gap-4 mb-3">
            <div className={cn(
              "rounded-xl p-2.5 flex-shrink-0", 
              "bg-background/50 backdrop-blur-sm shadow-sm border border-border/20"
            )}>
              <Icon className={cn("w-6 h-6", iconColor)} />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-1">{title}</h2>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
          
          {metrics && metrics.length > 0 && (
            <div className="mt-auto pt-3 grid grid-cols-2 gap-3 text-sm border-t border-border/10">
              {metrics.map((metric, index) => (
                <div key={index} className="flex items-center gap-1.5">
                  <metric.icon className="w-3.5 h-3.5 text-primary/70" />
                  <span className="text-muted-foreground">{metric.label}:</span>
                  <span className="font-medium">{metric.value}</span>
                </div>
              ))}
            </div>
          )}
          
          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowRight className="h-4 w-4 text-primary/70" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default IndexPage;

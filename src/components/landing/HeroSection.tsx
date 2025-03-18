import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Activity, Timer, FileText, Clock, CalendarCheck, Tag, ListTodo, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const HeroSection: React.FC = () => {
  return (
    <section className="mb-8 md:mb-10">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="flex flex-wrap gap-4 justify-center">
          <Button asChild size="lg" className="rounded-full px-8 shadow-glow button-glow">
            
          </Button>
        </div>
      </div>
      
      {/* Text section from FeaturesSection - Title part */}
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient-primary">Everything You Need</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">FlowTime combines task management, habit automation, and focused work sessions in one powerful, privacy-focused application.</p>
        
        <Badge variant="outline" className="mb-6 px-3 py-1 bg-primary/10 text-primary border-primary/20 backdrop-blur-sm">
          <Zap className="h-3.5 w-3.5 mr-1" />
          Productivity Reimagined
        </Badge>
      </div>
      
      {/* Features Section - Feature cards come first */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard icon={ListTodo} iconClass="bg-primary/10" iconColor="text-primary" title="Task Management" description="Organize all your work in one place" features={["Smart task organization", "Integrated with timers", "Tagging system"]} buttonLabel="Go to Tasks" buttonLink="/tasks" cardClass="from-blue-50/50 dark:from-blue-950/20" iconBgClass="bg-primary/10" iconFeatureClass="bg-primary/20" iconFeatureColor="text-primary" buttonStyle={{}} />
          
          <FeatureCard icon={Timer} iconClass="bg-[#9b87f5]/10" iconColor="text-[#9b87f5]" title="Focus Timers" description="Track time spent on tasks" features={["Customizable timers", "Session tracking", "Productivity metrics"]} buttonLabel="Use Timer" buttonLink="/timer" cardClass="from-purple-50/50 dark:from-purple-950/20" iconBgClass="bg-[#9b87f5]/10" iconFeatureClass="bg-[#9b87f5]/20" iconFeatureColor="text-[#9b87f5]" buttonStyle={{
          backgroundColor: "#9b87f5",
          borderColor: "#9b87f5"
        }} />
          
          <FeatureCard icon={BookOpen} iconClass="bg-green-400/10" iconColor="text-green-500" title="Notes & Journals" description="Capture ideas and reflections" features={["Written notes", "Voice recordings", "Journal templates"]} buttonLabel="View Notes" buttonLink="/notes" cardClass="from-green-50/50 dark:from-green-950/20" iconBgClass="bg-green-400/10" iconFeatureClass="bg-green-400/20" iconFeatureColor="text-green-500" buttonStyle={{
          backgroundColor: "rgb(74, 222, 128)",
          borderColor: "rgb(74, 222, 128)"
        }} />
        </div>
      </div>
      
      {/* Habit Automation Section - Now after the feature cards */}
      <HabitAutomationShowcase />
    </section>
  );
};

const HabitAutomationShowcase: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-amber-50/90 via-amber-50/40 to-transparent dark:from-amber-950/30 dark:via-amber-950/10 dark:to-transparent border border-amber-100/50 dark:border-amber-800/30 rounded-xl overflow-hidden shadow-xl mb-0 backdrop-blur-sm">
      <div className="p-6 md:p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-amber-400/20 p-3 rounded-full">
            <Activity className="w-6 h-6 text-amber-500" />
          </div>
          <div className="text-left">
            <h2 className="text-2xl md:text-3xl font-bold">Habit Automation</h2>
            <p className="text-muted-foreground">Configure once, automate your daily workflow</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <HabitExampleCard icon={Timer} iconClass="bg-blue-400/20" iconColor="text-blue-500" title="Morning Workout" badgeType="habit" badgeClass="bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300" timeBadge="25 min" tags="fitness, morning-routine" description="Auto-creates a timed task with proper tags" borderColor="border-blue-200 dark:border-blue-800/50" />
          
          <HabitExampleCard icon={FileText} iconClass="bg-green-400/20" iconColor="text-green-500" title="Evening Reflection" badgeType="journal" badgeClass="bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300" timeBadge="daily" timeIcon={CalendarCheck} tags="journal, reflection" description="Auto-generates a journal entry with prompts" borderColor="border-green-200 dark:border-green-800/50" />
        </div>
        
        <div className="text-center">
          <Button asChild variant="default" size="lg" className="bg-amber-500 hover:bg-amber-600 rounded-full shadow-glow button-glow">
            <Link to="/habits" className="flex items-center gap-2">
              Configure Your Habits <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

interface HabitExampleCardProps {
  icon: React.ElementType;
  iconClass: string;
  iconColor: string;
  title: string;
  badgeType: string;
  badgeClass: string;
  timeBadge: string;
  timeIcon?: React.ElementType;
  tags: string;
  description: string;
  borderColor: string;
}

const HabitExampleCard: React.FC<HabitExampleCardProps> = ({
  icon: Icon,
  iconClass,
  iconColor,
  title,
  badgeType,
  badgeClass,
  timeBadge,
  timeIcon: TimeIcon = Clock,
  tags,
  description,
  borderColor
}) => {
  return (
    <div className="bg-white/80 dark:bg-black/20 backdrop-blur-md rounded-lg border border-amber-200/50 dark:border-amber-800/30 p-5 shadow-md transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="flex items-center gap-3 mb-3">
        <div className={`${iconClass} h-10 w-10 rounded-full flex items-center justify-center`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        <div className="flex-1 text-left">
          <h3 className="text-lg font-semibold">{title}</h3>
          <div className="flex flex-wrap gap-2 mt-1">
            <Badge variant="outline" className={`${badgeClass} border-none`}>{badgeType}</Badge>
            <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 border-none flex items-center gap-1">
              <TimeIcon className="h-3 w-3" /> {timeBadge}
            </Badge>
          </div>
        </div>
      </div>
      <div className={`pl-12 border-l-2 ${borderColor} ml-4`}>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2 text-left">
          <Tag className="h-3.5 w-3.5 text-primary/70" />
          <span>{tags}</span>
        </div>
        <p className="text-sm text-muted-foreground text-left">{description}</p>
      </div>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ElementType;
  iconClass: string;
  iconColor: string;
  title: string;
  description: string;
  features: string[];
  buttonLabel: string;
  buttonLink: string;
  cardClass: string;
  iconBgClass: string;
  iconFeatureClass: string;
  iconFeatureColor: string;
  buttonStyle: React.CSSProperties;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  iconClass,
  iconColor,
  title,
  description,
  features,
  buttonLabel,
  buttonLink,
  cardClass,
  iconBgClass,
  iconFeatureClass,
  iconFeatureColor,
  buttonStyle
}) => {
  return (
    <Card className={`border-primary/10 bg-gradient-to-br ${cardClass} to-transparent shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 backdrop-blur-sm`}>
      <CardHeader>
        <div className="flex items-center gap-3 mb-1">
          <div className={`p-2 rounded-md ${iconBgClass}`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription className="text-left mt-2">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 mb-4 text-left">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <div className={`h-5 w-5 rounded-full ${iconFeatureClass} flex items-center justify-center`}>
                <ArrowRight className={`h-3 w-3 ${iconFeatureColor}`} />
              </div>
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full button-glow" variant="default" style={buttonStyle}>
          <Link to={buttonLink}>{buttonLabel}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default HeroSection;

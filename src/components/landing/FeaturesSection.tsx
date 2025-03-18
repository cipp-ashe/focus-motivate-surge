import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ListTodo, BookOpen, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
const FeaturesSection: React.FC = () => {
  return <section className="mb-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient-primary">Everything You Need</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">FlowTime combines task management, habit automation, and focused work sessions in one powerful, privacy-focused application.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tasks Card */}
        <FeatureCard icon={ListTodo} iconClass="bg-primary/10" iconColor="text-primary" title="Task Management" description="Organize all your work in one place" features={["Smart task organization", "Integrated with timers", "Tagging system"]} buttonLabel="Go to Tasks" buttonLink="/tasks" cardClass="from-blue-50/50 dark:from-blue-950/20" iconBgClass="bg-primary/10" iconFeatureClass="bg-primary/20" iconFeatureColor="text-primary" buttonStyle={{}} />
        
        {/* Timer Card */}
        <FeatureCard icon={Timer} iconClass="bg-[#9b87f5]/10" iconColor="text-[#9b87f5]" title="Focus Timers" description="Track time spent on tasks" features={["Customizable timers", "Session tracking", "Productivity metrics"]} buttonLabel="Use Timer" buttonLink="/timer" cardClass="from-purple-50/50 dark:from-purple-950/20" iconBgClass="bg-[#9b87f5]/10" iconFeatureClass="bg-[#9b87f5]/20" iconFeatureColor="text-[#9b87f5]" buttonStyle={{
        backgroundColor: "#9b87f5",
        borderColor: "#9b87f5"
      }} />
        
        {/* Notes Card */}
        <FeatureCard icon={BookOpen} iconClass="bg-green-400/10" iconColor="text-green-500" title="Notes & Journals" description="Capture ideas and reflections" features={["Written notes", "Voice recordings", "Journal templates"]} buttonLabel="View Notes" buttonLink="/notes" cardClass="from-green-50/50 dark:from-green-950/20" iconBgClass="bg-green-400/10" iconFeatureClass="bg-green-400/20" iconFeatureColor="text-green-500" buttonStyle={{
        backgroundColor: "rgb(74, 222, 128)",
        borderColor: "rgb(74, 222, 128)"
      }} />
      </div>
    </section>;
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
  return <Card className={`border-primary/10 bg-gradient-to-br ${cardClass} to-transparent shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 backdrop-blur-sm`}>
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
          {features.map((feature, index) => <li key={index} className="flex items-center gap-2">
              <div className={`h-5 w-5 rounded-full ${iconFeatureClass} flex items-center justify-center`}>
                <ArrowRight className={`h-3 w-3 ${iconFeatureColor}`} />
              </div>
              <span className="text-sm">{feature}</span>
            </li>)}
        </ul>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full button-glow" variant="default" style={buttonStyle}>
          <Link to={buttonLink}>{buttonLabel}</Link>
        </Button>
      </CardFooter>
    </Card>;
};
export default FeaturesSection;
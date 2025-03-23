
import React from 'react';
import { ListTodo, Timer, BookOpen } from 'lucide-react';
import FeatureCardHabit from './FeatureCardHabit';

const FeatureCardsHabit: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <FeatureCardHabit 
        icon={ListTodo} 
        iconClass="bg-primary/10" 
        iconColor="text-primary" 
        title="Task Management" 
        description="Organize all your work in one place" 
        features={["Smart task organization", "Integrated with timers", "Tagging system"]} 
        buttonLabel="Go to Tasks" 
        buttonLink="/tasks" 
        cardClass="from-blue-50/50 dark:from-blue-950/20" 
        iconFeatureClass="bg-primary/20" 
        iconFeatureColor="text-primary" 
        buttonStyle={{}} 
      />
      
      <FeatureCardHabit 
        icon={Timer} 
        iconClass="bg-[#9b87f5]/10" 
        iconColor="text-[#9b87f5]" 
        title="Focus Timers" 
        description="Track time spent on tasks" 
        features={["Customizable timers", "Session tracking", "Productivity metrics"]} 
        buttonLabel="Use Timer" 
        buttonLink="/timer" 
        cardClass="from-purple-50/50 dark:from-purple-950/20" 
        iconFeatureClass="bg-[#9b87f5]/20" 
        iconFeatureColor="text-[#9b87f5]" 
        buttonStyle={{
          backgroundColor: "#9b87f5",
          borderColor: "#9b87f5"
        }} 
      />
      
      <FeatureCardHabit 
        icon={BookOpen} 
        iconClass="bg-green-400/10" 
        iconColor="text-green-500" 
        title="Notes & Journals" 
        description="Capture ideas and reflections" 
        features={["Written notes", "Voice recordings", "Journal templates"]} 
        buttonLabel="View Notes" 
        buttonLink="/notes" 
        cardClass="from-green-50/50 dark:from-green-950/20" 
        iconFeatureClass="bg-green-400/20" 
        iconFeatureColor="text-green-500" 
        buttonStyle={{
          backgroundColor: "rgb(74, 222, 128)",
          borderColor: "rgb(74, 222, 128)"
        }} 
      />
    </div>
  );
};

export default FeatureCardsHabit;

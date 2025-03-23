
import React from 'react';
import { ListTodo, Timer, BookOpen } from 'lucide-react';
import FeatureCardHabit from './FeatureCardHabit';

const FeatureCardsHabit: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <FeatureCardHabit 
        icon={ListTodo}
        title="Task Management" 
        description="Organize all your work in one place" 
        features={["Smart task organization", "Integrated with timers", "Tagging system"]} 
        buttonLabel="Go to Tasks" 
        buttonLink="/tasks"
      />
      
      <FeatureCardHabit 
        icon={Timer}
        title="Focus Timers" 
        description="Track time spent on tasks" 
        features={["Customizable timers", "Session tracking", "Productivity metrics"]} 
        buttonLabel="Use Timer" 
        buttonLink="/timer"
      />
      
      <FeatureCardHabit 
        icon={BookOpen}
        title="Notes & Journals" 
        description="Capture ideas and reflections" 
        features={["Written notes", "Voice recordings", "Journal templates"]} 
        buttonLabel="View Notes" 
        buttonLink="/notes"
      />
    </div>
  );
};

export default FeatureCardsHabit;

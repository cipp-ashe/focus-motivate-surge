
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import HeroHeader from './HeroHeader';
import FeatureCards from './FeatureCards';
import HabitAutomationShowcase from './HabitAutomationShowcase';

const HeroSection: React.FC = () => {
  return (
    <section className="mb-8 md:mb-10">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="flex flex-wrap gap-4 justify-center">
          <Button asChild size="lg" className="rounded-full px-8 shadow-glow button-glow">
            
          </Button>
        </div>
      </div>
      
      {/* Hero Header with title and description */}
      <HeroHeader />
      
      {/* Feature Cards */}
      <div className="mb-8">
        <FeatureCards />
      </div>
      
      {/* Habit Automation Section */}
      <HabitAutomationShowcase />
    </section>
  );
};

export default HeroSection;

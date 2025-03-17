
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/ui/useIsMobile';
import DashboardCard from '@/components/dashboard/DashboardCard';
import { dashboardCards, iconMap, iconColorMap } from '@/components/dashboard/dashboardData';

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
        <header className="text-center mb-10 sm:mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-gradient-primary">
            Focus Dashboard
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Organize your work, improve your productivity, and build better habits
          </p>
        </header>
        
        <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-2">
          {dashboardCards.map((card, index) => (
            <DashboardCard
              key={index}
              to={card.to}
              title={card.title}
              description={card.description}
              icon={iconMap[card.title]}
              iconColor={iconColorMap[card.title]}
              metrics={card.metrics}
            />
          ))}
        </main>
        
        <footer className="mt-12 sm:mt-16 text-center">
          <Button asChild variant="outline" className="bg-card/80 backdrop-blur-sm rounded-full px-6 shadow-glass border-primary/20 hover:bg-primary/10 button-scale">
            <Link to="/settings" className="flex items-center gap-2">
              Start Customizing Your Experience
              <ArrowRight className="h-4 w-4 arrow-slide-right" />
            </Link>
          </Button>
        </footer>
      </div>
    </div>
  );
};

export default IndexPage;

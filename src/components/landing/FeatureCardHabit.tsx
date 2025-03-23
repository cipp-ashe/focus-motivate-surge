
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FeatureCardHabitProps {
  icon: React.ElementType;
  iconClass: string;
  iconColor: string;
  title: string;
  description: string;
  features: string[];
  buttonLabel: string;
  buttonLink: string;
  cardClass: string;
  iconFeatureClass: string;
  iconFeatureColor: string;
  buttonStyle: React.CSSProperties;
}

const FeatureCardHabit: React.FC<FeatureCardHabitProps> = ({
  icon: Icon,
  iconClass,
  iconColor,
  title,
  description,
  features,
  buttonLabel,
  buttonLink,
  cardClass,
  iconFeatureClass,
  iconFeatureColor,
  buttonStyle
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Effect to remove outlines and box-shadows
  useEffect(() => {
    if (cardRef.current) {
      // Apply to the card itself
      cardRef.current.style.outline = 'none';
      cardRef.current.style.boxShadow = 'none';
      
      // Apply to all focusable elements inside
      const focusableElements = cardRef.current.querySelectorAll<HTMLElement>(
        'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
      );
      
      focusableElements.forEach(el => {
        el.style.outline = 'none';
        el.style.boxShadow = 'none';
      });
    }
  }, []);
  
  return (
    <div 
      ref={cardRef}
      className={`bg-white/80 dark:bg-black/20 backdrop-blur-md rounded-lg border border-primary/10 p-6 shadow-md transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${cardClass}`}
      style={{ outline: 'none', boxShadow: 'none' }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`${iconClass} p-2 rounded-md flex items-center justify-center`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      
      <ul className="space-y-2 mb-6 text-left">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2">
            <div className={`h-5 w-5 rounded-full ${iconFeatureClass} flex items-center justify-center`}>
              <ArrowRight className={`h-3 w-3 ${iconFeatureColor}`} />
            </div>
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>
      
      <Button 
        className="w-full button-glow outline-none" 
        variant="default" 
        style={{...buttonStyle, outline: 'none', boxShadow: 'none'}}
        asChild
      >
        <Link to={buttonLink} style={{outline: 'none', boxShadow: 'none'}}>{buttonLabel}</Link>
      </Button>
    </div>
  );
};

export default FeatureCardHabit;

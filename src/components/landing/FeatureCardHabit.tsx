
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
    // Add a global style override for this component
    const style = document.createElement('style');
    style.innerHTML = `
      .feature-card-habit, 
      .feature-card-habit *,
      button, a, div[role="button"],
      .card, .card-glass, .feature-card {
        outline: none !important;
        box-shadow: none !important;
        border-color: rgba(var(--border-rgb), 0.1) !important;
      }
      
      .feature-card-habit:focus,
      .feature-card-habit *:focus,
      button:focus, a:focus, div[role="button"]:focus,
      .card:focus, .card-glass:focus, .feature-card:focus {
        outline: none !important;
        box-shadow: none !important;
      }
      
      .card, .card-content, .feature-card {
        outline: none !important;
        box-shadow: none !important;
      }
    `;
    document.head.appendChild(style);
    
    // Apply style to all elements within the card
    if (cardRef.current) {
      const applyNoOutlineStyle = (element: HTMLElement) => {
        element.style.outline = 'none';
        element.style.boxShadow = 'none';
        
        // Also remove focus styles
        element.addEventListener('focus', () => {
          element.style.outline = 'none';
          element.style.boxShadow = 'none';
        }, true);
      };
      
      // Apply to the card itself
      applyNoOutlineStyle(cardRef.current);
      
      // Apply to all child elements
      const allElements = cardRef.current.querySelectorAll('*');
      allElements.forEach(el => {
        if (el instanceof HTMLElement) {
          applyNoOutlineStyle(el);
        }
      });
    }
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  return (
    <div 
      ref={cardRef}
      className={`feature-card-habit bg-white/80 dark:bg-black/20 backdrop-blur-md rounded-lg p-6 transform transition-all duration-300 hover:-translate-y-1 ${cardClass}`}
      style={{ 
        outline: 'none', 
        boxShadow: 'none',
        border: '1px solid rgba(var(--border-rgb), 0.1)'
      }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`${iconClass} p-2 rounded-md flex items-center justify-center`} style={{ outline: 'none', boxShadow: 'none' }}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      
      <ul className="space-y-2 mb-6 text-left">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2" style={{ outline: 'none', boxShadow: 'none' }}>
            <div className={`h-5 w-5 rounded-full ${iconFeatureClass} flex items-center justify-center`} style={{ outline: 'none', boxShadow: 'none' }}>
              <ArrowRight className={`h-3 w-3 ${iconFeatureColor}`} />
            </div>
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>
      
      <Button 
        className="w-full" 
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

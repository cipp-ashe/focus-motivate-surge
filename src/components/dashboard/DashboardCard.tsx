
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/ui/useIsMobile';
import { cn } from '@/lib/utils';

export interface DashboardCardProps {
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

export const DashboardCard: React.FC<DashboardCardProps> = ({ 
  to, 
  title, 
  description,
  icon: Icon,
  iconColor,
  metrics
}) => {
  const isMobile = useIsMobile();
  
  return (
    <Link 
      to={to} 
      className="block h-full" 
      aria-label={`Navigate to ${title}`}
    >
      <Card className={cn(
        "h-full",
        "bg-card",
        "overflow-hidden flex flex-col"
      )}>
        <CardContent className={cn(
          "flex flex-col h-full",
          isMobile ? "p-4" : "p-5 sm:p-6"
        )}>
          <div className="flex items-center mb-3">
            <div 
              className={cn(
                "rounded-xl p-2.5 flex-shrink-0 mr-3", 
                "bg-background"
              )}
              aria-hidden="true"
            >
              <Icon className={cn("w-6 h-6", iconColor)} />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold" id={`card-title-${title.toLowerCase().replace(/\s+/g, '-')}`}>
                {title}
              </h2>
              <p 
                className="text-sm text-muted-foreground mt-1"
                aria-labelledby={`card-title-${title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {description}
              </p>
            </div>
          </div>
          
          {metrics && metrics.length > 0 && (
            <div 
              className="mt-auto pt-3 grid grid-cols-2 gap-2 text-sm"
              aria-label={`${title} metrics`}
            >
              {metrics.map((metric, index) => {
                const metricId = `metric-${title.toLowerCase().replace(/\s+/g, '-')}-${index}`;
                return (
                  <div 
                    key={index} 
                    className="flex items-center gap-1.5 bg-background p-1.5 rounded-md"
                  >
                    <metric.icon className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
                    <span className="text-muted-foreground" id={metricId}>{metric.label}:</span>
                    <span className="font-medium" aria-labelledby={metricId}>{metric.value}</span>
                  </div>
                );
              })}
            </div>
          )}
          
          <div className="absolute bottom-3 right-3">
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="text-primary"
              aria-hidden="true"
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default DashboardCard;

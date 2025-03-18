
import React from 'react';
import { Tag, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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

export default HabitExampleCard;

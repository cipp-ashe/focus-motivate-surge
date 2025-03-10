
import React from 'react';

export interface TaskMetricsRowProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

export const TaskMetricsRow: React.FC<TaskMetricsRowProps> = ({
  label,
  value,
  icon
}) => {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
        {icon && icon}
        {label}
      </div>
      <p className="text-sm">{value}</p>
    </div>
  );
};

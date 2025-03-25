
import React from 'react';
import { Card, CardContent, CardHeader, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function GlassCard({ children, className, ...props }: GlassCardProps) {
  return (
    <Card className={cn(
      "border border-border/[var(--border-medium)] bg-card/75 backdrop-blur-sm dark:bg-card/40 dark:backdrop-blur-md shadow-sm", 
      className
    )} {...props}>
      {children}
    </Card>
  );
}

export function GlassCardContent({ children, className, ...props }: GlassCardProps) {
  return (
    <CardContent className={cn("p-4", className)} {...props}>
      {children}
    </CardContent>
  );
}

export function GlassCardHeader({ children, className, ...props }: GlassCardProps) {
  return (
    <CardHeader className={cn("px-4 py-3 border-b border-border/40", className)} {...props}>
      {children}
    </CardHeader>
  );
}

export function GlassCardTitle({ children, className, ...props }: GlassCardProps) {
  return (
    <CardTitle className={cn("text-xl", className)} {...props}>
      {children}
    </CardTitle>
  );
}

export function GlassCardFooter({ children, className, ...props }: GlassCardProps) {
  return (
    <CardFooter className={cn("px-4 py-3", className)} {...props}>
      {children}
    </CardFooter>
  );
}

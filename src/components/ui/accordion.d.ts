
import * as React from 'react';

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "single" | "multiple";
  collapsible?: boolean;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

export const Accordion: React.FC<AccordionProps>;
export const AccordionItem: React.FC<{value: string}>;
export const AccordionTrigger: React.FC<React.HTMLAttributes<HTMLButtonElement>>;
export const AccordionContent: React.FC<React.HTMLAttributes<HTMLDivElement>>;

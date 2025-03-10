
import React from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface DatePickerSectionProps {
  date: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
}

export const DatePickerSection: React.FC<DatePickerSectionProps> = ({
  date,
  onDateSelect
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "flex items-center gap-2 bg-background/50 border-input/50",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="h-4 w-4 text-primary/70" />
          {date ? format(date, "MMM d, yyyy") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="center">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onDateSelect}
          disabled={(date) =>
            date > new Date("2100-01-01") || date < new Date("1900-01-01")
          }
          initialFocus
          className={cn("p-3 pointer-events-auto")}
        />
      </PopoverContent>
    </Popover>
  );
};


import React from "react";
import { Timer as TimerIcon } from "lucide-react";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface TimerErrorProps {
  message?: string;
}

export const TimerError: React.FC<TimerErrorProps> = ({ message = "There was an error loading the timer." }) => {
  return (
    <>
      <CardHeader className="bg-card/70 border-b border-border/10 py-4">
        <CardTitle className="text-lg font-medium flex items-center gap-2 text-destructive">
          <TimerIcon className="h-5 w-5 text-destructive" />
          Timer Error
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8 text-center">
        <p className="text-destructive font-medium">{message}</p>
        <p className="mt-4 text-sm text-muted-foreground">Try refreshing the page or contact support if the problem persists.</p>
      </CardContent>
    </>
  );
};

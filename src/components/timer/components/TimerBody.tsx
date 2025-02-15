
import React from "react";
import { TimerHeader } from "../TimerHeader";
import { TimerCircle } from "../TimerCircle";
import { TimerControls } from "../controls/TimerControls";
import { TimerMetricsDisplay } from "../TimerMetrics";
import { cn } from "@/lib/utils";
import type { TimerBodyProps } from "@/types/timer/components";

export const TimerBody = ({
  isExpanded,
  setIsExpanded,
  showCompletion,
  taskName,
  timerCircleProps,
  timerControlsProps,
  metrics,
  internalMinutes,
  handleMinutesChange,
  selectedSound,
  setSelectedSound,
  testSound,
  isLoadingAudio,
  updateMetrics,
  expandedViewRef,
  handleCloseTimer,
  favorites,
  setFavorites,
}: TimerBodyProps) => {
  return (
    <div className="flex flex-col h-full">
      <TimerHeader
        taskName={taskName}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        onClose={handleCloseTimer}
      />

      <div className={cn(
        "flex-1 grid gap-4",
        "grid-cols-1 lg:grid-cols-[1fr,auto]",
        "p-4 sm:p-6",
        "min-h-0" // Important for preventing overflow
      )}>
        {/* Timer Circle and Controls Section */}
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="relative w-full max-w-[300px] mx-auto">
            <TimerCircle {...timerCircleProps} />
          </div>
          <TimerControls {...timerControlsProps} />
        </div>

        {/* Metrics Section */}
        <div className={cn(
          "flex flex-col",
          "w-full lg:w-[280px]",
          "bg-card/5 rounded-lg",
          "overflow-y-auto"
        )}>
          <TimerMetricsDisplay
            metrics={metrics}
            isRunning={timerControlsProps.isRunning}
          />
        </div>
      </div>
    </div>
  );
};

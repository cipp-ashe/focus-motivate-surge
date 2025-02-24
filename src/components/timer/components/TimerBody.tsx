
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
        onCloseTimer={handleCloseTimer}
      />

      <div className={cn(
        "flex-1 grid gap-6",
        "grid-cols-1 lg:grid-cols-[1fr,280px]",
        "p-6",
        "min-h-0" // Important for preventing overflow
      )}>
        {/* Timer Circle and Controls Section */}
        <div className="flex flex-col items-center justify-center gap-8">
          <div className="relative w-full max-w-[300px] mx-auto">
            <TimerCircle {...timerCircleProps} size="normal" />
          </div>
          <div className="w-full max-w-[300px]">
            <TimerControls {...timerControlsProps} />
          </div>
        </div>

        {/* Metrics Section */}
        <div className={cn(
          "flex flex-col",
          "bg-card/5 rounded-lg"
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

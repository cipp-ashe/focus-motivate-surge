
import * as React from "react"
import { Dialog as BaseDialog, DialogContent, DialogOverlay, DialogPortal } from "../ui/dialog"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/ui/useIsMobile"

const TimerCompletionDialog = BaseDialog

const TimerCompletionDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogContent>,
  React.ComponentPropsWithoutRef<typeof DialogContent>
>(({ className, ...props }, ref) => {
  const isMobile = useIsMobile();

  return (
    <DialogPortal>
      <DialogOverlay className="z-[150] bg-black/60" />
      <DialogContent
        ref={ref}
        className={cn(
          "z-[150] max-w-lg",
          isMobile ? "w-[90vw] mt-16 mx-auto rounded-lg p-4" : "w-[95vw] sm:w-full",
          className
        )}
        {...props}
      />
    </DialogPortal>
  )
})
TimerCompletionDialogContent.displayName = "TimerCompletionDialogContent"

export { TimerCompletionDialog, TimerCompletionDialogContent }

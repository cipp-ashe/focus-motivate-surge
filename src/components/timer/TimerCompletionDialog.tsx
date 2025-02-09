
import * as React from "react"
import { Dialog as BaseDialog, DialogContent, DialogOverlay, DialogPortal } from "../ui/dialog"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"

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
          "z-[150] w-[95vw] max-w-lg sm:w-full",
          isMobile && "mt-16 mx-auto",
          className
        )}
        {...props}
      />
    </DialogPortal>
  )
})
TimerCompletionDialogContent.displayName = "TimerCompletionDialogContent"

export { TimerCompletionDialog, TimerCompletionDialogContent }

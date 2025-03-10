
import { type ToastActionElement, ToastProps } from "@/components/ui/toast"

// Re-export the toast from sonner
export { toast } from "sonner"

// Create a useToast hook interface similar to shadcn's
export const useToast = () => {
  return {
    toast: {
      // Basic toast functions
      success: (title: string, options?: Partial<ToastProps>) => {
        import("sonner").then(module => {
          module.toast.success(title, options);
        });
      },
      error: (title: string, options?: Partial<ToastProps>) => {
        import("sonner").then(module => {
          module.toast.error(title, options);
        });
      },
      info: (title: string, options?: Partial<ToastProps>) => {
        import("sonner").then(module => {
          module.toast.info(title, options);
        });
      },
      warning: (title: string, options?: Partial<ToastProps>) => {
        import("sonner").then(module => {
          module.toast.warning(title, options);
        });
      },
      // General toast function
      default: (title: string, options?: Partial<ToastProps>) => {
        import("sonner").then(module => {
          module.toast(title, options);
        });
      }
    }
  }
}

export type ToastType = ReturnType<typeof useToast>

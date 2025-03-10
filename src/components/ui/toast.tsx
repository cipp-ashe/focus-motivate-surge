
import { 
  ToastProvider as RadixToastProvider, 
  ToastViewport as RadixToastViewport, 
  Toast as RadixToast, 
  ToastTitle as RadixToastTitle, 
  ToastDescription as RadixToastDescription, 
  ToastClose as RadixToastClose, 
  ToastAction as RadixToastAction 
} from "@radix-ui/react-toast";

// Re-export the Sonner toast directly
export { toast } from "sonner";

// Re-export Radix UI components for backward compatibility
export const ToastProvider = RadixToastProvider;
export const ToastViewport = RadixToastViewport;
export const Toast = RadixToast;
export const ToastTitle = RadixToastTitle;
export const ToastDescription = RadixToastDescription;
export const ToastClose = RadixToastClose;
export const ToastAction = RadixToastAction;

// Re-export the useToast hook
export { useToast } from "@/hooks/use-toast";

export interface ToastProps {
  title?: string;
  description?: string;
  action?: React.ReactElement<{
    onPress: () => void
  }>;
  duration?: number;
}

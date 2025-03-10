
import { 
  ToastProvider as RadixToastProvider, 
  ToastViewport as RadixToastViewport, 
  Toast as RadixToast, 
  ToastTitle as RadixToastTitle, 
  ToastDescription as RadixToastDescription, 
  ToastClose as RadixToastClose, 
  ToastAction as RadixToastAction 
} from "@radix-ui/react-toast";

import { useToast, ToastActionElement } from "@/hooks/use-toast";

export const ToastProvider = RadixToastProvider;
export const ToastViewport = RadixToastViewport;
export const Toast = RadixToast;
export const ToastTitle = RadixToastTitle;
export const ToastDescription = RadixToastDescription;
export const ToastClose = RadixToastClose;
export const ToastAction = RadixToastAction;
export { useToast };

export interface ToastProps {
  title?: string;
  description?: string;
  action?: ToastActionElement;
  duration?: number;
}

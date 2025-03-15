import React from "react";
import { toast, Toaster as SonnerToaster } from "sonner";

interface ToastOptions {
  title: string;
  description?: string;
  type?: "success" | "error" | "warning" | "info";
  duration?: number;
}

interface ToastContextType {
  toast: (options: ToastOptions) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const showToast = ({ title, description, type = "success", duration = 5000 }: ToastOptions) => {
    switch (type) {
      case "success":
        toast.success(title, { description, duration });
        break;
      case "error":
        toast.error(title, { description, duration });
        break;
      case "warning":
        toast.warning(title, { description, duration });
        break;
      case "info":
        toast.info(title, { description, duration });
        break;
      default:
        toast(title, { description, duration });
    }
  };

  return (
    <ToastContext.Provider value={{ toast: showToast }}>
      <SonnerToaster position="top-right" expand={false} richColors closeButton />
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return {
    toast: (options: ToastOptions) => {
      const { title, description, type = "success", duration = 5000 } = options;
      
      switch (type) {
        case "success":
          toast.success(title, { description, duration });
          break;
        case "error":
          toast.error(title, { description, duration });
          break;
        case "warning":
          toast.warning(title, { description, duration });
          break;
        case "info":
          toast.info(title, { description, duration });
          break;
        default:
          toast(title, { description, duration });
      }
    }
  };
}

export function Toaster() {
  return <SonnerToaster position="top-right" expand={false} richColors closeButton />;
}

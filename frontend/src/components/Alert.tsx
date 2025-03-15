import React from "react";
import { AlertCircle, AlertTriangle, Info, CheckCircle } from "lucide-react";

export interface AlertTitleProps {
  children: React.ReactNode;
  className?: string;
}

export interface AlertDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export const AlertTitle: React.FC<AlertTitleProps> = ({ children, className = "" }) => {
  return (
    <h3 className={`text-sm font-medium ${className}`}>{children}</h3>
  );
};

export const AlertDescription: React.FC<AlertDescriptionProps> = ({ children, className = "" }) => {
  return (
    <div className={`text-sm mt-1 ${className}`}>{children}</div>
  );
};

export interface Props {
  title: string;
  message: string;
  variant: "error" | "warning" | "info" | "success";
  onClose?: () => void;
  className?: string;
}

export const Alert: React.FC<Props> = ({
  title,
  message,
  variant = "info",
  onClose,
  className = "",
}) => {
  // Define styling based on variant
  const variantStyles = {
    error: {
      containerClass: "bg-red-50 border-red-200",
      iconClass: "text-red-600",
      titleClass: "text-red-800",
      messageClass: "text-red-700",
      icon: <AlertCircle className="h-5 w-5" />,
    },
    warning: {
      containerClass: "bg-amber-50 border-amber-200",
      iconClass: "text-amber-600",
      titleClass: "text-amber-800",
      messageClass: "text-amber-700",
      icon: <AlertTriangle className="h-5 w-5" />,
    },
    info: {
      containerClass: "bg-blue-50 border-blue-200",
      iconClass: "text-blue-600",
      titleClass: "text-blue-800",
      messageClass: "text-blue-700",
      icon: <Info className="h-5 w-5" />,
    },
    success: {
      containerClass: "bg-green-50 border-green-200",
      iconClass: "text-green-600",
      titleClass: "text-green-800",
      messageClass: "text-green-700",
      icon: <CheckCircle className="h-5 w-5" />,
    },
  };

  const styles = variantStyles[variant];

  return (
    <div
      className={`p-4 border rounded-md flex items-start ${styles.containerClass} ${className}`}
    >
      <div className={`mr-3 flex-shrink-0 ${styles.iconClass}`}>
        {styles.icon}
      </div>
      <div className="flex-1">
        {title && <h3 className={`text-sm font-medium ${styles.titleClass}`}>{title}</h3>}
        {message && <div className={`text-sm mt-1 ${styles.messageClass}`}>{message}</div>}
      </div>
      {onClose && (
        <button
          type="button"
          className="ml-3 flex-shrink-0 inline-flex h-5 w-5 items-center justify-center rounded-md text-gray-400 hover:bg-gray-200 hover:text-gray-500 focus:outline-none"
          onClick={onClose}
        >
          <span className="sr-only">Close</span>
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

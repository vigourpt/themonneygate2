import React from "react";
import { Loader2 } from "lucide-react";

export interface Props {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const LoadingSpinner: React.FC<Props> = ({ 
  size = "md", 
  className = ""
}) => {
  const sizeMap = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12"
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 className={`${sizeMap[size]} animate-spin text-blue-600`} />
      <span className="sr-only">Loading...</span>
    </div>
  );
};

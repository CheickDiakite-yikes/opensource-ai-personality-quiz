
import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl";
}

export const Spinner = ({ className, size = "md", ...props }: SpinnerProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12",
  };

  return (
    <div role="status" aria-label="Loading" {...props} className={cn("flex justify-center items-center", className)}>
      <Loader2 
        className={cn(
          "animate-spin text-primary transition-all duration-200",
          sizeClasses[size]
        )} 
      />
    </div>
  );
};

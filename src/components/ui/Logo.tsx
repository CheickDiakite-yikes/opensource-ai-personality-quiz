
import React from "react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "small" | "medium" | "large";
  asLink?: boolean;
}

const Logo: React.FC<LogoProps> = ({ 
  className, 
  showText = true, 
  size = "medium",
  asLink = true
}) => {
  const sizeClasses = {
    small: "h-6 w-6",
    medium: "h-8 w-8",
    large: "h-12 w-12"
  };

  const textSizeClasses = {
    small: "text-lg",
    medium: "text-xl",
    large: "text-2xl"
  };

  const logoImage = (
    <img 
      src="/lovable-uploads/306ed828-b24c-4839-b992-4f1ac906fd6b.png" 
      alt="Who Am I? Logo" 
      className={cn(sizeClasses[size], "transition-transform duration-300 hover:scale-105")}
    />
  );

  const content = (
    <div className={cn("flex items-center gap-2", className)}>
      {logoImage}
      {showText && (
        <span className={cn("font-bold", textSizeClasses[size])}>
          Who Am I?
        </span>
      )}
    </div>
  );

  if (asLink) {
    return (
      <Link to="/" className="hover:opacity-90 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
};

export default Logo;

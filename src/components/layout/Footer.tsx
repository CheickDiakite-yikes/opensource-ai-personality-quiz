
import React from "react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const isMobile = useIsMobile();
  
  return (
    <footer className="border-t border-border py-4 sm:py-6 px-4 bg-background/80 backdrop-blur-sm">
      <div className="container max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 flex items-center">
            <img 
              src="/lovable-uploads/a6a49449-db76-4794-8533-d61d6a85d466.png" 
              alt="Who Am I Logo" 
              className="h-8 sm:h-10 w-auto mr-3" 
            />
            <div>
              <div className="text-base sm:text-lg font-bold text-gradient">Who Am I?</div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Discover your true self through AI-powered insights
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-x-4 sm:gap-x-6 gap-y-2 justify-center">
            <Link to="/" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <Link to="/assessment" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
              Assessment
            </Link>
            <Link to="/report" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
              Report
            </Link>
            <Link to="/tracker" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
              Tracker
            </Link>
          </div>
        </div>
        
        <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center text-xs sm:text-sm text-muted-foreground">
          <div>© {currentYear} Who Am I? All rights reserved.</div>
          <div className="mt-2 md:mt-0 flex items-center">
            Made with 
            <img 
              src="/lovable-uploads/a6a49449-db76-4794-8533-d61d6a85d466.png" 
              alt="Brain Logo" 
              className="h-2.5 sm:h-3 w-auto mx-1" 
            /> 
            for self-discovery
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

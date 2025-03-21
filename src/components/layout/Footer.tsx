
import React from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t border-border py-6 px-4 bg-background/80 backdrop-blur-sm">
      <div className="container max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 flex items-center">
            <img 
              src="/lovable-uploads/03c0c12c-5bc0-4613-811a-662add832c4f.png" 
              alt="Who Am I Logo" 
              className="h-10 w-auto mr-3" 
            />
            <div>
              <div className="text-lg font-bold text-gradient">Who Am I?</div>
              <p className="text-sm text-muted-foreground mt-1">
                Discover your true self through AI-powered insights
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <Link to="/assessment" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Assessment
            </Link>
            <Link to="/report" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Report
            </Link>
            <Link to="/tracker" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Tracker
            </Link>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <div>© {currentYear} Who Am I? All rights reserved.</div>
          <div className="mt-2 md:mt-0 flex items-center">
            Made with <Heart className="h-3 w-3 mx-1 text-red-500" /> for self-discovery
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

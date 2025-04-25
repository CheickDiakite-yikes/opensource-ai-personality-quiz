
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

const DesktopHeader: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <header className="hidden md:flex py-4 px-4 border-b">
      <div className="container flex justify-between items-center">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="mr-2 hover:bg-accent/50 transition-colors" />
          {location.pathname !== "/" && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleBack}
              className="hover:bg-accent/50 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Go back</span>
            </Button>
          )}
          <img 
            src="/lovable-uploads/a6a49449-db76-4794-8533-d61d6a85d466.png" 
            alt="Who Am I Logo" 
            className="h-6 w-auto" 
          />
        </div>
      </div>
    </header>
  );
};

export default DesktopHeader;

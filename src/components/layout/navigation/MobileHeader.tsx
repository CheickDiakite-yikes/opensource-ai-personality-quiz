
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import NotificationCenter from "../../notifications/NotificationCenter";
import MobileMenu from "./MobileMenu";

const MobileHeader: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const isHomePage = location.pathname === "/";
  const headerClasses = `md:hidden py-3 px-3 border-b fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md`;

  return (
    <header className={headerClasses}>
      <div className="container flex justify-between items-center">
        <div className="flex items-center gap-2">
          {!isHomePage && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleBack}
              className="mr-1 hover:bg-accent/50 transition-colors rounded-full w-9 h-9 p-0"
              aria-label="Go back"
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Go back</span>
            </Button>
          )}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <Link to="/" className="flex items-center hover:text-primary transition-colors">
              <img 
                src="/lovable-uploads/a6a49449-db76-4794-8533-d61d6a85d466.png" 
                alt="Who Am I Logo" 
                className="h-8 w-auto mr-2" 
              />
              <span className="text-lg font-bold">Who Am I?</span>
            </Link>
          </motion.div>
        </div>
        <div className="flex items-center space-x-1">
          <NotificationCenter />
          <MobileMenu />
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;

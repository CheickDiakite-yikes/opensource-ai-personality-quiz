
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

  return (
    <header className="md:hidden py-4 px-4 border-b">
      <div className="container flex justify-between items-center">
        <div className="flex items-center gap-2">
          {location.pathname !== "/" && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleBack}
              className="mr-1 hover:bg-accent/50 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Go back</span>
            </Button>
          )}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" className="text-xl font-bold hover:text-primary transition-colors">
              Who Am I?
            </Link>
          </motion.div>
        </div>
        <div className="flex items-center space-x-3">
          <NotificationCenter />
          <MobileMenu />
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;

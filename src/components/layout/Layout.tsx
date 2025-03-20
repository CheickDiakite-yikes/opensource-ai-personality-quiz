import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  Home, 
  User, 
  BarChart, 
  CheckSquare, 
  Menu, 
  X, 
  Settings, 
  LogOut,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [showSidebar, setShowSidebar] = useState(false);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { name: "Home", icon: Home, path: "/" },
    { name: "Assessment", icon: User, path: "/assessment" },
    { name: "Report", icon: BarChart, path: "/report" },
    { name: "Tracker", icon: CheckSquare, path: "/tracker" },
  ];

  const sidebarVariants = {
    open: { 
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    },
    closed: { 
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  };
  
  const itemVariants = {
    open: { 
      opacity: 1, 
      x: 0,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    closed: { 
      opacity: 0, 
      x: -20,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  const renderNavigation = () => (
    <>
      {navItems.map((item) => (
        <motion.div
          key={item.path}
          variants={itemVariants}
          className="w-full"
        >
          <Link
            to={item.path}
            onClick={() => isMobile && setShowSidebar(false)}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors relative w-full group",
              isActive(item.path)
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
            {isActive(item.path) && (
              <motion.div
                layoutId="sidebar-indicator"
                className="absolute right-2 h-2 w-2 rounded-full bg-primary"
                transition={{ duration: 0.2 }}
              />
            )}
            <div className="absolute inset-0 rounded-lg bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        </motion.div>
      ))}
    </>
  );

  return (
    <div className="flex flex-col min-h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <div className="fixed top-0 left-0 h-full z-40">
          <motion.div 
            initial="closed"
            animate={showSidebar ? "open" : "closed"}
            variants={sidebarVariants}
            className="bg-card/95 backdrop-blur-sm border-r border-border shadow-lg h-full w-64 overflow-hidden flex flex-col"
          >
            <div className="p-4 border-b border-border flex justify-between items-center">
              <div className="text-xl font-bold text-gradient">Who Am I?</div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowSidebar(false)}
                className="md:hidden"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex flex-col gap-1 p-3 flex-1 overflow-auto">
              {renderNavigation()}
            </div>
            
            <div className="p-3 border-t border-border mt-auto">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-muted-foreground hover:text-foreground"
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </div>
          </motion.div>
          
          {!showSidebar && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute top-1/2 -translate-y-1/2 -right-7 z-50"
            >
              <Button 
                variant="secondary" 
                size="icon" 
                onClick={() => setShowSidebar(true)}
                className="rounded-full shadow-lg h-14 w-14"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </motion.div>
          )}
        </div>
      )}
      
      {/* Mobile Navigation */}
      {isMobile && (
        <>
          {/* Mobile Top Nav */}
          <motion.div 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="sticky top-0 z-30 w-full border-b border-border bg-background/70 backdrop-blur-lg"
          >
            <div className="flex items-center justify-between h-14 px-4">
              <div className="text-xl font-bold text-gradient">Who Am I?</div>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0">
                  <div className="p-4 border-b border-border">
                    <div className="text-xl font-bold text-gradient">Who Am I?</div>
                  </div>
                  <div className="flex flex-col gap-1 p-3">
                    {navItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors relative",
                          isActive(item.path)
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-accent hover:text-foreground"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.name}</span>
                        {isActive(item.path) && (
                          <div className="absolute right-2 h-2 w-2 rounded-full bg-primary" />
                        )}
                      </Link>
                    ))}
                  </div>
                  <div className="p-3 border-t border-border mt-auto">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-muted-foreground hover:text-foreground"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </motion.div>
        
          {/* Mobile Bottom Nav */}
          <motion.div 
            className="fixed bottom-0 left-0 right-0 bg-background/70 dark:bg-background/70 backdrop-blur-xl border-t border-border z-50"
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <nav className="flex justify-around px-4 py-3">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex flex-col items-center justify-center rounded-lg px-2 py-1.5 text-sm font-medium transition-colors",
                    isActive(item.path)
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-xs mt-1">{item.name}</span>
                  {isActive(item.path) && (
                    <motion.div
                      className="absolute bottom-1 h-1 w-1 rounded-full bg-primary"
                      layoutId="navbar-indicator"
                    />
                  )}
                </Link>
              ))}
            </nav>
          </motion.div>
        </>
      )}
      
      <main className={cn(
        "flex-1 flex flex-col overflow-hidden transition-all duration-300",
        !isMobile && showSidebar ? "ml-64" : "ml-0"
      )}>
        <div className="flex-1 overflow-auto">
          {children}
        </div>
        
        {/* Only render footer if we're not on the assessment page for better UI */}
        {location.pathname !== "/assessment" && <Footer />}
      </main>
    </div>
  );
};

export default Layout;

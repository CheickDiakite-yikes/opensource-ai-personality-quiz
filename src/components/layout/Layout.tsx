
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Home, User, BarChart, CheckSquare, LogOut } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { name: "Home", icon: Home, path: "/" },
    { name: "Assessment", icon: User, path: "/assessment" },
    { name: "Report", icon: BarChart, path: "/report" },
    { name: "Tracker", icon: CheckSquare, path: "/tracker" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 flex flex-col md:pt-0 overflow-hidden">
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>
      
      {/* Mobile Navigation */}
      <motion.div 
        className="fixed bottom-0 left-0 right-0 bg-white/70 dark:bg-black/70 backdrop-blur-xl border-t border-border z-50 md:hidden"
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
    </div>
  );
};

export default Layout;

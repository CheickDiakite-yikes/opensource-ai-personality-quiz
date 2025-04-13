
import { User, Brain, BarChart, ClipboardList, Home, LogOut, BookCopy, FileChart } from "lucide-react";
import { useLocation } from "react-router-dom";

export interface NavigationItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  requiresAuth: boolean;
  description?: string;
}

export const useNavigationItems = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  // Navigation items used in both sidebar and mobile menu
  const navigationItems: NavigationItem[] = [
    { 
      name: "Assessment", 
      path: "/assessment", 
      icon: Brain, 
      requiresAuth: true,
      description: "Standard 25-question personality assessment"
    },
    { 
      name: "Report", 
      path: "/report", 
      icon: ClipboardList, 
      requiresAuth: true,
      description: "View your standard assessment results"
    },
    { 
      name: "Comprehensive", 
      path: "/comprehensive-assessment", 
      icon: BookCopy, 
      requiresAuth: true,
      description: "In-depth 100-question comprehensive assessment"
    },
    { 
      name: "Full Report", 
      path: "/comprehensive-report", 
      icon: FileChart, 
      requiresAuth: true,
      description: "View your in-depth comprehensive analysis"
    },
    { 
      name: "Tracker", 
      path: "/tracker", 
      icon: BarChart, 
      requiresAuth: true,
      description: "Track your personal growth journey"
    },
    { 
      name: "Profile", 
      path: "/profile", 
      icon: User, 
      requiresAuth: true,
      description: "View and manage your profile"
    },
  ];

  return { navigationItems, isActive };
};


import { User, BarChart, ClipboardList, Home, LogOut, Brain } from "lucide-react";
import { useLocation } from "react-router-dom";

export interface NavigationItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  requiresAuth: boolean;
}

export const useNavigationItems = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  // Navigation items used in both sidebar and mobile menu
  const navigationItems: NavigationItem[] = [
    { name: "Assessment", path: "/assessment", icon: ClipboardList, requiresAuth: true },
    { name: "Report", path: "/report", icon: BarChart, requiresAuth: true },
    { name: "Tracker", path: "/tracker", icon: BarChart, requiresAuth: true },
    { name: "Deep Insight", path: "/deep-insight", icon: Brain, requiresAuth: true },
    { name: "Big Me", path: "/big-me", icon: Brain, requiresAuth: true },
    { name: "Profile", path: "/profile", icon: User, requiresAuth: true },
  ];

  return { navigationItems, isActive };
};

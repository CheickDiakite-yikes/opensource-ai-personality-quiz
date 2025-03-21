
import { User, Brain, BarChart, ClipboardList, Home, LogOut } from "lucide-react";
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
    { name: "Assessment", path: "/assessment", icon: Brain, requiresAuth: true },
    { name: "Report", path: "/report", icon: ClipboardList, requiresAuth: true },
    { name: "Tracker", path: "/tracker", icon: BarChart, requiresAuth: true },
    { name: "Profile", path: "/profile", icon: User, requiresAuth: true },
  ];

  return { navigationItems, isActive };
};

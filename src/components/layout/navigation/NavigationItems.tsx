
import { User, Brain, BarChart, ClipboardList, FileText, Zap } from "lucide-react";
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
    // Consider the assessment and assessment-quiz routes the same for navigation
    if (path === "/assessment" && location.pathname === "/assessment-quiz") {
      return true;
    }
    return location.pathname === path || location.pathname.startsWith(path);
  };

  // Navigation items used in both sidebar and mobile menu
  const navigationItems: NavigationItem[] = [
    { name: "Who Am I?", path: "/assessment", icon: Brain, requiresAuth: true },
    { name: "WAI Report", path: "/report", icon: ClipboardList, requiresAuth: true },
    { name: "Tracker", path: "/tracker", icon: BarChart, requiresAuth: true },
    { name: "Free Assessment", path: "/concise-insight", icon: Zap, requiresAuth: true },
    { name: "Free Report", path: "/concise-report", icon: FileText, requiresAuth: true },
    { name: "Profile", path: "/profile", icon: User, requiresAuth: true },
  ];

  return { navigationItems, isActive };
};

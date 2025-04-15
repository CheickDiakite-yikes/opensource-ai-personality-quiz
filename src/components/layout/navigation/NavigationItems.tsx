
import { useLocation } from "react-router-dom";
import { Home, Brain, LineChart, User, BarChart2, Share2, Activity, BookOpen } from "lucide-react";

export const mainNavItems = [
  {
    title: "Home",
    href: "/",
    icon: Home,
    showOnMobile: true,
    showOnDesktop: true,
  },
  {
    title: "Assessment",
    href: "/assessment",
    icon: Brain,
    showOnMobile: true,
    showOnDesktop: true,
  },
  {
    title: "Report",
    href: "/report",
    icon: BarChart2,
    showOnMobile: true,
    showOnDesktop: true,
  },
  {
    title: "Full You",
    href: "/full-you",
    icon: BookOpen,
    showOnMobile: true,
    showOnDesktop: true,
  },
  {
    title: "Growth Tracker",
    href: "/tracker",
    icon: Activity,
    showOnMobile: true,
    showOnDesktop: true,
  },
  {
    title: "Comprehensive",
    href: "/comprehensive-assessment",
    icon: Share2,
    showOnMobile: false,
    showOnDesktop: true,
  },
  {
    title: "Profile",
    href: "/profile",
    icon: User,
    showOnMobile: true,
    showOnDesktop: true,
  },
];

export const useNavigationItems = () => {
  const location = useLocation();
  
  // Create a list of navigation items that includes properties needed by components
  const navigationItems = mainNavItems.map((item) => ({
    name: item.title,
    path: item.href,
    icon: item.icon,
    requiresAuth: item.href !== "/" && item.href !== "/auth", // Assume all routes except home and auth require auth
    showOnMobile: item.showOnMobile,
    showOnDesktop: item.showOnDesktop,
  }));
  
  // Function to check if a path is active (exact match or starts with path for nested routes)
  const isActive = (path: string): boolean => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  return { navigationItems, isActive };
};

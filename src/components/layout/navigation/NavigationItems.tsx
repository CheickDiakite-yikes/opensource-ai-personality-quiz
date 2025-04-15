
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


import React from "react";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { SidebarProvider } from "@/components/ui/sidebar";
import MobileHeader from "./navigation/MobileHeader";
import DesktopSidebar from "./navigation/DesktopSidebar";
import MainContent from "./navigation/MainContent";
import { useIsMobile } from "@/hooks/use-mobile";

const Layout: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <SidebarProvider>
        <div className="flex min-h-screen flex-col w-full">
          {/* Mobile Header - Only visible on mobile */}
          {isMobile && <MobileHeader />}
          
          {/* Desktop Sidebar with Content */}
          <div className="flex flex-1">
            {/* Sidebar for desktop and tablet */}
            <DesktopSidebar />
            
            {/* Main content area */}
            <MainContent />
          </div>
        </div>
        <Toaster position="top-center" />
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default Layout;

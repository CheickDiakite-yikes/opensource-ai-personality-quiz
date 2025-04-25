
import React from "react";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { SidebarProvider } from "@/components/ui/sidebar";
import MobileHeader from "./navigation/MobileHeader";
import DesktopSidebar from "./navigation/DesktopSidebar";
import DesktopHeader from "./navigation/DesktopHeader";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col w-full">
        {/* Mobile Header - Only visible on mobile */}
        <MobileHeader />
        
        {/* Desktop Sidebar with Content */}
        <div className="flex flex-1">
          {/* Sidebar for desktop and tablet */}
          <DesktopSidebar />
          
          {/* Main content area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <DesktopHeader />
            
            <main className="flex-1 overflow-x-hidden max-w-[100vw]">
              {children}
            </main>
            
            <Footer />
          </div>
        </div>
      </div>
      <Toaster position="top-center" />
    </SidebarProvider>
  );
};

export default Layout;

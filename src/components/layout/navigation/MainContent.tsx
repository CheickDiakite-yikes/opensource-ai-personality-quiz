
import React from "react";
import { AnimatePresence } from "framer-motion";
import { Outlet } from "react-router-dom";
import { SidebarInset } from "@/components/ui/sidebar";
import DesktopHeader from "./DesktopHeader";
import Footer from "../Footer";
import { useIsMobile } from "@/hooks/use-mobile";

const MainContent: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <SidebarInset className="flex-1 flex flex-col overflow-hidden">
      <DesktopHeader />
      
      <main className="flex-1 overflow-y-auto overflow-x-hidden max-w-[100vw] scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
        <AnimatePresence mode="wait">
          <Outlet />
        </AnimatePresence>
      </main>
      
      <Footer />
    </SidebarInset>
  );
};

export default MainContent;

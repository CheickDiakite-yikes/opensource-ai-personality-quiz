
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
      {/* Only show desktop header on non-mobile devices */}
      {!isMobile && <DesktopHeader />}
      
      <main className={`flex-1 ${isMobile ? 'px-2' : 'px-6'} overflow-x-hidden max-w-[100vw]`}>
        <AnimatePresence mode="wait">
          <div className="max-w-full mobile-overflow-fix">
            <Outlet />
          </div>
        </AnimatePresence>
      </main>
      
      <Footer />
    </SidebarInset>
  );
};

export default MainContent;

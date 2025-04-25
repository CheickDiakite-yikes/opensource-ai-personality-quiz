
import React from "react";
import { SidebarInset } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

interface MainContentProps {
  children: React.ReactNode;
}

const MainContent: React.FC<MainContentProps> = ({ children }) => {
  const isMobile = useIsMobile();
  
  return (
    <SidebarInset className="flex-1 flex flex-col overflow-hidden">
      <main className={`flex-1 overflow-x-hidden max-w-[100vw]`}>
        {children}
      </main>
    </SidebarInset>
  );
};

export default MainContent;

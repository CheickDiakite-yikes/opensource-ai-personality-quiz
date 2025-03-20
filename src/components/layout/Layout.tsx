
import React from "react";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import Footer from "./Footer";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import NotificationCenter from "../notifications/NotificationCenter";

const Layout: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <div className="flex min-h-screen flex-col">
        <header className="py-4 px-4 border-b">
          <div className="container flex justify-between items-center">
            <div className="flex items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-xl font-bold">PsychInsight</h1>
              </motion.div>
            </div>
            <div>
              <NotificationCenter />
            </div>
          </div>
        </header>
        
        <main className="flex-1">
          <Outlet />
        </main>
        
        <Footer />
      </div>
      <Toaster position="top-center" />
    </ThemeProvider>
  );
};

export default Layout;

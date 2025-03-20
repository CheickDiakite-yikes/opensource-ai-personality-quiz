import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { useEffect } from "react";
import PageTransition from "@/components/ui/PageTransition";
import Layout from "@/components/layout/Layout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AssessmentPage from "./components/assessment/AssessmentPage";
import ReportPage from "./components/report/ReportPage";
import TrackerPage from "./components/tracker/TrackerPage";
import { AnimatePresence } from "framer-motion";

const queryClient = new QueryClient();

// Add a wrapper component for route transitions
const AppRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Layout />}>
          <Route index element={
            <PageTransition>
              <Index />
            </PageTransition>
          } />
          <Route path="/assessment" element={
            <PageTransition>
              <AssessmentPage />
            </PageTransition>
          } />
          <Route path="/report" element={
            <PageTransition>
              <ReportPage />
            </PageTransition>
          } />
          <Route path="/tracker" element={
            <PageTransition>
              <TrackerPage />
            </PageTransition>
          } />
          <Route path="*" element={
            <PageTransition>
              <NotFound />
            </PageTransition>
          } />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  // Add RGB values for primary color to root for animation purposes
  useEffect(() => {
    // Get the primary color from CSS variables
    const root = document.documentElement;
    const primaryHSL = getComputedStyle(root).getPropertyValue('--primary').trim();
    
    // Convert HSL to RGB and store as CSS variable
    const hslMatch = primaryHSL.match(/(\d+)deg\s+(\d+)%\s+(\d+)%/);
    
    if (hslMatch) {
      const [_, h, s, l] = hslMatch.map(Number);
      const rgb = hslToRgb(h/360, s/100, l/100);
      root.style.setProperty('--primary-rgb', `${rgb[0]}, ${rgb[1]}, ${rgb[2]}`);
    }
  }, []);
  
  // Helper function to convert HSL to RGB
  const hslToRgb = (h: number, s: number, l: number): number[] => {
    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="who-am-i-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;

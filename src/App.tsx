
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PageTransition from "@/components/ui/PageTransition";
import Layout from "@/components/layout/Layout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AssessmentPage from "./components/assessment/AssessmentPage";
import ReportPage from "./components/report/ReportPage";
import TrackerPage from "./components/tracker/TrackerPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <PageTransition>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/assessment" element={<AssessmentPage />} />
              <Route path="/report" element={<ReportPage />} />
              <Route path="/tracker" element={<TrackerPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </PageTransition>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

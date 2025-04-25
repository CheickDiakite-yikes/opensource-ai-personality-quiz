
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./components/ui/theme-provider";
import { Toaster } from "sonner";
import EnhancedReportPage from "./components/report/EnhancedReportPage";
import Auth from "./pages/Auth";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import DeepInsight from "./pages/DeepInsight";
import DeepInsightQuiz from "./pages/DeepInsightQuiz";
import DeepInsightResults from "./pages/DeepInsightResults";
import NotFound from "./pages/NotFound";
import "./App.css";

function AppRouter() {
  const { user, isLoading } = useAuth();
  const [showApp, setShowApp] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setShowApp(true);
    }
  }, [isLoading]);

  if (!showApp) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          user ? <HomePage /> : <Navigate to="/auth" />
        }
      />
      <Route path="/auth" element={<Auth />} />
      <Route
        path="/report"
        element={<EnhancedReportPage />}
      />
      <Route
        path="/report/:id"
        element={<EnhancedReportPage />}
      />
      <Route
        path="/deep-insight"
        element={
          user ? <DeepInsight /> : <Navigate to="/auth" />
        }
      />
      <Route
        path="/deep-insight/quiz"
        element={
          user ? <DeepInsightQuiz /> : <Navigate to="/auth" />
        }
      />
      <Route
        path="/deep-insight/results"
        element={
          user ? <DeepInsightResults /> : <Navigate to="/auth" />
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <AuthProvider>
        <Router>
          <Layout>
            <AppRouter />
          </Layout>
          <Toaster richColors />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

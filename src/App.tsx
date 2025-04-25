import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ActivityProvider } from "./contexts/ActivityContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Dashboard from "./pages/Dashboard";
import AssessmentPage from "./pages/AssessmentPage";
import TraitsPage from "./components/traits/TraitsPage";
import ActivitiesPage from "./pages/ActivitiesPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import NotificationsPage from "./pages/NotificationsPage";
import PublicProfilePage from "./pages/PublicProfilePage";
import DeepInsightPage from "./features/deep-insight/DeepInsightPage";
import DeepInsightResultsPage from "./features/deep-insight/DeepInsightResultsPage";
import { useAuth } from "./contexts/AuthContext";
import { Toaster } from "sonner";
import "./App.css";
import EnhancedReportPage from "./components/report/EnhancedReportPage";

function AppRouter() {
  const { currentUser, loading } = useAuth();
  const [showApp, setShowApp] = useState(false);

  useEffect(() => {
    if (!loading) {
      setShowApp(true);
    }
  }, [loading]);

  if (!showApp) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          currentUser ? <Dashboard /> : <Navigate to="/login" />
        }
      />
      <Route
        path="/assessment"
        element={
          currentUser ? <AssessmentPage /> : <Navigate to="/login" />
        }
      />
      <Route
        path="/traits/:id"
        element={
          currentUser ? <TraitsPage /> : <Navigate to="/login" />
        }
      />
      <Route
        path="/activities"
        element={
          currentUser ? <ActivitiesPage /> : <Navigate to="/login" />
        }
      />
       <Route
        path="/report"
        element={<EnhancedReportPage />}
      />
      <Route
        path="/report/:id"
        element={<EnhancedReportPage />}
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route
        path="/update-profile"
        element={
          currentUser ? <UpdateProfilePage /> : <Navigate to="/login" />
        }
      />
      <Route
        path="/notifications"
        element={
          currentUser ? <NotificationsPage /> : <Navigate to="/login" />
        }
      />
      <Route path="/public-profile/:userId" element={<PublicProfilePage />} />
      <Route
        path="/deep-insight"
        element={
          currentUser ? <DeepInsightPage /> : <Navigate to="/login" />
        }
      />
      <Route
        path="/deep-insight/results"
        element={
          currentUser ? <DeepInsightResultsPage /> : <Navigate to="/login" />
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ActivityProvider>
          <Router>
            <AppRouter />
          </Router>
          <Toaster richColors />
        </ActivityProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;


import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import HomePage from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import ReportPage from "@/components/report/ReportPage";
import TrackerPage from "@/components/tracker/TrackerPage";
import AssessmentPage from "@/components/assessment/AssessmentPage";
import ProfilePage from "@/components/profile/ProfilePage";
import Auth from "@/pages/Auth";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

// Private route component
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

function AppRoutes() {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="auth" element={user ? <Navigate to="/" replace /> : <Auth />} />
        <Route path="assessment" element={<PrivateRoute><AssessmentPage /></PrivateRoute>} />
        <Route path="report" element={<PrivateRoute><ReportPage /></PrivateRoute>} />
        <Route path="tracker" element={<PrivateRoute><TrackerPage /></PrivateRoute>} />
        <Route path="profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;

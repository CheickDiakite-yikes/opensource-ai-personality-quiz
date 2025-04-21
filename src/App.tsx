
import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/sonner";

// Lazy load pages for better initial load performance
const HomePage = lazy(() => import("@/pages/HomePage"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const Auth = lazy(() => import("@/pages/Auth"));
const AssessmentPage = lazy(() => import("@/components/assessment/AssessmentPage"));
const ReportPage = lazy(() => import("@/components/report/ReportPage"));
const TrackerPage = lazy(() => import("@/components/tracker/TrackerPage"));
const ProfilePage = lazy(() => import("@/components/profile/ProfilePage"));
const TraitsPage = lazy(() => import("@/components/traits/TraitsPage"));
const SharedProfile = lazy(() => import("@/pages/SharedProfile"));
const DeepInsightAssessmentPage = lazy(() => import("@/components/deep-insight/DeepInsightAssessmentPage"));
const DeepInsightResultsPage = lazy(() => import("@/components/deep-insight/DeepInsightResultsPage"));
const BigMeAssessmentPage = lazy(() => import("@/components/big-me/BigMeAssessmentPage"));
const BigMeResultsPage = lazy(() => import("@/components/big-me/BigMeResultsPage"));

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
  </div>
);

// Auth guard for protected routes
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingFallback />;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={
            <Suspense fallback={<LoadingFallback />}>
              <HomePage />
            </Suspense>
          } />
          
          <Route path="auth" element={
            <Suspense fallback={<LoadingFallback />}>
              <Auth />
            </Suspense>
          } />
          
          <Route path="assessment" element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingFallback />}>
                <AssessmentPage />
              </Suspense>
            </ProtectedRoute>
          } />
          
          <Route path="report/:id?" element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingFallback />}>
                <ReportPage />
              </Suspense>
            </ProtectedRoute>
          } />
          
          <Route path="tracker" element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingFallback />}>
                <TrackerPage />
              </Suspense>
            </ProtectedRoute>
          } />
          
          <Route path="profile" element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingFallback />}>
                <ProfilePage />
              </Suspense>
            </ProtectedRoute>
          } />
          
          <Route path="traits" element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingFallback />}>
                <TraitsPage />
              </Suspense>
            </ProtectedRoute>
          } />
          
          <Route path="shared/:userId" element={
            <Suspense fallback={<LoadingFallback />}>
              <SharedProfile />
            </Suspense>
          } />
          
          <Route path="deep-insight" element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingFallback />}>
                <DeepInsightAssessmentPage />
              </Suspense>
            </ProtectedRoute>
          } />
          
          <Route path="deep-insight/results/:id?" element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingFallback />}>
                <DeepInsightResultsPage />
              </Suspense>
            </ProtectedRoute>
          } />
          
          <Route path="big-me" element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingFallback />}>
                <BigMeAssessmentPage />
              </Suspense>
            </ProtectedRoute>
          } />
          
          <Route path="big-me/results/:id?" element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingFallback />}>
                <BigMeResultsPage />
              </Suspense>
            </ProtectedRoute>
          } />
          
          <Route path="*" element={
            <Suspense fallback={<LoadingFallback />}>
              <NotFound />
            </Suspense>
          } />
        </Route>
      </Routes>
      
      <Toaster position="top-right" />
    </>
  );
}

export default App;

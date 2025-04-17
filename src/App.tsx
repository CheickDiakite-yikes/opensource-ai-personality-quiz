
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

// New Deep Insight pages
const DeepInsight = lazy(() => import("@/pages/DeepInsight"));
const DeepInsightQuiz = lazy(() => import("@/pages/DeepInsightQuiz"));
const DeepInsightResults = lazy(() => import("@/pages/DeepInsightResults"));
const DeepInsightHistory = lazy(() => import("@/pages/DeepInsightHistory"));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-pulse flex space-x-2">
      <div className="h-3 w-3 bg-primary rounded-full"></div>
      <div className="h-3 w-3 bg-primary rounded-full"></div>
      <div className="h-3 w-3 bg-primary rounded-full"></div>
    </div>
  </div>
);

// Private route component
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <PageLoader />;
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <PageLoader />;
  }
  
  return (
    <>
      <Routes>
        {/* Publicly accessible shared profile route outside of Layout to avoid auth problems */}
        <Route path="/shared/:id" element={
          <Suspense fallback={<PageLoader />}>
            <SharedProfile />
          </Suspense>
        } />
        
        <Route path="/" element={<Layout />}>
          <Route index element={
            <Suspense fallback={<PageLoader />}>
              <HomePage />
            </Suspense>
          } />
          <Route path="auth" element={
            user ? (
              <Navigate to="/" replace />
            ) : (
              <Suspense fallback={<PageLoader />}>
                <Auth />
              </Suspense>
            )
          } />
          <Route path="assessment" element={
            <PrivateRoute>
              <Suspense fallback={<PageLoader />}>
                <AssessmentPage />
              </Suspense>
            </PrivateRoute>
          } />
          <Route path="report/:id?" element={
            <PrivateRoute>
              <Suspense fallback={<PageLoader />}>
                <ReportPage />
              </Suspense>
            </PrivateRoute>
          } />
          <Route path="tracker" element={
            <PrivateRoute>
              <Suspense fallback={<PageLoader />}>
                <TrackerPage />
              </Suspense>
            </PrivateRoute>
          } />
          <Route path="profile" element={
            <PrivateRoute>
              <Suspense fallback={<PageLoader />}>
                <ProfilePage />
              </Suspense>
            </PrivateRoute>
          } />
          <Route path="traits/:id?" element={
            <PrivateRoute>
              <Suspense fallback={<PageLoader />}>
                <TraitsPage />
              </Suspense>
            </PrivateRoute>
          } />
          
          {/* Deep Insight Routes */}
          <Route path="deep-insight" element={
            <PrivateRoute>
              <Suspense fallback={<PageLoader />}>
                <DeepInsight />
              </Suspense>
            </PrivateRoute>
          } />
          <Route path="deep-insight/quiz" element={
            <PrivateRoute>
              <Suspense fallback={<PageLoader />}>
                <DeepInsightQuiz />
              </Suspense>
            </PrivateRoute>
          } />
          <Route path="deep-insight/results" element={
            <PrivateRoute>
              <Suspense fallback={<PageLoader />}>
                <DeepInsightResults />
              </Suspense>
            </PrivateRoute>
          } />
          <Route path="deep-insight/history" element={
            <PrivateRoute>
              <Suspense fallback={<PageLoader />}>
                <DeepInsightHistory />
              </Suspense>
            </PrivateRoute>
          } />
          
          <Route path="*" element={
            <Suspense fallback={<PageLoader />}>
              <NotFound />
            </Suspense>
          } />
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}

export default App;

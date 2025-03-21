
import { lazy, Suspense, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ErrorBoundary } from "@/components/ui/error-boundary";

// Lazy load pages for better initial load performance
const HomePage = lazy(() => import("@/pages/Index"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const Auth = lazy(() => import("@/pages/Auth"));

// More granular code splitting with retry logic for better reliability
const AssessmentPage = lazy(() => 
  import("@/components/assessment/AssessmentPage")
    .catch(err => {
      console.error("Failed to load AssessmentPage:", err);
      return import("@/pages/NotFound"); // Fallback to NotFound
    })
);

const ReportPage = lazy(() => 
  import("@/components/report/ReportPage")
    .catch(err => {
      console.error("Failed to load ReportPage:", err);
      return import("@/pages/NotFound"); // Fallback to NotFound
    })
);

const TrackerPage = lazy(() => 
  import("@/components/tracker/TrackerPage")
    .catch(err => {
      console.error("Failed to load TrackerPage:", err);
      return import("@/pages/NotFound"); // Fallback to NotFound
    })
);

const ProfilePage = lazy(() => 
  import("@/components/profile/ProfilePage")
    .catch(err => {
      console.error("Failed to load ProfilePage:", err);
      return import("@/pages/NotFound"); // Fallback to NotFound
    })
);

const TraitsPage = lazy(() => 
  import("@/components/traits/TraitsPage")
    .catch(err => {
      console.error("Failed to load TraitsPage:", err);
      return import("@/pages/NotFound"); // Fallback to NotFound
    })
);

// Loading fallback component with better visibility
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <div className="text-center space-y-4">
      <div className="animate-pulse flex space-x-2 justify-center">
        <div className="h-4 w-4 bg-primary rounded-full"></div>
        <div className="h-4 w-4 bg-primary rounded-full"></div>
        <div className="h-4 w-4 bg-primary rounded-full"></div>
      </div>
      <p className="text-sm text-muted-foreground">Loading page...</p>
    </div>
  </div>
);

// Improved error fallback component
const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="max-w-md p-6 bg-card rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Something went wrong</h2>
        <p className="text-muted-foreground mb-4">
          {error.message || "An error occurred while loading this page."}
        </p>
        <button 
          onClick={resetErrorBoundary}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Try again
        </button>
      </div>
    </div>
  );
};

// Private route component with improved error handling
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <PageLoader />;
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <ErrorBoundary FallbackComponent={ErrorFallback}>{children}</ErrorBoundary>;
};

// Improved suspense wrapper
const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<PageLoader />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
};

function AppRoutes() {
  const { user, isLoading } = useAuth();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  // Effect to handle initial load state
  useEffect(() => {
    if (!isLoading) {
      setIsInitialLoad(false);
    }
  }, [isLoading]);
  
  if (isInitialLoad) {
    return <PageLoader />;
  }
  
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={
          <SuspenseWrapper>
            <HomePage />
          </SuspenseWrapper>
        } />
        <Route path="auth" element={
          user ? (
            <Navigate to="/" replace />
          ) : (
            <SuspenseWrapper>
              <Auth />
            </SuspenseWrapper>
          )
        } />
        <Route path="assessment" element={
          <PrivateRoute>
            <SuspenseWrapper>
              <AssessmentPage />
            </SuspenseWrapper>
          </PrivateRoute>
        } />
        <Route path="report">
          <Route index element={
            <PrivateRoute>
              <SuspenseWrapper>
                <ReportPage />
              </SuspenseWrapper>
            </PrivateRoute>
          } />
          <Route path=":id" element={
            <PrivateRoute>
              <SuspenseWrapper>
                <ReportPage />
              </SuspenseWrapper>
            </PrivateRoute>
          } />
        </Route>
        <Route path="tracker" element={
          <PrivateRoute>
            <SuspenseWrapper>
              <TrackerPage />
            </SuspenseWrapper>
          </PrivateRoute>
        } />
        <Route path="profile" element={
          <PrivateRoute>
            <SuspenseWrapper>
              <ProfilePage />
            </SuspenseWrapper>
          </PrivateRoute>
        } />
        <Route path="traits" element={
          <PrivateRoute>
            <SuspenseWrapper>
              <TraitsPage />
            </SuspenseWrapper>
          </PrivateRoute>
        } />
        <Route path="*" element={
          <SuspenseWrapper>
            <NotFound />
          </SuspenseWrapper>
        } />
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

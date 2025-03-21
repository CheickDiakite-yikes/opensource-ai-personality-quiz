
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md p-6 bg-background/60 backdrop-blur-sm rounded-lg shadow-md">
        <h1 className="text-6xl font-bold mb-4 text-primary">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-muted-foreground mb-6">
          Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => navigate(-1)}
            variant="outline"
            className="w-full sm:w-auto"
          >
            Go Back
          </Button>
          <Button 
            onClick={() => navigate("/")}
            className="w-full sm:w-auto"
          >
            <Home className="mr-2 h-4 w-4" /> Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

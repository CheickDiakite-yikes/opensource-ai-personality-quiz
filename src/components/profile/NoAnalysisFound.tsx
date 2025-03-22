
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ClipboardList, RefreshCw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const NoAnalysisFound: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  return (
    <div className="container max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto py-8 px-4 flex items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <ClipboardList className="h-8 w-8 text-primary" />
        </div>
        
        <h1 className="text-2xl font-bold">No Analysis Available</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          {user 
            ? "You haven't completed an assessment yet. Take your first assessment to see your personalized profile."
            : "Sign in to save your assessments and access them later, or take an assessment now without saving."}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
          <Button 
            size="lg" 
            onClick={() => navigate("/assessment")}
            className="flex items-center"
          >
            <ClipboardList className="mr-2 h-4 w-4" />
            Take Assessment
          </Button>
          
          {!user && (
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => navigate("/auth")}
              className="flex items-center"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Sign In
            </Button>
          )}
          
          <Button 
            size="lg" 
            variant="outline" 
            onClick={() => navigate("/")}
            className="flex items-center"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NoAnalysisFound;

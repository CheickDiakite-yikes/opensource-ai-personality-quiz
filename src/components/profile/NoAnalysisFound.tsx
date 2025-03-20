
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NoAnalysisFound: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container max-w-4xl py-8 px-4 flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">No Analysis Available</h1>
        <p className="text-muted-foreground mb-6">
          Please complete the assessment to view your personalized profile.
        </p>
        <Button onClick={() => navigate("/assessment")}>
          Take Assessment
        </Button>
      </div>
    </div>
  );
};

export default NoAnalysisFound;

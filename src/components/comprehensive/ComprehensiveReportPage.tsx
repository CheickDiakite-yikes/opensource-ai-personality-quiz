
import React from "react";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ComprehensiveReportPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();

  return (
    <div className="container py-6 md:py-10 px-4 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Comprehensive Report</h1>
        <p className="text-muted-foreground">
          ID: {id || "No report ID provided"}
        </p>
      </div>
      
      <Card className="p-8 text-center">
        <h2 className="text-xl mb-4">Coming Soon</h2>
        <p className="text-muted-foreground mb-6">
          The comprehensive report feature is currently under development.
          This will provide a more detailed analysis based on our 100-question assessment.
        </p>
        
        <div className="space-y-4 max-w-md mx-auto">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
          
          <div className="py-4">
            <Skeleton className="h-24 w-full rounded-md" />
          </div>
          
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/6" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </Card>
    </div>
  );
};

export default ComprehensiveReportPage;

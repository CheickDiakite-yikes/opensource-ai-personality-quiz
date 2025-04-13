
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

const LoadingState: React.FC = () => {
  return (
    <div className="container py-6 md:py-10 px-4 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Comprehensive Report</h1>
        <Skeleton className="h-6 w-40 mx-auto" />
      </div>
      
      <Card className="p-8">
        <div className="space-y-4 max-w-3xl mx-auto">
          <Skeleton className="h-8 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
          
          <div className="py-4">
            <Skeleton className="h-36 w-full rounded-md" />
          </div>
          
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/6" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </Card>
    </div>
  );
};

export default LoadingState;

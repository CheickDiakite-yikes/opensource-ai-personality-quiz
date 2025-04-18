
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import PageTransition from "@/components/ui/PageTransition";

const AnalysisLoadingState = () => {
  return (
    <PageTransition>
      <div className="container max-w-4xl py-8 md:py-12 px-4 md:px-6">
        <div className="flex items-center justify-center mb-8">
          <Skeleton className="h-12 w-12 rounded-full" />
        </div>
        <Skeleton className="h-10 w-3/4 mx-auto mb-4" />
        <Skeleton className="h-6 w-1/2 mx-auto mb-8" />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
        
        <Skeleton className="h-[400px] w-full mb-8" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    </PageTransition>
  );
};

export default AnalysisLoadingState;


import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const ReportHeaderSkeleton: React.FC = () => {
  return (
    <div className="flex justify-between items-start mb-8 flex-col md:flex-row">
      <div>
        <Skeleton className="h-10 w-64 mb-2" />
        <Skeleton className="h-5 w-48" />
      </div>
      <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-40" />
      </div>
    </div>
  );
};

export default ReportHeaderSkeleton;

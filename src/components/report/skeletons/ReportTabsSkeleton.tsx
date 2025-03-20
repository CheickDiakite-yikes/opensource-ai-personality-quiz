
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const ReportTabsSkeleton: React.FC = () => {
  return (
    <div className="inline-flex h-10 items-center justify-center rounded-lg bg-muted/50 p-1 mb-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-7 w-24 mx-1 rounded-md" />
      ))}
    </div>
  );
};

export default ReportTabsSkeleton;

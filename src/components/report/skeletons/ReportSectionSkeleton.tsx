
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ReportSectionSkeletonProps {
  headerHeight?: number;
  contentItems?: number;
  variant?: "default" | "grid" | "list";
}

const ReportSectionSkeleton: React.FC<ReportSectionSkeletonProps> = ({
  headerHeight = 80,
  contentItems = 4,
  variant = "default",
}) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <Skeleton className="h-7 w-2/5 mb-2" />
        <Skeleton className="h-4 w-3/5" />
      </CardHeader>
      <CardContent className="pt-6">
        {variant === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Array.from({ length: contentItems }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-md" />
            ))}
          </div>
        ) : variant === "list" ? (
          <div className="space-y-3">
            {Array.from({ length: contentItems }).map((_, i) => (
              <div key={i} className="flex items-start">
                <Skeleton className="h-6 w-6 mr-3 rounded-full" />
                <Skeleton className="h-6 flex-1" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {Array.from({ length: contentItems }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReportSectionSkeleton;

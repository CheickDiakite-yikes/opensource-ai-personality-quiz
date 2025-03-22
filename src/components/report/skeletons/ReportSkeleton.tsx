
import React from "react";
import ReportHeaderSkeleton from "./ReportHeaderSkeleton";
import ReportTabsSkeleton from "./ReportTabsSkeleton";
import ReportSectionSkeleton from "./ReportSectionSkeleton";

const ReportSkeleton: React.FC = () => {
  return (
    <div className="container py-6 space-y-8">
      <ReportHeaderSkeleton />
      
      <div className="space-y-6">
        <ReportTabsSkeleton />
        
        <div className="space-y-10 mt-6">
          {/* Overview Section Skeleton */}
          <div className="space-y-4">
            <div className="h-8 w-48">
              <div className="h-full w-48 bg-muted animate-pulse rounded-md" />
            </div>
            
            <ReportSectionSkeleton contentItems={3} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ReportSectionSkeleton headerHeight={60} contentItems={1} />
            </div>
          </div>
          
          {/* Personality Traits Skeleton */}
          <ReportSectionSkeleton />
          
          {/* Intelligence Skeleton */}
          <ReportSectionSkeleton contentItems={3} />
          
          {/* Motivation Sections Skeleton */}
          <div className="grid md:grid-cols-2 gap-6">
            <ReportSectionSkeleton variant="list" />
            <ReportSectionSkeleton variant="list" />
          </div>
          
          {/* Core Values Skeleton */}
          <ReportSectionSkeleton variant="grid" contentItems={6} />
          
          {/* Growth Areas Skeleton */}
          <div className="grid md:grid-cols-2 gap-6">
            <ReportSectionSkeleton variant="list" />
            <ReportSectionSkeleton variant="list" />
          </div>
          
          {/* Relationship Sections Skeleton */}
          <div className="grid md:grid-cols-2 gap-6">
            <ReportSectionSkeleton contentItems={3} />
            <ReportSectionSkeleton variant="list" />
          </div>
          
          {/* Career Skeleton */}
          <ReportSectionSkeleton variant="grid" contentItems={8} />
          
          {/* Roadmap Skeleton */}
          <ReportSectionSkeleton contentItems={1} />
        </div>
      </div>
    </div>
  );
};

export default ReportSkeleton;


import React from "react";
import { Loader2 } from "lucide-react";

export const ResultsLoading: React.FC = () => {
  return (
    <div className="container max-w-4xl py-16 flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <Loader2 className="h-16 w-16 text-primary animate-spin" />
      </div>
      <h2 className="text-2xl font-bold">Generating your deep insight analysis...</h2>
      <p className="text-muted-foreground text-center max-w-md">
        Our AI is carefully analyzing your responses to create a comprehensive personality profile.
      </p>
    </div>
  );
};

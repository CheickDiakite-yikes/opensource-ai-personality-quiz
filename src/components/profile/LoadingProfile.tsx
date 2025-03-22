
import React from "react";
import { Loader2 } from "lucide-react";

const LoadingProfile: React.FC = () => (
  <div className="container max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto py-8 px-4 flex items-center justify-center min-h-screen">
    <div className="text-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
      <h1 className="text-2xl font-bold mb-4">Loading Profile</h1>
      <p className="text-muted-foreground">
        Please wait while we load your personalized profile data...
      </p>
    </div>
  </div>
);

export default LoadingProfile;

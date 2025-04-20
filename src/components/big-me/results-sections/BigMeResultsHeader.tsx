
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";

const BigMeResultsHeader: React.FC = () => {
  return (
    <div className="text-center space-y-4">
      <h1 className="text-3xl md:text-4xl font-bold text-primary">Your Big Me Analysis</h1>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        Discover insights about your personality, cognitive patterns, emotional architecture, 
        and more in this comprehensive analysis.
      </p>
      
      <div className="flex justify-center gap-4 mt-4">
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Download className="h-4 w-4" /> Download Report
        </Button>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Share2 className="h-4 w-4" /> Share Results
        </Button>
      </div>
    </div>
  );
};

export default BigMeResultsHeader;

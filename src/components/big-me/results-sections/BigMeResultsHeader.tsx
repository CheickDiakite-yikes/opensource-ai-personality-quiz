
import React from "react";
import { Button } from "@/components/ui/button";
import { Share, Download } from "lucide-react";

const BigMeResultsHeader: React.FC = () => {
  return (
    <div className="text-center space-y-4 bg-[#231e1a] text-white p-8 rounded-lg mb-8">
      <h1 className="text-4xl font-bold text-[#e67e22]">Your Big Me Analysis</h1>
      <p className="text-xl opacity-90">
        Discover insights about your personality, cognitive patterns, emotional
        architecture, and more in this comprehensive analysis.
      </p>
      
      <div className="flex justify-center space-x-4 mt-6">
        <Button variant="outline" className="flex items-center gap-2 text-white border-white hover:bg-white/10">
          <Download size={18} />
          Download Report
        </Button>
        <Button variant="outline" className="flex items-center gap-2 text-white border-white hover:bg-white/10">
          <Share size={18} />
          Share Results
        </Button>
      </div>
    </div>
  );
};

export default BigMeResultsHeader;

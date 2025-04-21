
import React from "react";
import { Button } from "@/components/ui/button";
import { Share, Download, FileText, Brain } from "lucide-react";

const BigMeResultsHeader: React.FC = () => {
  return (
    <div className="text-center space-y-6 bg-gradient-to-r from-[#1e1916] to-[#231e1a] text-white p-8 rounded-lg mb-8 shadow-xl">
      <div className="flex justify-center mb-2">
        <div className="h-16 w-16 rounded-full bg-amber-500/20 flex items-center justify-center">
          <Brain size={32} className="text-amber-400" />
        </div>
      </div>
      
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#e67e22] to-[#f39c12] mb-2">
          Your Big Me Analysis
        </h1>
        
        <p className="text-xl opacity-90 mb-4">
          Comprehensive insights into your personality, cognitive patterns, emotional architecture, and interpersonal dynamics.
        </p>
        
        <p className="text-base opacity-70 mb-6">
          This analysis is based on your unique response patterns, providing you with deep insights about who you are at your core.
        </p>
      </div>
      
      <div className="flex flex-wrap justify-center gap-4 mt-6">
        <Button variant="outline" size="lg" className="flex items-center gap-2 text-white border-white hover:bg-white/10">
          <Download size={18} />
          Download Full Report
        </Button>
        <Button variant="outline" size="lg" className="flex items-center gap-2 text-white border-white hover:bg-white/10">
          <Share size={18} />
          Share Results
        </Button>
        <Button variant="outline" size="lg" className="flex items-center gap-2 text-white border-white hover:bg-white/10">
          <FileText size={18} />
          View Assessment Details
        </Button>
      </div>
    </div>
  );
};

export default BigMeResultsHeader;

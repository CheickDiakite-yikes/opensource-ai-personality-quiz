
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Calendar, History } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAIAnalysis } from "@/hooks/useAIAnalysis";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { toast } from "sonner";
import { PersonalityAnalysis } from "@/utils/types";
import { formatAnalysisForDownload } from "@/utils/reportUtils";

interface ReportHeaderProps {
  analysis?: PersonalityAnalysis;
}

const ReportHeader: React.FC<ReportHeaderProps> = ({ analysis: propAnalysis }) => {
  const { analysis: hookAnalysis, getAnalysisHistory, setCurrentAnalysis } = useAIAnalysis();
  const navigate = useNavigate();
  const [historyOpen, setHistoryOpen] = useState(false);
  
  // Use the analysis from props if provided, otherwise use the one from the hook
  const analysis = propAnalysis || hookAnalysis;
  
  const handleDownload = () => {
    if (!analysis) return;
    
    try {
      // Create an HTML report
      const htmlContent = generateHTMLReport(analysis);
      
      // Create a Blob with the HTML data
      const blob = new Blob([htmlContent], { type: 'text/html' });
      
      // Create a temporary download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `personality-analysis-${format(new Date(), 'yyyy-MM-dd')}.html`;
      
      // Trigger the download
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("Report downloaded successfully!");
    } catch (error) {
      console.error("Error downloading report:", error);
      toast.error("Failed to download report. Please try again.");
    }
  };
  
  const generateHTMLReport = (analysis: PersonalityAnalysis): string => {
    const formattedAnalysis = formatAnalysisForDownload(analysis);
    
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Who Am I? - Personality Analysis Report</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
          }
          .report-header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 1px solid #eaeaea;
          }
          .report-header h1 {
            color: #2563eb;
            margin-bottom: 8px;
          }
          .report-date {
            color: #6b7280;
            font-size: 14px;
            margin-bottom: 20px;
          }
          .section {
            margin-bottom: 40px;
            background-color: white;
            padding: 24px;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }
          .section h2 {
            color: #1e40af;
            border-bottom: 2px solid #f4f4f4;
            padding-bottom: 10px;
            margin-top: 0;
          }
          .trait-card {
            margin-bottom: 20px;
            padding: 15px;
            background-color: #f7f9ff;
            border-radius: 6px;
            border-left: 3px solid #3b82f6;
          }
          .trait-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .trait-title {
            font-weight: bold;
            color: #2563eb;
            margin: 0;
          }
          .trait-score {
            background-color: #3b82f6;
            color: white;
            padding: 3px 10px;
            border-radius: 12px;
            font-weight: bold;
            font-size: 14px;
          }
          .trait-description {
            margin-top: 8px;
            margin-bottom: 12px;
          }
          .trait-details {
            margin-top: 12px;
          }
          .detail-group {
            margin-bottom: 12px;
          }
          .detail-title {
            font-weight: 600;
            color: #4b5563;
            margin-bottom: 4px;
          }
          .detail-list {
            margin: 0;
            padding-left: 20px;
          }
          .detail-list li {
            margin-bottom: 4px;
          }
          .intelligence-score {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
          }
          .intelligence-label {
            width: 220px;
            font-weight: 600;
          }
          .progress-bar {
            flex-grow: 1;
            height: 10px;
            background-color: #e5e7eb;
            border-radius: 5px;
            overflow: hidden;
          }
          .progress-value {
            height: 100%;
            background-color: #3b82f6;
          }
          .intelligence-percent {
            width: 50px;
            text-align: right;
            margin-left: 10px;
            font-weight: 600;
          }
          .list-section {
            margin-bottom: 20px;
          }
          .footer {
            text-align: center;
            margin-top: 60px;
            padding-top: 20px;
            border-top: 1px solid #eaeaea;
            color: #6b7280;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="report-header">
          <h1>Who Am I? - Personality Analysis Report</h1>
          <div class="report-date">Generated on ${formattedAnalysis.generatedAt}</div>
        </div>
        
        <div class="section">
          <h2>Overview</h2>
          <p>${formattedAnalysis.overview}</p>
        </div>
        
        <div class="section">
          <h2>Personality Traits</h2>
          ${formattedAnalysis.traits.map(trait => `
            <div class="trait-card">
              <div class="trait-header">
                <h3 class="trait-title">${trait.trait}</h3>
                <span class="trait-score">${trait.score}%</span>
              </div>
              <p class="trait-description">${trait.description}</p>
              <div class="trait-details">
                <div class="detail-group">
                  <div class="detail-title">Strengths:</div>
                  <ul class="detail-list">
                    ${trait.strengths.map(item => `<li>${item}</li>`).join('')}
                  </ul>
                </div>
                <div class="detail-group">
                  <div class="detail-title">Challenges:</div>
                  <ul class="detail-list">
                    ${trait.challenges.map(item => `<li>${item}</li>`).join('')}
                  </ul>
                </div>
                <div class="detail-group">
                  <div class="detail-title">Growth Suggestions:</div>
                  <ul class="detail-list">
                    ${trait.growthSuggestions.map(item => `<li>${item}</li>`).join('')}
                  </ul>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
        
        <div class="section">
          <h2>Intelligence Profile</h2>
          <p>${formattedAnalysis.intelligence.description}</p>
          
          <div class="intelligence-score">
            <div class="intelligence-label">Intelligence Quotient:</div>
            <div class="progress-bar">
              <div class="progress-value" style="width: ${formattedAnalysis.scores.intelligence}%;"></div>
            </div>
            <div class="intelligence-percent">${formattedAnalysis.scores.intelligence}%</div>
          </div>
          
          <div class="intelligence-score">
            <div class="intelligence-label">Emotional Intelligence:</div>
            <div class="progress-bar">
              <div class="progress-value" style="width: ${formattedAnalysis.scores.emotionalIntelligence}%;"></div>
            </div>
            <div class="intelligence-percent">${formattedAnalysis.scores.emotionalIntelligence}%</div>
          </div>
          
          <div class="detail-group" style="margin-top: 20px;">
            <div class="detail-title">Intelligence Domains:</div>
            ${formattedAnalysis.intelligence.domains.map(domain => `
              <div style="margin-bottom: 15px;">
                <strong>${domain.name} (${domain.score}%)</strong>
                <p>${domain.description}</p>
              </div>
            `).join('')}
          </div>
        </div>
        
        <div class="section">
          <h2>Cognitive Style</h2>
          <p>${typeof formattedAnalysis.cognitiveStyle === 'string' 
              ? formattedAnalysis.cognitiveStyle 
              : `<strong>${formattedAnalysis.cognitiveStyle.primary}</strong> with elements of <strong>${formattedAnalysis.cognitiveStyle.secondary}</strong>: ${formattedAnalysis.cognitiveStyle.description}`}</p>
        </div>
        
        <div class="section">
          <h2>Values & Motivations</h2>
          
          <div class="list-section">
            <div class="detail-title">Core Values:</div>
            <ul class="detail-list">
              ${Array.isArray(formattedAnalysis.valueSystem) 
                ? formattedAnalysis.valueSystem.map(value => `<li>${value}</li>`).join('') 
                : formattedAnalysis.valueSystem.strengths.map(value => `<li>${value}</li>`).join('')}
            </ul>
          </div>
          
          <div class="list-section">
            <div class="detail-title">Key Motivators:</div>
            <ul class="detail-list">
              ${formattedAnalysis.motivators.map(item => `<li>${item}</li>`).join('')}
            </ul>
          </div>
          
          <div class="list-section">
            <div class="detail-title">Potential Inhibitors:</div>
            <ul class="detail-list">
              ${formattedAnalysis.inhibitors.map(item => `<li>${item}</li>`).join('')}
            </ul>
          </div>
        </div>
        
        <div class="section">
          <h2>Growth Areas</h2>
          
          <div class="list-section">
            <div class="detail-title">Areas for Development:</div>
            <ul class="detail-list">
              ${formattedAnalysis.weaknesses.map(item => `<li>${item}</li>`).join('')}
            </ul>
          </div>
          
          <div class="list-section">
            <div class="detail-title">Growth Pathways:</div>
            <ul class="detail-list">
              ${formattedAnalysis.growthAreas.map(item => `<li>${item}</li>`).join('')}
            </ul>
          </div>
        </div>
        
        <div class="section">
          <h2>Relationship Patterns</h2>
          <ul class="detail-list">
            ${Array.isArray(formattedAnalysis.relationshipPatterns) 
              ? formattedAnalysis.relationshipPatterns.map(item => `<li>${item}</li>`).join('') 
              : `
                <div class="list-section">
                  <div class="detail-title">Strengths in Relationships:</div>
                  <ul class="detail-list">
                    ${formattedAnalysis.relationshipPatterns.strengths.map(item => `<li>${item}</li>`).join('')}
                  </ul>
                </div>
                <div class="list-section">
                  <div class="detail-title">Challenges in Relationships:</div>
                  <ul class="detail-list">
                    ${formattedAnalysis.relationshipPatterns.challenges.map(item => `<li>${item}</li>`).join('')}
                  </ul>
                </div>
                <div class="list-section">
                  <div class="detail-title">Compatible Personality Types:</div>
                  <ul class="detail-list">
                    ${formattedAnalysis.relationshipPatterns.compatibleTypes.map(item => `<li>${item}</li>`).join('')}
                  </ul>
                </div>
              `}
          </ul>
        </div>
        
        <div class="section">
          <h2>Career Suggestions</h2>
          <ul class="detail-list">
            ${formattedAnalysis.careerSuggestions.map(item => `<li>${item}</li>`).join('')}
          </ul>
        </div>
        
        <div class="section">
          <h2>Learning Pathways</h2>
          <ul class="detail-list">
            ${formattedAnalysis.learningPathways.map(item => `<li>${item}</li>`).join('')}
          </ul>
        </div>
        
        <div class="section">
          <h2>Personal Development Roadmap</h2>
          <p>${formattedAnalysis.roadmap}</p>
        </div>
        
        <div class="footer">
          <p>© ${new Date().getFullYear()} Who Am I? - All rights reserved</p>
          <p>This personality analysis is based on your assessment responses and is generated using AI technology.</p>
          <p>For more insights and to track your personal growth, visit <a href="https://whoami.app">whoami.app</a></p>
        </div>
      </body>
      </html>
    `;
  };
  
  const handleSelectHistory = (analysisId: string) => {
    if (setCurrentAnalysis(analysisId)) {
      toast.success("Loaded report from history");
      setHistoryOpen(false);
    } else {
      toast.error("Failed to load report");
    }
  };
  
  const historyItems = getAnalysisHistory();
  
  return (
    <div className="flex justify-between items-start mb-8 flex-col md:flex-row">
      <div>
        <h1 className="text-3xl font-bold">Your Analysis Report</h1>
        <p className="text-muted-foreground mt-2">
          Based on your assessment responses
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0">
        <Popover open={historyOpen} onOpenChange={setHistoryOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center">
              <History className="h-4 w-4 mr-2" /> History
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-2">
              <h3 className="font-medium">Previous Analyses</h3>
              {historyItems.length > 0 ? (
                <div className="max-h-60 overflow-y-auto">
                  {historyItems.map((item, index) => (
                    <button
                      key={item.id || index}
                      onClick={() => handleSelectHistory(item.id || '')}
                      className="w-full text-left p-2 hover:bg-muted rounded flex items-center justify-between group"
                    >
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>
                          {item.createdAt && format(new Date(item.createdAt), 'PPP')}
                        </span>
                      </div>
                      <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity text-sm">
                        View
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No previous analyses found
                </p>
              )}
            </div>
          </PopoverContent>
        </Popover>
        <Button 
          variant="outline" 
          className="flex items-center" 
          onClick={handleDownload}
        >
          <Download className="h-4 w-4 mr-2" /> Download Report
        </Button>
      </div>
    </div>
  );
};

export default ReportHeader;

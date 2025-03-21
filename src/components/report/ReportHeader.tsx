
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
      a.download = `who-am-i-personality-analysis-${format(new Date(), 'yyyy-MM-dd')}.html`;
      
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
          :root {
            --background: 0 0% 100%;
            --foreground: 240 10% 3.9%;
            --card: 0 0% 100%;
            --card-foreground: 240 10% 3.9%;
            --popover: 0 0% 100%;
            --popover-foreground: 240 10% 3.9%;
            --primary: 221.2 83.2% 53.3%;
            --primary-foreground: 210 40% 98%;
            --secondary: 210 40% 96.1%;
            --secondary-foreground: 222.2 47.4% 11.2%;
            --muted: 210 40% 96.1%;
            --muted-foreground: 215.4 16.3% 46.9%;
            --accent: 210 40% 96.1%;
            --accent-foreground: 222.2 47.4% 11.2%;
            --destructive: 0 84.2% 60.2%;
            --destructive-foreground: 210 40% 98%;
            --border: 214.3 31.8% 91.4%;
            --input: 214.3 31.8% 91.4%;
            --ring: 221.2 83.2% 53.3%;
            --radius: 0.5rem;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            line-height: 1.6;
            color: hsl(var(--foreground));
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
            background-color: hsl(var(--background));
          }
          
          .report-header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 1px solid hsl(var(--border));
          }
          
          .report-header h1 {
            color: hsl(var(--primary));
            margin-bottom: 8px;
            font-weight: 700;
            font-size: 2rem;
          }
          
          .report-date {
            color: hsl(var(--muted-foreground));
            font-size: 14px;
            margin-bottom: 20px;
          }
          
          .section {
            margin-bottom: 40px;
            background-color: hsl(var(--card));
            padding: 24px;
            border-radius: var(--radius);
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            border: 1px solid hsl(var(--border));
          }
          
          .section h2 {
            color: hsl(var(--card-foreground));
            border-bottom: 2px solid hsl(var(--border));
            padding-bottom: 10px;
            margin-top: 0;
            font-weight: 700;
            font-size: 1.5rem;
          }
          
          .section-header {
            background: linear-gradient(to right, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1));
            padding: 16px 24px;
            border-top-left-radius: var(--radius);
            border-top-right-radius: var(--radius);
            margin: -24px -24px 24px -24px;
          }
          
          .section-title {
            margin: 0;
            font-size: 1.25rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            color: hsl(var(--card-foreground));
          }
          
          .section-description {
            margin: 4px 0 0 0;
            color: hsl(var(--muted-foreground));
            font-size: 0.875rem;
          }
          
          .trait-card {
            margin-bottom: 20px;
            padding: 15px;
            background-color: hsl(var(--secondary));
            border-radius: var(--radius);
            border-left: 3px solid hsl(var(--primary));
          }
          
          .trait-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          
          .trait-title {
            font-weight: 600;
            color: hsl(var(--primary));
            margin: 0;
          }
          
          .trait-score {
            background-color: hsl(var(--primary));
            color: hsl(var(--primary-foreground));
            padding: 3px 10px;
            border-radius: 12px;
            font-weight: 600;
            font-size: 14px;
          }
          
          .trait-description {
            margin-top: 8px;
            margin-bottom: 12px;
            color: hsl(var(--card-foreground));
          }
          
          .trait-details {
            margin-top: 12px;
          }
          
          .detail-group {
            margin-bottom: 12px;
          }
          
          .detail-title {
            font-weight: 600;
            color: hsl(var(--card-foreground));
            margin-bottom: 4px;
          }
          
          .detail-list {
            margin: 0;
            padding-left: 20px;
          }
          
          .detail-list li {
            margin-bottom: 4px;
            color: hsl(var(--card-foreground));
          }
          
          .intelligence-score {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
          }
          
          .intelligence-label {
            width: 220px;
            font-weight: 600;
            color: hsl(var(--card-foreground));
          }
          
          .progress-bar {
            flex-grow: 1;
            height: 8px;
            background-color: hsl(var(--secondary));
            border-radius: 4px;
            overflow: hidden;
          }
          
          .progress-value {
            height: 100%;
            background-color: #f97316;
          }
          
          .intelligence-percent {
            width: 50px;
            text-align: right;
            margin-left: 10px;
            font-weight: 600;
            color: hsl(var(--card-foreground));
          }
          
          .list-section {
            margin-bottom: 20px;
          }
          
          .footer {
            text-align: center;
            margin-top: 60px;
            padding-top: 20px;
            border-top: 1px solid hsl(var(--border));
            color: hsl(var(--muted-foreground));
            font-size: 14px;
          }
          
          .intelligence-domains {
            margin-top: 20px;
          }
          
          .domain-item {
            margin-bottom: 16px;
          }
          
          .domain-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 6px;
          }
          
          .domain-name {
            font-weight: 600;
            color: hsl(var(--card-foreground));
          }
          
          .domain-score {
            font-weight: 600;
            color: hsl(var(--primary));
          }
          
          .domain-bar {
            height: 8px;
            background-color: hsl(var(--secondary));
            border-radius: 4px;
            overflow: hidden;
          }
          
          .domain-value {
            height: 100%;
            background-color: #f97316;
          }
          
          .domain-description {
            margin-top: 6px;
            font-size: 0.875rem;
            color: hsl(var(--card-foreground));
          }
          
          .value-chip {
            display: inline-flex;
            align-items: center;
            background-color: hsl(var(--secondary));
            border: 1px solid hsl(var(--border));
            padding: 6px 12px;
            border-radius: var(--radius);
            margin-right: 8px;
            margin-bottom: 8px;
          }
          
          .value-number {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background-color: rgba(59, 130, 246, 0.1);
            color: hsl(var(--primary));
            font-weight: 600;
            font-size: 0.75rem;
            margin-right: 8px;
          }
          
          .two-columns {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 24px;
          }
          
          @media (max-width: 768px) {
            .two-columns {
              grid-template-columns: 1fr;
            }
          }
          
          .icon {
            display: inline-block;
            width: 20px;
            height: 20px;
            margin-right: 8px;
            color: hsl(var(--primary));
          }
          
          .list-item {
            display: flex;
            align-items: flex-start;
            margin-bottom: 8px;
          }
          
          .list-item-number {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-width: 24px;
            height: 24px;
            border-radius: 50%;
            background-color: rgba(59, 130, 246, 0.1);
            color: hsl(var(--primary));
            font-weight: 600;
            font-size: 0.75rem;
            margin-right: 12px;
            margin-top: 2px;
            flex-shrink: 0;
          }
          
          .list-item-content {
            flex: 1;
          }
          
          .list-item-content p {
            margin: 0;
          }
          
          .grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 12px;
          }
          
          .glass-panel {
            background-color: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          }
        </style>
      </head>
      <body>
        <div class="report-header">
          <h1>Who Am I? - Personality Analysis Report</h1>
          <div class="report-date">Generated on ${formattedAnalysis.generatedAt}</div>
        </div>
        
        <section>
          <h2>Personality Overview</h2>
          
          <div class="section">
            <div class="prose">
              ${formattedAnalysis.overview.split('\n\n').map(paragraph => 
                `<p>${paragraph}</p>`
              ).join('')}
            </div>
          </div>
          
          <div class="two-columns">
            <div class="section">
              <h3>Cognitive Style</h3>
              <p>
                You tend to process information as a 
                ${typeof formattedAnalysis.cognitiveStyle === 'string' 
                  ? `<strong>${formattedAnalysis.cognitiveStyle}</strong>` 
                  : `<strong>${formattedAnalysis.cognitiveStyle.primary}</strong> with <strong>${formattedAnalysis.cognitiveStyle.secondary}</strong> elements`
                }
              </p>
              
              ${typeof formattedAnalysis.cognitiveStyle !== 'string' && formattedAnalysis.cognitiveStyle.description 
                ? `<p class="domain-description">${formattedAnalysis.cognitiveStyle.description}</p>` 
                : ''
              }
            </div>
          </div>
        </section>
        
        <section>
          <h2>Top Personality Traits</h2>
          
          <div class="section">
            <div class="section-header" style="background: linear-gradient(to right, rgba(168, 85, 247, 0.1), rgba(217, 70, 239, 0.1));">
              <h3 class="section-title">
                <span class="icon">⚡</span>
                Top Personality Traits
              </h3>
              <p class="section-description">Your most prominent characteristics</p>
            </div>
            
            <div class="trait-list">
              ${formattedAnalysis.traits.slice(0, 5).map((trait, index) => `
                <div class="trait-card">
                  <div class="trait-header">
                    <h4 class="trait-title">${trait.trait}</h4>
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
          </div>
        </section>
        
        <section>
          <h2>Intelligence Profile</h2>
          
          <div class="section" style="background-color: #231815; color: white;">
            <div class="section-header" style="background: linear-gradient(to right, rgba(251, 146, 60, 0.2), rgba(249, 115, 22, 0.2));">
              <h3 class="section-title" style="color: white;">
                <span class="icon">🧠</span>
                Intelligence Profile
              </h3>
              <p class="section-description" style="color: rgba(255, 255, 255, 0.8);">Your cognitive strengths and style</p>
            </div>
            
            <div style="margin-bottom: 24px;">
              <div class="intelligence-score">
                <div class="intelligence-label" style="color: white;">Intelligence Score</div>
                <div class="progress-bar" style="background-color: rgba(255, 255, 255, 0.2);">
                  <div class="progress-value" style="width: ${formattedAnalysis.scores.intelligence}%;"></div>
                </div>
                <div class="intelligence-percent" style="color: white;">${formattedAnalysis.scores.intelligence}/100</div>
              </div>
              
              <div class="intelligence-score">
                <div class="intelligence-label" style="color: white;">Emotional Intelligence</div>
                <div class="progress-bar" style="background-color: rgba(255, 255, 255, 0.2);">
                  <div class="progress-value" style="width: ${formattedAnalysis.scores.emotionalIntelligence}%;"></div>
                </div>
                <div class="intelligence-percent" style="color: white;">${formattedAnalysis.scores.emotionalIntelligence}/100</div>
              </div>
            </div>
            
            <div style="margin-top: 24px;">
              <h3 style="color: white; font-size: 1.125rem; margin-bottom: 12px;">Type: ${formattedAnalysis.intelligence.type}</h3>
              <p style="color: rgba(255, 255, 255, 0.8); margin-bottom: 24px;">${formattedAnalysis.intelligence.description}</p>
              
              <h4 style="color: white; font-size: 1rem; margin-bottom: 16px; display: flex; align-items: center;">
                <span class="icon">📊</span>
                Intelligence Domains
              </h4>
              
              <div class="intelligence-domains">
                ${formattedAnalysis.intelligence.domains.map(domain => `
                  <div class="domain-item">
                    <div class="domain-header">
                      <div class="domain-name" style="color: white;">${domain.name}</div>
                      <div class="domain-score" style="color: #f97316;">${domain.score}%</div>
                    </div>
                    <div class="domain-bar" style="background-color: rgba(255, 255, 255, 0.2);">
                      <div class="domain-value" style="width: ${domain.score}%;"></div>
                    </div>
                    <div class="domain-description" style="color: rgba(255, 255, 255, 0.8);">${domain.description}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </section>
        
        <section>
          <h2>Motivators & Inhibitors</h2>
          
          <div class="two-columns">
            <div class="section">
              <div class="section-header" style="background: linear-gradient(to right, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1));">
                <h3 class="section-title">
                  <span class="icon">💡</span>
                  Motivators
                </h3>
                <p class="section-description">What drives you forward</p>
              </div>
              
              <ul style="list-style: none; padding: 0; margin: 0;">
                ${formattedAnalysis.motivators.map((item, index) => `
                  <li class="list-item">
                    <div class="list-item-number">${index + 1}</div>
                    <div class="list-item-content">
                      <p>${item}</p>
                    </div>
                  </li>
                `).join('')}
              </ul>
            </div>
            
            <div class="section">
              <div class="section-header" style="background: linear-gradient(to right, rgba(239, 68, 68, 0.1), rgba(249, 115, 22, 0.1));">
                <h3 class="section-title">
                  <span class="icon">❤️</span>
                  Inhibitors
                </h3>
                <p class="section-description">What may hold you back</p>
              </div>
              
              <ul style="list-style: none; padding: 0; margin: 0;">
                ${formattedAnalysis.inhibitors.map((item, index) => `
                  <li class="list-item">
                    <div class="list-item-number">${index + 1}</div>
                    <div class="list-item-content">
                      <p>${item}</p>
                    </div>
                  </li>
                `).join('')}
              </ul>
            </div>
          </div>
        </section>
        
        <section>
          <h2>Your Core Values</h2>
          
          <div class="section">
            <div class="section-header" style="background: linear-gradient(to right, rgba(79, 70, 229, 0.1), rgba(124, 58, 237, 0.1));">
              <h3 class="section-title">
                <span class="icon">🏆</span>
                Your Core Values
              </h3>
              <p class="section-description">Principles that guide your decisions</p>
            </div>
            
            <div class="grid">
              ${Array.isArray(formattedAnalysis.valueSystem) 
                ? formattedAnalysis.valueSystem.map((value, index) => `
                    <div class="value-chip">
                      <span class="value-number">${index + 1}</span>
                      <span>${value}</span>
                    </div>
                  `).join('') 
                : formattedAnalysis.valueSystem.strengths.map((value, index) => `
                    <div class="value-chip">
                      <span class="value-number">${index + 1}</span>
                      <span>${value}</span>
                    </div>
                  `).join('')
              }
            </div>
          </div>
        </section>
        
        <section>
          <h2>Growth Areas</h2>
          
          <div class="two-columns">
            <div class="section">
              <div class="section-header" style="background: linear-gradient(to right, rgba(244, 63, 94, 0.1), rgba(225, 29, 72, 0.1));">
                <h3 class="section-title">Weaknesses</h3>
                <p class="section-description">Areas that may need attention</p>
              </div>
              
              <ul style="list-style: none; padding: 0; margin: 0;">
                ${formattedAnalysis.weaknesses.map((item, index) => `
                  <li class="list-item">
                    <div class="list-item-number">${index + 1}</div>
                    <div class="list-item-content">
                      <p>${item}</p>
                    </div>
                  </li>
                `).join('')}
              </ul>
            </div>
            
            <div class="section">
              <div class="section-header" style="background: linear-gradient(to right, rgba(59, 130, 246, 0.1), rgba(79, 70, 229, 0.1));">
                <h3 class="section-title">Growth Areas</h3>
                <p class="section-description">Opportunities for development</p>
              </div>
              
              <ul style="list-style: none; padding: 0; margin: 0;">
                ${formattedAnalysis.growthAreas.map((item, index) => `
                  <li class="list-item">
                    <div class="list-item-number">${index + 1}</div>
                    <div class="list-item-content">
                      <p>${item}</p>
                    </div>
                  </li>
                `).join('')}
              </ul>
            </div>
          </div>
        </section>
        
        <section>
          <h2>Relationships & Learning</h2>
          
          <div class="two-columns">
            <div class="section">
              <div class="section-header" style="background: linear-gradient(to right, rgba(236, 72, 153, 0.1), rgba(219, 39, 119, 0.1));">
                <h3 class="section-title">Relationship Patterns</h3>
                <p class="section-description">How you connect with others</p>
              </div>
              
              ${Array.isArray(formattedAnalysis.relationshipPatterns) 
                ? `
                  <ul style="list-style: none; padding: 0; margin: 0;">
                    ${formattedAnalysis.relationshipPatterns.map((item, index) => `
                      <li class="list-item">
                        <div class="list-item-number">${index + 1}</div>
                        <div class="list-item-content">
                          <p>${item}</p>
                        </div>
                      </li>
                    `).join('')}
                  </ul>
                ` 
                : `
                  <div>
                    <h4 style="font-size: 0.875rem; font-weight: 600; margin-bottom: 8px;">Strengths in Relationships:</h4>
                    <ul style="list-style: none; padding: 0; margin: 0 0 16px 0;">
                      ${formattedAnalysis.relationshipPatterns.strengths.map((item, index) => `
                        <li class="list-item">
                          <div class="list-item-number">${index + 1}</div>
                          <div class="list-item-content">
                            <p>${item}</p>
                          </div>
                        </li>
                      `).join('')}
                    </ul>
                    
                    <h4 style="font-size: 0.875rem; font-weight: 600; margin-bottom: 8px;">Challenges in Relationships:</h4>
                    <ul style="list-style: none; padding: 0; margin: 0 0 16px 0;">
                      ${formattedAnalysis.relationshipPatterns.challenges.map((item, index) => `
                        <li class="list-item">
                          <div class="list-item-number">${index + 1}</div>
                          <div class="list-item-content">
                            <p>${item}</p>
                          </div>
                        </li>
                      `).join('')}
                    </ul>
                    
                    <h4 style="font-size: 0.875rem; font-weight: 600; margin-bottom: 8px;">Compatible Personality Types:</h4>
                    <ul style="list-style: none; padding: 0; margin: 0;">
                      ${formattedAnalysis.relationshipPatterns.compatibleTypes.map((item, index) => `
                        <li class="list-item">
                          <div class="list-item-number">${index + 1}</div>
                          <div class="list-item-content">
                            <p>${item}</p>
                          </div>
                        </li>
                      `).join('')}
                    </ul>
                  </div>
                `
              }
            </div>
            
            <div class="section">
              <div class="section-header" style="background: linear-gradient(to right, rgba(14, 165, 233, 0.1), rgba(2, 132, 199, 0.1));">
                <h3 class="section-title">Learning Pathways</h3>
                <p class="section-description">Best ways for you to learn and grow</p>
              </div>
              
              <ul style="list-style: none; padding: 0; margin: 0;">
                ${formattedAnalysis.learningPathways.map((item, index) => `
                  <li class="list-item">
                    <div class="list-item-number">${index + 1}</div>
                    <div class="list-item-content">
                      <p>${item}</p>
                    </div>
                  </li>
                `).join('')}
              </ul>
            </div>
          </div>
        </section>
        
        <section>
          <h2>Career Suggestions</h2>
          
          <div class="section">
            <div class="section-header" style="background: linear-gradient(to right, rgba(59, 130, 246, 0.1), rgba(79, 70, 229, 0.1));">
              <h3 class="section-title">
                <span class="icon">💼</span>
                Career Suggestions
              </h3>
              <p class="section-description">Potential career paths that match your profile</p>
            </div>
            
            <ul style="list-style: none; padding: 0; margin: 0;">
              ${formattedAnalysis.careerSuggestions.map((career, index) => `
                <li class="list-item">
                  <div class="list-item-number">${index + 1}</div>
                  <div class="list-item-content">
                    <p>${career}</p>
                  </div>
                </li>
              `).join('')}
            </ul>
          </div>
        </section>
        
        <section>
          <h2>Personal Development Roadmap</h2>
          
          <div class="section">
            <div class="section-header" style="background: linear-gradient(to right, rgba(79, 70, 229, 0.1), rgba(124, 58, 237, 0.1));">
              <h3 class="section-title">
                <span class="icon">➡️</span>
                Your Personalized Roadmap
              </h3>
              <p class="section-description">Steps to become your best self</p>
            </div>
            
            <p class="text-lg">${formattedAnalysis.roadmap}</p>
          </div>
        </section>
        
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

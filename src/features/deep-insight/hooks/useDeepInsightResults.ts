
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { DeepInsightResponses } from "../types";

// Mock AI analysis function (in real app, this would call an API)
export const generateMockAnalysis = (responses: Record<string, string>) => {
  // For demo purposes, we'll just return a predefined analysis
  return {
    overview: "You are a thoughtful and introspective individual who carefully weighs options before making decisions. You have a rich inner life and tend to be selective in social situations, preferring meaningful connections over numerous casual acquaintances. Your approach to personal growth is balanced between structured self-improvement and following your intuition.",
    coreTraits: {
      primary: "Analytical Thinker",
      secondary: "Selective Socializer",
      strengths: [
        "Deep critical thinking abilities",
        "Strong attention to detail",
        "Authentic and genuine in relationships",
        "Self-reflective and growth-minded"
      ],
      challenges: [
        "May overthink decisions at times",
        "Can be reluctant to open up in new social settings",
        "Might be too self-critical during setbacks",
        "Sometimes struggles to balance reflection with action"
      ]
    },
    cognitivePatterning: {
      decisionMaking: "You favor a methodical approach to decisions, carefully weighing evidence and options. When faced with complexity, you're likely to spend time analyzing rather than making snap judgments.",
      learningStyle: "Your learning thrives when you can deeply understand concepts rather than memorize facts. You connect new information to existing knowledge frameworks and prefer to master topics thoroughly.",
      attention: "Your attention is selective and deep rather than broad and scattered. You can focus intently on subjects of interest but may tune out when topics don't engage your curiosity."
    },
    emotionalArchitecture: {
      emotionalAwareness: "You have well-developed emotional awareness, particularly regarding your own internal states. You're able to recognize and name your feelings with nuance and understand their origins.",
      regulationStyle: "You tend to process emotions internally before expressing them. This gives you emotional stability but might sometimes create delays in communicating your feelings to others.",
      empathicCapacity: "You have strong empathic abilities, particularly one-on-one. You're able to tune into others' emotional states and respond with appropriate support."
    },
    interpersonalDynamics: {
      attachmentStyle: "Your attachment style shows a preference for deep, meaningful connections with a select group rather than wide social circles. Trust builds gradually for you, but once established, your loyalty is steadfast.",
      communicationPattern: "You communicate thoughtfully and with precision. You value listening and understanding before expressing your own perspective.",
      conflictResolution: "In conflict, you tend to step back to analyze the situation before responding. You prefer finding common ground and mutual understanding over winning arguments."
    },
    growthPotential: {
      developmentAreas: [
        "Embracing more spontaneity in decision-making",
        "Expanding comfort in broader social settings",
        "Balancing self-reflection with active engagement",
        "Communicating emotions more readily with trusted others"
      ],
      recommendations: [
        "Practice making some decisions with less analysis to develop intuitive judgment",
        "Set small, progressive goals for social interaction in new contexts",
        "Establish reflection routines that conclude with concrete action steps",
        "Create regular check-ins with trusted friends to share emotional experiences"
      ]
    }
  };
};

export interface AnalysisData {
  overview: string;
  coreTraits: {
    primary: string;
    secondary: string;
    strengths: string[];
    challenges: string[];
  };
  cognitivePatterning: {
    decisionMaking: string;
    learningStyle: string;
    attention: string;
  };
  emotionalArchitecture: {
    emotionalAwareness: string;
    regulationStyle: string;
    empathicCapacity: string;
  };
  interpersonalDynamics: {
    attachmentStyle: string;
    communicationPattern: string;
    conflictResolution: string;
  };
  growthPotential: {
    developmentAreas: string[];
    recommendations: string[];
  };
}

export const useDeepInsightResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadAnalysis = async () => {
      try {
        // Check if we have responses in state
        const responses = location.state?.responses as DeepInsightResponses | undefined;
        
        if (!responses) {
          console.error("No responses found in location state");
          setError("No assessment data found. Please complete the assessment first.");
          setLoading(false);
          return;
        }
        
        console.log("Processing responses:", responses);
        
        // In a real implementation, this would call an API with the responses
        // For now, simulate API call with timeout
        setTimeout(() => {
          try {
            const mockResult = generateMockAnalysis(responses);
            setAnalysis(mockResult);
            setLoading(false);
          } catch (err) {
            console.error("Error generating analysis:", err);
            setError("Failed to generate your analysis. Please try again.");
            setLoading(false);
          }
        }, 1500);
      } catch (e) {
        console.error("Error loading analysis:", e);
        setError("An error occurred while loading your results.");
        setLoading(false);
      }
    };

    loadAnalysis();
  }, [location.state]);
  
  // Redirect if accessed directly without responses
  useEffect(() => {
    if (!location.state?.responses && !loading && !analysis) {
      console.log("No data found, redirecting to assessment page");
      toast.error("Please complete the assessment first");
      navigate("/deep-insight");
    }
  }, [location.state, loading, analysis, navigate]);
  
  // Save analysis function
  const saveAnalysis = () => {
    try {
      // In a real app, save to database here
      toast.success("Report saved to your profile!");
      console.log("Analysis saved");
      return true;
    } catch (e) {
      console.error("Error saving analysis:", e);
      toast.error("Failed to save your analysis");
      return false;
    }
  };
  
  return {
    analysis,
    loading,
    error,
    saveAnalysis
  };
};

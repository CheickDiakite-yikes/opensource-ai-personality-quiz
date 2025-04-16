import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { DeepInsightResponses } from "../types";
import { PersonalityAnalysis } from "@/utils/types";

// Define AnalysisData type explicitly
export interface AnalysisData extends PersonalityAnalysis {
  coreTraits: {
    primary: string;
    secondary: string;
    strengths: string[];
    challenges: string[];
  };
}

// Mock analysis generator function (in a real app, this would call an AI service)
const generateAnalysisFromResponses = (responses: DeepInsightResponses): AnalysisData => {
  console.log("Processing responses:", responses);
  
  // In a real implementation, this would call an AI service to analyze the responses
  // For now, we're returning a mock analysis
  const baseAnalysis = {
    id: `analysis-${Date.now()}`,
    createdAt: new Date().toISOString(),
    overview: "Based on your responses, you appear to be thoughtful, introspective, and value both structure and creativity. You demonstrate strong analytical abilities balanced with emotional awareness.",
    traits: [
      {
        trait: "Analytical Thinking",
        score: 85,
        description: "You have a structured approach to problem-solving and decision making, carefully weighing options before acting.",
        strengths: ["Methodical problem-solving", "Strategic planning", "Critical evaluation"],
        challenges: ["May sometimes overthink decisions", "Could benefit from trusting intuition more"],
        growthSuggestions: ["Practice making quicker decisions in low-stakes situations", "Balance analysis with action"]
      },
      {
        trait: "Emotional Intelligence",
        score: 78,
        description: "You demonstrate good awareness of your own emotions and consideration for others' feelings.",
        strengths: ["Self-awareness", "Empathy", "Relationship management"],
        challenges: ["Balancing emotional needs with practical considerations"],
        growthSuggestions: ["Practice mindfulness to deepen emotional awareness", "Seek feedback on interpersonal interactions"]
      },
      {
        trait: "Adaptability",
        score: 72,
        description: "You show flexibility in handling change, though you may prefer some stability.",
        strengths: ["Willingness to adjust when necessary", "Resilience when facing obstacles"],
        challenges: ["May need time to fully embrace major changes"],
        growthSuggestions: ["Intentionally seek new experiences", "Practice reframing challenges as opportunities"]
      }
    ],
    intelligence: {
      type: "Integrated",
      score: 82,
      description: "You exhibit balanced capabilities across analytical, emotional, and practical domains.",
      domains: [
        { name: "Logical-Mathematical", score: 84, description: "Strong analytical and systematic thinking" },
        { name: "Interpersonal", score: 79, description: "Good understanding of others' motivations and feelings" },
        { name: "Intrapersonal", score: 81, description: "Solid self-awareness and reflection capabilities" }
      ]
    },
    intelligenceScore: 82,
    emotionalIntelligenceScore: 78,
    cognitiveStyle: {
      primary: "Analytical",
      secondary: "Reflective",
      description: "You tend to process information systematically while taking time to consider implications."
    },
    valueSystem: {
      strengths: ["Integrity", "Balance", "Personal growth"],
      challenges: ["Balancing idealism with pragmatism"],
      compatibleTypes: ["Other growth-oriented individuals", "Those who value intellectual exchange"]
    },
    motivators: ["Meaningful achievement", "Learning and growth", "Making positive impact"],
    inhibitors: ["Excessive self-criticism", "Overthinking", "Fear of making wrong choices"],
    weaknesses: ["May struggle with ambiguity", "Sometimes hesitant to take risks", "Could delegate more effectively"],
    growthAreas: ["Developing greater comfort with uncertainty", "Trusting intuition alongside analysis", "Building resilience in the face of setbacks"],
    relationshipPatterns: {
      strengths: ["Loyalty", "Thoughtfulness", "Good listening skills"],
      challenges: ["May withhold feelings to maintain harmony", "Could be more assertive about needs"],
      compatibleTypes: ["Open communicators", "Growth-oriented individuals", "Those who appreciate depth"]
    },
    careerSuggestions: ["Strategic advisor", "Research specialist", "Program developer", "Systems analyst", "Consultant"],
    learningPathways: ["Structured courses with practical applications", "Collaborative learning environments", "Self-directed deep dives into topics of interest"],
    roadmap: "Focus on developing comfort with uncertainty while leveraging your analytical strengths. Practice more spontaneity in low-stakes situations and celebrate small risks taken. Consider mindfulness practices to balance your analytical tendencies with intuitive insights.",
    coreTraits: {
      primary: "Analytical Reflector",
      secondary: "Empathetic Innovator",
      strengths: [
        "Strategic thinking",
        "Emotional awareness",
        "Adaptable problem-solving"
      ],
      challenges: [
        "Potential over-analysis",
        "Balancing emotional and logical approaches",
        "Risk aversion"
      ]
    }
  } as AnalysisData;
  
  return baseAnalysis;
};

export const useDeepInsightResults = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  
  // Effect to handle generating analysis from responses
  useEffect(() => {
    const generateAnalysis = async () => {
      try {
        // Retrieve responses from location state
        const responseData = location.state?.responses;
        
        if (!responseData) {
          setError("No assessment data found. Please complete the assessment first.");
          setLoading(false);
          return;
        }
        
        // In a real app, we would call an API to analyze the responses
        // For now, we'll simulate a delay and generate a mock analysis
        setLoading(true);
        
        // Simulate API call delay
        setTimeout(() => {
          const generatedAnalysis = generateAnalysisFromResponses(responseData);
          setAnalysis(generatedAnalysis);
          setLoading(false);
        }, 3000); // 3 second delay to simulate processing
        
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : "An unknown error occurred";
        console.error("Error generating analysis:", errorMessage);
        setError("Failed to generate your analysis. Please try again later.");
        setLoading(false);
        toast.error("Something went wrong while generating your analysis.");
      }
    };
    
    generateAnalysis();
  }, [location.state]);
  
  // Function to save the analysis
  const saveAnalysis = async () => {
    try {
      if (!analysis) return;
      
      // In a real app, we would save to a database
      toast.success("Your analysis has been saved!");
      
      // If connected to Supabase, we would do something like:
      // await supabase
      //   .from('analyses')
      //   .insert({
      //     user_id: user?.id,
      //     result: analysis,
      //     // other fields...
      //   });
      
      console.log("Analysis saved for user:", user?.id);
      
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred";
      console.error("Error saving analysis:", errorMessage);
      toast.error("Failed to save your analysis. Please try again.");
    }
  };
  
  return {
    analysis,
    loading,
    error,
    saveAnalysis
  };
};

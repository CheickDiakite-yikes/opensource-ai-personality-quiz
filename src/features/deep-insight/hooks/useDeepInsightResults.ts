
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

// Mock analysis generator function (in a real app, this would call an AI service)
const generateAnalysisFromResponses = (responses: DeepInsightResponses): AnalysisData => {
  console.log("Processing responses:", responses);
  
  // In a real implementation, this would call an AI service to analyze the responses
  // For now, we're returning a mock analysis
  const baseAnalysis = {
    id: `analysis-${Date.now()}`,
    createdAt: new Date().toISOString(),
    overview: "Based on your responses, you appear to be thoughtful, introspective, and value both structure and creativity. You demonstrate strong analytical abilities balanced with emotional awareness. Your answers reveal a complex personality with a rich inner world and nuanced perspectives on various topics. Your approach to problems tends to be methodical while still maintaining flexibility and openness to new ideas. There's a clear theme of valuing both intellectual growth and meaningful connections with others running through your responses.",
    traits: [
      {
        trait: "Analytical Thinking",
        score: 85,
        description: "You have a structured approach to problem-solving and decision making, carefully weighing options before acting. Your responses consistently demonstrate a preference for gathering comprehensive information before drawing conclusions, showing strong critical thinking capabilities.",
        strengths: ["Methodical problem-solving", "Strategic planning", "Critical evaluation", "Attention to nuance"],
        challenges: ["May sometimes overthink decisions", "Could benefit from trusting intuition more", "Occasional analysis paralysis"],
        growthSuggestions: ["Practice making quicker decisions in low-stakes situations", "Balance analysis with action", "Incorporate more intuitive approaches alongside analytical ones"]
      },
      {
        trait: "Emotional Intelligence",
        score: 78,
        description: "You demonstrate good awareness of your own emotions and consideration for others' feelings. Your responses indicate thoughtful reflection on emotional states and their impact on behavior and relationships.",
        strengths: ["Self-awareness", "Empathy", "Relationship management", "Emotional vocabulary"],
        challenges: ["Balancing emotional needs with practical considerations", "Occasional tendency to intellectualize emotions"],
        growthSuggestions: ["Practice mindfulness to deepen emotional awareness", "Seek feedback on interpersonal interactions", "Explore the physical manifestations of emotions"]
      },
      {
        trait: "Adaptability",
        score: 72,
        description: "You show flexibility in handling change, though you may prefer some stability. Your responses suggest an ability to adjust to new circumstances while maintaining core values and principles.",
        strengths: ["Willingness to adjust when necessary", "Resilience when facing obstacles", "Capacity to integrate new information"],
        challenges: ["May need time to fully embrace major changes", "Preference for predictability in some areas"],
        growthSuggestions: ["Intentionally seek new experiences", "Practice reframing challenges as opportunities", "Develop comfort with ambiguity through exposure"]
      }
    ],
    intelligence: {
      type: "Integrated",
      score: 82,
      description: "You exhibit balanced capabilities across analytical, emotional, and practical domains. Your cognitive approach integrates logical reasoning with intuitive understanding, allowing for sophisticated problem-solving and adaptability.",
      domains: [
        { name: "Logical-Mathematical", score: 84, description: "Strong analytical and systematic thinking" },
        { name: "Interpersonal", score: 79, description: "Good understanding of others' motivations and feelings" },
        { name: "Intrapersonal", score: 81, description: "Solid self-awareness and reflection capabilities" },
        { name: "Linguistic", score: 83, description: "Strong verbal reasoning and communication abilities" },
        { name: "Naturalistic", score: 76, description: "Ability to recognize patterns and categorize information" }
      ]
    },
    intelligenceScore: 82,
    emotionalIntelligenceScore: 78,
    cognitiveStyle: {
      primary: "Analytical",
      secondary: "Reflective",
      description: "You tend to process information systematically while taking time to consider implications. Your thinking style combines careful analysis with thoughtful contemplation, allowing you to see both details and broader patterns."
    },
    valueSystem: {
      strengths: ["Integrity", "Balance", "Personal growth", "Meaningful connection", "Intellectual curiosity"],
      challenges: ["Balancing idealism with pragmatism", "Reconciling competing values"],
      compatibleTypes: ["Other growth-oriented individuals", "Those who value intellectual exchange", "People with complementary perspective-taking abilities"]
    },
    motivators: ["Meaningful achievement", "Learning and growth", "Making positive impact", "Authentic connection", "Understanding complex systems"],
    inhibitors: ["Excessive self-criticism", "Overthinking", "Fear of making wrong choices", "Concern about others' perceptions"],
    weaknesses: ["May struggle with ambiguity", "Sometimes hesitant to take risks", "Could delegate more effectively", "Occasional perfectionism"],
    growthAreas: ["Developing greater comfort with uncertainty", "Trusting intuition alongside analysis", "Building resilience in the face of setbacks", "Finding balance between reflection and action"],
    relationshipPatterns: {
      strengths: ["Loyalty", "Thoughtfulness", "Good listening skills", "Depth of connection"],
      challenges: ["May withhold feelings to maintain harmony", "Could be more assertive about needs", "Occasional overthinking of social dynamics"],
      compatibleTypes: ["Open communicators", "Growth-oriented individuals", "Those who appreciate depth", "People who balance your analytical tendencies"]
    },
    careerSuggestions: ["Strategic advisor", "Research specialist", "Program developer", "Systems analyst", "Consultant", "Educator", "Content strategist"],
    learningPathways: ["Structured courses with practical applications", "Collaborative learning environments", "Self-directed deep dives into topics of interest", "Interdisciplinary approaches that connect concepts"],
    roadmap: "Focus on developing comfort with uncertainty while leveraging your analytical strengths. Practice more spontaneity in low-stakes situations and celebrate small risks taken. Consider mindfulness practices to balance your analytical tendencies with intuitive insights. Engage in activities that require improvisation and quick decision-making to build confidence in your non-analytical abilities. Seek feedback from trusted others about areas where overthinking may be limiting your growth.",
    coreTraits: {
      primary: "Analytical Reflector",
      secondary: "Empathetic Innovator",
      strengths: [
        "Strategic thinking",
        "Emotional awareness",
        "Adaptable problem-solving",
        "Integrative learning",
        "Pattern recognition"
      ],
      challenges: [
        "Potential over-analysis",
        "Balancing emotional and logical approaches",
        "Risk aversion",
        "Decision hesitancy",
        "Perfectionism tendencies"
      ]
    },
    cognitivePatterning: {
      decisionMaking: "You tend to gather all available information before making decisions, weighing pros and cons carefully. This methodical approach serves you well for complex choices but may slow you down for simpler ones. Your responses show a preference for evidence-based reasoning combined with consideration of implications for all involved parties.",
      learningStyle: "You learn best through a combination of conceptual understanding and practical application. You prefer to grasp underlying principles before moving to specific examples. Your responses indicate strengths in connecting new information to existing knowledge frameworks and identifying patterns across different domains of learning.",
      attention: "Your attention is most focused when dealing with complex, intellectually stimulating content. You may need to consciously maintain focus on routine tasks. Your responses suggest strong sustained attention for topics of interest but potential difficulty with maintaining engagement when the material feels repetitive or lacks depth."
    },
    emotionalArchitecture: {
      emotionalAwareness: "You have good awareness of your emotional states and can generally identify what you're feeling and why. This self-awareness serves as a foundation for your emotional intelligence. Your responses demonstrate ability to articulate nuanced emotional experiences and understand their influence on your thoughts and behaviors.",
      regulationStyle: "You tend to process emotions internally before expressing them. This thoughtful approach helps you respond rather than react, though sometimes emotions may be held back too much. Your responses suggest a preference for cognitive reappraisal strategies and meaning-making to manage emotional experiences.",
      empathicCapacity: "You demonstrate strong empathy, particularly for those closest to you. You can often sense others' emotional states and adjust your approach accordingly. Your responses indicate both cognitive empathy (understanding others' perspectives) and affective empathy (sharing in others' emotional experiences), with slightly stronger tendencies toward the cognitive dimension."
    },
    interpersonalDynamics: {
      attachmentStyle: "Your attachment style shows a balanced approach to relationships, valuing both independence and connection. You form deep bonds while maintaining healthy boundaries. Your responses suggest elements of secure attachment with occasional anxious tendencies in particularly valued relationships.",
      communicationPattern: "You communicate thoughtfully and prefer depth over small talk. You listen well but may sometimes hesitate to express your full perspective to avoid conflict. Your responses indicate a preference for authentic, meaningful exchanges and a tendency to prepare mentally before important conversations.",
      conflictResolution: "Your conflict resolution approach emphasizes finding common ground and mutual understanding. You prefer to address issues directly but tactfully. Your responses suggest you value fairness and compromise, though you may occasionally accommodate others' needs at the expense of your own to maintain harmony."
    },
    growthPotential: {
      developmentAreas: [
        "Embracing uncertainty and ambiguity",
        "Developing more spontaneity in decision-making",
        "Expressing emotions more openly",
        "Setting clearer boundaries in relationships",
        "Taking more calculated risks",
        "Reducing perfectionism in less crucial areas",
        "Balancing deep thinking with practical action"
      ],
      recommendations: [
        "Practice making quick decisions in low-stakes situations",
        "Keep a reflection journal to track emotional patterns",
        "Engage in activities that require improvisation",
        "Practice assertive communication techniques",
        "Set small, progressive challenges that push your comfort zone",
        "Identify areas where 'good enough' truly is sufficient",
        "Establish clear timelines for decision processes to avoid analysis paralysis"
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

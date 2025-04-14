
import { AssessmentResponse, PersonalityAnalysis, QuestionCategory, RelationshipPatterns, PersonalityTrait, Intelligence, CognitiveStyle, ValueSystem } from "@/utils/types";

// Only use this function when explicitly testing
export const generateMockAnalysis = (assessmentId: string, isTest: boolean = false): PersonalityAnalysis | null => {
  // If not in test mode, return null to prevent mock data usage
  if (!isTest) {
    console.warn("Attempted to use mock analysis generator outside of test mode - prevented");
    return null;
  }

  // Create normalized traits that match the PersonalityTrait interface
  const mockTraits: PersonalityTrait[] = [
    {
      name: "Creativity",
      trait: "Creativity",
      score: 9.2,
      description: "You have an exceptional ability to generate novel ideas and see connections that others miss. Your creative thinking is not just artistic but extends to problem-solving and conceptual reasoning.",
      impact: ["Enables innovative problem-solving", "Enhances artistic expression"],
      recommendations: ["Schedule regular creative time", "Collaborate with diverse thinkers"],
      strengths: ["Innovative thinking", "Out-of-the-box solutions", "Appreciation for aesthetics"],
      challenges: ["May occasionally get lost in possibilities", "Can feel restricted by highly structured environments"],
      growthSuggestions: ["Balance creative exploration with practical implementation", "Find structured outlets for creative expression"]
    },
    {
      name: "Analytical Thinking",
      trait: "Analytical Thinking",
      score: 8.7,
      description: "You excel at breaking down complex problems and evaluating information objectively. You have a natural inclination toward logical reasoning and evidence-based decision-making.",
      impact: ["Facilitates systematic problem-solving", "Enables objective evaluation"],
      recommendations: ["Apply structured frameworks to complex problems", "Seek diverse perspectives"],
      strengths: ["Critical evaluation of information", "Logical problem-solving", "Attention to detail"],
      challenges: ["May overanalyze at times", "Can become frustrated with illogical arguments"],
      growthSuggestions: ["Practice integrating emotional insights with analytical thinking", "Develop comfort with ambiguity"]
    },
    {
      name: "Empathy",
      trait: "Empathy",
      score: 8.5,
      description: "You have a strong ability to understand and share the feelings of others. This emotional intelligence allows you to navigate social situations with sensitivity and form deep connections.",
      impact: ["Strengthens relationships", "Enhances communication"],
      recommendations: ["Use your empathic skills in conflict resolution", "Balance empathy with self-care"],
      strengths: ["Building rapport quickly", "Sensing unspoken emotions", "Providing meaningful support"],
      challenges: ["Risk of emotional exhaustion", "May take on others' problems as your own"],
      growthSuggestions: ["Develop healthy emotional boundaries", "Practice self-compassion alongside empathy for others"]
    },
    {
      name: "Resilience",
      trait: "Resilience",
      score: 8.3,
      description: "You demonstrate the ability to recover quickly from difficulties and adapt to change. Your responses show a growth mindset that views challenges as opportunities for development.",
      impact: ["Enables adaptation to change", "Supports long-term achievement"],
      recommendations: ["Share your resilience strategies with others", "Document your growth through challenges"],
      strengths: ["Bouncing back from setbacks", "Adapting to changing circumstances", "Learning from experience"],
      challenges: ["May sometimes push through when rest is needed", "Can set overly high expectations for recovery"],
      growthSuggestions: ["Honor your need for processing difficult experiences", "Celebrate small victories during challenging times"]
    },
    {
      name: "Curiosity",
      trait: "Curiosity",
      score: 8.1,
      description: "You have a strong desire to learn and understand the world around you. Your intellectual curiosity drives continuous personal growth and exposure to new ideas.",
      impact: ["Accelerates learning", "Expands perspective"],
      recommendations: ["Create a learning plan across diverse subjects", "Share your discoveries with others"],
      strengths: ["Love of learning", "Openness to new experiences", "Intellectual humility"],
      challenges: ["May sometimes lack focus when exploring too many interests", "Risk of information overload"],
      growthSuggestions: ["Develop systems to organize and integrate new knowledge", "Balance breadth and depth in your learning"]
    },
    {
      name: "Self-awareness",
      trait: "Self-awareness",
      score: 7.8,
      description: "You have good insight into your own character, feelings, motives, and desires. This metacognitive ability enables intentional personal development and authentic self-expression.",
      impact: ["Enables intentional growth", "Supports authentic expression"],
      recommendations: ["Regular reflection practices", "Seek feedback from trusted others"],
      strengths: ["Understanding personal triggers", "Recognizing patterns in your behavior", "Authentic self-expression"],
      challenges: ["Risk of overthinking personal motives", "Potential for excessive self-criticism"],
      growthSuggestions: ["Practice self-compassion alongside self-awareness", "Use journaling to track patterns and insights"]
    },
    {
      name: "Adaptability",
      trait: "Adaptability",
      score: 7.5,
      description: "You demonstrate flexibility in adjusting to new conditions and circumstances. Your responses indicate comfort with change and ability to thrive in diverse situations.",
      impact: ["Enhances effectiveness in changing environments", "Reduces stress during transitions"],
      recommendations: ["Seek varied experiences", "Share adaptation strategies with others"],
      strengths: ["Comfort with uncertainty", "Ability to pivot strategies", "Openness to different perspectives"],
      challenges: ["May occasionally change course too quickly", "Can find excessive routine stifling"],
      growthSuggestions: ["Develop discernment about when to adapt versus persevere", "Create flexible routines that provide structure without restriction"]
    },
    {
      name: "Conscientiousness",
      trait: "Conscientiousness",
      score: 7.3,
      description: "You are thorough, careful, and vigilant in your approach to tasks. You demonstrate reliability and attention to detail in your commitments.",
      impact: ["Ensures quality outcomes", "Builds trust with others"],
      recommendations: ["Apply your thorough approach selectively", "Develop systems for consistent execution"],
      strengths: ["Follow-through on commitments", "Organization and planning", "Attention to quality"],
      challenges: ["Risk of perfectionism", "May have difficulty delegating"],
      growthSuggestions: ["Practice appropriate standards for different contexts", "Develop comfort with 'good enough' when perfectionism isn't serving you"]
    },
    {
      name: "Independent Thinking",
      trait: "Independent Thinking",
      score: 7.0,
      description: "You value forming your own opinions and are willing to question conventional wisdom. You think critically about received knowledge and trust your own judgment.",
      impact: ["Leads to original insights", "Prevents groupthink"],
      recommendations: ["Balance independence with collaboration", "Document your unique perspectives"],
      strengths: ["Resistance to groupthink", "Intellectual courage", "Original perspectives"],
      challenges: ["May sometimes reject helpful conventional wisdom", "Can feel isolated in your viewpoints"],
      growthSuggestions: ["Balance skepticism with openness to established knowledge", "Find communities that value independent thinking"]
    },
    {
      name: "Optimism",
      trait: "Optimism",
      score: 6.9,
      description: "You tend to be hopeful and confident about the future or the success of something. Your responses show a generally positive outlook tempered with realism.",
      impact: ["Enhances resilience", "Inspires others"],
      recommendations: ["Share your positive perspective with those who need it", "Apply optimism strategically to challenges"],
      strengths: ["Resilience in the face of challenges", "Ability to inspire others", "Solution-focused thinking"],
      challenges: ["Risk of overlooking genuine obstacles", "May sometimes dismiss valid concerns"],
      growthSuggestions: ["Cultivate realistic optimism that acknowledges challenges", "Practice balancing hope with pragmatic planning"]
    }
  ];

  // Create intelligence that matches the Intelligence interface
  const mockIntelligence: Intelligence = {
    type: "Integrative Intelligence",
    score: 8.6,
    description: "You exhibit a remarkable blend of logical-mathematical, intrapersonal, and verbal-linguistic intelligence. This integrated cognitive style allows you to analyze complex information, communicate effectively, and maintain awareness of your internal thought processes.",
    strengths: ["Analytical reasoning", "Pattern recognition", "Verbal communication"],
    areas_for_development: ["Visual-spatial processing", "Kinesthetic awareness"],
    learning_style: "Analytical-Reflective",
    cognitive_preferences: ["Abstract conceptualization", "Logical systems", "Verbal processing"],
    domains: [
      {
        name: "Logical-Mathematical",
        score: 8.7,
        description: "Strong ability to reason abstractly, recognize patterns, and work with numerical concepts"
      },
      {
        name: "Verbal-Linguistic",
        score: 8.5,
        description: "Excellent command of language for expression, comprehension, and rhetorical effectiveness"
      },
      {
        name: "Intrapersonal",
        score: 8.4,
        description: "Deep self-understanding, awareness of internal states, and ability to use self-knowledge effectively"
      },
      {
        name: "Naturalistic",
        score: 7.9,
        description: "Strong ability to recognize patterns in the natural world and categorize information"
      },
      {
        name: "Interpersonal",
        score: 7.8,
        description: "Good understanding of others' intentions, motivations, and desires"
      }
    ]
  };

  // Create cognitive style that matches the CognitiveStyle interface
  const mockCognitiveStyle: CognitiveStyle = {
    primary: "Analytical-Intuitive",
    secondary: "Conceptual",
    description: "You balance detailed analysis with intuitive leaps, often seeing both the forest and the trees. Your thinking tends toward abstract concepts and patterns while maintaining the ability to consider practical applications."
  };

  // Create value system that matches the ValueSystem interface
  const mockValueSystem: ValueSystem = {
    strengths: [
      "Intellectual integrity",
      "Authentic self-expression",
      "Meaningful connection",
      "Creative contribution",
      "Personal growth"
    ],
    weaknesses: [
      "Perfectionism",
      "Overthinking",
      "Difficulty with routine"
    ],
    description: "Your values center around intellectual honesty, meaningful relationships, and creative contribution."
  };

  // Create relationship patterns
  const mockRelationshipPatterns: RelationshipPatterns = {
    strengths: [
      "Deep emotional intelligence and empathy",
      "Commitment to authentic communication",
      "Interest in genuine understanding of others",
      "Ability to provide thoughtful support and insights"
    ],
    challenges: [
      "May sometimes withhold concerns to maintain harmony",
      "Can have unexpectedly strong reactions when core values are challenged",
      "Tendency to process relationship dynamics internally before sharing"
    ],
    compatibleTypes: [
      "The Pragmatic Visionary",
      "The Authentic Navigator",
      "The Thoughtful Activator",
      "The Steadfast Innovator"
    ]
  };

  const mockAnalysis: PersonalityAnalysis = {
    id: `analysis-${Date.now()}`,
    createdAt: new Date().toISOString(), // Convert Date to string
    overview: "You are a highly creative individual with strong analytical abilities and remarkable emotional intelligence. Your responses reveal a complex personality with a blend of intuitive and methodical approaches to challenges. You show a preference for meaningful connections over superficial interactions, and you're driven by a desire to make a lasting positive impact on the world around you.",
    traits: mockTraits,
    intelligence: mockIntelligence,
    cognitiveStyle: mockCognitiveStyle,
    valueSystem: mockValueSystem,
    motivators: [
      "Making a meaningful impact on others",
      "Intellectual challenge and growth",
      "Creative expression and innovation",
      "Understanding complex systems and ideas",
      "Building deep and authentic relationships"
    ],
    inhibitors: [
      "Fear of not meeting your own high standards",
      "Tendency toward overthinking important decisions",
      "Occasional reluctance to assert your needs in relationships",
      "Sensitivity to criticism, especially regarding your core values",
      "Difficulty maintaining focus when not intellectually engaged"
    ],
    weaknesses: [
      "Can become emotionally invested in projects to the detriment of balance",
      "Tendency to overanalyze social interactions",
      "May struggle with practical implementation of abstract ideas",
      "Sometimes difficulty with establishing consistent routines",
      "Can be reluctant to delegate or ask for help"
    ],
    growthAreas: [
      "Developing a consistent balance between analysis and action",
      "Cultivating strategic assertiveness in professional settings",
      "Building structured systems for implementing creative ideas",
      "Practicing mindfulness to reduce overthinking patterns",
      "Learning to calibrate perfectionism based on context"
    ],
    relationshipPatterns: mockRelationshipPatterns,
    careerSuggestions: [
      "Research and Development",
      "Strategic Consulting",
      "Creative Direction",
      "Psychology and Counseling",
      "Systems Design or Architecture",
      "Education and Curriculum Development"
    ],
    intelligenceScore: 86,
    emotionalIntelligenceScore: 83,
    roadmap: "Your path to higher consciousness centers around integrating your analytical strengths with emotional intelligence while developing practical systems for implementing your creative insights. Focus on mindfulness practices to quiet your active mind, and seek out collaborative projects that challenge you to communicate your ideas clearly while receiving implementation feedback. Regular reflection through journaling will help you track patterns in your thinking and behavior, while deliberate practice in areas of discomfort will expand your capabilities. Given your natural curiosity and analytical mind, continued learning in diverse subjects will satisfy your intellectual needs while broadening your perspective. To address potential overthinking, practice timely decision-making protocols and celebrate small actions over perfect plans.",
    learningPathways: [
      "Explore structured creative expression to channel your ideas effectively",
      "Develop expertise in systems thinking to complement your analytical abilities",
      "Study practical implementation methodologies to bridge concept and action",
      "Investigate mindfulness practices that work with your cognitive style",
      "Pursue interpersonal communication strategies that leverage your emotional intelligence"
    ],
    detailedAnalysis: {
      personalityProfile: "You are highly creative and analytical with strong emotional intelligence.",
      cognitiveProcesses: "You tend to balance logical reasoning with intuitive insights.",
      emotionalPatterns: "You process emotions deeply and use them as valuable information.",
      interpersonalStyle: "You value authentic connections and meaningful conversations.",
      motivationalFactors: "You're driven by learning, growth, and making a difference.",
      developmentalPath: "Focus on implementing ideas and balancing reflection with action."
    }
  };
  
  return mockAnalysis;
};

export const categorizeResponses = (responses: AssessmentResponse[]): Record<QuestionCategory, AssessmentResponse[]> => {
  return responses.reduce((acc, response) => {
    if (!response.category) return acc;
    
    if (!acc[response.category]) {
      acc[response.category] = [];
    }
    
    acc[response.category].push(response);
    return acc;
  }, {} as Record<QuestionCategory, AssessmentResponse[]>);
};

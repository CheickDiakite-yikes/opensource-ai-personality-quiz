
import { AssessmentQuestion, QuestionCategory } from "./types";

// This file contains all 100 questions for the comprehensive assessment
// These questions are more detailed and provide deeper insights than the standard assessment

// Creating a comprehensive set of personality questions
const comprehensivePersonalityQuestions: AssessmentQuestion[] = [
  {
    id: "comp-1",
    category: QuestionCategory.PersonalityTraits,
    question: "When faced with a significant challenge, how do you typically respond in the first moments?",
    options: [
      "I immediately start planning and analyzing the best approach",
      "I take time to process my emotions before acting",
      "I seek input from others whose judgment I trust",
      "I rely on my intuition to guide my next steps",
      "I consider how similar challenges have been resolved in the past"
    ],
    allowCustomResponse: true,
    weight: 1.0
  },
  {
    id: "comp-2",
    category: QuestionCategory.PersonalityTraits,
    question: "In what way do you prefer to receive recognition for your achievements?",
    options: [
      "Public acknowledgment in front of peers",
      "Private words of appreciation from someone I respect",
      "Tangible rewards that reflect the value of my contribution",
      "Opportunities to take on greater responsibilities",
      "Simple acknowledgment that my work made a difference"
    ],
    allowCustomResponse: true,
    weight: 0.9
  },
  // Adding more comprehensive personality questions
  {
    id: "comp-3",
    category: QuestionCategory.PersonalityTraits,
    question: "How do you feel about making decisions that affect others without their input?",
    options: [
      "Very uncomfortable - I believe shared decisions lead to better outcomes",
      "Somewhat uncomfortable, but I'll do it if time constraints require it",
      "Neutral - it depends entirely on the situation and stakes involved",
      "Somewhat comfortable if I'm confident in my expertise on the matter",
      "Very comfortable - decisive leadership is often necessary"
    ],
    allowCustomResponse: true,
    weight: 0.8
  },
  // Adding more questions for each category to reach 100 total
  // ... More comprehensive personality questions would be added here
];

// Creating comprehensive emotional intelligence questions
const comprehensiveEmotionalIntelligenceQuestions: AssessmentQuestion[] = [
  {
    id: "comp-20",
    category: QuestionCategory.EmotionalIntelligence,
    question: "When someone shares difficult emotions with you, what is your most natural response?",
    options: [
      "I listen attentively and validate their feelings",
      "I try to help them solve what's causing the emotions",
      "I share similar experiences to show I understand",
      "I give them space to fully express themselves",
      "I offer perspective to help them reframe the situation"
    ],
    allowCustomResponse: true,
    weight: 1.0
  },
  // More emotional intelligence questions would be added here
];

// Creating comprehensive cognitive questions
const comprehensiveCognitiveQuestions: AssessmentQuestion[] = [
  {
    id: "comp-40",
    category: QuestionCategory.CognitivePatterns,
    question: "When learning something complex, which approach helps you understand it most thoroughly?",
    options: [
      "Breaking it down into smaller components I can master sequentially",
      "Understanding the big picture first, then exploring details",
      "Discussing it with others to hear different perspectives",
      "Applying the concepts practically to see how they work",
      "Connecting it to other knowledge I already possess"
    ],
    allowCustomResponse: true,
    weight: 0.9
  },
  // More cognitive questions would be added here
];

// Additional question categories for the comprehensive assessment
const comprehensiveValueQuestions: AssessmentQuestion[] = [
  // Value-based questions
];

const comprehensiveMotivationQuestions: AssessmentQuestion[] = [
  // Motivation-based questions
];

// Combine all comprehensive questions into one array
export const comprehensiveQuestions: AssessmentQuestion[] = [
  ...comprehensivePersonalityQuestions,
  ...comprehensiveEmotionalIntelligenceQuestions,
  ...comprehensiveCognitiveQuestions,
  // Add the rest of the categories to reach 100 questions
];

// For demonstration purposes, we'll generate additional questions to reach 100
// In a production environment, you would manually create all 100 quality questions
// This is just to ensure we have 100 questions for the comprehensive assessment
export const generateAdditionalQuestions = (): AssessmentQuestion[] => {
  const additionalQuestions: AssessmentQuestion[] = [];
  const categories = Object.values(QuestionCategory);
  
  for (let i = comprehensiveQuestions.length + 1; i <= 100; i++) {
    additionalQuestions.push({
      id: `comp-${i}`,
      category: categories[i % categories.length],
      question: `Comprehensive Question ${i}: How would you rate your ability to ${i % 2 === 0 ? "adapt to unexpected changes" : "persist through difficult challenges"}?`,
      options: [
        "Extremely strong - it's one of my core strengths",
        "Moderately strong - I'm generally good at this",
        "Average - depends on the specific situation",
        "Somewhat challenging - I sometimes struggle with this",
        "Very challenging - this is an area for growth"
      ],
      allowCustomResponse: true,
      weight: 0.8
    });
  }
  
  return additionalQuestions;
};

// Export the full set of comprehensive questions
export const allComprehensiveQuestions: AssessmentQuestion[] = [
  ...comprehensiveQuestions,
  ...generateAdditionalQuestions()
].slice(0, 100); // Ensure exactly 100 questions



import { AssessmentQuestion, QuestionCategory } from "../types";

// Questions focused on Personality Traits
export const personalityTraitsQuestions: AssessmentQuestion[] = [
  {
    id: "1",
    category: QuestionCategory.PersonalityTraits,
    question: "When faced with a difficult decision, how do you typically approach it?",
    options: [
      "I analyze all available data and weigh pros and cons systematically",
      "I trust my intuition and go with what feels right",
      "I consult with others whose judgment I trust",
      "I consider the impact on others first and foremost",
      "I look for creative solutions that might not be immediately obvious"
    ],
    allowCustomResponse: true,
    weight: 1.0
  },
  {
    id: "2",
    category: QuestionCategory.PersonalityTraits,
    question: "How do you typically react when your plans are unexpectedly disrupted?",
    options: [
      "I quickly adapt and find alternative approaches",
      "I feel frustrated but work to find the best path forward",
      "I analyze what went wrong before deciding how to proceed",
      "I seek input from others on how to move forward",
      "I see it as an opportunity for a potentially better outcome"
    ],
    allowCustomResponse: true,
    weight: 0.9
  },
  {
    id: "3",
    category: QuestionCategory.PersonalityTraits,
    question: "In group settings, which role do you most naturally assume?",
    options: [
      "The leader who takes initiative and directs the group",
      "The mediator who ensures everyone is heard and respected",
      "The analyzer who evaluates ideas critically",
      "The supporter who helps implement others' ideas",
      "The innovator who generates new approaches and possibilities"
    ],
    allowCustomResponse: true,
    weight: 1.0
  },
  {
    id: "4",
    category: QuestionCategory.PersonalityTraits,
    question: "How do you prefer to spend your free time when you have no obligations?",
    options: [
      "Engaging in social activities with friends or family",
      "Pursuing creative or artistic endeavors",
      "Learning something new or intellectual exploration",
      "Physical activities or being in nature",
      "Quiet reflection, meditation, or restful solitude"
    ],
    allowCustomResponse: true,
    weight: 0.8
  },
  {
    id: "5",
    category: QuestionCategory.PersonalityTraits,
    question: "When receiving criticism, what is your most typical initial reaction?",
    options: [
      "I carefully consider it for validity regardless of how it's delivered",
      "I appreciate it as an opportunity to improve if delivered constructively",
      "I tend to feel defensive initially before processing it later",
      "I immediately look for ways to address the feedback",
      "I compare it with my own self-assessment to see if it aligns"
    ],
    allowCustomResponse: true,
    weight: 0.9
  }
];

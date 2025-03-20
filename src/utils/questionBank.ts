
import { AssessmentQuestion, QuestionCategory } from "./types";

// A comprehensive bank of 50 high-quality assessment questions
export const questionBank: AssessmentQuestion[] = [
  // Personality Traits Category
  {
    id: 1,
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
    id: 2,
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
    id: 3,
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
    id: 4,
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
    id: 5,
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
  },
  
  // Emotional Intelligence Category
  {
    id: 6,
    category: QuestionCategory.EmotionalIntelligence,
    question: "When you witness someone else's distress, how do you typically respond?",
    options: [
      "I immediately offer practical help and solutions",
      "I listen empathetically without rushing to fix the situation",
      "I give them space, respecting that they might want privacy",
      "I share similar experiences to show understanding",
      "I try to cheer them up or distract them from their troubles"
    ],
    allowCustomResponse: true,
    weight: 1.0
  },
  {
    id: 7,
    category: QuestionCategory.EmotionalIntelligence,
    question: "How easily can you identify your own emotions as they arise?",
    options: [
      "Very easily – I'm immediately aware of what I'm feeling and why",
      "Fairly easily, though some complex emotions take time to understand",
      "It depends on the intensity – strong emotions are clear, subtle ones less so",
      "I often need time alone to process and understand my feelings",
      "I sometimes struggle to distinguish between similar emotions"
    ],
    allowCustomResponse: true,
    weight: 0.9
  },
  {
    id: 8,
    category: QuestionCategory.EmotionalIntelligence,
    question: "When you're feeling overwhelmed, what strategies do you typically employ?",
    options: [
      "I break down the situation into manageable components",
      "I seek social support and talk through my feelings",
      "I engage in physical activity or exercise",
      "I practice mindfulness, meditation, or breathing exercises",
      "I temporarily distract myself before returning to the issue"
    ],
    allowCustomResponse: true,
    weight: 0.8
  },
  {
    id: 9,
    category: QuestionCategory.EmotionalIntelligence,
    question: "How do you typically handle situations where others hold strong opinions that differ from yours?",
    options: [
      "I listen carefully to understand their perspective fully",
      "I engage in respectful debate to express my viewpoint",
      "I find common ground while acknowledging differences",
      "I tend to keep my opinions to myself to avoid conflict",
      "I reassess my own views to see if there's something I've missed"
    ],
    allowCustomResponse: true,
    weight: 1.0
  },
  {
    id: 10,
    category: QuestionCategory.EmotionalIntelligence,
    question: "When someone close to you is celebrating a success, what's your most natural reaction?",
    options: [
      "I express genuine enthusiasm and celebrate with them",
      "I ask questions to understand the achievement better",
      "I highlight specific aspects of their accomplishment I find impressive",
      "I share in their happiness while offering new goals to pursue",
      "I express pride in them and their efforts"
    ],
    allowCustomResponse: true,
    weight: 0.7
  },
  
  // Cognitive Patterns Category
  {
    id: 11,
    category: QuestionCategory.CognitivePatterns,
    question: "When learning something new, which approach do you find most effective?",
    options: [
      "Understanding the underlying principles and concepts first",
      "Diving in and learning through practical experience",
      "Following step-by-step instructions or tutorials",
      "Discussing and exploring ideas with others",
      "Connecting it to things I already know and understand"
    ],
    allowCustomResponse: true,
    weight: 0.9
  },
  {
    id: 12,
    category: QuestionCategory.CognitivePatterns,
    question: "How do you typically approach complex problems?",
    options: [
      "I break them down into smaller, manageable components",
      "I look for patterns and connections to solutions I already know",
      "I try to find creative approaches that others might miss",
      "I research how others have solved similar problems",
      "I identify the core issue before considering solutions"
    ],
    allowCustomResponse: true,
    weight: 1.0
  },
  {
    id: 13,
    category: QuestionCategory.CognitivePatterns,
    question: "How comfortable are you with ambiguity and uncertainty?",
    options: [
      "Very comfortable – I find it interesting and full of possibility",
      "Moderately comfortable, though I prefer clarity when possible",
      "It depends on the context – sometimes it's energizing, sometimes stressful",
      "Generally uncomfortable – I seek to resolve ambiguity quickly",
      "I'm comfortable with it intellectually but find it emotionally challenging"
    ],
    allowCustomResponse: true,
    weight: 0.8
  },
  {
    id: 14,
    category: QuestionCategory.CognitivePatterns,
    question: "When forming opinions on complex issues, what influences you most?",
    options: [
      "Factual evidence and logical reasoning",
      "Expertise and authoritative perspectives",
      "Personal values and principles",
      "Impact on people and relationships",
      "Intuitive sense of what feels right or true"
    ],
    allowCustomResponse: true,
    weight: 0.9
  },
  {
    id: 15,
    category: QuestionCategory.CognitivePatterns,
    question: "How often do you question your own assumptions and beliefs?",
    options: [
      "Constantly – I regularly reassess even my most fundamental beliefs",
      "Often, especially when presented with challenging new information",
      "Sometimes, particularly when my beliefs lead to unexpected outcomes",
      "Occasionally, but I find value in maintaining consistent perspectives",
      "Rarely for core values, more often for practical opinions"
    ],
    allowCustomResponse: true,
    weight: 0.8
  },
  
  // Value Systems Category
  {
    id: 16,
    category: QuestionCategory.ValueSystems,
    question: "Which of these do you value most in your relationships with others?",
    options: [
      "Honesty and authenticity",
      "Loyalty and dependability",
      "Growth and mutual development",
      "Understanding and empathy",
      "Respect for independence and boundaries"
    ],
    allowCustomResponse: true,
    weight: 0.9
  },
  {
    id: 17,
    category: QuestionCategory.ValueSystems,
    question: "What do you consider most important when making significant life decisions?",
    options: [
      "Alignment with my core values and principles",
      "Potential for personal growth and development",
      "Impact on important relationships in my life",
      "Practical considerations and likely outcomes",
      "Following my passion and what brings fulfillment"
    ],
    allowCustomResponse: true,
    weight: 1.0
  },
  {
    id: 18,
    category: QuestionCategory.ValueSystems,
    question: "How important is it to you that your work contributes to something beyond yourself?",
    options: [
      "Essential – I need to feel I'm contributing to a greater good",
      "Important, but balanced with personal fulfillment and practical needs",
      "Somewhat important, though other factors often take priority",
      "Nice when possible, but not a primary consideration",
      "Less important than excellence and personal achievement"
    ],
    allowCustomResponse: true,
    weight: 0.8
  },
  {
    id: 19,
    category: QuestionCategory.ValueSystems,
    question: "Which of these qualities do you most admire in others?",
    options: [
      "Integrity and moral courage",
      "Wisdom and insight",
      "Kindness and compassion",
      "Creativity and original thinking",
      "Resilience and determination"
    ],
    allowCustomResponse: true,
    weight: 0.7
  },
  {
    id: 20,
    category: QuestionCategory.ValueSystems,
    question: "What constitutes 'success' in your view?",
    options: [
      "Making a positive difference in others' lives",
      "Achieving excellence in my chosen field",
      "Finding personal fulfillment and happiness",
      "Building meaningful relationships and connections",
      "Continuously growing and developing as a person"
    ],
    allowCustomResponse: true,
    weight: 0.9
  },
  
  // Motivation Category
  {
    id: 21,
    category: QuestionCategory.Motivation,
    question: "What most often drives you to take on new challenges?",
    options: [
      "Curiosity and the desire to learn something new",
      "The possibility of achievement and recognition",
      "Personal development and growth",
      "Making a positive impact or contribution",
      "The excitement of pushing my boundaries"
    ],
    allowCustomResponse: true,
    weight: 0.9
  },
  {
    id: 22,
    category: QuestionCategory.Motivation,
    question: "When you've achieved a goal, what typically motivates you next?",
    options: [
      "Setting a more ambitious related goal",
      "Finding a completely different challenge",
      "Taking time to enjoy the achievement before moving on",
      "Helping others achieve similar goals",
      "Reflecting on what I learned from the process"
    ],
    allowCustomResponse: true,
    weight: 0.8
  },
  {
    id: 23,
    category: QuestionCategory.Motivation,
    question: "What typically helps you persist through difficult or tedious tasks?",
    options: [
      "Focusing on the purpose or meaning behind the task",
      "Breaking it down into smaller, manageable parts",
      "Rewarding myself at key milestones",
      "Thinking about how good it will feel to complete it",
      "Making the process more enjoyable or creative"
    ],
    allowCustomResponse: true,
    weight: 0.7
  },
  {
    id: 24,
    category: QuestionCategory.Motivation,
    question: "What tends to diminish your motivation most significantly?",
    options: [
      "Lack of clear purpose or meaning in the task",
      "Not seeing progress or positive results",
      "External pressure or control",
      "Insufficient challenge or stimulation",
      "Absence of recognition or appreciation"
    ],
    allowCustomResponse: true,
    weight: 0.8
  },
  {
    id: 25,
    category: QuestionCategory.Motivation,
    question: "What environment helps you feel most motivated and productive?",
    options: [
      "Collaborative setting with energetic, like-minded people",
      "Quiet, private space where I can focus without interruption",
      "Flexible environment that I can adjust as needs change",
      "Structured setting with clear expectations and deadlines",
      "Inspiring, aesthetically pleasing surroundings"
    ],
    allowCustomResponse: true,
    weight: 0.7
  },
  
  // Resilience Category
  {
    id: 26,
    category: QuestionCategory.Resilience,
    question: "How do you typically respond to significant setbacks or failures?",
    options: [
      "I analyze what went wrong and create a plan to improve",
      "I seek support from others while processing my feelings",
      "I take time to recover emotionally before moving forward",
      "I look for the lessons or growth opportunities in the experience",
      "I quickly pivot to alternative approaches or goals"
    ],
    allowCustomResponse: true,
    weight: 1.0
  },
  {
    id: 27,
    category: QuestionCategory.Resilience,
    question: "What helps you cope with stress most effectively?",
    options: [
      "Physical activity or exercise",
      "Speaking with supportive friends or family",
      "Mindfulness practices like meditation",
      "Creative expression or hobbies",
      "Planning and organizing to regain a sense of control"
    ],
    allowCustomResponse: true,
    weight: 0.8
  },
  {
    id: 28,
    category: QuestionCategory.Resilience,
    question: "When faced with significant life changes, how do you typically adapt?",
    options: [
      "I embrace change as an opportunity for growth",
      "I research and prepare as much as possible",
      "I take it one day at a time with a flexible approach",
      "I rely on my support network during the transition",
      "I maintain some routines for stability while adapting to changes"
    ],
    allowCustomResponse: true,
    weight: 0.9
  },
  {
    id: 29,
    category: QuestionCategory.Resilience,
    question: "When a long-term project becomes difficult, what most helps you persevere?",
    options: [
      "Reconnecting with the purpose or meaning behind the work",
      "Breaking it down into smaller milestones",
      "Taking breaks to recharge and gain perspective",
      "Getting input or support from others",
      "Reminding myself of past challenges I've overcome"
    ],
    allowCustomResponse: true,
    weight: 0.8
  },
  {
    id: 30,
    category: QuestionCategory.Resilience,
    question: "How have your past difficulties shaped your approach to new challenges?",
    options: [
      "They've made me more confident in my ability to overcome obstacles",
      "They've taught me to be more careful and thorough in my planning",
      "They've helped me develop better coping strategies",
      "They've shown me the importance of asking for help when needed",
      "They've given me perspective on what matters most"
    ],
    allowCustomResponse: true,
    weight: 0.9
  },
  
  // Social Interaction Category
  {
    id: 31,
    category: QuestionCategory.SocialInteraction,
    question: "In conversations, which are you more likely to do?",
    options: [
      "Listen attentively, focusing on understanding the other person",
      "Share my thoughts, feelings, and experiences openly",
      "Ask questions to deepen the discussion",
      "Look for opportunities to find common ground",
      "Offer solutions or advice when I see a problem"
    ],
    allowCustomResponse: true,
    weight: 0.8
  },
  {
    id: 32,
    category: QuestionCategory.SocialInteraction,
    question: "How do you typically navigate conflicts in relationships?",
    options: [
      "Address issues directly with honest communication",
      "Look for compromise and common ground",
      "Take time to understand all perspectives before responding",
      "Focus on maintaining the relationship while working through issues",
      "Adapt my approach based on what the other person needs"
    ],
    allowCustomResponse: true,
    weight: 0.9
  },
  {
    id: 33,
    category: QuestionCategory.SocialInteraction,
    question: "What role do social gatherings typically play in your life?",
    options: [
      "They energize me and are essential to my wellbeing",
      "I enjoy them in moderation but also need alone time",
      "I prefer small, intimate gatherings with close friends",
      "They're valuable opportunities for meaningful connection",
      "I tend to find them draining, though occasionally rewarding"
    ],
    allowCustomResponse: true,
    weight: 0.7
  },
  {
    id: 34,
    category: QuestionCategory.SocialInteraction,
    question: "How easily do you form deep connections with new people?",
    options: [
      "Very easily – I connect deeply with people right away",
      "Moderately easily with people who share my interests or values",
      "It varies greatly depending on the person and context",
      "I'm selective and take time to develop deep connections",
      "I find it challenging but rewarding with the right people"
    ],
    allowCustomResponse: true,
    weight: 0.8
  },
  {
    id: 35,
    category: QuestionCategory.SocialInteraction,
    question: "How important is it for you to be part of a community or group?",
    options: [
      "Essential – I thrive when I'm connected to a community",
      "Important for some aspects of life but not others",
      "I value a few close relationships over broader community",
      "I appreciate community support but maintain independence",
      "I prefer self-sufficiency and limited social entanglements"
    ],
    allowCustomResponse: true,
    weight: 0.7
  },
  
  // Decision Making Category
  {
    id: 36,
    category: QuestionCategory.DecisionMaking,
    question: "When making decisions, how much do you rely on intuition versus analysis?",
    options: [
      "Heavily analytical with little role for intuition",
      "Primarily analytical but intuition serves as a check",
      "Equal balance between analytical thinking and intuitive sensing",
      "Primarily intuitive but validated with analytical thinking",
      "Heavily intuitive with analysis as a secondary consideration"
    ],
    allowCustomResponse: true,
    weight: 0.9
  },
  {
    id: 37,
    category: QuestionCategory.DecisionMaking,
    question: "How comfortable are you making decisions with incomplete information?",
    options: [
      "Very comfortable – I can decide and adjust as needed",
      "Moderately comfortable if the situation requires quick action",
      "It depends on the stakes and consequences involved",
      "Somewhat uncomfortable – I prefer to gather more data first",
      "Very uncomfortable – I need thorough information before deciding"
    ],
    allowCustomResponse: true,
    weight: 0.8
  },
  {
    id: 38,
    category: QuestionCategory.DecisionMaking,
    question: "After making an important decision, how often do you second-guess yourself?",
    options: [
      "Rarely – once I decide, I typically move forward confidently",
      "Occasionally, especially if I receive new information",
      "Sometimes, particularly for decisions with significant impact",
      "Often – I frequently wonder if I made the right choice",
      "It depends on the feedback and results I observe"
    ],
    allowCustomResponse: true,
    weight: 0.7
  },
  {
    id: 39,
    category: QuestionCategory.DecisionMaking,
    question: "How do you typically approach decisions that affect others?",
    options: [
      "I consult those affected and consider their input carefully",
      "I try to anticipate needs and concerns of others independently",
      "I balance my judgment with consideration for others' perspectives",
      "I make the decision I believe is right and explain my reasoning",
      "I focus on objective criteria rather than subjective preferences"
    ],
    allowCustomResponse: true,
    weight: 0.9
  },
  {
    id: 40,
    category: QuestionCategory.DecisionMaking,
    question: "What tends to be your biggest challenge in decision-making?",
    options: [
      "Overthinking and analysis paralysis",
      "Balancing logical and emotional considerations",
      "Managing time pressure or urgency",
      "Considering too many options or possibilities",
      "Confidence in my judgment without external validation"
    ],
    allowCustomResponse: true,
    weight: 0.8
  },
  
  // Creativity Category
  {
    id: 41,
    category: QuestionCategory.Creativity,
    question: "How do you typically generate new ideas or approaches?",
    options: [
      "Connecting seemingly unrelated concepts or fields",
      "Building upon and improving existing ideas",
      "Through collaboration and discussion with others",
      "During quiet reflection or meditative states",
      "By challenging assumptions and conventional thinking"
    ],
    allowCustomResponse: true,
    weight: 0.9
  },
  {
    id: 42,
    category: QuestionCategory.Creativity,
    question: "When do you feel most creative or innovative?",
    options: [
      "When I'm under pressure with tight deadlines",
      "When I have unstructured time to explore possibilities",
      "When I'm collaborating with diverse perspectives",
      "When I'm in a relaxed, positive emotional state",
      "When I'm challenged by difficult problems or constraints"
    ],
    allowCustomResponse: true,
    weight: 0.8
  },
  {
    id: 43,
    category: QuestionCategory.Creativity,
    question: "How important is creative expression in your life?",
    options: [
      "Essential – it's a primary way I understand and process experience",
      "Very important for specific aspects of my life and work",
      "Moderately important as one of several valuable pursuits",
      "Somewhat important, mainly as a recreational activity",
      "Relatively minor compared to other priorities and interests"
    ],
    allowCustomResponse: true,
    weight: 0.7
  },
  {
    id: 44,
    category: QuestionCategory.Creativity,
    question: "How do you typically respond to unconventional or unusual ideas?",
    options: [
      "With excitement and eagerness to explore them further",
      "With curious interest but some practical skepticism",
      "By considering how they might be practically applied",
      "I evaluate them against established principles and knowledge",
      "I appreciate them intellectually but prefer proven approaches"
    ],
    allowCustomResponse: true,
    weight: 0.8
  },
  {
    id: 45,
    category: QuestionCategory.Creativity,
    question: "What do you find most challenging about creative processes?",
    options: [
      "Translating abstract ideas into concrete reality",
      "Finding the right balance between novelty and practicality",
      "Managing self-doubt and internal criticism",
      "Maintaining momentum through implementation",
      "Knowing when something is truly finished or complete"
    ],
    allowCustomResponse: true,
    weight: 0.7
  },
  
  // Leadership Category
  {
    id: 46,
    category: QuestionCategory.Leadership,
    question: "What do you believe is the most important quality of effective leadership?",
    options: [
      "Clear vision and the ability to inspire others",
      "Emotional intelligence and understanding of people",
      "Strategic thinking and sound decision-making",
      "Integrity and leading by example",
      "Adaptability and responsiveness to change"
    ],
    allowCustomResponse: true,
    weight: 0.9
  },
  {
    id: 47,
    category: QuestionCategory.Leadership,
    question: "How do you typically influence others toward a goal or perspective?",
    options: [
      "By clearly articulating the reasoning and benefits",
      "By demonstrating enthusiasm and conviction",
      "By listening to concerns and finding common ground",
      "By setting an example through my own actions",
      "By emphasizing shared values and principles"
    ],
    allowCustomResponse: true,
    weight: 0.8
  },
  {
    id: 48,
    category: QuestionCategory.Leadership,
    question: "When in a leadership role, how do you handle disagreement or dissenting views?",
    options: [
      "I actively seek out diverse perspectives to test my thinking",
      "I listen carefully and integrate valid points into the approach",
      "I encourage open debate to find the best solution",
      "I appreciate the input but make the final decision myself",
      "I look for common ground and areas of consensus"
    ],
    allowCustomResponse: true,
    weight: 0.9
  },
  {
    id: 49,
    category: QuestionCategory.Leadership,
    question: "How comfortable are you with taking charge in group situations?",
    options: [
      "Very comfortable – I naturally step into leadership roles",
      "Comfortable when I have expertise or feel responsible",
      "It depends on the context and the needs of the group",
      "I prefer to influence from within rather than leading formally",
      "I'm more comfortable supporting a capable leader"
    ],
    allowCustomResponse: true,
    weight: 0.8
  },
  {
    id: 50,
    category: QuestionCategory.Leadership,
    question: "How do you typically respond when things go wrong under your leadership?",
    options: [
      "I take full responsibility and focus on solutions",
      "I analyze what happened to prevent similar issues",
      "I engage the team in problem-solving together",
      "I acknowledge the issue while maintaining morale",
      "I evaluate whether adjustments in approach are needed"
    ],
    allowCustomResponse: true,
    weight: 0.9
  }
];

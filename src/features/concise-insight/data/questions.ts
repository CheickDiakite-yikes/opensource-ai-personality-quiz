
import { ConciseInsightQuestion } from "../types";

export const conciseInsightQuestions: ConciseInsightQuestion[] = [
  // Core Traits Questions (5 questions)
  {
    id: "core-1",
    category: "core_traits",
    question: "When faced with a major life decision, which best describes your approach?",
    options: [
      "I methodically analyze all options and potential outcomes before deciding",
      "I consider how the decision will affect my relationships and emotional well-being",
      "I trust my intuition and inner wisdom to guide me to the right choice",
      "I weigh the practical implications and immediate benefits of each option"
    ],
    weight: 1.2
  },
  {
    id: "core-2",
    category: "core_traits",
    question: "How do you typically respond to unexpected change?",
    options: [
      "I quickly adapt my plans and find new opportunities in the situation",
      "I resist the change initially but eventually adjust my approach",
      "I analyze how the change impacts my goals and develop a new strategy",
      "I seek support from others to help me navigate through the transition"
    ]
  },
  {
    id: "core-3",
    category: "core_traits",
    question: "Which of these activities would you find most energizing?",
    options: [
      "Engaging in a deep philosophical conversation with a small group",
      "Attending a social gathering with many opportunities to meet new people",
      "Working independently on a creative project that expresses your ideas",
      "Solving a complex problem that requires focused analytical thinking"
    ],
    weight: 1.1
  },
  {
    id: "core-4",
    category: "core_traits",
    question: "When you achieve success, what typically matters most to you?",
    options: [
      "Recognition from others and external validation of my accomplishment",
      "The personal satisfaction of knowing I've reached my own standards",
      "How my success contributes to or benefits others around me",
      "The practical rewards or new opportunities that result from it"
    ]
  },
  {
    id: "core-5",
    category: "core_traits",
    question: "Which statement most accurately reflects how you view yourself?",
    options: [
      "I'm a practical person who values efficiency and tangible results",
      "I'm a thoughtful person who considers multiple perspectives deeply",
      "I'm a passionate person driven by core values and authentic expression",
      "I'm a strategic person who plans carefully for future possibilities"
    ]
  },
  
  // Emotional Intelligence Questions (5 questions)
  {
    id: "emotional-1",
    category: "emotional",
    question: "When you experience strong emotions, what typically happens?",
    options: [
      "I'm immediately aware of what I'm feeling and why it's happening",
      "I often need time to process and understand what I'm truly feeling",
      "I tend to intellectualize or rationalize my emotions rather than feeling them fully",
      "I'm very expressive and others can easily tell what I'm feeling"
    ],
    weight: 1.2
  },
  {
    id: "emotional-2",
    category: "emotional",
    question: "How accurately can you typically predict how your words or actions will make others feel?",
    options: [
      "Very accurately - I have a natural sense for how others will respond emotionally",
      "Quite accurately for people I know well, less so with strangers or acquaintances",
      "Sometimes accurately, but people's emotional responses often surprise me",
      "I find it challenging to predict emotional responses and focus more on logical impacts"
    ],
    weight: 1.1
  },
  {
    id: "emotional-3",
    category: "emotional",
    question: "When someone shares a difficult personal experience with you, your most natural response is to:",
    options: [
      "Listen attentively and validate their feelings without offering solutions",
      "Ask questions to better understand the situation and how they feel",
      "Share a similar experience from your life to show you understand",
      "Offer practical advice or solutions to help resolve their situation"
    ]
  },
  {
    id: "emotional-4",
    category: "emotional",
    question: "After a significant argument or conflict, you typically:",
    options: [
      "Need time alone to process my feelings before addressing the situation",
      "Want to resolve things immediately and clear the air",
      "Analyze what went wrong and how to prevent similar conflicts",
      "Focus on rebuilding the relationship regardless of who was right"
    ]
  },
  {
    id: "emotional-5",
    category: "emotional",
    question: "Which best describes how you handle your emotions during a crisis?",
    options: [
      "I stay calm and controlled, setting aside emotions to deal with later",
      "I use my emotional awareness to guide intuitive decision-making",
      "I allow myself to feel while still taking necessary action",
      "I focus on supporting others emotionally while managing the situation"
    ]
  },
  
  // Cognitive Patterns Questions (5 questions)
  {
    id: "cognitive-1",
    category: "cognitive",
    question: "When learning something new, you prefer:",
    options: [
      "Understanding the theoretical principles and conceptual framework first",
      "Jumping in and learning through hands-on experience and experimentation",
      "Following structured, step-by-step instructions and demonstrations",
      "Discussing the topic with others to understand different perspectives"
    ]
  },
  {
    id: "cognitive-2",
    category: "cognitive",
    question: "When solving complex problems, you typically:",
    options: [
      "Break the problem down into smaller, manageable parts to analyze",
      "Look for patterns and connections to similar situations you've encountered",
      "Explore multiple creative approaches before settling on the best solution",
      "Consider how the problem affects people and relationships involved"
    ],
    weight: 1.1
  },
  {
    id: "cognitive-3",
    category: "cognitive",
    question: "Which best describes how you make important decisions?",
    options: [
      "I weigh all available evidence and use logical analysis to determine the best choice",
      "I consider my core values and choose what feels most authentic and meaningful",
      "I evaluate the practical outcomes and choose what will work best in reality",
      "I consider the impact on people involved and choose what creates most harmony"
    ],
    weight: 1.2
  },
  {
    id: "cognitive-4",
    category: "cognitive",
    question: "When planning a project, you prefer to:",
    options: [
      "Create a detailed plan with specific milestones before beginning work",
      "Start with a general direction and adapt the approach as you progress",
      "Focus on the end goal and work backward to determine necessary steps",
      "Ensure everyone involved has input and agrees with the approach"
    ]
  },
  {
    id: "cognitive-5",
    category: "cognitive",
    question: "When receiving constructive criticism, you typically:",
    options: [
      "Analyze it objectively for validity and useful insights",
      "Feel emotional initially but later consider its value",
      "See it as an opportunity for growth and self-improvement",
      "Consider the relationship with the person giving feedback and their intent"
    ]
  },
  
  // Social Dynamics Questions (5 questions)
  {
    id: "social-1",
    category: "social",
    question: "In group settings, you most often find yourself:",
    options: [
      "Naturally taking charge and directing the group's activities or discussion",
      "Bringing people together and facilitating connections between others",
      "Contributing ideas and perspectives while letting others lead",
      "Observing and analyzing group dynamics before participating fully"
    ]
  },
  {
    id: "social-2",
    category: "social",
    question: "When someone disagrees with you on an important topic, you typically:",
    options: [
      "Engage in debate, presenting logical arguments for your position",
      "Try to understand their perspective and find common ground",
      "Consider whether your position needs refining based on their input",
      "Focus on maintaining the relationship regardless of the disagreement"
    ],
    weight: 1.1
  },
  {
    id: "social-3",
    category: "social",
    question: "Which best describes your approach to social boundaries?",
    options: [
      "I have clear boundaries and communicate them directly to others",
      "My boundaries are flexible and depend on the specific relationship",
      "I sometimes struggle to establish boundaries, especially with close relationships",
      "I prioritize others' needs and may adjust my boundaries accordingly"
    ]
  },
  {
    id: "social-4",
    category: "social",
    question: "In your closest relationships, which matters most to you?",
    options: [
      "Deep, authentic connection and emotional intimacy",
      "Mutual respect and appreciation for each other's autonomy",
      "Practical support and reliability through life's challenges",
      "Intellectual stimulation and meaningful conversations"
    ],
    weight: 1.2
  },
  {
    id: "social-5",
    category: "social",
    question: "How do you typically respond when someone comes to you with a problem?",
    options: [
      "Listen and ask questions to help them discover their own solution",
      "Immediately think of solutions and practical advice to offer",
      "Share my own similar experiences to normalize what they're going through",
      "Focus on providing emotional support and validation"
    ]
  },
  
  // Values and Motivations Questions (5 questions)
  {
    id: "values-1",
    category: "values",
    question: "Which of these most strongly drives your major life decisions?",
    options: [
      "Creating meaningful impact and contributing to something larger than myself",
      "Achieving excellence and recognition in my chosen pursuits",
      "Building strong relationships and deep connections with others",
      "Gaining freedom and autonomy to chart my own course"
    ],
    weight: 1.3
  },
  {
    id: "values-2",
    category: "values",
    question: "When you feel most fulfilled and purposeful, you are likely:",
    options: [
      "Mastering a challenging skill or subject through focused effort",
      "Helping others overcome obstacles or improve their lives",
      "Creating or building something innovative or unique",
      "Experiencing deep connection and authentic exchange with others"
    ],
    weight: 1.2
  },
  {
    id: "values-3",
    category: "values",
    question: "Which statement resonates most strongly with your core values?",
    options: [
      "Living authentically according to my inner truth is most important",
      "Contributing to others' wellbeing and building community matters most",
      "Continual growth and the pursuit of excellence guide my choices",
      "Maintaining independence and self-determination is essential"
    ],
    weight: 1.1
  },
  {
    id: "values-4",
    category: "values",
    question: "What type of recognition or achievement would feel most meaningful to you?",
    options: [
      "Knowing my work made a positive difference in others' lives",
      "Receiving acknowledgment for my unique creativity or innovation",
      "Being respected for my expertise and mastery in my field",
      "Successfully building something lasting that reflects my values"
    ]
  },
  {
    id: "values-5",
    category: "values",
    question: "When considering your future, which is most important to you?",
    options: [
      "Having financial security and material comfort",
      "Finding purpose and meaning in my daily activities",
      "Building and maintaining deep, authentic relationships",
      "Having freedom and autonomy to make my own choices"
    ]
  }
];

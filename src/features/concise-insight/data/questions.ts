
import { ConciseInsightQuestion } from "../types";

export const conciseInsightQuestions: ConciseInsightQuestion[] = [
  // Core Traits Questions (5 questions)
  {
    id: "core-1",
    category: "core_traits",
    question: "When faced with a major life decision, how do you typically approach it?",
    options: [
      "I methodically analyze all options and consider potential outcomes before deciding",
      "I trust my intuition and inner wisdom to guide me to the right choice",
      "I seek advice from multiple people and follow what most suggest", // less optimal - external validation dependency
      "I make quick decisions to avoid overthinking and stress",
      "I consider how the decision aligns with my values and long-term goals",
      "I tend to postpone difficult decisions until absolutely necessary" // less optimal - avoidance
    ],
    weight: 1.2
  },
  {
    id: "core-2",
    category: "core_traits",
    question: "How do you typically respond to unexpected changes in your plans?",
    options: [
      "I quickly adapt and look for new opportunities in the situation",
      "I take time to process before developing a new approach",
      "I try to force things back to the original plan", // less optimal - rigidity
      "I analyze the situation and create multiple backup strategies",
      "I reach out to others for support and alternative perspectives",
      "I tend to feel overwhelmed and struggle to move forward" // less optimal - emotional flooding
    ]
  },
  {
    id: "core-3",
    category: "core_traits",
    question: "Which type of activities do you find most energizing?",
    options: [
      "Deep, focused work on complex problems that challenge my mind",
      "Creative projects that allow for self-expression",
      "High-pressure situations with tight deadlines", // less optimal - stress seeking
      "Collaborative projects with shared goals",
      "Learning and exploring new subjects or skills",
      "Activities that don't require much mental effort or interaction" // less optimal - avoidance of growth
    ],
    weight: 1.1
  },
  {
    id: "core-4",
    category: "core_traits",
    question: "When you achieve success, what typically matters most to you?",
    options: [
      "The personal satisfaction of meeting my own standards",
      "The positive impact my success has on others",
      "Getting recognition and praise from others", // less optimal - external validation
      "The practical rewards and opportunities it creates",
      "The knowledge and growth gained from the experience",
      "Proving wrong those who doubted me" // less optimal - validation through spite
    ]
  },
  {
    id: "core-5",
    category: "core_traits",
    question: "Which statement most accurately reflects your self-perception?",
    options: [
      "I'm adaptable and can handle most situations effectively",
      "I'm growth-oriented and constantly working on self-improvement",
      "I'm highly dependent on others' approval", // less optimal - external validation
      "I'm authentic and true to my values regardless of circumstances",
      "I'm practical and focused on tangible results",
      "I'm often unsure of my capabilities and direction" // less optimal - low self-efficacy
    ]
  },
  
  // Emotional Intelligence Questions (5 questions)
  {
    id: "emotional-1",
    category: "emotional",
    question: "How do you typically handle strong emotions?",
    options: [
      "I acknowledge and process them while maintaining perspective",
      "I express them appropriately and seek understanding",
      "I try to suppress or ignore them", // less optimal - avoidance
      "I analyze them logically to understand their source",
      "I use them as motivation for positive action",
      "I let them control my reactions and behavior" // less optimal - poor regulation
    ],
    weight: 1.2
  },
  {
    id: "emotional-2",
    category: "emotional",
    question: "When others share their problems with you, how do you usually respond?",
    options: [
      "I listen actively and validate their feelings",
      "I help them explore possible solutions",
      "I quickly offer advice to fix their situation", // less optimal - rushing to solutions
      "I share similar experiences to show understanding",
      "I ask questions to better understand their perspective",
      "I feel uncomfortable and try to change the subject" // less optimal - avoidance
    ],
    weight: 1.1
  },
  {
    id: "emotional-3",
    category: "emotional",
    question: "How do you typically handle conflicts in relationships?",
    options: [
      "I address issues directly with empathy and openness",
      "I seek to understand all perspectives before responding",
      "I avoid confrontation until tensions explode", // less optimal - avoidance
      "I focus on finding practical solutions",
      "I prioritize maintaining harmony while working through issues",
      "I defend my position and expect others to adjust" // less optimal - rigidity
    ]
  },
  {
    id: "emotional-4",
    category: "emotional",
    question: "When receiving criticism, what's your typical first reaction?",
    options: [
      "I listen openly and consider how I might grow from it",
      "I thank them and reflect on the feedback carefully",
      "I become defensive and justify my actions", // less optimal - defensiveness
      "I analyze it objectively for valid points",
      "I ask questions to better understand their perspective",
      "I take it personally and feel deeply hurt" // less optimal - oversensitivity
    ]
  },
  {
    id: "emotional-5",
    category: "emotional",
    question: "How do you typically support others during their difficult times?",
    options: [
      "I offer emotional support while respecting their space",
      "I help them develop practical coping strategies",
      "I try to fix their problems for them", // less optimal - overstepping
      "I share my own experiences and what worked for me",
      "I create a safe space for them to process emotions",
      "I distance myself to avoid getting emotionally involved" // less optimal - avoidance
    ]
  },

  // Cognitive Patterns Questions (5 questions)
  {
    id: "cognitive-1",
    category: "cognitive",
    question: "When solving complex problems, what's your typical approach?",
    options: [
      "I break them down into smaller, manageable parts",
      "I look for patterns and connections to known solutions",
      "I rush to implement the first solution I think of", // less optimal - impulsivity
      "I collaborate with others to gain different perspectives",
      "I research thoroughly before developing solutions",
      "I tend to feel overwhelmed and procrastinate" // less optimal - avoidance
    ]
  },
  {
    id: "cognitive-2",
    category: "cognitive",
    question: "How do you typically approach learning new skills?",
    options: [
      "I create a structured learning plan with clear goals",
      "I dive in and learn through hands-on experience",
      "I stick to what I already know well", // less optimal - comfort zone
      "I seek guidance from experts and mentors",
      "I combine different learning methods for better understanding",
      "I give up quickly if I don't see immediate progress" // less optimal - low persistence
    ]
  },
  {
    id: "cognitive-3",
    category: "cognitive",
    question: "When faced with a difficult decision, what factors most influence your choice?",
    options: [
      "Long-term consequences and alignment with goals",
      "Impact on myself and others involved",
      "Whatever will please others most", // less optimal - external validation
      "Practical considerations and feasibility",
      "Alignment with my values and principles",
      "Whatever helps me avoid immediate discomfort" // less optimal - short-term thinking
    ]
  },
  {
    id: "cognitive-4",
    category: "cognitive",
    question: "How do you typically organize your thoughts and ideas?",
    options: [
      "I use structured systems and tools to capture and organize them",
      "I visualize connections and create mind maps",
      "I keep everything in my head", // less optimal - poor organization
      "I discuss them with others to clarify and refine",
      "I write them down and revisit them regularly",
      "I often feel scattered and overwhelmed by them" // less optimal - mental chaos
    ]
  },
  {
    id: "cognitive-5",
    category: "cognitive",
    question: "When your beliefs are challenged, how do you typically respond?",
    options: [
      "I consider alternative perspectives with an open mind",
      "I engage in respectful dialogue to understand differences",
      "I defend my beliefs without considering alternatives", // less optimal - closed-mindedness
      "I evaluate evidence on both sides objectively",
      "I reflect on why I hold these beliefs",
      "I avoid discussions that challenge my viewpoints" // less optimal - avoidance
    ]
  },

  // Social Dynamics Questions (5 questions)
  {
    id: "social-1",
    category: "social",
    question: "In group settings, what role do you typically take on?",
    options: [
      "I facilitate collaboration and help the group achieve its goals",
      "I contribute ideas while supporting others' input",
      "I try to dominate and control the direction", // less optimal - controlling
      "I observe and provide thoughtful insights when needed",
      "I help maintain positive group dynamics",
      "I stay quiet and avoid drawing attention" // less optimal - withdrawal
    ]
  },
  {
    id: "social-2",
    category: "social",
    question: "How do you typically handle social boundaries?",
    options: [
      "I set clear boundaries while respecting others'",
      "I adapt boundaries based on the relationship and context",
      "I have difficulty saying no to others", // less optimal - poor boundaries
      "I maintain consistent boundaries in all relationships",
      "I communicate boundaries respectfully and directly",
      "I keep strong walls up to avoid getting hurt" // less optimal - overcautious
    ]
  },
  {
    id: "social-3",
    category: "social",
    question: "When building relationships, what do you value most?",
    options: [
      "Authentic connection and mutual understanding",
      "Trust and reliability",
      "What others can do for me", // less optimal - transactional
      "Shared values and interests",
      "Growth and learning from each other",
      "Avoiding potential rejection or conflict" // less optimal - fear-based
    ]
  },
  {
    id: "social-4",
    category: "social",
    question: "How do you typically navigate disagreements?",
    options: [
      "I seek to understand different perspectives and find common ground",
      "I focus on solutions that benefit everyone involved",
      "I insist on my way until others agree", // less optimal - controlling
      "I use logic and facts to support my position",
      "I maintain respect while working through differences",
      "I withdraw to avoid confrontation" // less optimal - avoidance
    ]
  },
  {
    id: "social-5",
    category: "social",
    question: "How do you typically respond to social support?",
    options: [
      "I accept it gratefully and reciprocate when possible",
      "I appreciate it while maintaining healthy boundaries",
      "I become overly dependent on it", // less optimal - dependency
      "I evaluate it carefully before accepting",
      "I use it as motivation to grow stronger",
      "I reject it to maintain independence" // less optimal - isolation
    ]
  },

  // Values and Motivations Questions (5 questions)
  {
    id: "values-1",
    category: "values",
    question: "What primarily drives your major life decisions?",
    options: [
      "Alignment with my core values and principles",
      "Potential for personal growth and development",
      "Fear of missing out or being left behind", // less optimal - FOMO
      "Impact on others and the greater good",
      "Pursuit of meaningful goals and purpose",
      "Avoiding potential failure or criticism" // less optimal - fear-based
    ],
    weight: 1.3
  },
  {
    id: "values-2",
    category: "values",
    question: "What gives you the strongest sense of fulfillment?",
    options: [
      "Creating positive impact in others' lives",
      "Achieving personal growth and mastery",
      "Receiving recognition and praise", // less optimal - external validation
      "Contributing to meaningful causes",
      "Building deep, authentic relationships",
      "Accumulating status and material success" // less optimal - materialism
    ],
    weight: 1.2
  },
  {
    id: "values-3",
    category: "values",
    question: "How do you typically view challenges and obstacles?",
    options: [
      "As opportunities for growth and learning",
      "As problems to be solved systematically",
      "As personal attacks or unfair situations", // less optimal - victim mentality
      "As tests of character and resilience",
      "As chances to demonstrate capabilities",
      "As threats to be avoided when possible" // less optimal - avoidance
    ],
    weight: 1.1
  },
  {
    id: "values-4",
    category: "values",
    question: "What type of legacy do you most want to leave?",
    options: [
      "Positive impact on others' lives and well-being",
      "Innovations or improvements that benefit society",
      "Wealth and status for my family", // less optimal - materialistic
      "Knowledge and wisdom shared with others",
      "Inspiration for future generations",
      "Personal comfort and security" // less optimal - self-focused
    ]
  },
  {
    id: "values-5",
    category: "values",
    question: "What most strongly influences your sense of self-worth?",
    options: [
      "Living according to my values and principles",
      "Personal growth and continuous improvement",
      "Others' opinions and approval", // less optimal - external validation
      "Achieving meaningful goals",
      "Making positive contributions to others",
      "Comparing myself to others' success" // less optimal - social comparison
    ]
  }
];

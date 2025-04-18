
import { AssessmentQuestion, QuestionCategory } from "../types";

// Complete set of 100 questions for the Deep Insight assessment
export const deepInsightQuestions: AssessmentQuestion[] = [
  // Personality Traits (1-10)
  {
    id: "di_1",
    category: QuestionCategory.PersonalityTraits,
    question: "When making important life decisions, I primarily rely on:",
    options: [
      "My careful analysis of pros and cons",
      "My intuition and emotional response to each possibility",
      "Input from trusted friends and family",
      "Past experiences and what has worked before",
      "A combination of logical analysis and intuitive feeling"
    ],
    weight: 1.0
  },
  {
    id: "di_2",
    category: QuestionCategory.PersonalityTraits,
    question: "When I encounter a setback or failure, my first response is often to:",
    options: [
      "Immediately look for solutions and next steps",
      "I seek to understand what went wrong before proceeding",
      "Seek support from others to process my feelings",
      "Take time alone to reflect and recharge",
      "Focus on what I can learn from the experience"
    ],
    weight: 0.9
  },
  {
    id: "di_3",
    category: QuestionCategory.PersonalityTraits,
    question: "In group discussions or debates, I typically:",
    options: [
      "Take charge and guide the conversation",
      "I carefully analyze all perspectives before forming my position",
      "Focus on maintaining harmony and positive relationships",
      "Offer creative ideas and possibilities",
      "Listen more than I speak, processing internally"
    ],
    weight: 0.8
  },
  {
    id: "di_4", 
    category: QuestionCategory.PersonalityTraits,
    question: "My approach to social activities is best described as:",
    options: [
      "Highly social - I seek out and enjoy many social interactions",
      "Selective - I prefer deep conversations with a few close friends",
      "I balance social and solitary activities based on my energy level",
      "Context-dependent - my social preferences vary by situation",
      "Primarily introverted - I prefer solitary activities most of the time"
    ],
    weight: 0.7
  },
  {
    id: "di_5",
    category: QuestionCategory.PersonalityTraits,
    question: "When receiving criticism, I typically:",
    options: [
      "Welcome it as an opportunity for growth and improvement",
      "I carefully evaluate whether the criticism is valid before reacting",
      "Feel hurt initially but reflect on it later",
      "Defend my position and explain my reasoning",
      "Worry about what others think of me"
    ],
    weight: 0.9
  },
  {
    id: "di_6",
    category: QuestionCategory.PersonalityTraits,
    question: "My living and working spaces are usually:",
    options: [
      "Very organized with everything in its proper place",
      "Generally tidy with occasional clutter",
      "Organized chaos - messy but I know where things are",
      "Varies greatly depending on my current focus and energy",
      "Minimalist with only essential items"
    ],
    weight: 0.6
  },
  {
    id: "di_7",
    category: QuestionCategory.PersonalityTraits,
    question: "When planning trips or events, I tend to:",
    options: [
      "Create detailed itineraries and plans",
      "Establish a general framework with room for spontaneity",
      "Focus on the social aspects and who will be there",
      "Go with the flow and decide things last minute",
      "Let others handle most of the planning"
    ],
    weight: 0.7
  },
  {
    id: "di_8",
    category: QuestionCategory.PersonalityTraits,
    question: "In terms of risk-taking, I am:",
    options: [
      "Very cautious, preferring security over opportunity",
      "Calculated risk-taker after thorough assessment",
      "Moderately comfortable with some uncertainty",
      "Quite comfortable with risk in areas I know well",
      "Highly comfortable with risk and uncertainty"
    ],
    weight: 0.8
  },
  {
    id: "di_9",
    category: QuestionCategory.PersonalityTraits,
    question: "When it comes to rules and traditions, I generally:",
    options: [
      "Value and adhere to established norms and procedures",
      "Respect them but question when they seem ineffective",
      "Evaluate each on its own merit",
      "Often challenge them if they limit creativity or progress",
      "Prefer to create my own path independent of conventional rules"
    ],
    weight: 0.8
  },
  {
    id: "di_10",
    category: QuestionCategory.PersonalityTraits,
    question: "In terms of future planning, I typically:",
    options: [
      "Have clear, specific long-term goals I actively work toward",
      "Have general directions I prefer with flexible pathways",
      "Focus more on present experiences than future outcomes",
      "Adapt my plans frequently based on new opportunities",
      "Avoid rigid planning in favor of natural development"
    ],
    weight: 0.7
  },
  
  // Emotional Intelligence (11-20)
  {
    id: "di_11",
    category: QuestionCategory.EmotionalIntelligence,
    question: "When someone shares their problems with me, I most often:",
    options: [
      "Offer solutions and advice to help fix the situation",
      "I share similar experiences to build connection and understanding",
      "Listen attentively without immediately offering solutions",
      "Ask questions to better understand their feelings",
      "Reflect back what I hear to confirm my understanding"
    ],
    weight: 0.9
  },
  {
    id: "di_12",
    category: QuestionCategory.EmotionalIntelligence,
    question: "When someone reacts to a situation differently than I would:",
    options: [
      "I try to understand why their perspective differs from mine",
      "I look for common ground despite our different reactions",
      "I become curious about what their reaction reveals about them",
      "I consider whether my own reaction needs reassessment",
      "I accept that different people naturally have different responses"
    ],
    weight: 0.8
  },
  {
    id: "di_13",
    category: QuestionCategory.EmotionalIntelligence,
    question: "My preferred methods for processing difficult emotions include:",
    options: [
      "Talking through them with someone I trust",
      "Expressive techniques like physical activity or creative outlets",
      "Quiet reflection, journaling, or meditation",
      "Logical analysis of the situation and my reactions",
      "Distraction until the intensity diminishes"
    ],
    weight: 0.7
  },
  {
    id: "di_14",
    category: QuestionCategory.EmotionalIntelligence,
    question: "When addressing a disagreement with someone, I prioritize:",
    options: [
      "Getting all relevant facts and perspectives on the table",
      "I focus on finding areas of agreement before addressing differences",
      "Understanding the emotional needs behind each position",
      "Maintaining or repairing the relationship",
      "Finding a fair compromise or solution"
    ],
    weight: 0.8
  },
  {
    id: "di_15",
    category: QuestionCategory.EmotionalIntelligence,
    question: "When someone close to me achieves something significant, I typically feel:",
    options: [
      "Pure joy and pride in their accomplishment",
      "Appreciation of their success while recognizing the work behind it",
      "Happy for them while also reflecting on my own goals",
      "Inspired to pursue my own achievements",
      "Complex emotions that might include both happiness and envy"
    ],
    weight: 0.7
  },
  {
    id: "di_16",
    category: QuestionCategory.EmotionalIntelligence,
    question: "In emotionally challenging situations, I'm most aware of:",
    options: [
      "My physical sensations (heart rate, tension, etc.)",
      "My thought patterns and internal narratives",
      "The specific emotions I'm experiencing",
      "How others are responding to the situation",
      "The broader context and what triggered the emotions"
    ],
    weight: 0.8
  },
  {
    id: "di_17",
    category: QuestionCategory.EmotionalIntelligence,
    question: "When I notice someone is upset but not saying anything, I typically:",
    options: [
      "Give them space, respecting their privacy",
      "Gently ask if they'd like to talk about what's bothering them",
      "Try to lighten the mood to help them feel better",
      "Share an observation about what I've noticed",
      "Continue as normal unless they bring it up"
    ],
    weight: 0.9
  },
  {
    id: "di_18",
    category: QuestionCategory.EmotionalIntelligence,
    question: "My ability to recognize my own emotional patterns is:",
    options: [
      "Very strong - I quickly identify and understand my emotions",
      "Good for major emotions but sometimes miss subtler feelings",
      "Variable depending on the situation and my stress level",
      "Better in retrospect than in the moment",
      "Something I'm actively working to develop"
    ],
    weight: 1.0
  },
  {
    id: "di_19",
    category: QuestionCategory.EmotionalIntelligence,
    question: "When making decisions, the role of emotions in my process is:",
    options: [
      "Central - I trust my emotional responses as important signals",
      "One factor among many that I consciously consider",
      "A reality check after logical analysis",
      "Something I try to minimize to stay objective",
      "Depends on the type of decision I'm making"
    ],
    weight: 0.8
  },
  {
    id: "di_20",
    category: QuestionCategory.EmotionalIntelligence,
    question: "After an intense emotional experience, I typically:",
    options: [
      "Reflect on what I learned from the experience",
      "Talk through it with someone to gain perspective",
      "Take time alone to process and recover",
      "Move on quickly to other activities",
      "Analyze what triggered the emotional response"
    ],
    weight: 0.7
  },
  
  // Cognitive Patterns (21-30)
  {
    id: "di_21",
    category: QuestionCategory.CognitivePatterns,
    question: "When facing a complex problem, my first approach is usually to:",
    options: [
      "Break it down into smaller, manageable components",
      "Identify the core principles or patterns at work",
      "Gather as much information as possible before proceeding",
      "Consider similar problems I've encountered before",
      "Explore multiple perspectives or potential frameworks"
    ],
    weight: 0.9
  },
  {
    id: "di_22",
    category: QuestionCategory.CognitivePatterns,
    question: "When learning something new and complex, I prefer:",
    options: [
      "Understanding the fundamental principles first",
      "Diving in with practical hands-on experience",
      "Seeing examples and case studies",
      "Learning from an expert who can guide me",
      "Moving between theory and practice iteratively"
    ],
    weight: 0.8
  },
  {
    id: "di_23",
    category: QuestionCategory.CognitivePatterns,
    question: "In discussions about abstract concepts, I tend to:",
    options: [
      "Enjoy exploring theoretical possibilities",
      "Look for practical applications and relevance",
      "Connect ideas across different domains or fields",
      "Focus on logical consistency and rigor",
      "Consider how different perspectives might view the concept"
    ],
    weight: 0.7
  },
  {
    id: "di_24",
    category: QuestionCategory.CognitivePatterns,
    question: "When my beliefs are challenged by new information, I typically:",
    options: [
      "Examine both my beliefs and the new information carefully",
      "Feel initial resistance but then consider the evidence",
      "Look for ways to integrate the new perspective with my existing views",
      "Seek additional information from multiple sources",
      "Consider what biases might be influencing either position"
    ],
    weight: 1.0
  },
  {
    id: "di_25",
    category: QuestionCategory.CognitivePatterns,
    question: "My approach to uncertainty and ambiguity is best described as:",
    options: [
      "I'm comfortable exploring without clear answers",
      "I try to establish some structure or framework to navigate it",
      "I focus on what is known while acknowledging what isn't",
      "I find it intellectually stimulating but emotionally challenging",
      "I prefer to reduce ambiguity by gathering more information"
    ],
    weight: 0.9
  },
  {
    id: "di_26",
    category: QuestionCategory.CognitivePatterns,
    question: "When analyzing information, I'm most attentive to:",
    options: [
      "Patterns, trends, and underlying principles",
      "Specific details and concrete facts",
      "Potential implications and future scenarios",
      "How different pieces of information relate to each other",
      "Any inconsistencies or gaps in the information"
    ],
    weight: 0.8
  },
  {
    id: "di_27",
    category: QuestionCategory.CognitivePatterns,
    question: "In my thinking, I tend to be most interested in:",
    options: [
      "Why things are the way they are (underlying causes)",
      "How things work in practical terms",
      "What possibilities exist beyond current reality",
      "How ideas connect across different domains",
      "The logical structure and consistency of ideas"
    ],
    weight: 0.7
  },
  {
    id: "di_28",
    category: QuestionCategory.CognitivePatterns,
    question: "When engaging with complex subjects, I prefer to:",
    options: [
      "Focus deeply on one aspect before moving to others",
      "Get a broad overview before exploring specifics",
      "Move between different aspects as connections emerge",
      "Start with concrete examples and move toward principles",
      "Relate new information to what I already understand"
    ],
    weight: 0.8
  },
  {
    id: "di_29",
    category: QuestionCategory.CognitivePatterns,
    question: "When considering solutions to problems, I typically:",
    options: [
      "Generate many possibilities before evaluating them",
      "Look for the most direct and efficient approach",
      "Consider what has worked in similar situations",
      "Think about potential consequences of each option",
      "Identify principles that should guide the solution"
    ],
    weight: 0.9
  },
  {
    id: "di_30",
    category: QuestionCategory.CognitivePatterns,
    question: "My thinking is most engaged when dealing with:",
    options: [
      "Abstract theoretical concepts and ideas",
      "Practical problems with tangible outcomes",
      "Understanding people and social dynamics",
      "Systems and how their components interact",
      "Creating or designing something new"
    ],
    weight: 0.7
  },
  
  // Value Systems (31-40)
  {
    id: "di_31",
    category: QuestionCategory.ValueSystems,
    question: "Which of these principles most strongly guides your ethical decisions?",
    options: [
      "Preventing harm and minimizing suffering",
      "Fairness and treating everyone equally",
      "Loyalty to those close to me",
      "Respect for legitimate authority and order",
      "Maintaining purity and sanctity of important things"
    ],
    weight: 1.0
  },
  {
    id: "di_32",
    category: QuestionCategory.ValueSystems,
    question: "When faced with an ethical dilemma, I'm most likely to consider:",
    options: [
      "The consequences of each possible action",
      "Universal principles that should apply to everyone",
      "What a virtuous person would do in this situation",
      "My duties and responsibilities in this context",
      "What builds the best relationships and community"
    ],
    weight: 0.9
  },
  {
    id: "di_33",
    category: QuestionCategory.ValueSystems,
    question: "Which of these is most essential for a good life?",
    options: [
      "Authentic self-expression and personal fulfillment",
      "Meaningful relationships and community",
      "Achievement and making a positive impact",
      "Wisdom and personal growth",
      "Security and peace of mind"
    ],
    weight: 0.8
  },
  {
    id: "di_34",
    category: QuestionCategory.ValueSystems,
    question: "In terms of how society should be organized, I tend to value:",
    options: [
      "Individual liberty and personal freedom",
      "Equality and social justice",
      "Order, security, and stability",
      "Tradition and respect for established practices",
      "Progress and innovation"
    ],
    weight: 0.9
  },
  {
    id: "di_35",
    category: QuestionCategory.ValueSystems,
    question: "I believe that wealth and resources should primarily be distributed based on:",
    options: [
      "Individual effort and merit",
      "Need and ensuring everyone has enough",
      "A combination of merit and addressing basic needs",
      "Equal shares to all members of society",
      "Whatever emerges from free choice and exchange"
    ],
    weight: 0.7
  },
  {
    id: "di_36",
    category: QuestionCategory.ValueSystems,
    question: "The purpose of education should mainly be to:",
    options: [
      "Develop critical thinking and intellectual capabilities",
      "Prepare people for productive careers",
      "Foster character development and ethical values",
      "Promote social cohesion and citizenship",
      "Enable self-discovery and personal fulfillment"
    ],
    weight: 0.8
  },
  {
    id: "di_37",
    category: QuestionCategory.ValueSystems,
    question: "When it comes to traditions and social norms, I generally:",
    options: [
      "Value them as sources of wisdom and stability",
      "Question them and keep only what serves current needs",
      "Respect them while allowing for gradual evolution",
      "Focus on creating new norms better suited to our times",
      "See them as often limiting personal freedom"
    ],
    weight: 0.7
  },
  {
    id: "di_38",
    category: QuestionCategory.ValueSystems,
    question: "My approach to nature and the environment is based on:",
    options: [
      "Humans as stewards responsible for protecting nature",
      "Balancing human needs with environmental sustainability",
      "Nature as having intrinsic value beyond human use",
      "Technological solutions to environmental challenges",
      "Prioritizing immediate human wellbeing and prosperity"
    ],
    weight: 0.8
  },
  {
    id: "di_39",
    category: QuestionCategory.ValueSystems,
    question: "Regarding personal identity, I believe it is:",
    options: [
      "Primarily self-defined and a matter of personal choice",
      "Shaped by cultural, family, and community contexts",
      "A combination of innate qualities and personal development",
      "Defined largely by our actions and commitments",
      "An ongoing process of growth and discovery"
    ],
    weight: 0.7
  },
  {
    id: "di_40",
    category: QuestionCategory.ValueSystems,
    question: "I think the ideal relationship between the individual and society is one where:",
    options: [
      "Individual rights and freedoms are paramount",
      "Everyone contributes to the common good",
      "There's a balance between individual liberty and social responsibility",
      "Strong communities support individual flourishing",
      "Diverse individuals and groups coexist with mutual respect"
    ],
    weight: 0.9
  },
  
  // Motivation (41-50)
  {
    id: "di_41",
    category: QuestionCategory.Motivation,
    question: "What most strongly motivates you to pursue challenging goals?",
    options: [
      "Personal growth and self-improvement",
      "Recognition and external validation",
      "The intrinsic enjoyment of the process itself",
      "Making a positive difference for others",
      "Achieving mastery and excellence"
    ],
    weight: 1.0
  },
  {
    id: "di_42",
    category: QuestionCategory.Motivation,
    question: "When I'm at my most productive and engaged, it's usually because:",
    options: [
      "I find the work itself interesting and meaningful",
      "I have clear goals with feedback on my progress",
      "I'm challenged at the right level - not too easy or too hard",
      "I feel connected to others through the work",
      "I can see the positive impact of what I'm doing"
    ],
    weight: 0.9
  },
  {
    id: "di_43",
    category: QuestionCategory.Motivation,
    question: "What typically causes you to lose motivation?",
    options: [
      "Lack of clear purpose or meaning in the activity",
      "Not seeing progress or results from my efforts",
      "Excessive external control or micromanagement",
      "Disconnection from others in the process",
      "Activities that don't use my strengths"
    ],
    weight: 0.8
  },
  {
    id: "di_44",
    category: QuestionCategory.Motivation,
    question: "In terms of rewards and incentives, I'm most motivated by:",
    options: [
      "Autonomy and freedom in how I approach tasks",
      "Recognition of my contributions and achievements",
      "Opportunities to learn and develop new skills",
      "Financial rewards and material benefits",
      "Advancement and increasing responsibility"
    ],
    weight: 0.9
  },
  {
    id: "di_45",
    category: QuestionCategory.Motivation,
    question: "When setting goals for myself, I tend to prioritize:",
    options: [
      "Goals that connect to my deeper values and purpose",
      "Ambitious goals that stretch my capabilities",
      "Clearly defined goals with measurable outcomes",
      "Goals that lead to tangible rewards or recognition",
      "Goals that allow for flexibility and adjustment"
    ],
    weight: 0.8
  },
  {
    id: "di_46",
    category: QuestionCategory.Motivation,
    question: "My commitment to long-term goals is strongest when:",
    options: [
      "They reflect my authentic interests and values",
      "I've publicly committed to them",
      "I can see clear progress along the way",
      "They connect me with others pursuing similar goals",
      "They challenge me to grow and develop"
    ],
    weight: 0.9
  },
  {
    id: "di_47",
    category: QuestionCategory.Motivation,
    question: "The type of feedback that most helps me stay motivated is:",
    options: [
      "Specific information about what I'm doing well",
      "Constructive guidance on how to improve",
      "Recognition of my effort regardless of outcome",
      "Seeing the real-world impact of my work",
      "Comparisons showing my progress over time"
    ],
    weight: 0.7
  },
  {
    id: "di_48",
    category: QuestionCategory.Motivation,
    question: "When faced with a setback or failure, what helps you persist?",
    options: [
      "Focusing on what I can learn from the experience",
      "Reminding myself of my past successes",
      "Breaking down the challenge into smaller steps",
      "Connecting with others who support my efforts",
      "Reconnecting with my purpose and why it matters"
    ],
    weight: 0.9
  },
  {
    id: "di_49",
    category: QuestionCategory.Motivation,
    question: "The work environments where I thrive most are characterized by:",
    options: [
      "Autonomy and freedom to determine my approach",
      "Clear expectations and regular feedback",
      "Collaboration and connection with others",
      "Recognition and appreciation of contributions",
      "Opportunities for growth and advancement"
    ],
    weight: 0.8
  },
  {
    id: "di_50",
    category: QuestionCategory.Motivation,
    question: "My underlying drive to achieve comes primarily from:",
    options: [
      "Desire to reach my full potential",
      "Wanting to be recognized and respected",
      "Enjoyment of mastering challenges",
      "Sense of duty and responsibility",
      "Desire to make a positive difference"
    ],
    weight: 1.0
  },
  
  // Resilience (51-60)
  {
    id: "di_51",
    category: QuestionCategory.Resilience,
    question: "When facing a major setback or crisis, my first response is typically to:",
    options: [
      "Take time to process my emotions before acting",
      "Immediately look for practical solutions",
      "Seek support from others",
      "Analyze what went wrong and why",
      "Find meaning or purpose in the challenge"
    ],
    weight: 0.9
  },
  {
    id: "di_52",
    category: QuestionCategory.Resilience,
    question: "Which resource do you rely on most during difficult times?",
    options: [
      "My inner strength and past experiences overcoming challenges",
      "Close relationships and social support",
      "Practical problem-solving skills",
      "Spiritual beliefs or philosophical perspectives",
      "Self-care practices and stress management techniques"
    ],
    weight: 1.0
  },
  {
    id: "di_53",
    category: QuestionCategory.Resilience,
    question: "When dealing with ongoing stress, I most effectively maintain my wellbeing by:",
    options: [
      "Regular physical activity and attention to bodily needs",
      "Maintaining perspective through mindfulness or reflection",
      "Connecting with supportive people",
      "Finding moments of joy and positive emotions",
      "Focusing on what I can control while accepting what I cannot"
    ],
    weight: 0.8
  },
  {
    id: "di_54",
    category: QuestionCategory.Resilience,
    question: "My ability to adapt to unexpected change is:",
    options: [
      "Very strong - I quickly adjust and find new approaches",
      "Good after initial resistance",
      "Dependent on the type of change involved",
      "Stronger when I have support from others",
      "Something I've developed through past experiences"
    ],
    weight: 0.9
  },
  {
    id: "di_55",
    category: QuestionCategory.Resilience,
    question: "Looking back on difficult experiences, I've typically found that they:",
    options: [
      "Led to significant personal growth and new capabilities",
      "Taught me valuable lessons about life and myself",
      "Showed me who I could really count on",
      "Eventually resolved with time and persistence",
      "Revealed strengths I didn't know I had"
    ],
    weight: 0.7
  },
  {
    id: "di_56",
    category: QuestionCategory.Resilience,
    question: "When my confidence is shaken by failure or criticism, I rebuild it by:",
    options: [
      "Reminding myself of past successes and strengths",
      "Taking on small challenges to regain momentum",
      "Seeking validation and support from people I trust",
      "Reframing the situation to focus on learning",
      "Recommitting to my values and what matters most"
    ],
    weight: 0.8
  },
  {
    id: "di_57",
    category: QuestionCategory.Resilience,
    question: "My approach to uncertainty and unpredictability is to:",
    options: [
      "Focus on what I can control while accepting uncertainty",
      "Create contingency plans for different scenarios",
      "Trust in my ability to handle whatever comes",
      "Find stability through routines and practices",
      "Connect with others facing similar uncertainties"
    ],
    weight: 0.9
  },
  {
    id: "di_58",
    category: QuestionCategory.Resilience,
    question: "When recovering from disappointment or loss, I find it most helpful to:",
    options: [
      "Allow myself to fully experience and express my emotions",
      "Find meaning or silver linings in the experience",
      "Engage in activities that bring joy or fulfillment",
      "Connect with others who can listen and understand",
      "Focus forward on new goals and possibilities"
    ],
    weight: 0.8
  },
  {
    id: "di_59",
    category: QuestionCategory.Resilience,
    question: "The quality that best helps me persevere through long-term challenges is:",
    options: [
      "Determination and mental toughness",
      "Optimism and positive outlook",
      "Flexibility and adaptability",
      "Purpose and meaning in what I'm doing",
      "Social connections and support systems"
    ],
    weight: 0.9
  },
  {
    id: "di_60",
    category: QuestionCategory.Resilience,
    question: "When helping others through difficulties, my approach is typically to:",
    options: [
      "Listen fully without immediately trying to fix things",
      "Share my own relevant experiences",
      "Offer practical help and solutions",
      "Help them find meaning or perspective in the situation",
      "Simply be present and available"
    ],
    weight: 0.7
  },
  
  // Social Interaction (61-70)
  {
    id: "di_61",
    category: QuestionCategory.SocialInteraction,
    question: "In social situations with new people, I typically:",
    options: [
      "Take initiative to introduce myself and start conversations",
      "Find common interests to establish connection",
      "Observe first to understand the social dynamics",
      "Look for one or two people to have deeper conversations",
      "Feel most comfortable when introduced by someone I know"
    ],
    weight: 0.8
  },
  {
    id: "di_62",
    category: QuestionCategory.SocialInteraction,
    question: "In my close relationships, I most value:",
    options: [
      "Deep emotional connection and understanding",
      "Mutual trust and dependability",
      "Stimulating conversation and shared interests",
      "Respect for independence and personal space",
      "Practical support and being there when needed"
    ],
    weight: 0.9
  },
  {
    id: "di_63",
    category: QuestionCategory.SocialInteraction,
    question: "When there's conflict in a relationship, my typical approach is to:",
    options: [
      "Address issues directly but respectfully",
      "Try to understand the other person's perspective first",
      "Look for compromise that meets both people's needs",
      "Take time to process before engaging",
      "Focus on preserving the relationship above winning"
    ],
    weight: 1.0
  },
  {
    id: "di_64",
    category: QuestionCategory.SocialInteraction,
    question: "In groups, I am most often in the role of:",
    options: [
      "Leader or initiator",
      "Mediator or harmonizer",
      "Contributor of ideas",
      "Implementer who gets things done",
      "Observer who offers perspective"
    ],
    weight: 0.7
  },
  {
    id: "di_65",
    category: QuestionCategory.SocialInteraction,
    question: "My approach to giving feedback to others is best described as:",
    options: [
      "Direct and straightforward about what could improve",
      "Balanced between positives and areas for growth",
      "Gentle and supportive with a focus on encouragement",
      "Asking questions to help them reflect",
      "Specific and detailed with practical suggestions"
    ],
    weight: 0.8
  },
  {
    id: "di_66",
    category: QuestionCategory.SocialInteraction,
    question: "What aspect of social interaction do you find most challenging?",
    options: [
      "Small talk and casual conversation",
      "Setting and maintaining boundaries",
      "Understanding unspoken social cues",
      "Developing deep connections beyond acquaintanceship",
      "Managing disagreement or conflict"
    ],
    weight: 0.7
  },
  {
    id: "di_67",
    category: QuestionCategory.SocialInteraction,
    question: "In terms of social energy and preference, I am:",
    options: [
      "Highly energized by social interaction",
      "Energized by certain types of social interaction",
      "Balanced between needing social time and alone time",
      "Selective about social engagements to manage energy",
      "Primarily energized by solitude with occasional social connection"
    ],
    weight: 0.9
  },
  {
    id: "di_68",
    category: QuestionCategory.SocialInteraction,
    question: "My relationship to social expectations and norms is that I:",
    options: [
      "Generally follow and value social conventions",
      "Evaluate each norm and follow those that make sense",
      "Often question or challenge social expectations",
      "Prefer settings with fewer social rules and constraints",
      "Adapt to different social contexts while maintaining my core values"
    ],
    weight: 0.7
  },
  {
    id: "di_69",
    category: QuestionCategory.SocialInteraction,
    question: "When someone shares good news with me, I typically respond by:",
    options: [
      "Expressing enthusiastic excitement and celebration",
      "Asking questions to show interest in the details",
      "Sharing in their happiness while staying relatively calm",
      "Acknowledging their achievement and offering praise",
      "Relating it to my own experiences or perspectives"
    ],
    weight: 0.8
  },
  {
    id: "di_70",
    category: QuestionCategory.SocialInteraction,
    question: "The quality I most value in my social connections is:",
    options: [
      "Authenticity and being true to oneself",
      "Loyalty and consistent support",
      "Depth of understanding and emotional connection",
      "Stimulating conversation and intellectual exchange",
      "Mutual respect and appreciation of differences"
    ],
    weight: 0.9
  },
  
  // Decision Making (71-80)
  {
    id: "di_71",
    category: QuestionCategory.DecisionMaking,
    question: "When making important decisions, I primarily rely on:",
    options: [
      "Logical analysis of facts and likely outcomes",
      "My intuition and gut feelings",
      "Alignment with my values and principles",
      "Advice from people I trust",
      "A combination of analysis and intuition"
    ],
    weight: 1.0
  },
  {
    id: "di_72",
    category: QuestionCategory.DecisionMaking,
    question: "When facing a decision with limited information, I typically:",
    options: [
      "Gather as much additional information as possible before deciding",
      "Trust my experience and intuition to guide me",
      "Weigh probabilities of different outcomes",
      "Consider what's worked in similar situations",
      "Make a provisional decision that can be adjusted later"
    ],
    weight: 0.9
  },
  {
    id: "di_73",
    category: QuestionCategory.DecisionMaking,
    question: "After making a difficult decision, I tend to:",
    options: [
      "Feel confident and move forward without looking back",
      "Second-guess myself and wonder about alternatives",
      "Reflect on my decision process for future improvement",
      "Monitor outcomes to validate or adjust my choice",
      "Seek feedback or affirmation from others"
    ],
    weight: 0.8
  },
  {
    id: "di_74",
    category: QuestionCategory.DecisionMaking,
    question: "When making decisions that affect others, I prioritize:",
    options: [
      "Finding the objectively best solution regardless of feelings",
      "Maintaining harmony and positive relationships",
      "Ensuring everyone feels heard and considered",
      "Aligning with shared values and principles",
      "Balancing practical outcomes with relational impacts"
    ],
    weight: 0.9
  },
  {
    id: "di_75",
    category: QuestionCategory.DecisionMaking,
    question: "My approach to risk in decision-making is best described as:",
    options: [
      "Cautious - I prefer safe options with known outcomes",
      "Calculated - I take measured risks after careful analysis",
      "Context-dependent - my risk tolerance varies by situation",
      "Opportunity-focused - I'm willing to risk for potential gains",
      "Risk-embracing - I see risk as necessary for growth"
    ],
    weight: 0.8
  },
  {
    id: "di_76",
    category: QuestionCategory.DecisionMaking,
    question: "When under pressure to make quick decisions, I typically:",
    options: [
      "Trust my instincts and decide swiftly",
      "Quickly identify the most critical factors and focus only on those",
      "Ask for a brief moment to collect my thoughts",
      "Draw on similar past experiences to guide me",
      "Prioritize caution and avoiding serious mistakes"
    ],
    weight: 0.7
  },
  {
    id: "di_77",
    category: QuestionCategory.DecisionMaking,
    question: "When faced with too many options or choices, I:",
    options: [
      "Establish clear criteria to systematically evaluate options",
      "Eliminate options in rounds to narrow the field",
      "Consider what I truly want rather than comparing options",
      "Look for the option that stands out intuitively",
      "Seek input from others to help clarify my thinking"
    ],
    weight: 0.8
  },
  {
    id: "di_78",
    category: QuestionCategory.DecisionMaking,
    question: "When making decisions with long-term implications, I focus most on:",
    options: [
      "Alignment with my core values and life purpose",
      "Practical consequences and likely outcomes",
      "Maintaining maximum flexibility for the future",
      "What feels right intuitively",
      "Learning and growth opportunities"
    ],
    weight: 0.9
  },
  {
    id: "di_79",
    category: QuestionCategory.DecisionMaking,
    question: "When looking back on past decisions I've made, I most often:",
    options: [
      "Feel confident I made the best choice with available information",
      "See how I could have made better decisions",
      "Focus on what I learned rather than the outcome",
      "Notice patterns in my decision-making style",
      "Wonder about roads not taken and alternative outcomes"
    ],
    weight: 0.7
  },
  {
    id: "di_80",
    category: QuestionCategory.DecisionMaking,
    question: "My biggest decision-making challenge is typically:",
    options: [
      "Overthinking and analysis paralysis",
      "Making decisions too quickly without enough consideration",
      "Being influenced by emotions in the moment",
      "Considering too many options and possibilities",
      "Worry about making the 'wrong' choice"
    ],
    weight: 0.8
  },
  
  // Creativity (81-90)
  {
    id: "di_81",
    category: QuestionCategory.Creativity,
    question: "My approach to generating new ideas typically involves:",
    options: [
      "Making unexpected connections between different concepts",
      "Building upon and improving existing ideas",
      "Questioning assumptions and conventional thinking",
      "Immersing myself in diverse influences and perspectives",
      "Allowing my mind to wander freely without judgment"
    ],
    weight: 0.9
  },
  {
    id: "di_82",
    category: QuestionCategory.Creativity,
    question: "The conditions where I feel most creative are:",
    options: [
      "When I have unstructured time to explore possibilities",
      "When I'm collaborating with others who inspire me",
      "When I'm faced with constraints or limitations",
      "When I'm in a relaxed, positive emotional state",
      "When I'm under pressure with deadlines"
    ],
    weight: 0.8
  },
  {
    id: "di_83",
    category: QuestionCategory.Creativity,
    question: "When developing creative ideas, I tend to:",
    options: [
      "Generate many possibilities before evaluating any",
      "Focus on developing one promising idea thoroughly",
      "Alternate between divergent and convergent thinking",
      "Gather feedback early and often to refine ideas",
      "Let ideas incubate over time before developing them"
    ],
    weight: 0.9
  },
  {
    id: "di_84",
    category: QuestionCategory.Creativity,
    question: "What most often blocks or limits your creative expression?",
    options: [
      "Self-criticism and fear of judgment",
      "Practical constraints like time or resources",
      "Difficulty translating abstract ideas into concrete form",
      "Too much structure or external direction",
      "Lack of technical skills or expertise"
    ],
    weight: 0.8
  },
  {
    id: "di_85",
    category: QuestionCategory.Creativity,
    question: "The role of structure and constraints in my creative process is:",
    options: [
      "They limit my creativity and I prefer total freedom",
      "They provide helpful boundaries that focus my creativity",
      "They're a starting point that I often bend or break",
      "They help initially but I need freedom as ideas develop",
      "I create my own structure to guide my creative process"
    ],
    weight: 0.7
  },
  {
    id: "di_86",
    category: QuestionCategory.Creativity,
    question: "When I encounter an unconventional or unusual idea, I typically:",
    options: [
      "Feel excited and eager to explore it further",
      "Look for ways it might be practically applied",
      "Evaluate it against established principles",
      "Consider how it connects to existing knowledge",
      "Appreciate its novelty while remaining somewhat skeptical"
    ],
    weight: 0.8
  },
  {
    id: "di_87",
    category: QuestionCategory.Creativity,
    question: "The type of creative expression that most resonates with me involves:",
    options: [
      "Visual arts or design",
      "Written or verbal expression",
      "Music or sound",
      "Physical movement or spatial arrangement",
      "Problem-solving or conceptual thinking"
    ],
    weight: 0.7
  },
  {
    id: "di_88",
    category: QuestionCategory.Creativity,
    question: "My relationship to the creative work of others is that I:",
    options: [
      "Find it highly inspiring for my own creativity",
      "Appreciate it but keep my creative process separate",
      "Often build upon or remix others' creative ideas",
      "Use it as a benchmark to evaluate my own work",
      "Seek out work very different from my own style"
    ],
    weight: 0.7
  },
  {
    id: "di_89",
    category: QuestionCategory.Creativity,
    question: "The aspect of creativity I value most is:",
    options: [
      "Originality and novelty",
      "Problem-solving and practical applications",
      "Self-expression and authenticity",
      "The process of making and creating",
      "Creating meaning or emotional impact"
    ],
    weight: 0.8
  },
  {
    id: "di_90",
    category: QuestionCategory.Creativity,
    question: "When stuck or facing creative blocks, I typically:",
    options: [
      "Step away and engage in unrelated activities",
      "Seek inspiration from other creative works",
      "Push through by experimenting with different approaches",
      "Talk through my ideas with others",
      "Return to basics or established techniques"
    ],
    weight: 0.9
  },
  
  // Leadership (91-100)
  {
    id: "di_91",
    category: QuestionCategory.Leadership,
    question: "My natural leadership approach tends to be:",
    options: [
      "Visionary - inspiring others toward a compelling future",
      "Democratic - involving the team in decisions",
      "Coaching - developing others' capabilities",
      "Pacesetting - setting high standards through example",
      "Supportive - creating positive emotional connections"
    ],
    weight: 1.0
  },
  {
    id: "di_92",
    category: QuestionCategory.Leadership,
    question: "When leading a team through change or uncertainty, I prioritize:",
    options: [
      "Clear communication about what we know and don't know",
      "Maintaining stability and continuity where possible",
      "Involving the team in shaping our response",
      "Finding opportunities within the challenges",
      "Supporting individual team members' concerns"
    ],
    weight: 0.9
  },
  {
    id: "di_93",
    category: QuestionCategory.Leadership,
    question: "My approach to motivating others typically centers on:",
    options: [
      "Connecting their work to meaningful purpose",
      "Setting challenging but achievable goals",
      "Providing recognition and appreciation",
      "Creating autonomy and ownership",
      "Building a positive team environment"
    ],
    weight: 0.9
  },
  {
    id: "di_94",
    category: QuestionCategory.Leadership,
    question: "When making decisions as a leader, I tend to:",
    options: [
      "Gather input from the team before deciding",
      "Analyze data and evidence thoroughly",
      "Consider organizational values and principles",
      "Trust my experience and intuition",
      "Balance short and long-term implications"
    ],
    weight: 0.8
  },
  {
    id: "di_95",
    category: QuestionCategory.Leadership,
    question: "The aspect of leadership I find most challenging is:",
    options: [
      "Giving difficult feedback or having tough conversations",
      "Balancing task focus with relationship building",
      "Delegating effectively",
      "Managing conflict within the team",
      "Making decisions with incomplete information"
    ],
    weight: 0.7
  },
  {
    id: "di_96",
    category: QuestionCategory.Leadership,
    question: "When team members disagree, my typical approach is to:",
    options: [
      "Focus on areas of common ground and shared objectives",
      "Encourage open dialogue to understand all perspectives",
      "Look for creative solutions that incorporate diverse viewpoints",
      "Bring focus back to data and objective criteria",
      "Make the final call if consensus can't be reached"
    ],
    weight: 0.8
  },
  {
    id: "di_97",
    category: QuestionCategory.Leadership,
    question: "My approach to developing team members involves:",
    options: [
      "Providing stretch assignments with support",
      "Regular coaching and feedback",
      "Encouraging them to take ownership of their growth",
      "Creating learning opportunities through new challenges",
      "Matching assignments to their strengths and interests"
    ],
    weight: 0.9
  },
  {
    id: "di_98",
    category: QuestionCategory.Leadership,
    question: "The leadership quality I most aspire to develop is:",
    options: [
      "Strategic vision and future orientation",
      "Emotional intelligence and interpersonal awareness",
      "Decisiveness and clear direction-setting",
      "Building and empowering high-performing teams",
      "Adaptability and comfort with ambiguity"
    ],
    weight: 0.8
  },
  {
    id: "di_99",
    category: QuestionCategory.Leadership,
    question: "In a leadership role, I am most energized by:",
    options: [
      "Developing strategies and future directions",
      "Helping others grow and succeed",
      "Solving complex problems",
      "Building effective teams and cultures",
      "Achieving ambitious goals and results"
    ],
    weight: 0.7
  },
  {
    id: "di_100",
    category: QuestionCategory.Leadership,
    question: "My leadership philosophy centers most on:",
    options: [
      "Empowering others to reach their full potential",
      "Creating clarity of purpose and direction",
      "Building trust through integrity and consistency",
      "Driving innovation and positive change",
      "Achieving excellence and outstanding results"
    ],
    weight: 1.0
  }
];

// Export a function to get a subset of questions for testing
export const getDeepInsightQuestions = (count = 100) => {
  return deepInsightQuestions.slice(0, Math.min(count, deepInsightQuestions.length));
};

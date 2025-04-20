
import { BigMeQuestion } from "./types";
import { QuestionCategory } from "../types";

// Create 50 diverse questions across categories
export const bigMeQuestions: BigMeQuestion[] = [
  // Personality Traits Questions (10 questions)
  {
    id: "BM-1",
    category: QuestionCategory.PersonalityTraits,
    question: "How do you typically handle unexpected changes to your plans?",
    options: [
      "I adapt quickly and look for new opportunities in the change",
      "I feel uncomfortable but make the best of the situation",
      "I try to modify the new situation to fit my original plans",
      "I prefer to maintain my original plans whenever possible",
      "I find it very disruptive and struggle to adjust"
    ],
    allowCustomResponse: true,
    weight: 1.0
  },
  {
    id: "BM-2",
    category: QuestionCategory.PersonalityTraits,
    question: "In group projects, which role do you naturally gravitate toward?",
    options: [
      "Taking charge and delegating responsibilities",
      "Contributing ideas and facilitating discussions",
      "Handling specific tasks I know I'm good at",
      "Supporting others and maintaining group harmony",
      "Observing first and adapting to what the group needs"
    ],
    allowCustomResponse: true,
    weight: 1.0
  },
  {
    id: "BM-3",
    category: QuestionCategory.PersonalityTraits,
    question: "How do you feel when you have nothing scheduled for a day?",
    options: [
      "Excited to have complete freedom and spontaneity",
      "Comfortable but I'll probably create some structure",
      "A bit anxious without a plan for my time",
      "I rarely have completely unscheduled days",
      "I prefer having at least some planned activities"
    ],
    allowCustomResponse: true,
    weight: 0.9
  },
  {
    id: "BM-4",
    category: QuestionCategory.PersonalityTraits,
    question: "How important is it to you to express your authentic self, even when it might be seen as unconventional?",
    options: [
      "Essential - I always prioritize authenticity over fitting in",
      "Very important, though I'm mindful of context",
      "I balance authenticity with social expectations",
      "I generally conform to expectations while finding small ways to express myself",
      "I find more value in adapting to social norms than standing out"
    ],
    allowCustomResponse: true,
    weight: 0.9
  },
  {
    id: "BM-5",
    category: QuestionCategory.PersonalityTraits,
    question: "When making important life decisions, what do you rely on most?",
    options: [
      "Careful analysis of facts and likely outcomes",
      "My intuition and inner sense of what feels right",
      "Input and advice from people I trust",
      "A combination of rational analysis and emotional guidance",
      "Past experiences and lessons learned"
    ],
    allowCustomResponse: true,
    weight: 1.0
  },
  {
    id: "BM-6",
    category: QuestionCategory.PersonalityTraits,
    question: "How often do you find yourself lost in thought or daydreaming?",
    options: [
      "Constantly - my mind naturally drifts to ideas and possibilities",
      "Often, especially when I'm not actively engaged in something",
      "Occasionally, usually when I'm relaxed or bored",
      "Rarely - I tend to stay focused on the present",
      "Almost never - I prefer to keep my attention on tangible realities"
    ],
    allowCustomResponse: true,
    weight: 0.8
  },
  {
    id: "BM-7",
    category: QuestionCategory.PersonalityTraits,
    question: "How would you describe your approach to rules and procedures?",
    options: [
      "I value rules that serve a clear purpose but question those that don't",
      "I generally follow rules but adapt them when necessary",
      "I see rules as necessary guidelines for smooth functioning",
      "I believe strongly in following established protocols",
      "I often find rules limiting and prefer to forge my own path"
    ],
    allowCustomResponse: true,
    weight: 0.9
  },
  {
    id: "BM-8",
    category: QuestionCategory.PersonalityTraits,
    question: "How comfortable are you spending time alone?",
    options: [
      "Very comfortable - I need significant alone time to recharge",
      "Comfortable, though I also enjoy socializing regularly",
      "I need a balance of social time and alone time",
      "I prefer being with others but can handle short periods alone",
      "I find extended solitude challenging and energize through interaction"
    ],
    allowCustomResponse: true,
    weight: 0.9
  },
  {
    id: "BM-9",
    category: QuestionCategory.PersonalityTraits,
    question: "How do you typically approach new learning opportunities?",
    options: [
      "I dive in enthusiastically with a broad, exploratory approach",
      "I create a structured plan to master the subject systematically",
      "I focus on practical applications I can use right away",
      "I prefer learning through discussion and collaboration",
      "I connect new information to concepts and patterns I already know"
    ],
    allowCustomResponse: true,
    weight: 0.8
  },
  {
    id: "BM-10",
    category: QuestionCategory.PersonalityTraits,
    question: "When communicating, how important is precision in your choice of words?",
    options: [
      "Extremely important - I carefully select the most precise words",
      "Very important - I try to be as clear and specific as possible",
      "Moderately important - clarity matters more than perfect precision",
      "Somewhat important - general understanding is usually sufficient",
      "I focus more on expressiveness and connection than technical precision"
    ],
    allowCustomResponse: true,
    weight: 0.8
  },
  
  // Emotional Intelligence Questions (10 questions)
  {
    id: "BM-11",
    category: QuestionCategory.EmotionalIntelligence,
    question: "When you experience a strong negative emotion, what is your typical first response?",
    options: [
      "I pause to identify and understand what I'm feeling exactly",
      "I look for ways to solve whatever is causing the emotion",
      "I seek support and talk about it with someone I trust",
      "I try to reframe the situation to see it differently",
      "I allow myself to fully experience the emotion before responding"
    ],
    allowCustomResponse: true,
    weight: 1.0
  },
  {
    id: "BM-12",
    category: QuestionCategory.EmotionalIntelligence,
    question: "How accurately can you typically predict how your words or actions will make others feel?",
    options: [
      "Very accurately - I have a strong sense of others' emotional responses",
      "Usually accurately, though I'm sometimes surprised",
      "Moderately - I can anticipate obvious reactions but miss subtleties",
      "It varies greatly depending on the person and context",
      "I find others' emotional responses often unpredictable"
    ],
    allowCustomResponse: true,
    weight: 0.9
  },
  {
    id: "BM-13",
    category: QuestionCategory.EmotionalIntelligence,
    question: "How comfortable are you discussing your vulnerabilities with others?",
    options: [
      "Very comfortable with people I trust",
      "Somewhat comfortable with select people after establishing trust",
      "Neutral - I can discuss some vulnerabilities in appropriate contexts",
      "Somewhat uncomfortable - I prefer to keep these private",
      "Very uncomfortable - I rarely share my vulnerabilities"
    ],
    allowCustomResponse: true,
    weight: 0.9
  },
  {
    id: "BM-14",
    category: QuestionCategory.EmotionalIntelligence,
    question: "When someone shares their problems with you, what's your typical response?",
    options: [
      "I listen attentively without immediately offering solutions",
      "I ask questions to better understand their feelings",
      "I share similar experiences to show I understand",
      "I offer practical advice and potential solutions",
      "I try to cheer them up and shift to a positive perspective"
    ],
    allowCustomResponse: true,
    weight: 0.9
  },
  {
    id: "BM-15",
    category: QuestionCategory.EmotionalIntelligence,
    question: "How well do you recognize when you need emotional support from others?",
    options: [
      "Very well - I'm aware of my emotional needs and seek appropriate support",
      "Fairly well, though I sometimes delay asking for support",
      "Moderately - I recognize major emotional needs but may miss subtler ones",
      "I often realize I needed support only in retrospect",
      "I rarely feel I need emotional support from others"
    ],
    allowCustomResponse: true,
    weight: 0.8
  },
  {
    id: "BM-16",
    category: QuestionCategory.EmotionalIntelligence,
    question: "How do you typically handle situations where you feel misunderstood?",
    options: [
      "I calmly attempt to clarify my perspective",
      "I try to understand the other person's viewpoint first",
      "I become frustrated but keep trying to explain myself",
      "I often let it go rather than pursuing full understanding",
      "I reflect on how I might communicate more effectively next time"
    ],
    allowCustomResponse: true,
    weight: 0.9
  },
  {
    id: "BM-17",
    category: QuestionCategory.EmotionalIntelligence,
    question: "How well can you tolerate extended periods of emotional discomfort or uncertainty?",
    options: [
      "Very well - I can sit with difficult emotions productively",
      "Fairly well, though it takes significant energy",
      "Moderately - I can handle short periods but seek resolution",
      "I find it challenging and tend to seek quick resolution",
      "I actively avoid situations likely to cause extended emotional discomfort"
    ],
    allowCustomResponse: true,
    weight: 1.0
  },
  {
    id: "BM-18",
    category: QuestionCategory.EmotionalIntelligence,
    question: "When you notice someone is upset but not talking about it, what do you typically do?",
    options: [
      "Gently ask if they want to talk about what's bothering them",
      "Give them space, assuming they'll talk when ready",
      "Try to cheer them up without directly addressing the issue",
      "Mention that I notice something seems off and leave it open",
      "Adjust my behavior to be more supportive without mentioning it"
    ],
    allowCustomResponse: true,
    weight: 0.8
  },
  {
    id: "BM-19",
    category: QuestionCategory.EmotionalIntelligence,
    question: "How often do you examine the underlying causes of your emotional reactions?",
    options: [
      "Very frequently - I regularly reflect on the roots of my emotions",
      "Often, especially for significant or recurring emotions",
      "Sometimes, particularly when my reaction seems disproportionate",
      "Occasionally, but I don't consistently analyze my emotions",
      "Rarely - I generally accept my emotions as they are"
    ],
    allowCustomResponse: true,
    weight: 0.9
  },
  {
    id: "BM-20",
    category: QuestionCategory.EmotionalIntelligence,
    question: "How accurately can you identify subtle changes in your own emotional state?",
    options: [
      "Very accurately - I notice even minor emotional shifts",
      "Quite accurately for most emotions",
      "I recognize major changes but might miss subtler ones",
      "I sometimes realize my emotions have changed after the fact",
      "I often find it difficult to pinpoint my exact feelings"
    ],
    allowCustomResponse: true,
    weight: 0.9
  },
  
  // Cognitive Patterns Questions (5 questions)
  {
    id: "BM-21",
    category: QuestionCategory.CognitivePatterns,
    question: "How do you typically approach complex problems?",
    options: [
      "Break them down into smaller components to solve methodically",
      "Look for patterns or analogies to familiar situations",
      "Consider multiple perspectives or approaches simultaneously",
      "Focus on identifying the core issue before seeking solutions",
      "Rely on intuitive insights that emerge after immersion in the problem"
    ],
    allowCustomResponse: true,
    weight: 1.0
  },
  {
    id: "BM-22",
    category: QuestionCategory.CognitivePatterns,
    question: "What is your preference for consuming information?",
    options: [
      "Reading detailed explanations and analyses",
      "Visual representations like diagrams, charts, or videos",
      "Listening to explanations or discussions",
      "Hands-on experience and practical examples",
      "A combination of methods, varying by subject matter"
    ],
    allowCustomResponse: true,
    weight: 0.8
  },
  {
    id: "BM-23",
    category: QuestionCategory.CognitivePatterns,
    question: "How comfortable are you with ambiguity and open-ended situations?",
    options: [
      "Very comfortable - I find ambiguity interesting and full of possibility",
      "Moderately comfortable - I can work with ambiguity but prefer some structure",
      "It depends on the context and how much clarity I need",
      "Somewhat uncomfortable - I prefer having clear parameters",
      "Very uncomfortable - I strongly prefer clarity and definition"
    ],
    allowCustomResponse: true,
    weight: 0.9
  },
  {
    id: "BM-24",
    category: QuestionCategory.CognitivePatterns,
    question: "When forming your opinion on a complex issue, what matters most to you?",
    options: [
      "Logical consistency and factual accuracy",
      "Alignment with my core values and principles",
      "Practical implications and real-world impact",
      "Considering diverse perspectives and nuances",
      "Intuitive sense of what feels right or true"
    ],
    allowCustomResponse: true,
    weight: 0.9
  },
  {
    id: "BM-25",
    category: QuestionCategory.CognitivePatterns,
    question: "How often do you question your own assumptions and beliefs?",
    options: [
      "Constantly - I regularly reevaluate even longstanding beliefs",
      "Often - I'm open to revising my views with new information",
      "Periodically - I revisit assumptions when prompted by contradictions",
      "Occasionally - I question some beliefs but hold others as foundational",
      "Rarely - I have confidence in my established worldview"
    ],
    allowCustomResponse: true,
    weight: 1.0
  },
  
  // Value Systems Questions (5 questions)
  {
    id: "BM-26",
    category: QuestionCategory.ValueSystems,
    question: "Which of these values do you prioritize most highly in your personal relationships?",
    options: [
      "Honesty and authenticity",
      "Loyalty and commitment",
      "Growth and mutual development",
      "Freedom and independence",
      "Harmony and emotional connection"
    ],
    allowCustomResponse: true,
    weight: 1.0
  },
  {
    id: "BM-27",
    category: QuestionCategory.ValueSystems,
    question: "How do you typically determine whether something is morally right or wrong?",
    options: [
      "By considering the outcomes and consequences for all involved",
      "By evaluating whether it aligns with universal principles or rules",
      "By assessing whether it promotes justice and fairness",
      "By considering how it affects the well-being of the community",
      "By consulting my intuitive sense of right and wrong"
    ],
    allowCustomResponse: true,
    weight: 0.9
  },
  {
    id: "BM-28",
    category: QuestionCategory.ValueSystems,
    question: "How important is tradition in shaping your values and decisions?",
    options: [
      "Very important - I value wisdom passed down through generations",
      "Somewhat important - I respect traditions but adapt them to modern contexts",
      "Neutral - I evaluate traditions on their individual merit",
      "Not very important - I prefer developing my own values independently",
      "I often question tradition in favor of progressive alternatives"
    ],
    allowCustomResponse: true,
    weight: 0.8
  },
  {
    id: "BM-29",
    category: QuestionCategory.ValueSystems,
    question: "What matters most to you in creating a meaningful life?",
    options: [
      "Making positive contributions to others and society",
      "Pursuing personal growth and self-actualization",
      "Building deep, authentic relationships",
      "Creating or experiencing beauty and excellence",
      "Finding purpose and alignment with my core values"
    ],
    allowCustomResponse: true,
    weight: 1.0
  },
  {
    id: "BM-30",
    category: QuestionCategory.ValueSystems,
    question: "How do you view material success in relation to overall life satisfaction?",
    options: [
      "As one component that enables other forms of fulfillment",
      "As important but secondary to relationships and experiences",
      "As a reflection of effort and achievement that brings satisfaction",
      "As largely separate from true happiness and meaning",
      "As valuable primarily for the security and freedom it provides"
    ],
    allowCustomResponse: true,
    weight: 0.8
  },
  
  // Motivation Questions (5 questions)
  {
    id: "BM-31",
    category: QuestionCategory.Motivation,
    question: "What typically drives you to persist through difficulties toward a goal?",
    options: [
      "The satisfaction of overcoming challenges and proving capability",
      "Deep belief in the meaningful purpose of the goal",
      "Commitment to others who are counting on me",
      "Desire to avoid the regret of not seeing it through",
      "The anticipated rewards or outcomes once achieved"
    ],
    allowCustomResponse: true,
    weight: 1.0
  },
  {
    id: "BM-32",
    category: QuestionCategory.Motivation,
    question: "What aspect of work or projects do you find most intrinsically motivating?",
    options: [
      "Solving difficult problems or puzzles",
      "Creating something new or innovative",
      "Mastering skills and continuously improving",
      "Collaborating with and supporting others",
      "Seeing tangible results and progress"
    ],
    allowCustomResponse: true,
    weight: 0.9
  },
  {
    id: "BM-33",
    category: QuestionCategory.Motivation,
    question: "How important is external recognition to your sense of achievement?",
    options: [
      "Very important - external validation significantly enhances my satisfaction",
      "Somewhat important - I appreciate recognition but don't depend on it",
      "It depends on the context and whose recognition it is",
      "Not very important - I prioritize my own assessment of my work",
      "Minimal - my motivation is almost entirely internal"
    ],
    allowCustomResponse: true,
    weight: 0.8
  },
  {
    id: "BM-34",
    category: QuestionCategory.Motivation,
    question: "What typically happens to your motivation when facing a setback?",
    options: [
      "It increases - challenges make me more determined",
      "It remains steady - setbacks are just part of the process",
      "It dips temporarily but recovers after processing",
      "It decreases but can be restored with support or perspective",
      "It significantly decreases, making it hard to continue"
    ],
    allowCustomResponse: true,
    weight: 0.9
  },
  {
    id: "BM-35",
    category: QuestionCategory.Motivation,
    question: "How do you typically respond to having multiple important priorities competing for your attention?",
    options: [
      "I establish a clear hierarchy and focus sequentially",
      "I try to find synergies where one effort serves multiple priorities",
      "I allocate specific time blocks to different priorities",
      "I focus on what feels most urgent or important in the moment",
      "I seek help or delegate where possible to manage the load"
    ],
    allowCustomResponse: true,
    weight: 0.8
  },
  
  // Resilience Questions (5 questions)
  {
    id: "BM-36",
    category: QuestionCategory.Resilience,
    question: "When facing a significant disappointment, how do you typically recover?",
    options: [
      "I reflect on lessons learned and pivot to new possibilities",
      "I reach out to my support network for perspective",
      "I give myself time to process emotions before moving forward",
      "I focus on other projects or areas where I can make progress",
      "I analyze what went wrong to avoid similar situations"
    ],
    allowCustomResponse: true,
    weight: 1.0
  },
  {
    id: "BM-37",
    category: QuestionCategory.Resilience,
    question: "How has your approach to difficulties evolved based on past challenges?",
    options: [
      "I've developed greater emotional regulation during hard times",
      "I've learned to more quickly identify what I can and cannot control",
      "I'm more skilled at breaking large problems into manageable steps",
      "I've built a stronger support network I can rely on",
      "I'm better at recognizing patterns and applying past solutions"
    ],
    allowCustomResponse: true,
    weight: 0.9
  },
  {
    id: "BM-38",
    category: QuestionCategory.Resilience,
    question: "When under prolonged stress, which coping mechanism do you rely on most?",
    options: [
      "Physical activity and attention to basic needs",
      "Mindfulness practices and present-moment awareness",
      "Creative expression or meaningful activities",
      "Connection with supportive people",
      "Structured problem-solving and planning"
    ],
    allowCustomResponse: true,
    weight: 0.9
  },
  {
    id: "BM-39",
    category: QuestionCategory.Resilience,
    question: "How do you typically make meaning from difficult experiences?",
    options: [
      "I focus on how they've helped me grow stronger",
      "I look for ways they've deepened my understanding of life",
      "I consider how they've clarified my priorities and values",
      "I appreciate how they've connected me more deeply with others",
      "I value the practical wisdom they've provided"
    ],
    allowCustomResponse: true,
    weight: 0.8
  },
  {
    id: "BM-40",
    category: QuestionCategory.Resilience,
    question: "When a long-term project encounters serious obstacles, what helps you persevere?",
    options: [
      "Reconnecting with the meaningful purpose behind the work",
      "Breaking down problems into smaller, more manageable steps",
      "Drawing energy from collaborators or supporters",
      "Adjusting expectations while maintaining core goals",
      "Taking breaks to regain perspective and energy"
    ],
    allowCustomResponse: true,
    weight: 0.9
  },
  
  // Social Interaction Questions (3 questions)
  {
    id: "BM-41",
    category: QuestionCategory.SocialInteraction,
    question: "In new social situations, how do you typically engage?",
    options: [
      "I observe first and gradually become more interactive",
      "I readily introduce myself and initiate conversations",
      "I connect with one or two people rather than the whole group",
      "I look for familiar faces or common interests as entry points",
      "I wait for others to approach me before engaging"
    ],
    allowCustomResponse: true,
    weight: 0.8
  },
  {
    id: "BM-42",
    category: QuestionCategory.SocialInteraction,
    question: "How easily do you form close connections with new acquaintances?",
    options: [
      "Very easily - I connect deeply with people quickly",
      "Relatively easily with people who share my interests or values",
      "Moderately - it takes time but happens naturally with compatible people",
      "Somewhat challenging - I'm selective about close connections",
      "Quite difficult - deep connections take significant time and trust"
    ],
    allowCustomResponse: true,
    weight: 0.9
  },
  {
    id: "BM-43",
    category: QuestionCategory.SocialInteraction,
    question: "How do you typically respond when you disagree with a group consensus?",
    options: [
      "I voice my perspective clearly but respectfully",
      "I ask questions to understand others' views before sharing mine",
      "I might suggest compromise or alternative approaches",
      "I typically go along with the group unless it's very important",
      "My response depends on my relationship with the group"
    ],
    allowCustomResponse: true,
    weight: 0.8
  },
  
  // Decision Making Questions (2 questions)
  {
    id: "BM-44",
    category: QuestionCategory.DecisionMaking,
    question: "How comfortable are you making decisions with incomplete information?",
    options: [
      "Very comfortable - I can decide and adjust as needed",
      "Moderately comfortable if a decision is necessary",
      "It depends on the stakes and potential consequences",
      "Somewhat uncomfortable - I prefer more complete information",
      "Very uncomfortable - I strongly prefer thorough information before deciding"
    ],
    allowCustomResponse: true,
    weight: 0.9
  },
  {
    id: "BM-45",
    category: QuestionCategory.DecisionMaking,
    question: "After making a significant decision, how often do you second-guess yourself?",
    options: [
      "Rarely - once I decide, I move forward confidently",
      "Occasionally, especially with new information",
      "Sometimes, particularly for major decisions",
      "Fairly often - I frequently wonder if I chose correctly",
      "It depends entirely on the outcome"
    ],
    allowCustomResponse: true,
    weight: 0.8
  },
  
  // Creativity Questions (2 questions)
  {
    id: "BM-46",
    category: QuestionCategory.Creativity,
    question: "How do you typically generate new ideas?",
    options: [
      "Making unexpected connections between different concepts",
      "Building incrementally on existing knowledge or ideas",
      "Challenging conventional assumptions or approaches",
      "Collaborating and bouncing thoughts off others",
      "Through unstructured exploration and play"
    ],
    allowCustomResponse: true,
    weight: 0.9
  },
  {
    id: "BM-47",
    category: QuestionCategory.Creativity,
    question: "What conditions help you feel most creative?",
    options: [
      "Unstructured time with freedom to explore",
      "A clear problem that needs innovative solutions",
      "Exposure to diverse perspectives and stimuli",
      "Collaboration with other creative minds",
      "Quiet reflection and internal processing"
    ],
    allowCustomResponse: true,
    weight: 0.8
  },
  
  // Leadership Questions (3 questions)
  {
    id: "BM-48",
    category: QuestionCategory.Leadership,
    question: "When in a position to lead others, what approach do you typically take?",
    options: [
      "Setting clear direction and expectations",
      "Building consensus and fostering collaboration",
      "Empowering individuals and delegating authority",
      "Leading by example through my own actions",
      "Adapting my style to what the situation requires"
    ],
    allowCustomResponse: true,
    weight: 1.0
  },
  {
    id: "BM-49",
    category: QuestionCategory.Leadership,
    question: "How do you typically handle disagreement or dissenting views when leading?",
    options: [
      "I actively seek out diverse perspectives to test my thinking",
      "I listen carefully and integrate valid points",
      "I encourage open debate to find the best solution",
      "I appreciate the input but make the final decision myself",
      "I look for common ground and areas of consensus"
    ],
    allowCustomResponse: true,
    weight: 0.9
  },
  {
    id: "BM-50",
    category: QuestionCategory.Leadership,
    question: "How do you respond when something goes wrong under your leadership?",
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

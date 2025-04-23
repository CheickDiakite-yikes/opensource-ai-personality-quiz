
import { AssessmentQuestion, QuestionCategory } from "../types";

// Complete set of 50 research-backed questions for the Deep Insight assessment
export const deepInsightQuestions: AssessmentQuestion[] = [
  // Personality Traits (1-5)
  {
    id: "di_1",
    category: QuestionCategory.PersonalityTraits,
    question: "When making important decisions with significant consequences, what do you rely on most?",
    options: [
      "Systematic analysis of pros and cons with relevant data",
      "My intuition and emotional responses to each possibility",
      "How each option aligns with my core values and principles",
      "Seeking diverse perspectives from people I trust and respect",
      "Past experiences with similar situations and their outcomes"
    ],
    weight: 1.0
  },
  {
    id: "di_2",
    category: QuestionCategory.PersonalityTraits,
    question: "How do you typically respond when carefully made plans are unexpectedly disrupted?",
    options: [
      "Quickly adapt and create alternative approaches",
      "Feel frustrated but methodically work on developing a new plan",
      "Seek to understand what happened before making new decisions",
      "Look for ways to preserve the most important elements of the original plan",
      "See the disruption as potentially opening better opportunities"
    ],
    weight: 0.9
  },
  {
    id: "di_3",
    category: QuestionCategory.PersonalityTraits,
    question: "In collaborative projects where strong differences of opinion emerge, how do you typically contribute?",
    options: [
      "Take charge to establish direction when there's uncertainty",
      "Focus on finding common ground between opposing viewpoints",
      "Carefully analyze all perspectives before forming my position",
      "Support promising ideas while offering refinements",
      "Introduce creative alternatives that hadn't been considered"
    ],
    weight: 1.0
  },
  {
    id: "di_4", 
    category: QuestionCategory.PersonalityTraits,
    question: "Which statement most accurately describes your social energy patterns and needs?",
    options: [
      "I need significant alone time to recharge after social interaction",
      "I prefer quiet activities with one or two close friends",
      "I balance social and solitary activities based on my energy level",
      "I'm energized by diverse social settings with different people",
      "I rarely feel drained by social interaction and can engage continually"
    ],
    weight: 0.8
  },
  {
    id: "di_5",
    category: QuestionCategory.PersonalityTraits,
    question: "When receiving substantive criticism about your work, what is your most authentic immediate reaction?",
    options: [
      "I appreciate the feedback and immediately consider how to implement it",
      "I feel temporarily disappointed but recognize its value for growth",
      "I carefully evaluate whether the criticism is valid before reacting",
      "I tend to feel defensive initially before processing it objectively",
      "I actively seek clarification to understand the critique fully"
    ],
    weight: 0.9
  },
  
  // Emotional Intelligence (6-10)
  {
    id: "di_6",
    category: QuestionCategory.EmotionalIntelligence,
    question: "When someone close to you is experiencing intense emotional distress, how do you most naturally respond?",
    options: [
      "Listen fully without interruption, validating their feelings before offering help",
      "Share relevant experiences to show understanding of their situation",
      "Focus on practical solutions to help resolve what's causing their distress",
      "Give them space, recognizing some people process emotions privately",
      "Offer physical comfort and reassurance through my presence"
    ],
    weight: 1.0
  },
  {
    id: "di_7",
    category: QuestionCategory.EmotionalIntelligence,
    question: "When you experience complex or conflicting emotions (like simultaneous anxiety, excitement, and uncertainty), how do you typically process them?",
    options: [
      "I journal or internally reflect until I understand each component feeling",
      "I talk through my emotions with someone who helps me gain clarity",
      "I identify the physical sensations associated with each emotion",
      "I analyze the situation triggering these emotions rather than the feelings themselves",
      "I accept the emotional complexity without needing to fully dissect it"
    ],
    weight: 0.9
  },
  {
    id: "di_8",
    category: QuestionCategory.EmotionalIntelligence,
    question: "When overwhelmed by strong negative emotions, which regulation strategy proves most effective for you personally?",
    options: [
      "Cognitive reframing - changing how I think about the situation",
      "Mindfulness practices - observing emotions without judgment",
      "Expressive techniques like physical activity or creative outlets",
      "Strategic distraction until I'm in a better state to process feelings",
      "Seeking support and discussing my feelings with others"
    ],
    weight: 1.0
  },
  {
    id: "di_9",
    category: QuestionCategory.EmotionalIntelligence,
    question: "In a heated disagreement about something you deeply care about, how do you typically handle conflicting viewpoints?",
    options: [
      "Listen carefully to understand the underlying values driving their perspective",
      "Express my position clearly while acknowledging valid points they make",
      "Focus on finding areas of agreement before addressing differences",
      "Regulate my emotional response first, then engage intellectually",
      "Ask questions to better understand their reasoning and experiences"
    ],
    weight: 1.0
  },
  {
    id: "di_10",
    category: QuestionCategory.EmotionalIntelligence,
    question: "When witnessing someone achieve significant professional success, which response most closely matches your genuine internal experience?",
    options: [
      "Pure joy and enthusiasm for their achievement",
      "Happiness for them mixed with some reflection on your own goals",
      "Appreciation of their success while recognizing the work behind it",
      "Curiosity about their process and what you might learn from them",
      "Motivated inspiration to pursue your own aspirations"
    ],
    weight: 0.8
  },
  
  // Cognitive Patterns (11-15)
  {
    id: "di_11",
    category: QuestionCategory.CognitivePatterns,
    question: "When acquiring a complex new skill or subject area, which approach yields the best results for you?",
    options: [
      "Building a theoretical foundation before attempting practical application",
      "Diving into hands-on practice and learning through trial and error",
      "Alternating between conceptual understanding and practical application",
      "Observing experts and then modeling their techniques with my own adaptations",
      "Breaking down the subject into smaller components to master sequentially"
    ],
    weight: 0.9
  },
  {
    id: "di_12",
    category: QuestionCategory.CognitivePatterns,
    question: "When faced with an ambiguous problem with no clear solution path, how do you typically approach it?",
    options: [
      "I explore multiple potential frameworks before committing to one approach",
      "I break it down into smaller, more defined components to tackle individually",
      "I seek analogies from seemingly unrelated fields that might provide insight",
      "I gather diverse perspectives to see the problem from different angles",
      "I start with what's certain and methodically work toward the uncertain areas"
    ],
    weight: 1.0
  },
  {
    id: "di_13",
    category: QuestionCategory.CognitivePatterns,
    question: "How do you respond when presented with compelling information that contradicts your existing beliefs?",
    options: [
      "I evaluate the new information's credibility and evidence regardless of my current beliefs",
      "I experience initial resistance but consciously examine both perspectives",
      "I integrate the new information with my existing knowledge where possible",
      "I seek additional sources and perspectives before modifying my views",
      "I welcome the contradiction as an opportunity to refine my understanding"
    ],
    weight: 1.0
  },
  {
    id: "di_14",
    category: QuestionCategory.CognitivePatterns,
    question: "In situations with high uncertainty but requiring decisions with significant consequences, which cognitive approach do you rely on most?",
    options: [
      "I identify the minimal critical information needed for a reasonable decision",
      "I trust my intuition based on pattern recognition from past experiences",
      "I create mental simulations of potential outcomes for different choices",
      "I establish clear principles to guide decisions when specific data is lacking",
      "I make provisional decisions that can be adjusted as more information emerges"
    ],
    weight: 0.9
  },
  {
    id: "di_15",
    category: QuestionCategory.CognitivePatterns,
    question: "How often and in what circumstances do you find yourself fundamentally revising your understanding of how something important works?",
    options: [
      "Frequently, whenever I encounter evidence that challenges my understanding",
      "Periodically, during dedicated reflection on my knowledge frameworks",
      "When a trusted source presents a compelling alternative perspective",
      "When my current understanding fails to produce expected outcomes",
      "Rarely for core principles, more often for their application in specific contexts"
    ],
    weight: 0.8
  },
  
  // Value Systems (16-20)
  {
    id: "di_16",
    category: QuestionCategory.ValueSystems,
    question: "If you had to prioritize one of these values above all others in your closest relationships, which would it be?",
    options: [
      "Complete honesty, even when uncomfortable truths are involved",
      "Loyalty and commitment, especially during challenging times",
      "Mutual growth and supporting each other's development",
      "Deep understanding and empathy for each other's experiences",
      "Respect for autonomy and personal boundaries"
    ],
    weight: 0.9
  },
  {
    id: "di_17",
    category: QuestionCategory.ValueSystems,
    question: "When making a major life decision that involves competing values, which consideration typically guides you most strongly?",
    options: [
      "Whether the decision aligns with my core ethical principles",
      "The potential impact on the wellbeing of those closest to me",
      "Which choice offers the greatest opportunity for personal growth",
      "The option that best balances multiple important priorities",
      "What feels most authentic to my sense of purpose and identity"
    ],
    weight: 1.0
  },
  {
    id: "di_18",
    category: QuestionCategory.ValueSystems,
    question: "In your view, what is the most fundamental responsibility we have toward society and others?",
    options: [
      "To minimize harm and prevent suffering whenever possible",
      "To uphold justice and fairness in our actions and systems",
      "To remain loyal to our communities and shared traditions",
      "To respect legitimate authority and social structures",
      "To preserve what is pure and sacred against degradation"
    ],
    weight: 0.9
  },
  {
    id: "di_19",
    category: QuestionCategory.ValueSystems,
    question: "Which quality do you most deeply admire and aspire to embody in your own life?",
    options: [
      "Moral courage - standing for what's right despite personal cost",
      "Wisdom - deep understanding applied with good judgment",
      "Compassion - genuine concern for others' wellbeing",
      "Authenticity - true alignment between values and actions",
      "Excellence - mastery and continuous improvement"
    ],
    weight: 0.8
  },
  {
    id: "di_20",
    category: QuestionCategory.ValueSystems,
    question: "If you could ensure your life embodied one type of meaningful impact, which would you choose?",
    options: [
      "Positively transforming individual lives through direct support",
      "Advancing knowledge or innovation that benefits humanity",
      "Creating beauty or meaning that inspires and moves others",
      "Building communities and connections between people",
      "Upholding important principles and being an example to others"
    ],
    weight: 1.0
  },
  
  // Motivation (21-25)
  {
    id: "di_21",
    category: QuestionCategory.Motivation,
    question: "When you commit deeply to pursuing a challenging long-term goal, what typically drives your persistence?",
    options: [
      "The intrinsic enjoyment of the activities involved",
      "The personal meaning or purpose the goal represents for you",
      "The opportunity to develop mastery and demonstrate competence",
      "The vision of the specific outcome or achievement",
      "The way it connects you to something larger than yourself"
    ],
    weight: 1.0
  },
  {
    id: "di_22",
    category: QuestionCategory.Motivation,
    question: "After successfully completing a significant project or achievement, what most strongly motivates your next steps?",
    options: [
      "Seeking a more challenging extension of what I've just accomplished",
      "Exploring an entirely different domain that intrigues me",
      "Deepening my expertise in an aspect I found particularly engaging",
      "Applying what I've learned to help others achieve similar goals",
      "Reflecting on the experience before determining my next direction"
    ],
    weight: 0.9
  },
  {
    id: "di_23",
    category: QuestionCategory.Motivation,
    question: "When facing a necessary but uninspiring task, which approach helps you maintain the highest quality of engagement?",
    options: [
      "Connecting it to a larger purpose or value that matters to me",
      "Finding creative ways to make the process itself more enjoyable",
      "Breaking it into smaller milestones with rewards for completion",
      "Transforming it into a challenge or opportunity to develop a skill",
      "Creating accountability through commitments to others"
    ],
    weight: 0.8
  },
  {
    id: "di_24",
    category: QuestionCategory.Motivation,
    question: "Which situation most significantly diminishes your motivation and sense of engagement?",
    options: [
      "When I don't have autonomy in how I approach the work",
      "When I don't understand the purpose behind what I'm doing",
      "When I receive little feedback about my progress or impact",
      "When the challenge level isn't well-matched to my capabilities",
      "When there's minimal connection with others in the process"
    ],
    weight: 0.9
  },
  {
    id: "di_25",
    category: QuestionCategory.Motivation,
    question: "In your experience, which element most powerfully sustains your motivation through difficulties and setbacks?",
    options: [
      "A clear and compelling vision of what I'm working toward",
      "Strong social support and encouragement from others",
      "Seeing tangible progress, even if small",
      "Connecting with my deeper values and why the goal matters",
      "The confidence gained from overcoming previous obstacles"
    ],
    weight: 1.0
  },
  
  // Resilience (26-30)
  {
    id: "di_26",
    category: QuestionCategory.Resilience,
    question: "Following a significant setback or failure, which approach most helps you recover and move forward?",
    options: [
      "Analyzing the experience for lessons and growth opportunities",
      "Connecting with supportive people who provide perspective",
      "Focusing on what aspects remain within my control",
      "Reconnecting with my core values and larger purpose",
      "Allowing myself to fully process the emotions before planning next steps"
    ],
    weight: 1.0
  },
  {
    id: "di_27",
    category: QuestionCategory.Resilience,
    question: "When experiencing prolonged stress, which coping mechanism proves most effective for maintaining your wellbeing?",
    options: [
      "Physical activity and attention to bodily needs",
      "Mindfulness practices and present-moment awareness",
      "Creative expression or immersion in meaningful activities",
      "Structured problem-solving and prioritization techniques",
      "Seeking connection and support from trusted others"
    ],
    weight: 0.9
  },
  {
    id: "di_28",
    category: QuestionCategory.Resilience,
    question: "How has your approach to adversity evolved based on challenging life experiences?",
    options: [
      "I've developed greater emotional regulation during difficult situations",
      "I more quickly identify what's within and beyond my control",
      "I'm more willing to seek and accept support from others",
      "I better recognize patterns and apply lessons from past challenges",
      "I've cultivated more self-compassion when facing struggles"
    ],
    weight: 0.9
  },
  {
    id: "di_29",
    category: QuestionCategory.Resilience,
    question: "When a long-term project encounters serious obstacles that threaten its completion, what most helps you persevere?",
    options: [
      "Remembering the meaningful purpose behind the work",
      "Breaking down problems into smaller, more manageable steps",
      "Adapting my approach or pivoting to alternative solutions",
      "Drawing on successful strategies from past challenges",
      "Gathering input and support from trusted collaborators"
    ],
    weight: 0.8
  },
  {
    id: "di_30",
    category: QuestionCategory.Resilience,
    question: "Looking back on your most significant challenges, which perspective most resonates with your experience?",
    options: [
      "They revealed strengths I didn't know I possessed",
      "They taught me what truly matters and clarified my priorities",
      "They connected me more deeply with supportive people in my life",
      "They forced me to develop new capabilities and approaches",
      "They showed me that I can handle more than I thought possible"
    ],
    weight: 1.0
  },
  
  // Social Interaction (31-35)
  {
    id: "di_31",
    category: QuestionCategory.SocialInteraction,
    question: "In conversations, which approach are you most likely to take?",
    options: [
      "Listen attentively, focusing on understanding the other person",
      "Share my thoughts, feelings, and experiences openly",
      "Ask questions to deepen the discussion",
      "Look for opportunities to find common ground",
      "Offer solutions or advice when I see a problem"
    ],
    weight: 0.8
  },
  {
    id: "di_32",
    category: QuestionCategory.SocialInteraction,
    question: "How do you typically navigate conflicts in important relationships?",
    options: [
      "Address issues directly with honest communication",
      "Look for compromise and common ground",
      "Take time to understand all perspectives before responding",
      "Focus on maintaining the relationship while working through issues",
      "Adapt my approach based on what the other person needs"
    ],
    weight: 0.9
  },
  {
    id: "di_33",
    category: QuestionCategory.SocialInteraction,
    question: "What role do social gatherings typically play in your life?",
    options: [
      "They energize me and are essential to my wellbeing",
      "I enjoy them in moderation but also need alone time",
      "I prefer small, intimate gatherings with close friends",
      "They're valuable opportunities for meaningful connection",
      "I tend to find them draining, though occasionally rewarding"
    ],
    weight: 0.7
  },
  {
    id: "di_34",
    category: QuestionCategory.SocialInteraction,
    question: "How easily do you form deep connections with new people?",
    options: [
      "Very easily – I connect deeply with people right away",
      "Moderately easily with people who share my interests or values",
      "It varies greatly depending on the person and context",
      "I'm selective and take time to develop deep connections",
      "I find it challenging but rewarding with the right people"
    ],
    weight: 0.8
  },
  {
    id: "di_35",
    category: QuestionCategory.SocialInteraction,
    question: "How important is it for you to be part of a community or group?",
    options: [
      "Essential – I thrive when I'm connected to a community",
      "Important for some aspects of life but not others",
      "I value a few close relationships over broader community",
      "I appreciate community support but maintain independence",
      "I prefer self-sufficiency and limited social entanglements"
    ],
    weight: 0.7
  },
  
  // Decision Making (36-40)
  {
    id: "di_36",
    category: QuestionCategory.DecisionMaking,
    question: "When making decisions with significant consequences, how much do you rely on intuition versus analysis?",
    options: [
      "Heavily analytical with little role for intuition",
      "Primarily analytical but intuition serves as a check",
      "Equal balance between analytical thinking and intuitive sensing",
      "Primarily intuitive but validated with analytical thinking",
      "Heavily intuitive with analysis as a secondary consideration"
    ],
    weight: 0.9
  },
  {
    id: "di_37",
    category: QuestionCategory.DecisionMaking,
    question: "How comfortable are you making consequential decisions with incomplete information?",
    options: [
      "Very comfortable – I can decide and adjust as needed",
      "Moderately comfortable if the situation requires quick action",
      "It depends on the stakes and consequences involved",
      "Somewhat uncomfortable – I prefer to gather more data first",
      "Very uncomfortable – I need thorough information before deciding"
    ],
    weight: 0.8
  },
  {
    id: "di_38",
    category: QuestionCategory.DecisionMaking,
    question: "After making an important decision, how often do you second-guess yourself?",
    options: [
      "Rarely – once I decide, I typically move forward confidently",
      "Occasionally, especially if I receive new information",
      "Sometimes, particularly for decisions with significant impact",
      "Often – I frequently wonder if I made the right choice",
      "It depends on the feedback and results I observe"
    ],
    weight: 0.7
  },
  {
    id: "di_39",
    category: QuestionCategory.DecisionMaking,
    question: "How do you typically approach decisions that affect others?",
    options: [
      "I consult those affected and consider their input carefully",
      "I try to anticipate needs and concerns of others independently",
      "I balance my judgment with consideration for others' perspectives",
      "I make the decision I believe is right and explain my reasoning",
      "I focus on objective criteria rather than subjective preferences"
    ],
    weight: 0.9
  },
  {
    id: "di_40",
    category: QuestionCategory.DecisionMaking,
    question: "What tends to be your biggest challenge in decision-making?",
    options: [
      "Overthinking and analysis paralysis",
      "Balancing logical and emotional considerations",
      "Managing time pressure or urgency",
      "Considering too many options or possibilities",
      "Confidence in my judgment without external validation"
    ],
    weight: 0.8
  },
  
  // Creativity (41-45)
  {
    id: "di_41",
    category: QuestionCategory.Creativity,
    question: "How do you typically generate new ideas or approaches?",
    options: [
      "Connecting seemingly unrelated concepts or fields",
      "Building upon and improving existing ideas",
      "Through collaboration and discussion with others",
      "During quiet reflection or meditative states",
      "By challenging assumptions and conventional thinking"
    ],
    weight: 0.9
  },
  {
    id: "di_42",
    category: QuestionCategory.Creativity,
    question: "When do you feel most creative or innovative?",
    options: [
      "When I'm under pressure with tight deadlines",
      "When I have unstructured time to explore possibilities",
      "When I'm collaborating with diverse perspectives",
      "When I'm in a relaxed, positive emotional state",
      "When I'm challenged by difficult problems or constraints"
    ],
    weight: 0.8
  },
  {
    id: "di_43",
    category: QuestionCategory.Creativity,
    question: "How important is creative expression in your life?",
    options: [
      "Essential – it's a primary way I understand and process experience",
      "Very important for specific aspects of my life and work",
      "Moderately important as one of several valuable pursuits",
      "Somewhat important, mainly as a recreational activity",
      "Relatively minor compared to other priorities and interests"
    ],
    weight: 0.7
  },
  {
    id: "di_44",
    category: QuestionCategory.Creativity,
    question: "How do you typically respond to unconventional or unusual ideas?",
    options: [
      "With excitement and eagerness to explore them further",
      "With curious interest but some practical skepticism",
      "By considering how they might be practically applied",
      "I evaluate them against established principles and knowledge",
      "I appreciate them intellectually but prefer proven approaches"
    ],
    weight: 0.8
  },
  {
    id: "di_45",
    category: QuestionCategory.Creativity,
    question: "What do you find most challenging about creative processes?",
    options: [
      "Translating abstract ideas into concrete reality",
      "Finding the right balance between novelty and practicality",
      "Managing self-doubt and internal criticism",
      "Maintaining momentum through implementation",
      "Knowing when something is truly finished or complete"
    ],
    weight: 0.7
  },
  
  // Leadership (46-50)
  {
    id: "di_46",
    category: QuestionCategory.Leadership,
    question: "What do you believe is the most important quality of effective leadership?",
    options: [
      "Clear vision and the ability to inspire others",
      "Emotional intelligence and understanding of people",
      "Strategic thinking and sound decision-making",
      "Integrity and leading by example",
      "Adaptability and responsiveness to change"
    ],
    weight: 0.9
  },
  {
    id: "di_47",
    category: QuestionCategory.Leadership,
    question: "How do you typically influence others toward a goal or perspective?",
    options: [
      "By clearly articulating the reasoning and benefits",
      "By demonstrating enthusiasm and conviction",
      "By listening to concerns and finding common ground",
      "By setting an example through my own actions",
      "By emphasizing shared values and principles"
    ],
    weight: 0.8
  },
  {
    id: "di_48",
    category: QuestionCategory.Leadership,
    question: "When in a leadership role, how do you handle disagreement or dissenting views?",
    options: [
      "I actively seek out diverse perspectives to test my thinking",
      "I listen carefully and integrate valid points into the approach",
      "I encourage open debate to find the best solution",
      "I appreciate the input but make the final decision myself",
      "I look for common ground and areas of consensus"
    ],
    weight: 0.9
  },
  {
    id: "di_49",
    category: QuestionCategory.Leadership,
    question: "How comfortable are you with taking charge in group situations?",
    options: [
      "Very comfortable – I naturally step into leadership roles",
      "Comfortable when I have expertise or feel responsible",
      "It depends on the context and the needs of the group",
      "I prefer to influence from within rather than leading formally",
      "I'm more comfortable supporting a capable leader"
    ],
    weight: 0.8
  },
  {
    id: "di_50",
    category: QuestionCategory.Leadership,
    question: "How do you typically respond when things go wrong under your leadership?",
    options: [
      "I take full responsibility and focus on solutions",
      "I analyze what happened to prevent similar issues",
      "I engage the team in problem-solving together",
      "I acknowledge the issue while maintaining morale",
      "I evaluate whether adjustments in approach are needed"
    ],
    weight: 0.9
  }
];

// Export a function to get all questions (default) or a subset for testing
export const getDeepInsightQuestions = (count = 50) => {
  return deepInsightQuestions.slice(0, Math.min(count, deepInsightQuestions.length));
};

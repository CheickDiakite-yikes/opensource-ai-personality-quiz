
import { DeepInsightQuestion } from "../types";

// This file now contains 100 comprehensive questions across multiple categories
export const deepInsightQuestions: DeepInsightQuestion[] = [
  // PERSONALITY CORE - Questions 1-10
  {
    id: "q1",
    question: "When faced with a difficult decision, I typically:",
    description: "Think about your natural response pattern in challenging situations",
    category: "personality",
    options: [
      { id: "q1-a", text: "Analyze all options methodically before deciding", value: 1 },
      { id: "q1-b", text: "Go with what feels right intuitively", value: 2 },
      { id: "q1-c", text: "Consider how others would handle it", value: 3 },
      { id: "q1-d", text: "Delay the decision until absolutely necessary", value: 4 },
    ],
  },
  {
    id: "q2",
    question: "In social gatherings, I am most often:",
    category: "personality",
    options: [
      { id: "q2-a", text: "The center of attention, energized by interaction", value: 1 },
      { id: "q2-b", text: "Engaging with a small group of close friends", value: 2 },
      { id: "q2-c", text: "Observing others and selectively participating", value: 3 },
      { id: "q2-d", text: "Feeling drained and looking forward to alone time", value: 4 },
    ],
  },
  {
    id: "q3",
    question: "My approach to personal growth is best described as:",
    category: "personality",
    options: [
      { id: "q3-a", text: "Setting clear goals with measurable outcomes", value: 1 },
      { id: "q3-b", text: "Following my passions wherever they lead me", value: 2 },
      { id: "q3-c", text: "Learning from mentors and role models", value: 3 },
      { id: "q3-d", text: "Reflecting deeply on past experiences", value: 4 },
    ],
  },
  {
    id: "q4",
    question: "When I experience failure, I typically:",
    category: "personality",
    options: [
      { id: "q4-a", text: "Analyze what went wrong to avoid future mistakes", value: 1 },
      { id: "q4-b", text: "Feel deeply disappointed but try to move forward", value: 2 },
      { id: "q4-c", text: "Seek support and perspective from others", value: 3 },
      { id: "q4-d", text: "Question my abilities and worry about future attempts", value: 4 },
    ],
  },
  {
    id: "q5",
    question: "My ideal work environment would be:",
    category: "personality",
    options: [
      { id: "q5-a", text: "Structured and organized with clear expectations", value: 1 },
      { id: "q5-b", text: "Creative and flexible with room for innovation", value: 2 },
      { id: "q5-c", text: "Collaborative with strong team relationships", value: 3 },
      { id: "q5-d", text: "Independent with minimal oversight", value: 4 },
    ],
  },
  {
    id: "q6",
    question: "When learning something new, I prefer to:",
    category: "personality",
    options: [
      { id: "q6-a", text: "Follow a structured, step-by-step approach", value: 1 },
      { id: "q6-b", text: "Experiment and learn through trial and error", value: 2 },
      { id: "q6-c", text: "Watch others demonstrate before trying myself", value: 3 },
      { id: "q6-d", text: "Research thoroughly before beginning practice", value: 4 },
    ],
  },
  {
    id: "q7",
    question: "I find the most satisfaction in achievements that:",
    category: "personality",
    options: [
      { id: "q7-a", text: "Are recognized and valued by others", value: 1 },
      { id: "q7-b", text: "Fulfill my own internal standards of success", value: 2 },
      { id: "q7-c", text: "Make a positive difference for others", value: 3 },
      { id: "q7-d", text: "Advance my knowledge and understanding", value: 4 },
    ],
  },
  {
    id: "q8",
    question: "When planning for the future, I tend to:",
    category: "personality",
    options: [
      { id: "q8-a", text: "Create detailed plans with specific milestones", value: 1 },
      { id: "q8-b", text: "Have general ideas but stay flexible to opportunities", value: 2 },
      { id: "q8-c", text: "Focus on relationships and lifestyle more than achievements", value: 3 },
      { id: "q8-d", text: "Worry about potential obstacles and challenges", value: 4 },
    ],
  },
  {
    id: "q9",
    question: "My room or workspace is usually:",
    category: "personality",
    options: [
      { id: "q9-a", text: "Neat and organized with everything in its place", value: 1 },
      { id: "q9-b", text: "Somewhat cluttered but with a system that works for me", value: 2 },
      { id: "q9-c", text: "Decorated to be comfortable and personally meaningful", value: 3 },
      { id: "q9-d", text: "Frequently changing based on current projects and interests", value: 4 },
    ],
  },
  {
    id: "q10",
    question: "When making moral or ethical decisions, I primarily consider:",
    category: "personality",
    options: [
      { id: "q10-a", text: "Universal principles of right and wrong", value: 1 },
      { id: "q10-b", text: "The specific circumstances and individuals involved", value: 2 },
      { id: "q10-c", text: "The impact on community and relationships", value: 3 },
      { id: "q10-d", text: "My personal values and intuitive sense", value: 4 },
    ],
  },
  
  // EMOTIONAL INTELLIGENCE - Questions 11-20
  {
    id: "q11",
    question: "When I experience strong emotions:",
    category: "emotional",
    options: [
      { id: "q11-a", text: "I can usually identify and name them precisely", value: 1 },
      { id: "q11-b", text: "I feel them intensely but sometimes struggle to identify them", value: 2 },
      { id: "q11-c", text: "I notice physical sensations before recognizing the emotion", value: 3 },
      { id: "q11-d", text: "I tend to rationalize or downplay my emotional responses", value: 4 },
    ],
  },
  {
    id: "q12",
    question: "When someone shares their problems with me:",
    category: "emotional",
    options: [
      { id: "q12-a", text: "I try to offer solutions and practical advice", value: 1 },
      { id: "q12-b", text: "I focus on listening and validating their feelings", value: 2 },
      { id: "q12-c", text: "I relate their experience to similar situations I've faced", value: 3 },
      { id: "q12-d", text: "I ask questions to understand the situation more deeply", value: 4 },
    ],
  },
  {
    id: "q13",
    question: "When I'm feeling overwhelmed, I typically:",
    category: "emotional",
    options: [
      { id: "q13-a", text: "Take time alone to process and regain composure", value: 1 },
      { id: "q13-b", text: "Talk through my feelings with someone I trust", value: 2 },
      { id: "q13-c", text: "Focus on solving the problems causing stress", value: 3 },
      { id: "q13-d", text: "Engage in physical activity or practical tasks", value: 4 },
    ],
  },
  {
    id: "q14",
    question: "How accurately can you predict how your actions will make others feel?",
    category: "emotional",
    options: [
      { id: "q14-a", text: "Very accurately - I'm highly attuned to others' emotional responses", value: 1 },
      { id: "q14-b", text: "Somewhat accurately, though I'm sometimes surprised", value: 2 },
      { id: "q14-c", text: "It depends on how well I know the person", value: 3 },
      { id: "q14-d", text: "I often find others' emotional responses unpredictable", value: 4 },
    ],
  },
  {
    id: "q15",
    question: "When facing criticism, I typically:",
    category: "emotional",
    options: [
      { id: "q15-a", text: "Consider it objectively and look for truth in it", value: 1 },
      { id: "q15-b", text: "Feel hurt initially but reflect on it later", value: 2 },
      { id: "q15-c", text: "Defend my actions or explain my reasoning", value: 3 },
      { id: "q15-d", text: "Question the critic's motives or understanding", value: 4 },
    ],
  },
  {
    id: "q16",
    question: "In emotionally charged conflicts, I tend to:",
    category: "emotional",
    options: [
      { id: "q16-a", text: "Stay calm and focus on finding rational solutions", value: 1 },
      { id: "q16-b", text: "Express my feelings openly while respecting others", value: 2 },
      { id: "q16-c", text: "Try to smooth things over and restore harmony", value: 3 },
      { id: "q16-d", text: "Need time to process before engaging constructively", value: 4 },
    ],
  },
  {
    id: "q17",
    question: "How often do you reflect on why you feel the way you do?",
    category: "emotional",
    options: [
      { id: "q17-a", text: "Very often - I regularly analyze my emotional responses", value: 1 },
      { id: "q17-b", text: "Sometimes, particularly for strong or persistent emotions", value: 2 },
      { id: "q17-c", text: "Occasionally, when someone prompts me to think about it", value: 3 },
      { id: "q17-d", text: "Rarely - I generally accept my feelings without analysis", value: 4 },
    ],
  },
  {
    id: "q18",
    question: "When someone is in distress, my most natural response is to:",
    category: "emotional",
    options: [
      { id: "q18-a", text: "Feel their distress deeply myself", value: 1 },
      { id: "q18-b", text: "Listen and validate their feelings", value: 2 },
      { id: "q18-c", text: "Offer practical help or solutions", value: 3 },
      { id: "q18-d", text: "Give them space to process their emotions", value: 4 },
    ],
  },
  {
    id: "q19",
    question: "When it comes to managing my emotions:",
    category: "emotional",
    options: [
      { id: "q19-a", text: "I can usually regulate my emotions effectively", value: 1 },
      { id: "q19-b", text: "I express emotions freely but recover quickly", value: 2 },
      { id: "q19-c", text: "Strong emotions sometimes overwhelm me", value: 3 },
      { id: "q19-d", text: "I tend to suppress or control emotional displays", value: 4 },
    ],
  },
  {
    id: "q20",
    question: "How important is emotional connection in your relationships?",
    category: "emotional",
    options: [
      { id: "q20-a", text: "Essential - I prioritize deep emotional intimacy", value: 1 },
      { id: "q20-b", text: "Very important, balanced with other aspects", value: 2 },
      { id: "q20-c", text: "Somewhat important, but I value independence too", value: 3 },
      { id: "q20-d", text: "I prefer connections based on shared activities or interests", value: 4 },
    ],
  },
  
  // COGNITIVE PATTERNS - Questions 21-30
  {
    id: "q21",
    question: "When solving complex problems, I prefer to:",
    category: "cognitive",
    options: [
      { id: "q21-a", text: "Break them down into smaller, manageable parts", value: 1 },
      { id: "q21-b", text: "Consider the big picture and overall patterns", value: 2 },
      { id: "q21-c", text: "Brainstorm multiple creative approaches", value: 3 },
      { id: "q21-d", text: "Draw on similar problems I've solved before", value: 4 },
    ],
  },
  {
    id: "q22",
    question: "When forming opinions, I prioritize:",
    category: "cognitive",
    options: [
      { id: "q22-a", text: "Logical reasoning and objective evidence", value: 1 },
      { id: "q22-b", text: "Personal experiences and observations", value: 2 },
      { id: "q22-c", text: "Input from experts and trusted sources", value: 3 },
      { id: "q22-d", text: "My intuition and what feels right", value: 4 },
    ],
  },
  {
    id: "q23",
    question: "How do you typically approach learning new subjects?",
    category: "cognitive",
    options: [
      { id: "q23-a", text: "Systematically studying fundamentals before applications", value: 1 },
      { id: "q23-b", text: "Diving in with practical applications and learning as needed", value: 2 },
      { id: "q23-c", text: "Finding connections to things I already understand", value: 3 },
      { id: "q23-d", text: "Exploring different perspectives and approaches", value: 4 },
    ],
  },
  {
    id: "q24",
    question: "When considering the future, I tend to:",
    category: "cognitive",
    options: [
      { id: "q24-a", text: "Make detailed plans based on likely outcomes", value: 1 },
      { id: "q24-b", text: "Imagine various possibilities and scenarios", value: 2 },
      { id: "q24-c", text: "Focus on immediate next steps rather than distant outcomes", value: 3 },
      { id: "q24-d", text: "Adapt to circumstances as they occur", value: 4 },
    ],
  },
  {
    id: "q25",
    question: "When explaining complex ideas to others, I typically:",
    category: "cognitive",
    options: [
      { id: "q25-a", text: "Use precise definitions and logical structure", value: 1 },
      { id: "q25-b", text: "Use analogies and real-world examples", value: 2 },
      { id: "q25-c", text: "Use visual aids or demonstrations", value: 3 },
      { id: "q25-d", text: "Adapt my explanation based on the listener's responses", value: 4 },
    ],
  },
  {
    id: "q26",
    question: "When I encounter information that contradicts my beliefs:",
    category: "cognitive",
    options: [
      { id: "q26-a", text: "I evaluate it critically based on credibility and evidence", value: 1 },
      { id: "q26-b", text: "I consider how it might change or refine my understanding", value: 2 },
      { id: "q26-c", text: "I compare it to my existing knowledge and experience", value: 3 },
      { id: "q26-d", text: "I feel skeptical until multiple sources confirm it", value: 4 },
    ],
  },
  {
    id: "q27",
    question: "My thinking tends to be most effective when:",
    category: "cognitive",
    options: [
      { id: "q27-a", text: "I focus deeply on one topic without distractions", value: 1 },
      { id: "q27-b", text: "I'm engaging with diverse perspectives and ideas", value: 2 },
      { id: "q27-c", text: "I'm collaborating and discussing with others", value: 3 },
      { id: "q27-d", text: "I'm under some pressure or time constraint", value: 4 },
    ],
  },
  {
    id: "q28",
    question: "When remembering past events, I most easily recall:",
    category: "cognitive",
    options: [
      { id: "q28-a", text: "Specific details and sequences of what happened", value: 1 },
      { id: "q28-b", text: "The emotions and personal significance of the experience", value: 2 },
      { id: "q28-c", text: "Visual images and the physical setting", value: 3 },
      { id: "q28-d", text: "The general impression rather than specific details", value: 4 },
    ],
  },
  {
    id: "q29",
    question: "I'm most motivated to think deeply about topics that:",
    category: "cognitive",
    options: [
      { id: "q29-a", text: "Present complex logical or abstract challenges", value: 1 },
      { id: "q29-b", text: "Have practical applications to real-world problems", value: 2 },
      { id: "q29-c", text: "Connect to human experiences and values", value: 3 },
      { id: "q29-d", text: "Allow for creative or innovative approaches", value: 4 },
    ],
  },
  {
    id: "q30",
    question: "When faced with ambiguity or uncertainty:",
    category: "cognitive",
    options: [
      { id: "q30-a", text: "I try to gather more information to reduce the uncertainty", value: 1 },
      { id: "q30-b", text: "I'm comfortable exploring multiple potential interpretations", value: 2 },
      { id: "q30-c", text: "I look for patterns or similarities to familiar situations", value: 3 },
      { id: "q30-d", text: "I focus on what's clear while tolerating some ambiguity", value: 4 },
    ],
  },
  
  // SOCIAL DYNAMICS - Questions 31-40
  {
    id: "q31",
    question: "In group situations, I typically:",
    category: "social",
    options: [
      { id: "q31-a", text: "Take on leadership or facilitation roles", value: 1 },
      { id: "q31-b", text: "Contribute actively to discussions and activities", value: 2 },
      { id: "q31-c", text: "Observe and listen before participating", value: 3 },
      { id: "q31-d", text: "Connect with individuals rather than the whole group", value: 4 },
    ],
  },
  {
    id: "q32",
    question: "My approach to building new friendships is:",
    category: "social",
    options: [
      { id: "q32-a", text: "Being outgoing and initiating conversations", value: 1 },
      { id: "q32-b", text: "Finding common interests or activities", value: 2 },
      { id: "q32-c", text: "Gradually developing trust over time", value: 3 },
      { id: "q32-d", text: "Connecting deeply with few rather than many", value: 4 },
    ],
  },
  {
    id: "q33",
    question: "When there's conflict in a group:",
    category: "social",
    options: [
      { id: "q33-a", text: "I try to mediate and find compromise", value: 1 },
      { id: "q33-b", text: "I advocate for what I believe is right", value: 2 },
      { id: "q33-c", text: "I try to understand all perspectives involved", value: 3 },
      { id: "q33-d", text: "I tend to distance myself from the conflict", value: 4 },
    ],
  },
  {
    id: "q34",
    question: "My social network tends to be:",
    category: "social",
    options: [
      { id: "q34-a", text: "Wide with many acquaintances and social connections", value: 1 },
      { id: "q34-b", text: "Balanced between close friends and broader connections", value: 2 },
      { id: "q34-c", text: "Small but with deep, long-lasting relationships", value: 3 },
      { id: "q34-d", text: "Variable depending on my life circumstances", value: 4 },
    ],
  },
  {
    id: "q35",
    question: "When communicating important ideas:",
    category: "social",
    options: [
      { id: "q35-a", text: "I'm direct and straightforward about my thoughts", value: 1 },
      { id: "q35-b", text: "I consider how my message will be received", value: 2 },
      { id: "q35-c", text: "I tailor my approach to each specific person", value: 3 },
      { id: "q35-d", text: "I prefer writing to speaking for complex ideas", value: 4 },
    ],
  },
  {
    id: "q36",
    question: "In close relationships, I value most:",
    category: "social",
    options: [
      { id: "q36-a", text: "Open, honest communication", value: 1 },
      { id: "q36-b", text: "Mutual support and reliability", value: 2 },
      { id: "q36-c", text: "Shared experiences and enjoyment", value: 3 },
      { id: "q36-d", text: "Respect for independence and boundaries", value: 4 },
    ],
  },
  {
    id: "q37",
    question: "When someone disagrees with my viewpoint:",
    category: "social",
    options: [
      { id: "q37-a", text: "I enjoy debating and defending my position", value: 1 },
      { id: "q37-b", text: "I'm curious about their reasoning and perspective", value: 2 },
      { id: "q37-c", text: "I look for points of common ground", value: 3 },
      { id: "q37-d", text: "I might reconsider my view if their argument is strong", value: 4 },
    ],
  },
  {
    id: "q38",
    question: "When someone needs emotional support, I typically:",
    category: "social",
    options: [
      { id: "q38-a", text: "Listen attentively without immediately offering advice", value: 1 },
      { id: "q38-b", text: "Help them analyze the problem and find solutions", value: 2 },
      { id: "q38-c", text: "Share similar experiences to show understanding", value: 3 },
      { id: "q38-d", text: "Offer practical help and tangible support", value: 4 },
    ],
  },
  {
    id: "q39",
    question: "In terms of social boundaries:",
    category: "social",
    options: [
      { id: "q39-a", text: "I'm quite open and readily share personal information", value: 1 },
      { id: "q39-b", text: "I adjust my openness depending on the relationship", value: 2 },
      { id: "q39-c", text: "I'm selective about what personal information I share", value: 3 },
      { id: "q39-d", text: "I prefer maintaining clear privacy boundaries", value: 4 },
    ],
  },
  {
    id: "q40",
    question: "When working with others on projects:",
    category: "social",
    options: [
      { id: "q40-a", text: "I enjoy collaborating and building on others' ideas", value: 1 },
      { id: "q40-b", text: "I prefer clearly defined individual responsibilities", value: 2 },
      { id: "q40-c", text: "I often take on coordination or leadership roles", value: 3 },
      { id: "q40-d", text: "I'm most productive when I can work independently", value: 4 },
    ],
  },
  
  // MOTIVATION & DRIVE - Questions 41-50
  {
    id: "q41",
    question: "What most often drives me to pursue goals is:",
    category: "motivation",
    options: [
      { id: "q41-a", text: "The desire to achieve excellence and mastery", value: 1 },
      { id: "q41-b", text: "Finding meaning and purpose in what I do", value: 2 },
      { id: "q41-c", text: "The excitement of new challenges and growth", value: 3 },
      { id: "q41-d", text: "Recognition and validation of my efforts", value: 4 },
    ],
  },
  {
    id: "q42",
    question: "When faced with setbacks or obstacles:",
    category: "motivation",
    options: [
      { id: "q42-a", text: "I persistently try different approaches until I succeed", value: 1 },
      { id: "q42-b", text: "I reassess whether the goal remains worthwhile", value: 2 },
      { id: "q42-c", text: "I seek advice or assistance from others", value: 3 },
      { id: "q42-d", text: "I may redirect my energy to more promising opportunities", value: 4 },
    ],
  },
  {
    id: "q43",
    question: "I feel most energized and motivated when:",
    category: "motivation",
    options: [
      { id: "q43-a", text: "I'm developing new skills and capabilities", value: 1 },
      { id: "q43-b", text: "I'm making tangible progress toward clear goals", value: 2 },
      { id: "q43-c", text: "My work positively impacts others", value: 3 },
      { id: "q43-d", text: "I'm free to follow my curiosity and interests", value: 4 },
    ],
  },
  {
    id: "q44",
    question: "When it comes to long-term commitments:",
    category: "motivation",
    options: [
      { id: "q44-a", text: "I'm driven by consistency and seeing things through", value: 1 },
      { id: "q44-b", text: "I need to maintain interest and engagement over time", value: 2 },
      { id: "q44-c", text: "I'm motivated by continual growth and evolution", value: 3 },
      { id: "q44-d", text: "I prefer flexibility to adapt as circumstances change", value: 4 },
    ],
  },
  {
    id: "q45",
    question: "The type of recognition that most motivates me is:",
    category: "motivation",
    options: [
      { id: "q45-a", text: "Specific acknowledgment of my skills and contributions", value: 1 },
      { id: "q45-b", text: "Seeing the direct impact of my work", value: 2 },
      { id: "q45-c", text: "Promotion or advancement opportunities", value: 3 },
      { id: "q45-d", text: "Autonomy and trust in my abilities", value: 4 },
    ],
  },
  {
    id: "q46",
    question: "When setting personal goals, I prioritize:",
    category: "motivation",
    options: [
      { id: "q46-a", text: "Ambitious outcomes that stretch my capabilities", value: 1 },
      { id: "q46-b", text: "Balanced growth across multiple life areas", value: 2 },
      { id: "q46-c", text: "Alignment with my core values and purpose", value: 3 },
      { id: "q46-d", text: "Realistic objectives I can confidently achieve", value: 4 },
    ],
  },
  {
    id: "q47",
    question: "What typically sustains my motivation over time is:",
    category: "motivation",
    options: [
      { id: "q47-a", text: "Visible progress and achievement of milestones", value: 1 },
      { id: "q47-b", text: "Connection to deeper meaning or purpose", value: 2 },
      { id: "q47-c", text: "Variety and new challenges along the way", value: 3 },
      { id: "q47-d", text: "Support and encouragement from others", value: 4 },
    ],
  },
  {
    id: "q48",
    question: "When I lack motivation for necessary tasks:",
    category: "motivation",
    options: [
      { id: "q48-a", text: "I use structured systems and routines to stay on track", value: 1 },
      { id: "q48-b", text: "I connect the task to larger goals or values", value: 2 },
      { id: "q48-c", text: "I find ways to make the task more interesting", value: 3 },
      { id: "q48-d", text: "I use rewards or consequences to motivate myself", value: 4 },
    ],
  },
  {
    id: "q49",
    question: "The potential outcomes that most motivate my decisions are:",
    category: "motivation",
    options: [
      { id: "q49-a", text: "Personal growth and self-improvement", value: 1 },
      { id: "q49-b", text: "Security and stability in my life", value: 2 },
      { id: "q49-c", text: "Positive impact on others or society", value: 3 },
      { id: "q49-d", text: "New experiences and enjoyment", value: 4 },
    ],
  },
  {
    id: "q50",
    question: "My motivation tends to be highest when:",
    category: "motivation",
    options: [
      { id: "q50-a", text: "I have autonomy over how I approach tasks", value: 1 },
      { id: "q50-b", text: "I'm working collaboratively with others", value: 2 },
      { id: "q50-c", text: "There are clear standards and expectations", value: 3 },
      { id: "q50-d", text: "The work aligns with my natural interests", value: 4 },
    ],
  },
  
  // VALUE SYSTEMS - Questions 51-60
  {
    id: "q51",
    question: "Which best describes your approach to truth and knowledge?",
    category: "values",
    options: [
      { id: "q51-a", text: "There are objective truths we should seek to understand", value: 1 },
      { id: "q51-b", text: "Truth is relative to perspective and context", value: 2 },
      { id: "q51-c", text: "Truth emerges through consensus and dialogue", value: 3 },
      { id: "q51-d", text: "Practical utility matters more than abstract truth", value: 4 },
    ],
  },
  {
    id: "q52",
    question: "Which of these values do you consider most fundamental?",
    category: "values",
    options: [
      { id: "q52-a", text: "Freedom and individual autonomy", value: 1 },
      { id: "q52-b", text: "Compassion and care for others", value: 2 },
      { id: "q52-c", text: "Justice and fairness", value: 3 },
      { id: "q52-d", text: "Tradition and respect for established wisdom", value: 4 },
    ],
  },
  {
    id: "q53",
    question: "When considering ethical dilemmas, I primarily focus on:",
    category: "values",
    options: [
      { id: "q53-a", text: "Universal principles that should apply to everyone", value: 1 },
      { id: "q53-b", text: "The specific context and individuals involved", value: 2 },
      { id: "q53-c", text: "The outcomes and consequences of different choices", value: 3 },
      { id: "q53-d", text: "Maintaining harmonious relationships and community", value: 4 },
    ],
  },
  {
    id: "q54",
    question: "I believe the best societies prioritize:",
    category: "values",
    options: [
      { id: "q54-a", text: "Individual rights and freedoms", value: 1 },
      { id: "q54-b", text: "Community welfare and collective good", value: 2 },
      { id: "q54-c", text: "Order, security, and stability", value: 3 },
      { id: "q54-d", text: "Equality and fair distribution of resources", value: 4 },
    ],
  },
  {
    id: "q55",
    question: "Which statement best reflects your view on authority?",
    category: "values",
    options: [
      { id: "q55-a", text: "Authority should be questioned and held accountable", value: 1 },
      { id: "q55-b", text: "Legitimate authority deserves respect and cooperation", value: 2 },
      { id: "q55-c", text: "Authority should be earned through competence", value: 3 },
      { id: "q55-d", text: "Authority works best when it serves those it governs", value: 4 },
    ],
  },
  {
    id: "q56",
    question: "Which quality do you most value in yourself and others?",
    category: "values",
    options: [
      { id: "q56-a", text: "Integrity and honesty", value: 1 },
      { id: "q56-b", text: "Kindness and compassion", value: 2 },
      { id: "q56-c", text: "Courage and determination", value: 3 },
      { id: "q56-d", text: "Wisdom and good judgment", value: 4 },
    ],
  },
  {
    id: "q57",
    question: "Regarding wealth and material resources:",
    category: "values",
    options: [
      { id: "q57-a", text: "They're important tools for freedom and opportunity", value: 1 },
      { id: "q57-b", text: "Their value depends on how they're used for good", value: 2 },
      { id: "q57-c", text: "Simple living often leads to greater contentment", value: 3 },
      { id: "q57-d", text: "Fair distribution is more important than accumulation", value: 4 },
    ],
  },
  {
    id: "q58",
    question: "I believe human nature is fundamentally:",
    category: "values",
    options: [
      { id: "q58-a", text: "Good but influenced by circumstances", value: 1 },
      { id: "q58-b", text: "A mix of positive and negative potentials", value: 2 },
      { id: "q58-c", text: "Primarily self-interested but capable of altruism", value: 3 },
      { id: "q58-d", text: "Shaped more by culture and society than inherent traits", value: 4 },
    ],
  },
  {
    id: "q59",
    question: "The legacy I would most like to leave is:",
    category: "values",
    options: [
      { id: "q59-a", text: "Having made a positive difference in others' lives", value: 1 },
      { id: "q59-b", text: "Having lived authentically according to my values", value: 2 },
      { id: "q59-c", text: "Having created something lasting and meaningful", value: 3 },
      { id: "q59-d", text: "Having continuously grown and evolved as a person", value: 4 },
    ],
  },
  {
    id: "q60",
    question: "On the question of free will versus determinism:",
    category: "values",
    options: [
      { id: "q60-a", text: "We have significant free will and moral responsibility", value: 1 },
      { id: "q60-b", text: "Our choices are constrained but still meaningful", value: 2 },
      { id: "q60-c", text: "External and internal factors strongly shape our choices", value: 3 },
      { id: "q60-d", text: "This theoretical question matters less than practical living", value: 4 },
    ],
  },
  
  // RESILIENCE & GROWTH - Questions 61-70
  {
    id: "q61",
    question: "When facing significant life challenges, I typically:",
    category: "resilience",
    options: [
      { id: "q61-a", text: "Analyze the problem systematically to find solutions", value: 1 },
      { id: "q61-b", text: "Draw strength from my values and sense of purpose", value: 2 },
      { id: "q61-c", text: "Rely on supportive relationships to help me through", value: 3 },
      { id: "q61-d", text: "Focus on acceptance and adapting to the new reality", value: 4 },
    ],
  },
  {
    id: "q62",
    question: "After experiencing failure or disappointment:",
    category: "resilience",
    options: [
      { id: "q62-a", text: "I quickly regroup and focus on next steps", value: 1 },
      { id: "q62-b", text: "I reflect deeply on lessons and personal growth", value: 2 },
      { id: "q62-c", text: "I process my emotions before moving forward", value: 3 },
      { id: "q62-d", text: "I sometimes struggle to regain momentum", value: 4 },
    ],
  },
  {
    id: "q63",
    question: "My capacity to adapt to unexpected changes is:",
    category: "resilience",
    options: [
      { id: "q63-a", text: "Very strong - I thrive on change and novelty", value: 1 },
      { id: "q63-b", text: "Good - I adjust after an initial adjustment period", value: 2 },
      { id: "q63-c", text: "Variable depending on the type of change", value: 3 },
      { id: "q63-d", text: "Challenging - I prefer stability and predictability", value: 4 },
    ],
  },
  {
    id: "q64",
    question: "During periods of high stress, I maintain wellbeing by:",
    category: "resilience",
    options: [
      { id: "q64-a", text: "Exercising or other physical activities", value: 1 },
      { id: "q64-b", text: "Mindfulness practices or spiritual activities", value: 2 },
      { id: "q64-c", text: "Connecting with supportive people", value: 3 },
      { id: "q64-d", text: "Creating structure and managing priorities", value: 4 },
    ],
  },
  {
    id: "q65",
    question: "When things don't go as planned:",
    category: "resilience",
    options: [
      { id: "q65-a", text: "I quickly pivot to alternative approaches", value: 1 },
      { id: "q65-b", text: "I see it as an opportunity to learn and improve", value: 2 },
      { id: "q65-c", text: "I try to accept what I cannot change", value: 3 },
      { id: "q65-d", text: "I analyze what went wrong before proceeding", value: 4 },
    ],
  },
  {
    id: "q66",
    question: "I derive strength during difficult times primarily from:",
    category: "resilience",
    options: [
      { id: "q66-a", text: "My inner beliefs and personal philosophy", value: 1 },
      { id: "q66-b", text: "Close relationships and social support", value: 2 },
      { id: "q66-c", text: "Past experiences overcoming challenges", value: 3 },
      { id: "q66-d", text: "Focusing on practical solutions and actions", value: 4 },
    ],
  },
  {
    id: "q67",
    question: "My attitude toward painful or difficult emotions is:",
    category: "resilience",
    options: [
      { id: "q67-a", text: "I accept them as natural and try to understand them", value: 1 },
      { id: "q67-b", text: "I express them and seek support when needed", value: 2 },
      { id: "q67-c", text: "I work through them by focusing on constructive actions", value: 3 },
      { id: "q67-d", text: "I try to maintain perspective and not let them overwhelm me", value: 4 },
    ],
  },
  {
    id: "q68",
    question: "When considering personal growth, I believe:",
    category: "resilience",
    options: [
      { id: "q68-a", text: "Challenges are essential opportunities for development", value: 1 },
      { id: "q68-b", text: "Gradual, consistent effort yields the best growth", value: 2 },
      { id: "q68-c", text: "Growth happens through reflection and self-awareness", value: 3 },
      { id: "q68-d", text: "Learning from others accelerates personal development", value: 4 },
    ],
  },
  {
    id: "q69",
    question: "My capacity to persevere toward long-term goals is:",
    category: "resilience",
    options: [
      { id: "q69-a", text: "Very strong - I consistently follow through", value: 1 },
      { id: "q69-b", text: "Strong when the goal remains meaningful to me", value: 2 },
      { id: "q69-c", text: "Variable depending on feedback and progress", value: 3 },
      { id: "q69-d", text: "Sometimes challenged by changing interests", value: 4 },
    ],
  },
  {
    id: "q70",
    question: "Looking back on difficult life experiences:",
    category: "resilience",
    options: [
      { id: "q70-a", text: "I can identify ways they made me stronger", value: 1 },
      { id: "q70-b", text: "They've helped me develop greater compassion", value: 2 },
      { id: "q70-c", text: "They've clarified what's truly important to me", value: 3 },
      { id: "q70-d", text: "I've learned valuable lessons about myself", value: 4 },
    ],
  },
  
  // CREATIVITY & INNOVATION - Questions 71-80
  {
    id: "q71",
    question: "When approaching creative tasks, I typically:",
    category: "creativity",
    options: [
      { id: "q71-a", text: "Generate many ideas before evaluating them", value: 1 },
      { id: "q71-b", text: "Build on existing concepts and improve them", value: 2 },
      { id: "q71-c", text: "Start with a structured plan or framework", value: 3 },
      { id: "q71-d", text: "Draw inspiration from diverse sources", value: 4 },
    ],
  },
  {
    id: "q72",
    question: "My relationship with rules and conventions is:",
    category: "creativity",
    options: [
      { id: "q72-a", text: "I often question them and seek alternatives", value: 1 },
      { id: "q72-b", text: "I understand their value but am willing to break them", value: 2 },
      { id: "q72-c", text: "I appreciate structure but add my own interpretation", value: 3 },
      { id: "q72-d", text: "I learn them thoroughly before considering deviations", value: 4 },
    ],
  },
  {
    id: "q73",
    question: "When seeking new ideas or solutions, I prefer to:",
    category: "creativity",
    options: [
      { id: "q73-a", text: "Brainstorm many possibilities without judgment", value: 1 },
      { id: "q73-b", text: "Look for connections between different domains", value: 2 },
      { id: "q73-c", text: "Research how others have approached similar problems", value: 3 },
      { id: "q73-d", text: "Experiment with hands-on prototypes or trials", value: 4 },
    ],
  },
  {
    id: "q74",
    question: "I feel most creative when:",
    category: "creativity",
    options: [
      { id: "q74-a", text: "I have unstructured time to explore freely", value: 1 },
      { id: "q74-b", text: "I'm collaborating with diverse perspectives", value: 2 },
      { id: "q74-c", text: "I'm responding to a specific challenge or constraint", value: 3 },
      { id: "q74-d", text: "I'm in a relaxed but focused mental state", value: 4 },
    ],
  },
  {
    id: "q75",
    question: "When evaluating creative ideas, I prioritize:",
    category: "creativity",
    options: [
      { id: "q75-a", text: "Originality and novelty", value: 1 },
      { id: "q75-b", text: "Practical utility and implementation", value: 2 },
      { id: "q75-c", text: "Depth and meaningful impact", value: 3 },
      { id: "q75-d", text: "Elegance and aesthetic quality", value: 4 },
    ],
  },
  {
    id: "q76",
    question: "My preferred approach to innovation is:",
    category: "creativity",
    options: [
      { id: "q76-a", text: "Radical rethinking of fundamental assumptions", value: 1 },
      { id: "q76-b", text: "Incremental improvements to existing systems", value: 2 },
      { id: "q76-c", text: "Adapting ideas from one context to another", value: 3 },
      { id: "q76-d", text: "Combining existing elements in new ways", value: 4 },
    ],
  },
  {
    id: "q77",
    question: "When my creative work is criticized:",
    category: "creativity",
    options: [
      { id: "q77-a", text: "I consider it valuable feedback for improvement", value: 1 },
      { id: "q77-b", text: "I evaluate whether it aligns with my vision", value: 2 },
      { id: "q77-c", text: "I feel personally affected but try to learn from it", value: 3 },
      { id: "q77-d", text: "I test the critique against my own standards", value: 4 },
    ],
  },
  {
    id: "q78",
    question: "The role of intuition in my creative process is:",
    category: "creativity",
    options: [
      { id: "q78-a", text: "Central - I strongly trust my intuitive insights", value: 1 },
      { id: "q78-b", text: "Important but balanced with analytical thinking", value: 2 },
      { id: "q78-c", text: "Useful as a starting point for further development", value: 3 },
      { id: "q78-d", text: "Secondary to more systematic approaches", value: 4 },
    ],
  },
  {
    id: "q79",
    question: "When I have a creative block:",
    category: "creativity",
    options: [
      { id: "q79-a", text: "I switch to a completely different activity", value: 1 },
      { id: "q79-b", text: "I seek inspiration from external sources", value: 2 },
      { id: "q79-c", text: "I break the problem into smaller parts", value: 3 },
      { id: "q79-d", text: "I use specific creativity techniques or exercises", value: 4 },
    ],
  },
  {
    id: "q80",
    question: "I believe the most important factor for creativity is:",
    category: "creativity",
    options: [
      { id: "q80-a", text: "Openness to experience and curiosity", value: 1 },
      { id: "q80-b", text: "Technical skill and domain knowledge", value: 2 },
      { id: "q80-c", text: "Persistence and willingness to iterate", value: 3 },
      { id: "q80-d", text: "Freedom from judgment and constraints", value: 4 },
    ],
  },
  
  // LEADERSHIP STYLE - Questions 81-90
  {
    id: "q81",
    question: "My natural approach to leading others is:",
    category: "leadership",
    options: [
      { id: "q81-a", text: "Inspiring a shared vision and purpose", value: 1 },
      { id: "q81-b", text: "Empowering individuals and delegating authority", value: 2 },
      { id: "q81-c", text: "Providing clear direction and structure", value: 3 },
      { id: "q81-d", text: "Leading by example and personal excellence", value: 4 },
    ],
  },
  {
    id: "q82",
    question: "When making decisions as a leader, I prioritize:",
    category: "leadership",
    options: [
      { id: "q82-a", text: "Gathering diverse input before deciding", value: 1 },
      { id: "q82-b", text: "Efficiency and decisive action", value: 2 },
      { id: "q82-c", text: "Alignment with core values and mission", value: 3 },
      { id: "q82-d", text: "Analyzing data and potential outcomes", value: 4 },
    ],
  },
  {
    id: "q83",
    question: "How do you typically motivate others?",
    category: "leadership",
    options: [
      { id: "q83-a", text: "Connecting their work to meaningful purpose", value: 1 },
      { id: "q83-b", text: "Recognizing achievements and providing feedback", value: 2 },
      { id: "q83-c", text: "Setting challenging but achievable goals", value: 3 },
      { id: "q83-d", text: "Creating opportunities for growth and development", value: 4 },
    ],
  },
  {
    id: "q84",
    question: "When there's disagreement within a team I'm leading:",
    category: "leadership",
    options: [
      { id: "q84-a", text: "I encourage open discussion of different viewpoints", value: 1 },
      { id: "q84-b", text: "I focus on finding common ground and consensus", value: 2 },
      { id: "q84-c", text: "I emphasize our shared goals and priorities", value: 3 },
      { id: "q84-d", text: "I make a clear decision after hearing perspectives", value: 4 },
    ],
  },
  {
    id: "q85",
    question: "I believe effective leadership primarily requires:",
    category: "leadership",
    options: [
      { id: "q85-a", text: "Emotional intelligence and people skills", value: 1 },
      { id: "q85-b", text: "Strategic vision and decisiveness", value: 2 },
      { id: "q85-c", text: "Integrity and strong ethical foundation", value: 3 },
      { id: "q85-d", text: "Adaptability and continuous learning", value: 4 },
    ],
  },
  {
    id: "q86",
    question: "When developing team members, I focus most on:",
    category: "leadership",
    options: [
      { id: "q86-a", text: "Identifying and leveraging their unique strengths", value: 1 },
      { id: "q86-b", text: "Providing regular constructive feedback", value: 2 },
      { id: "q86-c", text: "Creating challenging growth opportunities", value: 3 },
      { id: "q86-d", text: "Building their confidence and self-efficacy", value: 4 },
    ],
  },
  {
    id: "q87",
    question: "My approach to handling mistakes or failures in a team is:",
    category: "leadership",
    options: [
      { id: "q87-a", text: "Focus on learning and improvement, not blame", value: 1 },
      { id: "q87-b", text: "Address issues directly but constructively", value: 2 },
      { id: "q87-c", text: "Create systems to prevent similar problems", value: 3 },
      { id: "q87-d", text: "Model accountability by acknowledging my own role", value: 4 },
    ],
  },
  {
    id: "q88",
    question: "When implementing change, I typically:",
    category: "leadership",
    options: [
      { id: "q88-a", text: "Communicate a compelling vision for the change", value: 1 },
      { id: "q88-b", text: "Involve stakeholders in planning the process", value: 2 },
      { id: "q88-c", text: "Provide clear rationale and expected outcomes", value: 3 },
      { id: "q88-d", text: "Address concerns and support adaptation", value: 4 },
    ],
  },
  {
    id: "q89",
    question: "How do you typically handle power and authority?",
    category: "leadership",
    options: [
      { id: "q89-a", text: "Share it broadly through delegation and empowerment", value: 1 },
      { id: "q89-b", text: "Exercise it thoughtfully with awareness of impact", value: 2 },
      { id: "q89-c", text: "Use it primarily to remove obstacles for others", value: 3 },
      { id: "q89-d", text: "Focus on earning trust and credibility", value: 4 },
    ],
  },
  {
    id: "q90",
    question: "My greatest strength as a leader is:",
    category: "leadership",
    options: [
      { id: "q90-a", text: "Building strong relationships and trust", value: 1 },
      { id: "q90-b", text: "Strategic thinking and vision", value: 2 },
      { id: "q90-c", text: "Execution and achieving results", value: 3 },
      { id: "q90-d", text: "Developing others and building teams", value: 4 },
    ],
  },
  
  // SELF-AWARENESS - Questions 91-100
  {
    id: "q91",
    question: "How accurately do you believe you understand your own strengths and limitations?",
    category: "mindfulness",
    options: [
      { id: "q91-a", text: "Very accurately - I have deep self-knowledge", value: 1 },
      { id: "q91-b", text: "Fairly accurately, though I'm still discovering aspects", value: 2 },
      { id: "q91-c", text: "I'm more aware of some areas than others", value: 3 },
      { id: "q91-d", text: "I sometimes surprise myself with unknown capacities", value: 4 },
    ],
  },
  {
    id: "q92",
    question: "How often do you deliberately reflect on your thoughts, feelings, and behaviors?",
    category: "mindfulness",
    options: [
      { id: "q92-a", text: "Very frequently - it's a regular practice", value: 1 },
      { id: "q92-b", text: "Often, especially when facing challenges", value: 2 },
      { id: "q92-c", text: "Sometimes, when prompted by circumstances", value: 3 },
      { id: "q92-d", text: "Occasionally, but I'm more action-oriented", value: 4 },
    ],
  },
  {
    id: "q93",
    question: "When you receive feedback that contradicts your self-perception:",
    category: "mindfulness",
    options: [
      { id: "q93-a", text: "I'm very curious and explore it deeply", value: 1 },
      { id: "q93-b", text: "I consider it thoughtfully but trust my self-knowledge", value: 2 },
      { id: "q93-c", text: "I may feel defensive initially but reflect later", value: 3 },
      { id: "q93-d", text: "I evaluate it against other feedback I've received", value: 4 },
    ],
  },
  {
    id: "q94",
    question: "How aware are you of how your behavior affects others?",
    category: "mindfulness",
    options: [
      { id: "q94-a", text: "Highly aware and attentive to others' responses", value: 1 },
      { id: "q94-b", text: "Generally aware, though sometimes surprised", value: 2 },
      { id: "q94-c", text: "More aware in some contexts than others", value: 3 },
      { id: "q94-d", text: "I focus more on intentions than impacts", value: 4 },
    ],
  },
  {
    id: "q95",
    question: "How well do you understand the patterns in your emotional responses?",
    category: "mindfulness",
    options: [
      { id: "q95-a", text: "Very well - I recognize clear patterns and triggers", value: 1 },
      { id: "q95-b", text: "Fairly well, though some emotions still surprise me", value: 2 },
      { id: "q95-c", text: "I understand some patterns better than others", value: 3 },
      { id: "q95-d", text: "I'm still working on identifying these patterns", value: 4 },
    ],
  },
  {
    id: "q96",
    question: "How conscious are you of the values that guide your important decisions?",
    category: "mindfulness",
    options: [
      { id: "q96-a", text: "Very conscious - I explicitly consider my values", value: 1 },
      { id: "q96-b", text: "Mostly aware, though sometimes in retrospect", value: 2 },
      { id: "q96-c", text: "I have a general sense but don't always articulate them", value: 3 },
      { id: "q96-d", text: "I act more on practical considerations than abstract values", value: 4 },
    ],
  },
  {
    id: "q97",
    question: "To what extent do you notice your mind wandering during everyday activities?",
    category: "mindfulness",
    options: [
      { id: "q97-a", text: "I'm very present and rarely find my mind wandering", value: 1 },
      { id: "q97-b", text: "I notice quickly when my mind wanders and refocus", value: 2 },
      { id: "q97-c", text: "I'm more present for some activities than others", value: 3 },
      { id: "q97-d", text: "My mind often explores tangents and connections", value: 4 },
    ],
  },
  {
    id: "q98",
    question: "How well do you recognize when your stress levels are increasing?",
    category: "mindfulness",
    options: [
      { id: "q98-a", text: "Very quickly through physical and mental signals", value: 1 },
      { id: "q98-b", text: "Fairly well, though sometimes after it's significant", value: 2 },
      { id: "q98-c", text: "I recognize clear signs but might miss subtler ones", value: 3 },
      { id: "q98-d", text: "Others sometimes notice before I do", value: 4 },
    ],
  },
  {
    id: "q99",
    question: "How would you describe your awareness of your own biases and assumptions?",
    category: "mindfulness",
    options: [
      { id: "q99-a", text: "Highly aware and actively working to recognize them", value: 1 },
      { id: "q99-b", text: "Generally aware but still discovering blind spots", value: 2 },
      { id: "q99-c", text: "Aware of major biases but probably miss subtler ones", value: 3 },
      { id: "q99-d", text: "I try to be objective and not influenced by bias", value: 4 },
    ],
  },
  {
    id: "q100",
    question: "When making important life choices, how connected are you to your authentic self?",
    category: "mindfulness",
    options: [
      { id: "q100-a", text: "Deeply connected to my core values and true self", value: 1 },
      { id: "q100-b", text: "Generally aligned though sometimes influenced by external factors", value: 2 },
      { id: "q100-c", text: "Still discovering what authenticity means for me", value: 3 },
      { id: "q100-d", text: "I focus more on practical considerations than authenticity", value: 4 },
    ],
  }
];

export interface AssessmentOption {
  id: number; // Simple 1-6 identifier for the option within the question
  text: string;
}

export interface AssessmentQuestion {
  id: number; // Unique ID for the question (1-100)
  category: string;
  questionText: string;
  options: AssessmentOption[];
}

export const deepAssessmentQuestions: AssessmentQuestion[] = [
  // === Personality (8 Questions) ===
  {
    id: 1,
    category: "Personality",
    questionText: "In social gatherings where you don't know many people, you tend to:",
    options: [
      { id: 1, text: "Observe quietly first, then approach individuals who seem interesting or open." },
      { id: 2, text: "Introduce yourself proactively to several people or groups to get a feel for the room." },
      { id: 3, text: "Stick close to the few people you do know, engaging primarily with them." },
      { id: 4, text: "Find a comfortable spot and wait for others to initiate conversation with you." },
      { id: 5, text: "(N) Focus on an activity (like checking your phone or getting food) to appear occupied and avoid initiating." }, // Disguised: Social anxiety / avoidance
      { id: 6, text: "(N) Attach yourself quickly to the most outgoing or seemingly important person/group." } // Disguised: Social climbing / insecurity
    ]
  },
  {
    id: 2,
    category: "Personality",
    questionText: "When planning a weekend trip, your primary style is:",
    options: [
      { id: 1, text: "Detailed Itinerary: Schedule activities, book accommodations/restaurants in advance." },
      { id: 2, text: "Flexible Outline: Have a general destination and ideas, but leave room for spontaneity." },
      { id: 3, text: "Spontaneous: Decide where to go and what to do closer to the time or even during the trip." },
      { id: 4, text: "Collaborative: Prefer to plan it together with travel companions, balancing everyone's preferences." },
      { id: 5, text: "(N) Minimal Effort: Prefer if someone else handles most of the planning details." }, // Disguised: Passivity / Lack of initiative
      { id: 6, text: "(N) Overly Ambitious: Try to pack too many activities or destinations into a short time." } // Disguised: Poor planning / Fear of missing out / Lack of realism
    ]
  },
  {
    id: 3,
    category: "Personality",
    questionText: "How do you typically react to unexpected changes in your routine or plans?",
    options: [
      { id: 1, text: "Adapt readily: Assess the new situation and adjust your plans accordingly without much stress." },
      { id: 2, text: "Feel initially flustered: Experience some stress or annoyance but adapt after a short period." },
      { id: 3, text: "Seek stability: Try to find ways to stick to the original plan or minimize the disruption." },
      { id: 4, text: "Embrace the novelty: See it as an opportunity for something new or different." },
      { id: 5, text: "(N) Complain or vent: Express frustration significantly before (or instead of) adapting." }, // Disguised: Poor adaptability / Negativity
      { id: 6, text: "(N) Become rigid: Resist the change strongly, potentially creating conflict or shutting down." } // Disguised: Inflexibility / Need for control
    ]
  },
  {
    id: 4,
    category: "Personality",
    questionText: "Your approach to trying new experiences (e.g., food, hobbies, travel) is generally:",
    options: [
      { id: 1, text: "Eager: Actively seek out new things and enjoy the novelty and learning." },
      { id: 2, text: "Cautiously Optimistic: Willing to try new things if they seem appealing or are recommended." },
      { id: 3, text: "Comfort-Oriented: Prefer familiar experiences but occasionally try something new." },
      { id: 4, text: "Selective: Only try new things that align closely with existing interests or values." },
      { id: 5, text: "(N) Skeptical/Resistant: Tend to find reasons why a new experience might not be enjoyable or worthwhile." }, // Disguised: Closed-mindedness / Neophobia
      { id: 6, text: "(N) Impulsive Trend-Follower: Jump onto new experiences mainly because they are popular or novel, without deep consideration." } // Disguised: Lack of self-direction / Need for external validation
    ]
  },
   {
    id: 5,
    category: "Personality",
    questionText: "When working on a long-term project, you find motivation primarily through:",
    options: [
      { id: 1, text: "The end goal: Visualizing the final achievement keeps you going." },
      { id: 2, text: "Milestones: Breaking it down and celebrating small wins along the way." },
      { id: 3, text: "The process: Enjoying the day-to-day tasks and learning involved." },
      { id: 4, text: "External validation: Positive feedback or recognition from others fuels your effort." },
      { id: 5, text: "(N) Pressure/Deadlines: Working best only when facing an imminent deadline or external pressure." }, // Disguised: Procrastination / Poor intrinsic motivation
      { id: 6, text: "(N) Fear of failure: Driven more by the anxiety of not succeeding than the joy of accomplishment." } // Disguised: Anxiety-driven / Potential perfectionism issues
    ]
  },
  {
    id: 6,
    category: "Personality",
    questionText: "How do you typically handle alone time?",
    options: [
      { id: 1, text: "Energizing: Regularly need and enjoy solitude to recharge and pursue personal interests." },
      { id: 2, text: "Restorative: Appreciate it occasionally for rest but generally prefer social interaction." },
      { id: 3, text: "Neutral: Neither actively seek nor avoid it; depends on the mood." },
      { id: 4, text: "Activity-focused: Use it productively for tasks or hobbies, rather than just relaxing." },
      { id: 5, text: "(N) Uncomfortable/Boring: Tend to feel restless, bored, or lonely when alone for extended periods." }, // Disguised: Low self-sufficiency / External focus
      { id: 6, text: "(N) Escapist: Use it primarily to withdraw and avoid social interaction or responsibilities." } // Disguised: Avoidance / Potential social anxiety
    ]
  },
  {
    id: 7,
    category: "Personality",
    questionText: "When learning a new complex skill, you prefer to:",
    options: [
      { id: 1, text: "Structured Learning: Follow a course or guide step-by-step." },
      { id: 2, text: "Dive In: Start experimenting and learn through trial and error." },
      { id: 3, text: "Conceptual First: Understand the underlying principles thoroughly before practicing." },
      { id: 4, text: "Learn with Others: Prefer group settings or learning alongside peers/mentors." },
      { id: 5, text: "(N) Seek Shortcuts: Look for the quickest way to appear competent, even if foundational understanding is weak." }, // Disguised: Superficiality / Lack of thoroughness
      { id: 6, text: "(N) Get Easily Discouraged: Give up relatively quickly if progress isn't immediate or easy." } // Disguised: Low persistence / Fixed mindset
    ]
  },
  {
    id: 8,
    category: "Personality",
    questionText: "Your living or workspace environment tends to be:",
    options: [
      { id: 1, text: "Highly Organized: Everything has a specific place; clutter is minimized." },
      { id: 2, text: "Functionally Organized: Generally tidy in work areas, but less so elsewhere; organized chaos." },
      { id: 3, text: "Comfortably Lived-In: Some clutter is fine; prioritize comfort and accessibility over perfect order." },
      { id: 4, text: "Aesthetically Focused: Prioritize appearance and style, even if it means less practical organization." },
      { id: 5, text: "(N) Consistently Messy: Difficulty maintaining order; clutter tends to accumulate significantly." }, // Disguised: Disorganization / Potential overwhelm
      { id: 6, text: "(N) Sterile/Minimalist to an Extreme: Avoid personal items or any sign of 'life' to maintain strict control." } // Disguised: Rigidity / Need for control / Potential detachment
    ]
  },

  // === Emotional (8 Questions) ===
   {
    id: 9,
    category: "Emotional",
    questionText: "When someone criticizes your work or an idea you care about, how do you typically react internally *first*?",
    options: [
      { id: 1, text: "Reflect objectively: Consider the feedback's validity, separating it from personal feelings to see if there's truth in it." },
      { id: 2, text: "Feel hurt/defensive: Experience a strong emotional sting, feeling personally attacked or misunderstood." },
      { id: 3, text: "Seek clarification: Focus on understanding the critic's perspective and the reasoning behind their feedback before forming an emotional response." },
      { id: 4, text: "Feel determined: See the criticism as a challenge to overcome, motivating you to improve or prove them wrong." },
      { id: 5, text: "(N) Dismiss the source: Quickly decide the critic is unqualified, biased, or doesn't understand, thus invalidating the feedback mentally." }, // Disguised: Arrogance / Defensiveness
      { id: 6, text: "(N) Ruminate on unfairness: Dwell on how the criticism was delivered poorly or seemed unjust, focusing on the interpersonal slight rather than the content." } // Disguised: Victim mentality / Emotional dysregulation
    ]
  },
  {
    id: 10,
    category: "Emotional",
    questionText: "You find yourself unexpectedly overwhelmed with a strong negative emotion (e.g., intense frustration, sadness, anxiety). Your immediate go-to strategy is often to:",
    options: [
      { id: 1, text: "Acknowledge and explore: Pause to identify the emotion and its likely trigger, allowing yourself to feel it without judgment before deciding how to act." },
      { id: 2, text: "Distract yourself: Immediately seek out an unrelated activity, conversation, or entertainment to shift your focus away from the feeling." },
      { id: 3, text: "Analyze the problem: Shift focus to the external situation causing the emotion, trying to logically solve the underlying issue that triggered it." },
      { id: 4, text: "Seek support: Reach out to a friend, partner, or mentor to talk through the feeling and gain perspective or comfort." },
      { id: 5, text: "(N) Suppress and push through: Force yourself to ignore the feeling and carry on with tasks as if nothing is wrong, perhaps increasing your workload." }, // Disguised: Suppression / Avoidance / Lack of self-care
      { id: 6, text: "(N) Vent intensely/immediately: Express the emotion strongly and perhaps disproportionately to whoever is nearby or through immediate action, seeking quick release." } // Disguised: Poor impulse control / Emotional dumping
    ]
  },
   {
    id: 11,
    category: "Emotional",
    questionText: "When you witness someone else experiencing distress or sadness, your instinct is to:",
    options: [
      { id: 1, text: "Offer empathy and support: Listen attentively and express understanding and care." },
      { id: 2, text: "Offer practical help: Focus on finding solutions or taking action to alleviate their problem." },
      { id: 3, text: "Give them space: Assume they might prefer privacy unless they explicitly ask for help." },
      { id: 4, text: "Share a similar experience: Relate their situation to your own past struggles to show solidarity." },
      { id: 5, text: "(N) Feel awkward and withdraw: Become uncomfortable and try to subtly remove yourself from the situation." }, // Disguised: Lack of empathy / Emotional discomfort
      { id: 6, text: "(N) Minimize their feelings: Try to cheer them up quickly or tell them it's 'not that bad', invalidating their emotion." } // Disguised: Toxic positivity / Discomfort with negative emotions
    ]
  },
  {
    id: 12,
    category: "Emotional",
    questionText: "Reflecting on past mistakes or failures tends to make you feel:",
    options: [
      { id: 1, text: "Analytical: Focus on understanding what went wrong and what can be learned for the future." },
      { id: 2, text: "Regretful but accepting: Acknowledge the mistake and the associated feelings, but focus on moving forward." },
      { id: 3, text: "Motivated: Use the memory as fuel to work harder and avoid similar errors." },
      { id: 4, text: "Forgiving (of self): Recognize it was a learning experience and practice self-compassion." },
      { id: 5, text: "(N) Shameful/Self-critical: Dwell on the mistake with harsh self-judgment, finding it hard to let go." }, // Disguised: Poor self-esteem / Perfectionism
      { id: 6, text: "(N) Blame-oriented: Tend to focus on external factors or other people who contributed to the failure, minimizing personal responsibility." } // Disguised: External locus of control / Avoidance of accountability
    ]
  },
  {
    id: 13,
    category: "Emotional",
    questionText: "How comfortable are you expressing vulnerability or 'softer' emotions (e.g., sadness, fear, deep affection)?",
    options: [
      { id: 1, text: "Very comfortable: Share openly and appropriately with trusted individuals." },
      { id: 2, text: "Moderately comfortable: Can share with close relations but requires significant trust and the right context." },
      { id: 3, text: "Somewhat uncomfortable: Tend to keep such feelings private unless absolutely necessary to share." },
      { id: 4, text: "Context-dependent: More comfortable in certain situations (e.g., romantic relationships) than others (e.g., work)." },
      { id: 5, text: "(N) Highly uncomfortable/Avoidant: Actively avoid situations requiring vulnerability; may use humor or stoicism to deflect." }, // Disguised: Fear of intimacy / Emotional suppression
      { id: 6, text: "(N) Over-sharing/Boundaryless: Tend to express vulnerability excessively or inappropriately, potentially overwhelming others." } // Disguised: Poor boundaries / Attention-seeking / Lack of regulation
    ]
  },
  {
    id: 14,
    category: "Emotional",
    questionText: "When you achieve a significant personal success, your primary emotional response is:",
    options: [
      { id: 1, text: "Joy and satisfaction: Feel genuinely happy and proud of the accomplishment." },
      { id: 2, text: "Relief: Feel glad the effort is over and that you didn't fail." },
      { id: 3, text: "Gratitude: Focus on appreciating the help or circumstances that contributed." },
      { id: 4, text: "Anticipation: Immediately start thinking about the next goal or challenge." },
      { id: 5, text: "(N) Downplaying/Minimizing: Tend to diminish the achievement or attribute it solely to luck." }, // Disguised: Imposter syndrome / Low self-worth
      { id: 6, text: "(N) Anxious about sustainability: Worry about whether you can maintain this level of success or repeat it." } // Disguised: Anxiety / Fear of future failure
    ]
  },
  {
    id: 15,
    category: "Emotional",
    questionText: "How easily do you tend to forgive others for significant wrongdoings?",
    options: [
      { id: 1, text: "Relatively easily: Believe in giving second chances and letting go of resentment for personal peace." },
      { id: 2, text: "Conditionally: Forgiveness depends on their apology, remorse, and changed behavior." },
      { id: 3, text: "With difficulty: Hold onto hurt for a while but can eventually forgive, though may not forget." },
      { id: 4, text: "Intellectually but not emotionally: Understand the value of forgiveness but struggle to truly release the negative feelings." },
      { id: 5, text: "(N) Very difficult/Rarely: Tend to hold grudges and find it hard to trust or forgive someone who has wronged you significantly." }, // Disguised: Resentfulness / Difficulty letting go / Trust issues
      { id: 6, text: "(N) Superficially/Quickly: Claim to forgive easily but may not have fully processed the hurt or set necessary boundaries, leading to repeated issues." } // Disguised: Conflict avoidance / Lack of self-protection / Denial
    ]
  },
  {
    id: 16,
    category: "Emotional",
    questionText: "Recognizing and naming your own specific emotional state in the moment is typically:",
    options: [
      { id: 1, text: "Easy and clear: Usually have a good sense of what you're feeling and why." },
      { id: 2, text: "Moderately easy: Can usually figure it out with some reflection." },
      { id: 3, text: "Sometimes difficult: May feel generally 'bad' or 'good' without specific labels." },
      { id: 4, text: "Easier for strong emotions: Can identify intense feelings but struggle with subtler ones." },
      { id: 5, text: "(N) Very difficult/Confusing: Often feel overwhelmed or confused by emotions, struggling to identify them accurately." }, // Disguised: Alexithymia traits / Low emotional intelligence
      { id: 6, text: "(N) Over-analytical/Intellectualized: Tend to analyze emotions excessively rather than feeling them, potentially mislabeling them." } // Disguised: Intellectualization defense / Disconnect from feeling
    ]
  },

  // === Cognitive (8 Questions) ===
  {
    id: 17,
    category: "Cognitive",
    questionText: "When learning about a complex topic, you prefer information presented as:",
    options: [
      { id: 1, text: "Structured Text: Well-organized articles, books, or documentation." },
      { id: 2, text: "Visualizations: Diagrams, charts, infographics, or mind maps." },
      { id: 3, text: "Interactive Exploration: Hands-on examples, simulations, or tools to manipulate." },
      { id: 4, text: "Narrative/Storytelling: Case studies, historical accounts, or explanations woven into a story." },
      { id: 5, text: "(N) Fragmented Snippets: Quick summaries, bullet points, or isolated facts without deep context." }, // Disguised: Superficial learning / Low attention span
      { id: 6, text: "(N) Highly Abstract Theory: Dense theoretical frameworks without practical examples or connection to reality." } // Disguised: Intellectualization / Disconnect from application
    ]
  },
  {
    id: 18,
    category: "Cognitive",
    questionText: "When faced with a problem that has multiple potential solutions, your approach is typically to:",
    options: [
      { id: 1, text: "Analyze systematically: Evaluate each option based on predefined criteria to find the optimal one." },
      { id: 2, text: "Brainstorm broadly: Generate many diverse ideas first, then filter and refine." },
      { id: 3, text: "Seek expert advice: Consult someone with more experience or knowledge in the area." },
      { id: 4, text: "Pilot test: Try out the most promising 1-2 options on a small scale before full commitment." },
      { id: 5, text: "(N) Go with the familiar: Choose the solution most similar to what has worked in the past, even if the context is different." }, // Disguised: Cognitive rigidity / Resistance to novelty
      { id: 6, text: "(N) Pick the easiest/quickest: Opt for the path of least resistance, potentially sacrificing quality or long-term effectiveness." } // Disguised: Lack of diligence / Short-term thinking
    ]
  },
  {
    id: 19,
    category: "Cognitive",
    questionText: "How comfortable are you with ambiguity and uncertainty in information or situations?",
    options: [
      { id: 1, text: "Very comfortable: Can operate effectively even with incomplete information, adapting as needed." },
      { id: 2, text: "Moderately comfortable: Prefer clarity but can manage ambiguity for a limited time." },
      { id: 3, text: "Somewhat uncomfortable: Feel stress or anxiety when things are unclear; actively seek certainty." },
      { id: 4, text: "Context-dependent: Tolerate ambiguity in some areas (e.g., creative work) but need clarity in others (e.g., procedures)." },
      { id: 5, text: "(N) Highly uncomfortable/Avoidant: Experience significant stress; may make premature decisions or interpretations just to reduce uncertainty." }, // Disguised: Need for closure / Low tolerance for ambiguity / Potential anxiety
      { id: 6, text: "(N) Indifferent due to oversimplification: Ignore ambiguity by simplifying the situation excessively, potentially missing crucial nuances." } // Disguised: Lack of critical thinking / Superficial analysis
    ]
  },
   {
    id: 20,
    category: "Cognitive",
    questionText: "When working on a task requiring sustained focus, you find it:",
    options: [
      { id: 1, text: "Engaging: Can easily enter a state of flow and concentrate for long periods." },
      { id: 2, text: "Manageable with structure: Need techniques like time-blocking or minimizing distractions to stay focused." },
      { id: 3, text: "Challenging: Mind tends to wander; require frequent breaks or external prompts." },
      { id: 4, text: "Interest-dependent: Easy to focus on highly engaging topics, difficult on less interesting ones." },
      { id: 5, text: "(N) Easily Distracted: Prone to interruption by external stimuli or internal thoughts, finding sustained focus very difficult." }, // Disguised: Poor attentional control / Potential ADHD traits
      { id: 6, text: "(N) Hyper-focused to exclusion: Can focus intensely but struggle to switch tasks or notice other important things." } // Disguised: Cognitive inflexibility / Potential obsessive traits
    ]
  },
   {
    id: 21,
    category: "Cognitive",
    questionText: "When presented with a strong argument that contradicts your current belief, your typical reaction is to:",
    options: [
      { id: 1, text: "Listen openly: Seek to fully understand the argument and evidence before evaluating it against your own view." },
      { id: 2, text: "Defend your position: Immediately formulate counter-arguments and reasons why your belief is correct." },
      { id: 3, text: "Find common ground: Look for areas of agreement or ways to integrate aspects of the new argument." },
      { id: 4, text: "Research further: Seek out more information or different perspectives on the topic before forming a conclusion." },
      { id: 5, text: "(N) Dismiss or ignore: Quickly reject the argument without deep consideration, potentially by attacking the source or premise." }, // Disguised: Confirmation bias / Closed-mindedness
      { id: 6, text: "(N) Feel destabilized: Become emotionally unsettled or confused by the challenge to your belief, struggling to reconcile the conflict." } // Disguised: Identity fusion with belief / Cognitive dissonance intolerance
    ]
  },
  {
    id: 22,
    category: "Cognitive",
    questionText: "Your ability to remember details like names, dates, or specific instructions is generally:",
    options: [
      { id: 1, text: "Excellent: Recall details easily and accurately." },
      { id: 2, text: "Good: Generally remember well but may need occasional reminders or notes." },
      { id: 3, text: "Average: Remember key information but specific details can be fuzzy." },
      { id: 4, text: "Context-dependent: Better memory for topics of high interest or importance." },
      { id: 5, text: "(N) Poor/Forgetful: Frequently forget details, names, or instructions, requiring significant external aids." }, // Disguised: Memory issues / Potential attention deficits
      { id: 6, text: "(N) Selectively Forgetful: Conveniently forget details or instructions that are inconvenient or undesirable." } // Disguised: Passive resistance / Lack of accountability
    ]
  },
  {
    id: 23,
    category: "Cognitive",
    questionText: "When explaining a complex idea to someone else, you tend to rely on:",
    options: [
      { id: 1, text: "Analogies and metaphors: Use comparisons to familiar concepts." },
      { id: 2, text: "Logical structure: Break it down into sequential steps or components." },
      { id: 3, text: "Visual aids: Use diagrams, drawings, or demonstrations." },
      { id: 4, text: "Real-world examples: Illustrate the idea with practical applications or case studies." },
      { id: 5, text: "(N) Technical jargon: Use precise, specialized language, assuming the other person understands it." }, // Disguised: Poor communication skills / Lack of empathy / 'Curse of knowledge'
      { id: 6, text: "(N) Oversimplification: Explain it in such basic terms that important nuances or complexities are lost." } // Disguised: Lack of depth / Condescension / Underestimation of audience
    ]
  },
  {
    id: 24,
    category: "Cognitive",
    questionText: "How often do you find yourself 'connecting the dots' between seemingly unrelated pieces of information or ideas?",
    options: [
      { id: 1, text: "Frequently: Often notice patterns, parallels, or connections others might miss." },
      { id: 2, text: "Occasionally: Sometimes make such connections, especially when actively thinking about a topic." },
      { id: 3, text: "Rarely: Tend to focus on information within its specific context." },
      { id: 4, text: "More in specific domains: Strong pattern recognition in areas of expertise but less so elsewhere." },
      { id: 5, text: "(N) Forced connections: Tend to see patterns or connections where they don't actually exist (apophenia)." }, // Disguised: Faulty pattern recognition / Potential bias
      { id: 6, text: "(N) Concrete thinking: Primarily focus on literal meanings and struggle with abstract connections or metaphors." } // Disguised: Lack of abstract thinking / Cognitive limitation
    ]
  },

  // === Values (8 Questions) ===
   {
    id: 25,
    category: "Values",
    questionText: "Which of these potential career sacrifices would be MOST difficult for you to make?",
    options: [
      { id: 1, text: "Significantly lower salary for more meaningful work." },
      { id: 2, text: "Much longer working hours for greater impact or advancement." },
      { id: 3, text: "Less autonomy/creative freedom for more job security." },
      { id: 4, text: "Working on projects that conflict slightly with personal ethics for team harmony/success." },
      { id: 5, text: "(N) Sacrificing public recognition/status for behind-the-scenes contribution." }, // Disguised: High need for external validation / Status-driven
      { id: 6, text: "(N) Prioritizing work-life balance over rapid career progression, even if colleagues don't." } // Disguised: Workaholism / Difficulty setting boundaries / Societal pressure conformity
    ]
  },
   {
    id: 26,
    category: "Values",
    questionText: "Imagine you found a wallet containing a significant amount of cash and identifying information. What is your most likely course of action?",
    options: [
      { id: 1, text: "Immediately make every effort to contact the owner directly and return everything." },
      { id: 2, text: "Hand it in to the nearest police station or authority figure." },
      { id: 3, text: "Wait a short period to see if the owner retraces their steps, then hand it in." },
      { id: 4, text: "Check the ID, consider the owner's likely situation, then decide the best way to return it." },
      { id: 5, text: "(N) Take the cash but make an effort to return the wallet and cards." }, // Disguised: Rationalized dishonesty / Self-interest over ethics
      { id: 6, text: "(N) Keep the wallet and contents, rationalizing that 'finders keepers' or the owner was careless." } // Disguised: Dishonesty / Lack of integrity
    ]
  },
   {
    id: 27,
    category: "Values",
    questionText: "Which societal contribution do you admire most?",
    options: [
      { id: 1, text: "Advancing scientific knowledge or technological innovation." },
      { id: 2, text: "Creating art, music, or literature that inspires or provokes thought." },
      { id: 3, text: "Providing essential services and care (e.g., healthcare, education, social work)." },
      { id: 4, text: "Fighting for social justice, equality, or environmental protection." },
      { id: 5, text: "(N) Building immense wealth or a powerful business empire, regardless of methods." }, // Disguised: Materialism / Ends justify the means thinking
      { id: 6, text: "(N) Achieving widespread fame or influence, regardless of the substance of contribution." } // Disguised: Focus on status/attention over impact
    ]
  },
   {
    id: 28,
    category: "Values",
    questionText: "In a friendship or relationship, what is the MOST important quality?",
    options: [
      { id: 1, text: "Loyalty and unwavering support, even when you are wrong." },
      { id: 2, text: "Honesty and the willingness to offer constructive criticism, even if it's difficult." },
      { id: 3, text: "Shared interests and enjoying similar activities together." },
      { id: 4, text: "Mutual respect for individuality and personal space." },
      { id: 5, text: "(N) Unconditional agreement and avoidance of any conflict or disagreement." }, // Disguised: Fear of conflict / Need for validation / Superficiality
      { id: 6, text: "(N) Consistent availability and fulfilling your needs, with less focus on reciprocity." } // Disguised: Self-centeredness / Taking others for granted
    ]
  },
   {
    id: 29,
    category: "Values",
    questionText: "When you have free time, you feel the strongest pull towards activities that provide:",
    options: [
      { id: 1, text: "Learning and personal growth (e.g., reading, courses, documentaries)." },
      { id: 2, text: "Relaxation and stress reduction (e.g., meditation, nature walks, quiet hobbies)." },
      { id: 3, text: "Social connection and fun (e.g., spending time with friends/family, events)." },
      { id: 4, text: "Creativity and self-expression (e.g., arts, crafts, writing, music)." },
      { id: 5, text: "(N) Status enhancement or competition (e.g., networking, luxury shopping, competitive games focused solely on winning)." }, // Disguised: External validation focus / Materialism
      { id: 6, text: "(N) Pure escapism or numbing (e.g., excessive passive entertainment, substance use, scrolling)." } // Disguised: Avoidance / Lack of engagement with self/world
    ]
  },
  {
    id: 30,
    category: "Values",
    questionText: "Which principle would you be least willing to compromise on, even if it caused significant personal disadvantage?",
    options: [
      { id: 1, text: "Telling the truth, even when it's difficult or costly." },
      { id: 2, text: "Standing up for someone being treated unfairly, even if it makes you unpopular." },
      { id: 3, text: "Keeping a promise or commitment, even if circumstances change." },
      { id: 4, text: "Maintaining your independence and autonomy in decision-making." },
      { id: 5, text: "(N) Protecting your own reputation or image at all costs, even if it involves dishonesty." }, // Disguised: Self-preservation over integrity / Narcissistic traits
      { id: 6, text: "(N) Ensuring you always 'win' or come out on top in any situation, even if it harms others." } // Disguised: Ruthlessness / Lack of empathy / Extreme competitiveness
    ]
  },
  {
    id: 31,
    category: "Values",
    questionText: "What role should tradition play in society and personal life?",
    options: [
      { id: 1, text: "Foundation: Traditions provide valuable stability, wisdom, and connection to the past." },
      { id: 2, text: "Guideline: Traditions offer useful starting points but should be adapted or discarded if they become harmful or irrelevant." },
      { id: 3, text: "Inspiration: Traditions can be a source of cultural richness and identity, but not rigid rules." },
      { id: 4, text: "Minimal Role: Progress requires questioning tradition and focusing on rational, contemporary solutions." },
      { id: 5, text: "(N) Unquestionable Authority: Traditions must be upheld strictly, even if they seem illogical or unjust by modern standards." }, // Disguised: Dogmatism / Resistance to change / Cognitive rigidity
      { id: 6, text: "(N) Tool for Exclusion: Using tradition primarily to define 'us' vs 'them' and maintain group boundaries." } // Disguised: Tribalism / Prejudice
    ]
  },
   {
    id: 32,
    category: "Values",
    questionText: "When considering environmental issues, your perspective is closest to:",
    options: [
      { id: 1, text: "Deep Responsibility: Humans have a strong ethical obligation to protect the planet, even at significant economic cost." },
      { id: 2, text: "Balanced Approach: Environmental protection is important but must be balanced with economic needs and human well-being." },
      { id: 3, text: "Technological Optimism: Innovation and technology will likely solve most environmental problems." },
      { id: 4, text: "Local Focus: Prioritize environmental issues that directly impact your own community or health." },
      { id: 5, text: "(N) Human Centrism: The environment's primary value is its usefulness to humans; protection is secondary to human needs/desires." }, // Disguised: Anthropocentrism / Lack of ecological perspective
      { id: 6, text: "(N) Apathy/Dismissal: Environmental problems are exaggerated or too distant to warrant significant personal concern or action." } // Disguised: Short-sightedness / Denial / Lack of responsibility
    ]
  },

  // === Motivation (8 Questions) ===
  {
    id: 33,
    category: "Motivation",
    questionText: "What is more likely to get you started on a task you've been putting off?",
    options: [
      { id: 1, text: "A sudden burst of inspiration or a new idea related to it." },
      { id: 2, text: "Breaking it down into very small, manageable first steps." },
      { id: 3, text: "Someone else asking about your progress or needing your contribution." },
      { id: 4, text: "Setting a specific reward for yourself upon completion." },
      { id: 5, text: "(N) The building anxiety or guilt about not doing it becoming unbearable." }, // Disguised: Anxiety-driven motivation / Procrastination cycle
      { id: 6, text: "(N) Seeing someone else succeed at a similar task, triggering competitiveness." } // Disguised: Social comparison / External motivation focus
    ]
  },
  {
    id: 34,
    category: "Motivation",
    questionText: "When pursuing a long-term goal, how do you handle setbacks or periods of slow progress?",
    options: [
      { id: 1, text: "Analyze the setback: Understand the cause and adjust your strategy." },
      { id: 2, text: "Increase effort: Double down on work and push harder." },
      { id: 3, text: "Seek feedback/advice: Consult mentors or peers for new perspectives." },
      { id: 4, text: "Take a break: Step back to rest and regain perspective before continuing." },
      { id: 5, text: "(N) Lose motivation easily: Feel significantly discouraged and consider giving up or switching goals." }, // Disguised: Low persistence / Lack of resilience
      { id: 6, text: "(N) Blame external factors: Attribute the setback primarily to things outside your control, avoiding strategy changes." } // Disguised: External locus of control / Avoidance
    ]
  },
  {
    id: 35,
    category: "Motivation",
    questionText: "Which type of recognition for your work do you find most motivating?",
    options: [
      { id: 1, text: "Public praise or awards highlighting your achievement." },
      { id: 2, text: "Private acknowledgement from a respected leader or mentor." },
      { id: 3, text: "Seeing the tangible positive impact of your work on others." },
      { id: 4, text: "Mastery and the personal satisfaction of knowing you did your best work." },
      { id: 5, text: "(N) Monetary rewards (bonuses, raises) above all other forms of recognition." }, // Disguised: Primarily extrinsic motivation / Potential materialism
      { id: 6, text: "(N) Comparative recognition: Knowing you performed better than peers or competitors." } // Disguised: High competitiveness / Social comparison drive
    ]
  },
  {
    id: 36,
    category: "Motivation",
    questionText: "The idea of having a 'calling' or a life purpose is:",
    options: [
      { id: 1, text: "Deeply resonant: Feel strongly that you have or are seeking a specific purpose." },
      { id: 2, text: "Inspiring but elusive: Like the idea but haven't identified a single 'calling'." },
      { id: 3, text: "Pragmatic: Focus on finding meaningful work and contributions without needing a grand 'purpose'." },
      { id: 4, text: "Fluid: Believe purpose can change throughout life based on experiences and priorities." },
      { id: 5, text: "(N) Overrated/Naive: Find the concept unrealistic or overly romanticized." }, // Disguised: Cynicism / Potential lack of introspection
      { id: 6, text: "(N) Stressful: Feel pressured or inadequate if you haven't found a clear 'calling'." } // Disguised: Anxiety / External pressure internalization
    ]
  },
  {
    id: 37,
    category: "Motivation",
    questionText: "Imagine mastering a challenging skill purely for personal enjoyment, with no external reward or recognition. How appealing is this?",
    options: [
      { id: 1, text: "Very appealing: The intrinsic satisfaction of mastery is a primary motivator." },
      { id: 2, text: "Moderately appealing: Enjoyable, but external validation or usefulness adds significant motivation." },
      { id: 3, text: "Slightly appealing: Prefer activities with more tangible outcomes or social aspects." },
      { id: 4, text: "Depends on the skill: Highly appealing for certain interests, less so for others." },
      { id: 5, text: "(N) Not very appealing: Struggle to stay motivated without external rewards, recognition, or practical application." }, // Disguised: High extrinsic motivation focus / Lack of intrinsic drive
      { id: 6, text: "(N) Appealing only if it confers status: Motivated if mastering the skill makes you seem impressive, even if unused." } // Disguised: Status-driven / External validation need
    ]
  },
  {
    id: 38,
    category: "Motivation",
    questionText: "When faced with a repetitive but necessary task, how do you maintain focus and quality?",
    options: [
      { id: 1, text: "Find ways to optimize: Look for efficiencies or improvements to make it less tedious." },
      { id: 2, text: "Focus on the bigger picture: Remind yourself why the task is important for the overall goal." },
      { id: 3, text: "Use discipline/routine: Set specific times and power through with self-control." },
      { id: 4, text: "Make it enjoyable: Listen to music, podcasts, or incorporate small breaks/rewards." },
      { id: 5, text: "(N) Quality drops significantly: Tend to rush through it carelessly or make frequent errors due to boredom." }, // Disguised: Low conscientiousness / Poor self-regulation
      { id: 6, text: "(N) Avoid or delegate: Try to pass the task off to someone else whenever possible." } // Disguised: Avoidance / Lack of responsibility
    ]
  },
  {
    id: 39,
    category: "Motivation",
    questionText: "Which scenario sounds more motivating as a long-term career driver?",
    options: [
      { id: 1, text: "Continuously learning and developing new skills in your field." },
      { id: 2, text: "Making a significant, positive difference in people's lives or society." },
      { id: 3, text: "Achieving a high level of expertise and recognition as a leader in your domain." },
      { id: 4, text: "Having significant autonomy, flexibility, and control over your work." },
      { id: 5, text: "(N) Attaining maximum financial wealth and material security." }, // Disguised: Primarily extrinsic/materialistic focus
      { id: 6, text: "(N) Gaining power and influence over others or large systems." } // Disguised: Power-driven motivation / Potential control issues
    ]
  },
  {
    id: 40,
    category: "Motivation",
    questionText: "How does competition generally affect your performance and motivation?",
    options: [
      { id: 1, text: "Energizes: Drives you to perform better and try harder." },
      { id: 2, text: "Focuses: Helps clarify goals and priorities but can be stressful." },
      { id: 3, text: "Irrelevant: Primarily motivated by internal standards, not comparison." },
      { id: 4, text: "Depends on context: Enjoy friendly competition but dislike high-stakes or cutthroat environments." },
      { id: 5, text: "(N) Demotivates/Intimidates: Feel anxious or discouraged by competition, potentially leading to withdrawal." }, // Disguised: Low self-efficacy / Fear of failure / High anxiety
      { id: 6, text: "(N) Fuels negative behavior: Tempted to bend rules or undermine competitors to win." } // Disguised: Poor sportsmanship / Unethical tendencies
    ]
  },

  // === Resilience (8 Questions) ===
  {
    id: 41,
    category: "Resilience",
    questionText: "After a significant personal or professional setback (e.g., job loss, relationship ending, project failure), your typical initial reaction is:",
    options: [
      { id: 1, text: "Problem-solving mode: Immediately focus on practical steps to address the situation." },
      { id: 2, text: "Emotional processing: Allow yourself time to feel the disappointment/grief before taking action." },
      { id: 3, text: "Seek support network: Reach out to friends, family, or mentors for comfort and advice." },
      { id: 4, text: "Information gathering: Try to understand exactly what happened and why." },
      { id: 5, text: "(N) Catastrophizing: Assume the worst possible outcomes and feel overwhelmed by negativity." }, // Disguised: Pessimism / Anxiety / Lack of perspective
      { id: 6, text: "(N) Denial/Avoidance: Try to ignore the problem or pretend it didn't happen, delaying any response." } // Disguised: Poor coping mechanism / Avoidance
    ]
  },
  {
    id: 42,
    category: "Resilience",
    questionText: "How do you typically view challenges or obstacles that arise unexpectedly?",
    options: [
      { id: 1, text: "As opportunities for growth: See them as chances to learn, adapt, and become stronger." },
      { id: 2, text: "As temporary hurdles: Annoying but manageable obstacles to overcome on the path to a goal." },
      { id: 3, text: "As tests of ability: Situations that require you to prove your competence or resourcefulness." },
      { id: 4, text: "As signals to re-evaluate: Prompts to reconsider if the current path or goal is still right." },
      { id: 5, text: "(N) As unfair burdens: Feel singled out or victimized by the difficulty, focusing on the injustice." }, // Disguised: Victim mentality / External locus of control
      { id: 6, text: "(N) As signs to quit: Interpret them as indicators that the goal is too difficult or not meant to be." } // Disguised: Low persistence / Giving up easily
    ]
  },
  {
    id: 43,
    category: "Resilience",
    questionText: "Your belief in your ability to handle stressful situations effectively is generally:",
    options: [
      { id: 1, text: "Strong: Confident in your coping mechanisms and ability to manage pressure." },
      { id: 2, text: "Moderate: Believe you can cope but may feel significantly strained." },
      { id: 3, text: "Variable: Depends heavily on the specific type of stressor and available resources." },
      { id: 4, text: "Developing: Actively working on improving stress management skills." },
      { id: 5, text: "(N) Low: Often feel overwhelmed by stress and doubt your ability to cope effectively." }, // Disguised: Low self-efficacy / High anxiety
      { id: 6, text: "(N) Overconfident/Dismissive: Tend to underestimate stress or ignore its impact until it becomes overwhelming." } // Disguised: Lack of self-awareness / Poor coping strategy
    ]
  },
   {
    id: 44,
    category: "Resilience",
    questionText: "When facing a period of high pressure or demand, how well do you typically maintain healthy habits (sleep, nutrition, exercise)?",
    options: [
      { id: 1, text: "Prioritize them: Make a conscious effort to maintain healthy habits as essential coping tools." },
      { id: 2, text: "Maintain some: Try to keep up with the basics but some habits may slip." },
      { id: 3, text: "Struggle significantly: Healthy habits are often the first thing to go under pressure." },
      { id: 4, text: "Compensate later: Neglect habits during the peak stress but try to catch up afterwards." },
      { id: 5, text: "(N) Actively engage in unhealthy coping: Turn to poor diet, lack of sleep, or substances to manage stress." }, // Disguised: Poor self-care / Maladaptive coping
      { id: 6, text: "(N) Use 'busyness' as an excuse: Justify neglecting self-care by emphasizing external demands, avoiding responsibility." } // Disguised: Avoidance / Poor boundary setting
    ]
  },
  {
    id: 45,
    category: "Resilience",
    questionText: "How quickly do you tend to bounce back emotionally after a disappointment?",
    options: [
      { id: 1, text: "Quite quickly: Process the feeling and refocus on positive aspects or next steps relatively soon." },
      { id: 2, text: "Moderately quickly: Need some time to process but generally recover within a reasonable period." },
      { id: 3, text: "Slowly: Tend to dwell on disappointment for a longer time before moving on." },
      { id: 4, text: "Depends on severity: Bounce back easily from minor issues but struggle with major ones." },
      { id: 5, text: "(N) Very slowly/Ruminatively: Get stuck in negative feelings, replaying the disappointment extensively." }, // Disguised: Rumination / Difficulty letting go / Potential depression trait
      { id: 6, text: "(N) Superficially quickly: Appear fine externally very quickly but may have suppressed or unprocessed emotions." } // Disguised: Suppression / Avoidance / Emotional bypassing
    ]
  },
  {
    id: 46,
    category: "Resilience",
    questionText: "Maintaining a sense of humor during difficult times is something you find:",
    options: [
      { id: 1, text: "Essential: Often use humor as a key coping mechanism to maintain perspective." },
      { id: 2, text: "Helpful: Appreciate humor but don't always rely on it." },
      { id: 3, text: "Difficult: Tend to become serious or somber under stress." },
      { id: 4, text: "Situational: Can find humor in some difficulties but not others." },
      { id: 5, text: "(N) Inappropriate/Dismissive: Use humor to avoid dealing with the seriousness of a situation or others' feelings." }, // Disguised: Deflection / Avoidance / Lack of empathy
      { id: 6, text: "(N) Cynical/Sarcastic: Use dark or biting humor that may alienate others or reflect underlying bitterness." } // Disguised: Negativity / Poor coping / Passive aggression
    ]
  },
   {
    id: 47,
    category: "Resilience",
    questionText: "How effectively do you typically manage conflicting demands on your time and energy?",
    options: [
      { id: 1, text: "Effectively prioritize: Assess urgency and importance, set boundaries, and allocate resources strategically." },
      { id: 2, text: "Juggle adequately: Manage most conflicts but may feel stretched thin or occasionally drop the ball." },
      { id: 3, text: "Struggle to prioritize: Find it difficult to say no or decide what's most important, leading to overwhelm." },
      { id: 4, text: "Tend to overcommit: Take on too much and then feel stressed trying to fulfill all obligations." },
      { id: 5, text: "(N) Become paralyzed/avoidant: Feel overwhelmed by conflict and shut down or avoid making decisions." }, // Disguised: Poor executive function / Anxiety / Avoidance
      { id: 6, text: "(N) Complain but comply: Express stress about conflicting demands but ultimately try to do everything, leading to burnout." } // Disguised: Poor boundary setting / People-pleasing
    ]
  },
  {
    id: 48,
    category: "Resilience",
    questionText: "Having a strong sense of purpose or meaning in life impacts your ability to handle adversity:",
    options: [
      { id: 1, text: "Significantly positively: Provides a core motivation and perspective that helps weather difficulties." },
      { id: 2, text: "Moderately positively: Helpful, but other coping factors are also very important." },
      { id: 3, text: "Minimally: Rely more on practical coping skills than an overarching sense of purpose." },
      { id: 4, text: "Unsure/Not considered: Haven't really thought about the connection." },
      { id: 5, text: "(N) Negatively if purpose feels blocked: Adversity feels more devastating if it seems to obstruct a core life purpose." }, // Disguised: Rigidity / Potential for existential crisis if purpose is thwarted
      { id: 6, text: "(N) Purpose used as denial: Focus so much on a 'higher purpose' that practical realities or emotional impacts of adversity are ignored." } // Disguised: Spiritual bypassing / Denial / Avoidance
    ]
  },

  // === Social (8 Questions) ===
   {
    id: 49,
    category: "Social",
    questionText: "When meeting someone new, what aspect of the interaction do you focus on most?",
    options: [
      { id: 1, text: "Finding common interests or experiences to build rapport." },
      { id: 2, text: "Understanding their personality and communication style." },
      { id: 3, text: "Assessing their potential value (e.g., as a friend, contact, resource)." },
      { id: 4, text: "Ensuring you make a positive and competent impression." },
      { id: 5, text: "(N) Identifying flaws or points of disagreement quickly." }, // Disguised: Criticalness / Negativity / Defensiveness
      { id: 6, text: "(N) Talking mostly about yourself to control the interaction and narrative." } // Disguised: Self-centeredness / Narcissistic traits
    ]
  },
  {
    id: 50,
    category: "Social",
    questionText: "In group conversations, you are more likely to:",
    options: [
      { id: 1, text: "Listen actively and contribute thoughtful points when relevant." },
      { id: 2, text: "Steer the conversation towards topics you find interesting or knowledgeable about." },
      { id: 3, text: "Ensure everyone gets a chance to speak and feel included." },
      { id: 4, text: "Use humor and storytelling to keep the mood light and engaging." },
      { id: 5, text: "(N) Interrupt frequently or dominate the conversation to ensure your points are heard." }, // Disguised: Poor listening skills / Need for control / Arrogance
      { id: 6, text: "(N) Mentally check out or engage in side conversations if the main topic doesn't interest you." } // Disguised: Disengagement / Disrespect / Poor social awareness
    ]
  },
   {
    id: 51,
    category: "Social",
    questionText: "How comfortable are you initiating plans or social activities with friends or acquaintances?",
    options: [
      { id: 1, text: "Very comfortable: Frequently initiate and organize gatherings." },
      { id: 2, text: "Moderately comfortable: Initiate sometimes but also happy to join others' plans." },
      { id: 3, text: "Somewhat hesitant: Prefer others to initiate but will do so occasionally." },
      { id: 4, text: "Rarely initiate: Almost always wait for invitations from others." },
      { id: 5, text: "(N) Avoid initiating due to fear of rejection: Worry that others won't be interested or available." }, // Disguised: Social anxiety / Low self-esteem / Fear of rejection
      { id: 6, text: "(N) Initiate excessively without considering others' capacity: Overwhelm others with frequent or demanding plans." } // Disguised: Poor boundaries / Self-centeredness / Lack of social awareness
    ]
  },
  {
    id: 52,
    category: "Social",
    questionText: "When navigating a social disagreement or conflict, your preferred style is:",
    options: [
      { id: 1, text: "Collaborative problem-solving: Seek solutions that address everyone's core needs." },
      { id: 2, text: "Direct confrontation: Address the issue head-on, stating your perspective clearly." },
      { id: 3, text: "Compromise: Find a middle ground where both parties give a little." },
      { id: 4, text: "Mediation: Try to facilitate understanding between conflicting parties (if applicable)." },
      { id: 5, text: "(N) Avoidance: Ignore the conflict or withdraw, hoping it resolves itself." }, // Disguised: Conflict avoidance / Passive aggression / Unresolved issues
      { id: 6, text: "(N) Aggressive confrontation: Attack the other person's character or position forcefully to 'win'." } // Disguised: Aggression / Poor emotional regulation / Destructive conflict style
    ]
  },
  {
    id: 53,
    category: "Social",
    questionText: "How easily do you pick up on subtle social cues or unspoken emotions in others?",
    options: [
      { id: 1, text: "Very easily: Often aware of underlying moods or dynamics." },
      { id: 2, text: "Moderately well: Can usually sense strong cues but might miss subtle ones." },
      { id: 3, text: "With some difficulty: Tend to rely more on explicit communication." },
      { id: 4, text: "Better in familiar contexts: More attuned to cues from close relations than strangers." },
      { id: 5, text: "(N) Often misinterpret cues: Tend to read situations inaccurately, leading to misunderstandings." }, // Disguised: Poor social perception / Potential projection
      { id: 6, text: "(N) Over-interpret cues negatively: Assume neutral or ambiguous cues have negative intent towards you." } // Disguised: Social anxiety / Paranoia / Negative bias
    ]
  },
   {
    id: 54,
    category: "Social",
    questionText: "Maintaining long-distance friendships or relationships is something you find:",
    options: [
      { id: 1, text: "Relatively easy: Make a consistent effort to stay connected through calls, messages, etc." },
      { id: 2, text: "Possible with effort: Requires conscious planning but worthwhile for important relationships." },
      { id: 3, text: "Challenging: Tend to drift apart if not seeing people regularly." },
      { id: 4, text: "Dependent on the other person: Rely on the other individual to maintain the connection." },
      { id: 5, text: "(N) Too much work/Unnecessary: Believe friendships naturally fade with distance and don't actively fight it." }, // Disguised: Low relationship value / Passivity / Potential detachment
      { id: 6, text: "(N) Intense but infrequent contact: Swing between long silences and overly intense catch-up sessions." } // Disguised: Poor consistency / Potential emotional volatility
    ]
  },
  {
    id: 55,
    category: "Social",
    questionText: "How important is fitting in or being accepted by a social group to you?",
    options: [
      { id: 1, text: "Very important: Strong need to belong and feel accepted by peers." },
      { id: 2, text: "Moderately important: Value belonging but prioritize authenticity." },
      { id: 3, text: "Slightly important: Enjoy group connection but comfortable being independent." },
      { id: 4, text: "Not very important: Prioritize individual connections or personal values over group conformity." },
      { id: 5, text: "(N) Desperate need to fit in: Willing to compromise significant values or behaviors to gain acceptance." }, // Disguised: Low self-esteem / External validation dependency / Peer pressure vulnerability
      { id: 6, text: "(N) Actively anti-conformist: Define self primarily in opposition to group norms, even if arbitrary." } // Disguised: Reactivity / Need for uniqueness as identity / Potential contrarianism
    ]
  },
   {
    id: 56,
    category: "Social",
    questionText: "When attending a networking event, your primary goal is usually to:",
    options: [
      { id: 1, text: "Build genuine connections: Seek out interesting people for potential future collaboration or friendship." },
      { id: 2, text: "Learn something new: Focus on conversations that offer insights or knowledge." },
      { id: 3, text: "Identify specific opportunities: Look for contacts relevant to current career goals or projects." },
      { id: 4, text: "Represent your organization: Act as an ambassador and share information about your work." },
      { id: 5, text: "(N) Maximize contacts collected: Focus on quantity over quality, gathering as many business cards/connections as possible." }, // Disguised: Superficiality / Transactional approach
      { id: 6, text: "(N) Promote yourself aggressively: Dominate conversations to highlight your own achievements and status." } // Disguised: Self-centeredness / Arrogance / Poor listening
    ]
  },

  // === Decision Making (8 Questions) ===
  {
    id: 57,
    category: "Decision Making",
    questionText: "When faced with a complex decision with uncertain outcomes, your typical first step is to:",
    options: [
      { id: 1, text: "Analyze thoroughly: Gather all available data, weigh pros and cons meticulously, and create a detailed plan before acting." },
      { id: 2, text: "Trust intuition: Go with your gut feeling or initial instinct about the best path forward." },
      { id: 3, text: "Seek consensus: Discuss extensively with trusted advisors or peers, aiming for group agreement before proceeding." },
      { id: 4, text: "Experiment quickly: Try a small-scale version of a potential solution to see what happens, adapting as you go." },
      { id: 5, text: "(N) Delay and observe: Wait to see if the situation resolves itself or if more information emerges naturally, avoiding commitment until absolutely necessary." }, // Disguised: Procrastination / Avoidance
      { id: 6, text: "(N) Delegate upward/sideways: Frame the problem in a way that shifts the final decision responsibility to a superior or another department." } // Disguised: Avoidance of accountability
    ]
  },
   {
    id: 58,
    category: "Decision Making",
    questionText: "How much information do you typically need before feeling comfortable making a significant decision?",
    options: [
      { id: 1, text: "Exhaustive: Prefer to have almost all possible information, even if it causes delays." },
      { id: 2, text: "Substantial: Need a solid understanding of key factors and risks, but accept some unknowns." },
      { id: 3, text: "Sufficient: Gather enough information to make an informed choice, prioritizing speed once key data is in." },
      { id: 4, text: "Minimal: Comfortable making decisions quickly with limited information, relying on intuition or adaptation." },
      { id: 5, text: "(N) Analysis Paralysis: Tend to gather information indefinitely, struggling to commit to a decision due to fear of being wrong." }, // Disguised: Indecisiveness / Perfectionism / Anxiety
      { id: 6, text: "(N) Information Avoidance: Make decisions quickly specifically to avoid the discomfort of analyzing complex information." } // Disguised: Impulsivity / Cognitive avoidance
    ]
  },
  {
    id: 59,
    category: "Decision Making",
    questionText: "When making a decision that affects others, how much weight do you give their potential reactions or feelings?",
    options: [
      { id: 1, text: "Significant weight: Consider impacts on others deeply; may adjust decision to minimize negative feelings." },
      { id: 2, text: "Moderate weight: Consider others' feelings as one factor among several (e.g., logic, efficiency)." },
      { id: 3, text: "Some weight: Aware of potential reactions but prioritize the 'best' decision objectively." },
      { id: 4, text: "Minimal weight: Focus primarily on the rational or optimal outcome, assuming others will adapt." },
      { id: 5, text: "(N) Overly focused on pleasing: Prioritize avoiding disapproval above the optimal outcome, potentially making poor decisions." }, // Disguised: People-pleasing / Fear of conflict
      { id: 6, text: "(N) Disregard for impact: Make decisions with little or no consideration for how they affect others' feelings or well-being." } // Disguised: Lack of empathy / Selfishness
    ]
  },
  {
    id: 60,
    category: "Decision Making",
    questionText: "Once you've made a significant decision, how likely are you to second-guess it?",
    options: [
      { id: 1, text: "Rarely: Feel confident once a decision is made and focus on implementation." },
      { id: 2, text: "Occasionally: May briefly reconsider if new, significant information emerges." },
      { id: 3, text: "Sometimes: Prone to reviewing the decision mentally, especially if outcomes are slow." },
      { id: 4, text: "Frequently: Often revisit the decision, wondering if the alternative path would have been better." },
      { id: 5, text: "(N) Constant second-guessing: Plagued by doubt and regret, finding it hard to move past the decision point." }, // Disguised: Anxiety / Indecisiveness / Lack of confidence
      { id: 6, text: "(N) Rigidly defended: Refuse to reconsider the decision even when presented with strong contradictory evidence." } // Disguised: Stubbornness / Ego-defense / Confirmation bias
    ]
  },
  {
    id: 61,
    category: "Decision Making",
    questionText: "Your decision-making is influenced more by:",
    options: [
      { id: 1, text: "Logic and data: Prioritizing objective analysis and evidence." },
      { id: 2, text: "Intuition and gut feeling: Relying on inner sense or immediate impressions." },
      { id: 3, text: "Values and ethics: Ensuring the decision aligns with personal principles." },
      { id: 4, text: "Past experience: Drawing heavily on similar situations encountered before." },
      { id: 5, text: "(N) Emotional state: Decisions heavily swayed by current mood (e.g., optimism, fear, anger)." }, // Disguised: Poor emotional regulation / Impulsivity
      { id: 6, text: "(N) Social pressure/norms: Decisions strongly influenced by what peers, family, or society expect." } // Disguised: External locus of control / Lack of autonomy
    ]
  },
  {
    id: 62,
    category: "Decision Making",
    questionText: "When making a decision under time pressure, you are more likely to:",
    options: [
      { id: 1, text: "Become more focused: Concentrate intensely on the key variables to make a quick, informed choice." },
      { id: 2, text: "Rely on heuristics: Use mental shortcuts or rules of thumb based on experience." },
      { id: 3, text: "Simplify the options: Reduce the complexity to make the choice faster." },
      { id: 4, text: "Consult quickly: Seek rapid input from a trusted source." },
      { id: 5, text: "(N) Make impulsive choices: Act hastily without sufficient thought, potentially regretting it later." }, // Disguised: Impulsivity / Poor planning under stress
      { id: 6, text: "(N) Freeze or delay: Struggle to make any decision due to the pressure, leading to inaction." } // Disguised: Anxiety / Decision paralysis
    ]
  },
  {
    id: 63,
    category: "Decision Making",
    questionText: "How comfortable are you making decisions where there is a risk of significant negative consequences?",
    options: [
      { id: 1, text: "Comfortable: Accept risk as inherent; focus on mitigation and potential upside." },
      { id: 2, text: "Cautiously comfortable: Willing to take calculated risks after careful analysis." },
      { id: 3, text: "Somewhat uncomfortable: Prefer safer options but can take risks when necessary." },
      { id: 4, text: "Very uncomfortable: Strongly prefer to avoid decisions with potential negative outcomes." },
      { id: 5, text: "(N) Risk-averse to stagnation: Avoid necessary risks even when it hinders progress or opportunity." }, // Disguised: Excessive fear of failure / Stagnation
      { id: 6, text: "(N) Reckless/Thrill-seeking: Seek out or underestimate high risks, potentially without adequate preparation." } // Disguised: Poor judgment / Impulsivity / Sensation-seeking
    ]
  },
  {
    id: 64,
    category: "Decision Making",
    questionText: "After making a choice that leads to a poor outcome, your focus is primarily on:",
    options: [
      { id: 1, text: "Learning: Analyzing what went wrong to improve future decisions." },
      { id: 2, text: "Damage control: Taking steps to mitigate the negative consequences." },
      { id: 3, text: "Acceptance: Acknowledging the outcome and moving on without excessive blame." },
      { id: 4, text: "Seeking feedback: Understanding how others perceived the decision and outcome." },
      { id: 5, text: "(N) Blaming self excessively: Engaging in harsh self-criticism and rumination." }, // Disguised: Poor self-esteem / Internalized criticism
      { id: 6, text: "(N) Blaming others/externals: Deflecting responsibility by focusing on external factors or other people's roles." } // Disguised: Avoidance of accountability / External locus of control
    ]
  },

  // === Creativity (7 Questions) ===
  {
    id: 65,
    category: "Creativity",
    questionText: "Where do you typically get your best creative ideas?",
    options: [
      { id: 1, text: "During focused brainstorming or problem-solving sessions." },
      { id: 2, text: "While relaxing or doing unrelated activities (e.g., shower, walk)." },
      { id: 3, text: "From exposure to new information, art, or environments." },
      { id: 4, text: "Through collaboration and discussion with others." },
      { id: 5, text: "(N) Rarely feel creative: Struggle to generate novel ideas." }, // Disguised: Low openness / Creative block
      { id: 6, text: "(N) By slightly modifying existing ideas: Tend to iterate incrementally rather than generate truly novel concepts." } // Disguised: Fear of novelty / Preference for safety / Derivative thinking
    ]
  },
   {
    id: 66,
    category: "Creativity",
    questionText: "When starting a creative project, your initial approach is usually:",
    options: [
      { id: 1, text: "Plan and outline: Structure the project clearly before diving into execution." },
      { id: 2, text: "Experiment freely: Start creating and let the direction emerge through the process." },
      { id: 3, text: "Research and gather inspiration: Collect ideas, examples, and materials first." },
      { id: 4, text: "Define the core message/goal: Clarify the intended impact or purpose before starting." },
      { id: 5, text: "(N) Get stuck in planning: Over-plan and research excessively, delaying the actual start of creation." }, // Disguised: Procrastination / Perfectionism / Fear of starting
      { id: 6, text: "(N) Start impulsively without direction: Jump in without a clear idea, often leading to abandoned projects." } // Disguised: Lack of planning / Poor follow-through
    ]
  },
   {
    id: 67,
    category: "Creativity",
    questionText: "How do you react when your creative work receives criticism?",
    options: [
      { id: 1, text: "Openly consider it: Value feedback as a tool for improvement, even if initially difficult." },
      { id: 2, text: "Defend your choices: Explain the reasoning and intent behind your creative decisions." },
      { id: 3, text: "Filter selectively: Consider feedback from trusted sources but may dismiss others." },
      { id: 4, text: "Separate self from work: View criticism as feedback on the project, not a personal attack." },
      { id: 5, text: "(N) Become discouraged/defensive: Take criticism personally and feel demotivated or unwilling to change." }, // Disguised: Fragile ego / Resistance to feedback
      { id: 6, text: "(N) Dismiss all criticism: Believe your creative vision is inherently correct and external feedback is irrelevant." } // Disguised: Arrogance / Unwillingness to learn
    ]
  },
   {
    id: 68,
    category: "Creativity",
    questionText: "Connecting seemingly unrelated concepts to generate novel ideas is something you find:",
    options: [
      { id: 1, text: "Natural and frequent: Often see connections or analogies others don't." },
      { id: 2, text: "Possible with effort: Can do it when intentionally brainstorming or problem-solving." },
      { id: 3, text: "Challenging: Tend to think more linearly or within established categories." },
      { id: 4, text: "Domain-specific: Easier in areas of interest or expertise." },
      { id: 5, text: "(N) Confusing/Pointless: Struggle to see the value or logic in connecting disparate ideas." }, // Disguised: Concrete thinking / Lack of divergent thinking
      { id: 6, text: "(N) Makes bizarre connections: Connect things in ways that lack coherence or practical application." } // Disguised: Loose associations / Potential tangential thinking (if extreme)
    ]
  },
   {
    id: 69,
    category: "Creativity",
    questionText: "How important is originality versus effectiveness in your creative endeavors?",
    options: [
      { id: 1, text: "Originality is key: Strive for unique, novel approaches even if less conventional." },
      { id: 2, text: "Effectiveness first: Prioritize creating something that works well or achieves its goal, even if not entirely new." },
      { id: 3, text: "Balance of both: Aim for novel solutions that are also practical and effective." },
      { id: 4, text: "Depends on context: Prioritize differently based on the project's requirements." },
      { id: 5, text: "(N) Originality for its own sake: Focus on being different, even if it's impractical, ineffective, or nonsensical." }, // Disguised: Style over substance / Contrarianism
      { id: 6, text: "(N) Avoids originality: Stick strictly to proven formulas or templates, fearing novelty." } // Disguised: Fear of risk / Lack of creative confidence
    ]
  },
  {
    id: 70,
    category: "Creativity",
    questionText: "Dealing with creative blocks or lack of inspiration typically involves:",
    options: [
      { id: 1, text: "Stepping away: Taking a break, changing scenery, or doing something unrelated." },
      { id: 2, text: "Seeking new input: Consuming different media, art, or information." },
      { id: 3, text: "Disciplined practice: Working through the block by forcing some output, even if imperfect." },
      { id: 4, text: "Collaborating: Talking through ideas with others to spark inspiration." },
      { id: 5, text: "(N) Frustration and self-criticism: Getting stuck in negative thoughts about the lack of creativity." }, // Disguised: Negative self-talk / Giving up easily
      { id: 6, text: "(N) Waiting passively: Hoping inspiration strikes without taking proactive steps." } // Disguised: Passivity / Lack of strategy
    ]
  },
  {
    id: 71,
    category: "Creativity",
    questionText: "How willing are you to break established rules or conventions in your creative field?",
    options: [
      { id: 1, text: "Very willing: See rules as guidelines to be challenged or ignored for better results." },
      { id: 2, text: "Somewhat willing: Will break rules if there's a clear justification or benefit." },
      { id: 3, text: "Hesitant: Prefer to work within established structures but can adapt if needed." },
      { id: 4, text: "Respectful of rules: Believe conventions exist for good reasons and follow them." },
      { id: 5, text: "(N) Rule-breaking for shock value: Break rules primarily to be provocative or gain attention, not necessarily for artistic merit." }, // Disguised: Attention-seeking / Lack of substance
      { id: 6, text: "(N) Fearful of breaking rules: Adhere rigidly to conventions due to fear of criticism or failure." } // Disguised: Conformity / Lack of confidence / Rigidity
    ]
  },

  // === Leadership (6 Questions) ===
  {
    id: 72,
    category: "Leadership",
    questionText: "When leading a team project, your primary focus tends to be on:",
    options: [
      { id: 1, text: "The Vision: Inspiring the team with a clear, compelling picture of the end goal." },
      { id: 2, text: "The Process: Ensuring efficient workflows, clear roles, and effective coordination." },
      { id: 3, text: "The People: Supporting team members, fostering collaboration, and managing morale." },
      { id: 4, text: "The Results: Driving towards specific metrics and achieving measurable outcomes." },
      { id: 5, text: "(N) Maintaining Control: Micromanaging tasks and decisions to ensure things are done 'your way'." }, // Disguised: Need for control / Lack of trust / Inefficiency
      { id: 6, text: "(N) Gaining Credit: Positioning yourself to receive maximum recognition for the team's success." } // Disguised: Self-interest / Poor teamwork
    ]
  },
  {
    id: 73,
    category: "Leadership",
    questionText: "How do you typically handle delegation of important tasks?",
    options: [
      { id: 1, text: "Empowerment: Delegate clearly with necessary authority and trust the person to deliver." },
      { id: 2, text: "Strategic: Match tasks carefully to individual strengths and development goals." },
      { id: 3, text: "Supportive: Delegate but remain available for guidance and check-ins." },
      { id: 4, text: "Cautious: Delegate less critical tasks first, building trust before assigning major responsibilities." },
      { id: 5, text: "(N) Reluctant/Avoidant: Prefer to do important tasks yourself to ensure quality or speed (or lack of trust)." }, // Disguised: Micromanagement / Lack of trust / Poor development of others
      { id: 6, text: "(N) Abdication: Delegate tasks without clear instructions, support, or follow-up ('dumping')." } // Disguised: Poor leadership / Lack of responsibility
    ]
  },
  {
    id: 74,
    category: "Leadership",
    questionText: "When your team faces a significant challenge or failure, your response as a leader is to:",
    options: [
      { id: 1, text: "Facilitate a learning review: Analyze what happened collaboratively without blame." },
      { id: 2, text: "Take responsibility: Acknowledge leadership's role and focus on solutions." },
      { id: 3, text: "Rally the team: Focus on boosting morale and encouraging resilience." },
      { id: 4, text: "Adjust strategy: Quickly pivot plans based on the new information or setback." },
      { id: 5, text: "(N) Assign blame: Identify individuals responsible for the failure, potentially publicly." }, // Disguised: Poor leadership / Scapegoating / Fear culture
      { id: 6, text: "(N) Minimize or hide the failure: Try to downplay the issue or avoid addressing it openly with the team or stakeholders." } // Disguised: Lack of transparency / Avoidance / Fear of consequences
    ]
  },
  {
    id: 75,
    category: "Leadership",
    questionText: "How comfortable are you making decisions that may be unpopular with some team members?",
    options: [
      { id: 1, text: "Comfortable: Prioritize the best decision for the goal/organization, explaining the rationale clearly." },
      { id: 2, text: "Somewhat uncomfortable: Dislike causing discontent but will make the tough call when necessary." },
      { id: 3, text: "Context-dependent: Depends on the importance of the decision versus team morale." },
      { id: 4, text: "Seek buy-in first: Try hard to achieve consensus before making an unpopular decision." },
      { id: 5, text: "(N) Avoid unpopular decisions: Tend to choose options that maintain harmony, even if suboptimal." }, // Disguised: Conflict avoidance / People-pleasing / Weak leadership
      { id: 6, text: "(N) Indifferent to reactions: Make decisions autocratically without considering or explaining the impact on the team." } // Disguised: Authoritarianism / Lack of empathy
    ]
  },
  {
    id: 76,
    category: "Leadership",
    questionText: "Developing the skills and careers of your team members is something you see as:",
    options: [
      { id: 1, text: "A core responsibility: Actively seek opportunities for team growth and mentorship." },
      { id: 2, text: "Important but secondary: Support development when time allows, but focus on tasks first." },
      { id: 3, text: "Their own responsibility: Believe individuals should drive their own development." },
      { id: 4, text: "A benefit of good leadership: See team development as a positive outcome, not a primary focus." },
      { id: 5, text: "(N) A threat: Worry that developing team members might lead them to leave or surpass you." }, // Disguised: Insecurity / Scarcity mindset / Poor leadership
      { id: 6, text: "(N) A tool for manipulation: Develop certain individuals primarily to increase their loyalty or usefulness to you." } // Disguised: Exploitation / Self-serving leadership
    ]
  },
  {
    id: 77,
    category: "Leadership",
    questionText: "How transparent are you typically with your team about challenges or uncertainties the organization/project faces?",
    options: [
      { id: 1, text: "Highly transparent: Share relevant information openly and honestly, fostering trust." },
      { id: 2, text: "Selectively transparent: Share information on a 'need-to-know' basis, balancing openness with avoiding unnecessary alarm." },
      { id: 3, text: "Optimistically framed: Share challenges but focus primarily on positive aspects or solutions." },
      { id: 4, text: "Information controller: Carefully manage the flow of information to maintain control or morale." },
      { id: 5, text: "(N) Avoidant/Untruthful: Hide significant challenges or mislead the team to maintain control or avoid difficult conversations." }, // Disguised: Dishonesty / Lack of trust / Paternalism
      { id: 6, text: "(N) Overly transparent/Alarmist: Share raw, unfiltered anxieties or information inappropriately, causing unnecessary panic." } // Disguised: Poor judgment / Lack of emotional regulation / Boundary issues
    ]
  },

  // === Communication Style (8 Questions) ===
  {
    id: 78,
    category: "Communication Style",
    questionText: "When you need to deliver critical feedback to a colleague or team member, you tend to:",
    options: [
      { id: 1, text: "Be direct and concise: State the feedback clearly and objectively, focusing on the issue and desired change without excessive preamble." },
      { id: 2, text: "Use the 'sandwich' method: Start with praise, deliver the criticism, and end with encouragement or more praise." },
      { id: 3, text: "Ask guiding questions: Lead them to recognize the issue themselves through questioning rather than stating the criticism directly." },
      { id: 4, text: "Focus on impact: Explain the negative impact of their actions on the project or team, framing the feedback around shared goals." },
      { id: 5, text: "(N) Hint or imply: Make indirect comments or jokes, hoping they get the message without a direct confrontation." }, // Disguised: Passive-aggression / Lack of clarity
      { id: 6, text: "(N) Deliver it publicly/semi-publicly: Address the issue in a group setting or email where others are included." } // Disguised: Shaming / Lack of empathy
    ]
  },
  {
    id: 79,
    category: "Communication Style",
    questionText: "In a meeting where various ideas are being debated, your typical contribution style is:",
    options: [
      { id: 1, text: "Synthesizer: Listen actively to all points, then summarize connections, discrepancies, and potential paths forward." },
      { id: 2, text: "Advocate: Passionately argue for the idea you believe is best, providing strong rationale and addressing counterarguments." },
      { id: 3, text: "Questioner: Probe assumptions, ask clarifying questions, and explore potential risks or alternatives for various proposals." },
      { id: 4, text: "Supporter/Harmonizer: Encourage others, build on existing ideas, and try to find common ground or ensure everyone feels heard." },
      { id: 5, text: "(N) Strategic Silence/Observation: Mostly listen, contributing minimally until you see a clear 'winning' side emerging to align with." }, // Disguised: Disengagement / Political maneuvering
      { id: 6, text: "(N) Devil's Advocate (Excessive): Consistently point out flaws or potential problems in *most* ideas presented, often without offering constructive alternatives." } // Disguised: Negativity / Obstructionism
    ]
  },
   {
    id: 80,
    category: "Communication Style",
    questionText: "When writing an important email or document, you prioritize:",
    options: [
      { id: 1, text: "Clarity and conciseness: Getting the main point across efficiently." },
      { id: 2, text: "Thoroughness and detail: Including all relevant background and supporting information." },
      { id: 3, text: "Diplomacy and tone: Ensuring the message is received positively and maintains relationships." },
      { id: 4, text: "Persuasiveness: Structuring the argument logically to convince the reader." },
      { id: 5, text: "(N) Speed and minimal effort: Writing quickly without significant proofreading or consideration for the reader." }, // Disguised: Carelessness / Lack of professionalism
      { id: 6, text: "(N) Obscurity/Complexity: Using overly complex language or structure, potentially to appear intelligent or obscure lack of substance." } // Disguised: Poor communication / Insecurity / Intentional obfuscation
    ]
  },
  {
    id: 81,
    category: "Communication Style",
    questionText: "How comfortable are you with silence during a conversation?",
    options: [
      { id: 1, text: "Comfortable: Allow pauses for thought or reflection without feeling the need to fill them." },
      { id: 2, text: "Slightly uncomfortable: Tolerate brief silences but may feel awkward if they extend." },
      { id: 3, text: "Generally uncomfortable: Tend to fill silences quickly with talk or questions." },
      { id: 4, text: "Use silence strategically: Employ pauses intentionally for emphasis or to encourage others to speak." },
      { id: 5, text: "(N) Very uncomfortable/Anxious: Feel a strong compulsion to fill any silence, often with nervous chatter." }, // Disguised: Anxiety / Poor listening / Need for control
      { id: 6, text: "(N) Use silence aggressively: Employ long, uncomfortable silences as a form of passive aggression or intimidation." } // Disguised: Manipulation / Aggression
    ]
  },
   {
    id: 82,
    category: "Communication Style",
    questionText: "When someone is explaining something complex to you, your preferred way to show you're listening is:",
    options: [
      { id: 1, text: "Asking clarifying questions periodically." },
      { id: 2, text: "Summarizing their points back to them occasionally." },
      { id: 3, text: "Using non-verbal cues like nodding and eye contact." },
      { id: 4, text: "Taking notes quietly." },
      { id: 5, text: "(N) Interrupting frequently with your own related thoughts or experiences." }, // Disguised: Poor listening / Self-centeredness / Conversational narcissism
      { id: 6, text: "(N) Appearing distracted: Looking away, checking phone, or showing minimal reaction." } // Disguised: Disinterest / Disrespect
    ]
  },
   {
    id: 83,
    category: "Communication Style",
    questionText: "Your typical use of humor in professional or serious conversations is:",
    options: [
      { id: 1, text: "Frequent and lighthearted: Use humor to build rapport and ease tension." },
      { id: 2, text: "Occasional and relevant: Use humor sparingly when appropriate to the context." },
      { id: 3, text: "Rare or absent: Tend to maintain a serious tone in professional settings." },
      { id: 4, text: "Dry or witty: Employ subtle humor that requires attention to catch." },
      { id: 5, text: "(N) Inappropriate or excessive: Use humor that is ill-timed, unprofessional, or distracts from the topic." }, // Disguised: Poor judgment / Lack of seriousness / Defense mechanism
      { id: 6, text: "(N) Sarcastic or cynical: Rely on biting humor that can be perceived as negative or passive-aggressive." } // Disguised: Negativity / Passive aggression / Poor rapport building
    ]
  },
  {
    id: 84,
    category: "Communication Style",
    questionText: "When you disagree with someone in a discussion, you are most likely to:",
    options: [
      { id: 1, text: "State your disagreement directly but respectfully, explaining your reasoning." },
      { id: 2, text: "Acknowledge their point first, then gently introduce your counter-perspective ('Yes, and...')." },
      { id: 3, text: "Ask questions to understand their viewpoint better before stating your disagreement." },
      { id: 4, text: "Focus on objective facts or data that support your differing view." },
      { id: 5, text: "(N) Agree outwardly but disagree inwardly: Avoid stating disagreement directly to maintain harmony." }, // Disguised: Conflict avoidance / Lack of assertiveness / Passive aggression
      { id: 6, text: "(N) Dismiss their viewpoint: Strongly assert your disagreement, potentially invalidating their perspective." } // Disguised: Arrogance / Poor listening / Combativeness
    ]
  },
   {
    id: 85,
    category: "Communication Style",
    questionText: "How effectively do you adapt your communication style to different audiences (e.g., technical experts vs. general audience, superiors vs. subordinates)?",
    options: [
      { id: 1, text: "Very effectively: Consciously adjust language, tone, and level of detail." },
      { id: 2, text: "Moderately effectively: Make some adjustments but may not always hit the mark." },
      { id: 3, text: "Somewhat effectively: Tend to have a default style but try to adapt when necessary." },
      { id: 4, text: "Minimally: Primarily use one communication style regardless of the audience." },
      { id: 5, text: "(N) Inconsistently/Awkwardly: Attempts to adapt may come across as unnatural or condescending." }, // Disguised: Poor social calibration / Lack of skill
      { id: 6, text: "(N) Refuse to adapt: Believe others should adapt to your style or understand your default communication." } // Disguised: Rigidity / Arrogance / Lack of empathy
    ]
  },

  // === Self-Perception / Blind Spots (8 Questions) ===
  {
    id: 86,
    category: "Self-Perception / Blind Spots",
    questionText: "How often do you actively seek out critical feedback about yourself or your performance, even when things seem to be going well?",
    options: [
      { id: 1, text: "Regularly: Make it a point to ask trusted sources for honest feedback." },
      { id: 2, text: "Occasionally: Seek feedback primarily when facing challenges or uncertainty." },
      { id: 3, text: "Rarely: Tend to rely on self-assessment or wait for feedback to be offered." },
      { id: 4, text: "Only from specific people: Seek feedback only from those likely to be positive or supportive." },
      { id: 5, text: "(N) Avoidantly: Actively dislike or avoid situations where critical feedback might be given." }, // Disguised: Fear of criticism / Fragile ego / Lack of growth mindset
      { id: 6, text: "(N) Seek feedback then argue: Ask for feedback but then become defensive or justify behavior when receiving it." } // Disguised: Poor reception to feedback / Defensiveness
    ]
  },
   {
    id: 87,
    category: "Self-Perception / Blind Spots",
    questionText: "When multiple people give you similar feedback about a potential blind spot or weakness, your reaction is usually to:",
    options: [
      { id: 1, text: "Reflect seriously: Consider the pattern and explore whether the feedback holds truth." },
      { id: 2, text: "Seek more data: Ask for specific examples or clarification to better understand." },
      { id: 3, text: "Feel defensive initially, then reflect: Have an immediate negative reaction but consider it later." },
      { id: 4, text: "Compare sources: Evaluate the credibility and potential biases of those giving feedback." },
      { id: 5, text: "(N) Dismiss as conspiracy/misunderstanding: Assume they are coordinating against you or simply don't understand you." }, // Disguised: Paranoia / Externalization of blame / Lack of self-awareness
      { id: 6, text: "(N) Become distressed/withdrawn: Feel overwhelmed by the perceived criticism and shut down emotionally." } // Disguised: High sensitivity to criticism / Poor emotional regulation
    ]
  },
  {
    id: 88,
    category: "Self-Perception / Blind Spots",
    questionText: "How accurate do you believe your self-assessment of your strengths and weaknesses generally is?",
    options: [
      { id: 1, text: "Highly accurate: Have a clear and realistic view confirmed by experience and feedback." },
      { id: 2, text: "Moderately accurate: Generally realistic but acknowledge potential biases or blind spots." },
      { id: 3, text: "Somewhat accurate: Suspect self-perception might be skewed in certain areas." },
      { id: 4, text: "Unsure: Find it difficult to objectively assess personal strengths and weaknesses." },
      { id: 5, text: "(N) Overly positive/Inflated: Tend to overestimate strengths and underestimate weaknesses significantly." }, // Disguised: Narcissistic traits / Dunning-Kruger effect / Lack of self-awareness
      { id: 6, text: "(N) Overly negative/Critical: Tend to underestimate strengths and overestimate weaknesses significantly." } // Disguised: Low self-esteem / Imposter syndrome / Negative bias
    ]
  },
   {
    id: 89,
    category: "Self-Perception / Blind Spots",
    questionText: "When reflecting on a past interpersonal conflict, how often do you genuinely consider your own contribution to the problem?",
    options: [
      { id: 1, text: "Almost always: Routinely examine own actions, assumptions, and communication." },
      { id: 2, text: "Frequently: Often consider own role, especially if the outcome was poor." },
      { id: 3, text: "Sometimes: May consider own role if prompted or if the other person's fault isn't obvious." },
      { id: 4, text: "Rarely: Tend to focus primarily on the other person's actions and faults." },
      { id: 5, text: "(N) Never/Defensively: Automatically assume the other party was solely or primarily at fault, defending own actions vigorously." }, // Disguised: Lack of accountability / Externalization / Defensiveness
      { id: 6, text: "(N) Excessive self-blame: Take disproportionate responsibility for the conflict, even for others' actions." } // Disguised: Poor boundaries / Codependency traits / Low self-esteem
    ]
  },
  {
    id: 90,
    category: "Self-Perception / Blind Spots",
    questionText: "How aware are you of the non-verbal signals (body language, tone of voice) you project to others?",
    options: [
      { id: 1, text: "Highly aware: Consciously manage non-verbal communication and check for consistency with verbal message." },
      { id: 2, text: "Moderately aware: Aware of major signals but may not notice subtle cues." },
      { id: 3, text: "Somewhat aware: Occasionally notice own non-verbals, especially if pointed out." },
      { id: 4, text: "Minimally aware: Rarely think about or notice own non-verbal communication." },
      { id: 5, text: "(N) Assume congruence: Believe non-verbals always match intentions, potentially unaware of contradictory signals (e.g., appearing bored when interested)." }, // Disguised: Lack of self-awareness / Poor emotional expression control
      { id: 6, text: "(N) Intentionally misleading: Consciously use non-verbal signals to manipulate or deceive others." } // Disguised: Manipulativeness / Deceitfulness
    ]
  },
  {
    id: 91,
    category: "Self-Perception / Blind Spots",
    questionText: "Do you ever find that people react to you in ways that genuinely surprise you (e.g., finding you intimidating when you feel friendly, or distant when you feel engaged)?",
    options: [
      { id: 1, text: "Rarely: People's reactions generally align with my intentions and self-perception." },
      { id: 2, text: "Occasionally: Sometimes surprises happen, prompting reflection on my impact." },
      { id: 3, text: "Sometimes: Notice occasional discrepancies between intent and impact." },
      { id: 4, text: "Frequently: Often feel misunderstood or find people react unexpectedly." },
      { id: 5, text: "(N) Dismiss surprising reactions: Assume the other person is misinterpreting or overly sensitive, rather than examining own behavior." }, // Disguised: Lack of self-awareness / Externalization
      { id: 6, text: "(N) Indifferent to reactions: Pay little attention to how others perceive or react to you." } // Disguised: Lack of social awareness / Potential detachment
    ]
  },
  {
    id: 92,
    category: "Self-Perception / Blind Spots",
    questionText: "How open are you to the idea that some of your deeply held beliefs or assumptions might be flawed or biased?",
    options: [
      { id: 1, text: "Very open: Actively question own beliefs and welcome perspectives that challenge them." },
      { id: 2, text: "Moderately open: Willing to reconsider beliefs if presented with strong evidence." },
      { id: 3, text: "Somewhat resistant: Tend to hold onto beliefs unless evidence is overwhelming." },
      { id: 4, text: "Open in some areas, closed in others: Willing to question certain beliefs but not core values or identity-linked assumptions." },
      { id: 5, text: "(N) Highly resistant/Defensive: Vigorously defend all core beliefs and assumptions, dismissing contradictory evidence or perspectives." }, // Disguised: Dogmatism / Cognitive rigidity / Confirmation bias
      { id: 6, text: "(N) Feigned openness: Pretend to be open but subtly manipulate conversations to reinforce existing beliefs." } // Disguised: Intellectual dishonesty / Manipulation
    ]
  },
   {
    id: 93,
    category: "Self-Perception / Blind Spots",
    questionText: "Thinking about your 'worst' qualities or recurring mistakes, your attitude is generally one of:",
    options: [
      { id: 1, text: "Acceptance and management: Acknowledge them and actively work to mitigate their negative impact." },
      { id: 2, text: "Frustrated striving: Dislike these qualities intensely and constantly try to eliminate them." },
      { id: 3, text: "Resigned tolerance: Accept them as part of who you are without significant effort to change." },
      { id: 4, text: "Contextual justification: Tend to find reasons why these qualities were necessary or understandable in specific situations." },
      { id: 5, text: "(N) Denial or minimization: Avoid acknowledging these qualities or downplay their significance." }, // Disguised: Lack of self-awareness / Avoidance
      { id: 6, text: "(N) Romanticization/Justification: Frame negative qualities as strengths or necessary evils (e.g., 'brutal honesty' for cruelty)." } // Disguised: Rationalization / Lack of accountability
    ]
  },

  // === Philosophical Outlook / Worldview (8 Questions) ===
  {
    id: 94,
    category: "Philosophical Outlook / Worldview",
    questionText: "Fundamentally, do you believe human nature is:",
    options: [
      { id: 1, text: "Basically good: People are inherently well-intentioned, though circumstances can lead them astray." },
      { id: 2, text: "Neutral/Malleable: People are shaped primarily by environment, culture, and choice." },
      { id: 3, text: "Mixed: Capable of both great good and great evil, a constant internal struggle." },
      { id: 4, text: "Basically self-interested: People primarily act to maximize their own benefit, though cooperation can be strategic." },
      { id: 5, text: "(N) Fundamentally flawed/sinful: People have inherent negative tendencies that require strong control (internal or external)." }, // Disguised: Cynicism / Pessimism / Potential misanthropy
      { id: 6, text: "(N) Unknowable/Irrelevant: Find questions about fundamental human nature meaningless or unanswerable." } // Disguised: Philosophical avoidance / Potential nihilism
    ]
  },
  {
    id: 95,
    category: "Philosophical Outlook / Worldview",
    questionText: "What is the primary source of meaning or purpose in life, in your view?",
    options: [
      { id: 1, text: "Relationships and connection: Love, family, friendship, community." },
      { id: 2, text: "Contribution and service: Making a positive impact on the world or others." },
      { id: 3, text: "Personal growth and self-actualization: Continuously learning, developing, and becoming one's best self." },
      { id: 4, text: "Experiencing and appreciating life: Finding joy, beauty, and wonder in existence itself." },
      { id: 5, text: "(N) Achievement and status: Gaining external success, recognition, power, or wealth." }, // Disguised: External validation focus / Materialism / Status drive
      { id: 6, text: "(N) There is no inherent meaning: Life lacks objective purpose; meaning is subjective and perhaps illusory." } // Disguised: Nihilism / Potential existential despair (depends on tone)
    ]
  },
  {
    id: 96,
    category: "Philosophical Outlook / Worldview",
    questionText: "How much control do you believe individuals ultimately have over the course of their lives?",
    options: [
      { id: 1, text: "Significant control: Choices and effort are the primary determinants of life outcomes." },
      { id: 2, text: "Moderate control: Choices matter, but external factors (luck, environment, society) play a major role." },
      { id: 3, text: "Limited control: External factors and systemic forces largely shape life paths, with individual agency having less impact." },
      { id: 4, text: "Control over response, not outcome: Cannot control events, but can control reactions and attitude." },
      { id: 5, text: "(N) Illusion of control: Belief in free will is largely an illusion; outcomes are mostly predetermined by factors beyond individual control." }, // Disguised: Fatalism / Determinism / Potential learned helplessness
      { id: 6, text: "(N) Total control (unrealistic): Believe individuals have near-complete control over all aspects of life, ignoring external realities." } // Disguised: Naivety / 'Just world' fallacy / Lack of systemic awareness
    ]
  },
   {
    id: 97,
    category: "Philosophical Outlook / Worldview",
    questionText: "What is your general outlook on the future of humanity or society?",
    options: [
      { id: 1, text: "Optimistic: Believe progress is possible and humanity will overcome challenges." },
      { id: 2, text: "Cautiously optimistic: Hopeful but aware of significant risks and the need for effort." },
      { id: 3, text: "Neutral/Uncertain: See potential for both positive and negative outcomes; future is unpredictable." },
      { id: 4, text: "Pessimistic: Tend to believe challenges are insurmountable or negative trends will prevail." },
      { id: 5, text: "(N) Apocalyptic/Doomer: Convinced of imminent collapse or disaster, potentially with a sense of detachment or even anticipation." }, // Disguised: Extreme pessimism / Catastrophizing / Potential negativity bias
      { id: 6, text: "(N) Indifferent/Disengaged: Pay little attention to large-scale societal futures, focusing only on the immediate or personal." } // Disguised: Apathy / Lack of broader concern / Solipsism
    ]
  },
  {
    id: 98,
    category: "Philosophical Outlook / Worldview",
    questionText: "The pursuit of happiness is best achieved through:",
    options: [
      { id: 1, text: "Meaningful contribution and purpose." },
      { id: 2, text: "Strong social connections and relationships." },
      { id: 3, text: "Inner peace, mindfulness, and acceptance." },
      { id: 4, text: "Personal achievement and mastery." },
      { id: 5, text: "(N) Pleasure-seeking and maximizing positive experiences/sensations." }, // Disguised: Hedonism (potentially unsustainable or shallow)
      { id: 6, text: "(N) Avoiding pain and discomfort at all costs." } // Disguised: Safetyism / Fear-based living / Stagnation
    ]
  },
   {
    id: 99,
    category: "Philosophical Outlook / Worldview",
    questionText: "What is the role of suffering in human life?",
    options: [
      { id: 1, text: "Growth catalyst: Necessary for building resilience, empathy, and wisdom." },
      { id: 2, text: "Inevitable part of existence: Something to be accepted and navigated, not necessarily sought or avoided." },
      { id: 3, text: "Problem to be solved: Something to be minimized or eliminated through progress and effort." },
      { id: 4, text: "Source of meaning (sometimes): Can provide depth or purpose in specific contexts (e.g., overcoming adversity)." },
      { id: 5, text: "(N) Pointless and destructive: Primarily negative, offering little value and something to be avoided entirely." }, // Disguised: Suffering intolerance / Potential naivety
      { id: 6, text: "(N) Deserved or purifying: Belief that suffering is a necessary punishment or a path to spiritual merit." } // Disguised: Potential masochism / Punitive worldview
    ]
  },
  {
    id: 100,
    category: "Philosophical Outlook / Worldview",
    questionText: "When confronted with the vastness of the universe and the limits of human understanding, you feel primarily:",
    options: [
      { id: 1, text: "Awe and wonder: Inspired by the mystery and scale." },
      { id: 2, text: "Curiosity: Motivated to learn more about what can be known." },
      { id: 3, text: "Humility: Aware of the small place humanity occupies." },
      { id: 4, text: "Connection: Feel part of a larger, interconnected system." },
      { id: 5, text: "(N) Insignificance and anxiety: Overwhelmed by the lack of inherent meaning or individual importance." }, // Disguised: Existential anxiety / Potential nihilistic despair
      { id: 6, text: "(N) Indifference: Find such large-scale considerations irrelevant to daily life." } // Disguised: Lack of curiosity / Limited perspective / Apathy
    ]
  },
]; 
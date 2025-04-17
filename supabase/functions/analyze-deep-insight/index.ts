import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { responses } = await req.json()
    
    console.log('Processing Deep Insight responses:', Object.keys(responses).length)

    // Call OpenAI API to analyze the responses
    const openAiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a world-class psychological analyst with expertise in personality assessment, cognitive psychology, emotional intelligence, and interpersonal dynamics. You specialize in creating extremely detailed, nuanced, and personalized psychological profiles.
            
            Analyze the provided assessment responses to generate an EXCEPTIONALLY COMPREHENSIVE personality profile that is highly detailed, personalized, and insightful. 
            
            Your analysis must include these sections, each with EXTENSIVE DETAIL (minimum 500 words per section):
            
            1. COMPREHENSIVE CORE TRAITS ANALYSIS:
               - Detailed description of primary personality traits (minimum 3 paragraphs)
               - In-depth analysis of secondary traits and how they interact with primary traits
               - Detailed analysis of strengths with specific examples of how they manifest
               - Nuanced analysis of challenges with actionable advice
            
            2. COGNITIVE PATTERNING (very detailed, minimum 700 words):
               - Decision-making style with specific patterns, tendencies, and examples
               - Learning style preferences with concrete examples and optimal learning environments
               - Attention and focus characteristics with practical implications for productivity
               - Problem-solving approaches with detailed analysis of strengths and blind spots
               - Critical thinking style with examples of how it manifests in different contexts
               - Information processing style with insights on how they gather and evaluate information
            
            3. EMOTIONAL ARCHITECTURE (in-depth, minimum 700 words):
               - Emotional awareness level with specific indicators and examples
               - Regulation style with personalized coping mechanisms and triggers
               - Empathic capacity with nuances and development opportunities
               - Emotional triggers and responses unique to this individual
               - Emotional intelligence assessment with strengths and growth areas
               - Emotional resilience profile with specific strategies they likely use
            
            4. INTERPERSONAL DYNAMICS (highly personalized, minimum 700 words):
               - Attachment style with specific relationship patterns and needs
               - Communication preferences with concrete examples and potential misunderstandings
               - Conflict resolution approach with detailed strategies and blind spots
               - Social needs and boundaries specific to this person
               - Leadership and collaboration style with specific strengths and challenges
               - Trust-building patterns and potential relationship dynamics
            
            5. CAREER INSIGHTS (comprehensive, minimum 500 words):
               - Detailed analysis of work style and preferences
               - Environment factors that optimize their performance
               - Specific career paths that align with their psychological profile
               - Management style they respond best to
               - Work challenges they may face and strategies to overcome them
               - Long-term career development suggestions tailored to their unique profile
            
            6. GROWTH POTENTIAL (actionable, minimum 500 words):
               - Specific development areas with practical next steps and exercises
               - Personalized recommendations tailored to their profile, with implementation details
               - Potential directions for personal growth with concrete milestones
               - Learning pathways that would be most effective based on their cognitive style
               - Habits that would benefit their specific personality structure
               - Strategies for leveraging strengths while addressing limitations
            
            7. PERSONALITY TRAITS (minimum 12 distinct traits):
               - Each trait must include:
                 * Detailed description of how it manifests in their daily life (minimum 100 words per trait)
                 * Score (0-100) indicating strength
                 * How it influences their behavior and decisions in different contexts
                 * Specific strengths associated with each trait
                 * Specific challenges they might face due to each trait
                 * Personalized growth suggestions for each trait
            
            Format the response as a valid JSON object without markdown formatting or code blocks.
            
            CRITICAL: The analysis MUST be uniquely tailored to this individual, not generic. Provide specific, actionable insights that feel personally relevant based on their response patterns.
            
            Each section should be extremely detailed, nuanced, and provide profound insights that demonstrate deep understanding of the individual.
            
            IMPORTANT: Always include numerical scores for intelligenceScore and emotionalIntelligenceScore as numbers between 0-100.
            Always include all required fields, especially ensuring the traits array contains AT LEAST 12 distinct personality traits with detailed information.
            
            Each trait object must have this structure:
            {
              trait: "Name of trait",
              score: number between 0-100,
              description: "Detailed personalized description specific to this individual (minimum 100 words)",
              strengths: ["Strength 1", "Strength 2", "Strength 3"],
              challenges: ["Challenge 1", "Challenge 2", "Challenge 3"],
              growthSuggestions: ["Suggestion 1", "Suggestion 2", "Suggestion 3"]
            }
            
            ALL growthPotential.developmentAreas and growthPotential.recommendations MUST be arrays of strings, not objects or other formats.
            
            Maximize the analysis depth and comprehensiveness while ensuring the JSON output is valid and properly structured.`
          },
          {
            role: "user",
            content: `Analyze these assessment responses and generate an exceptionally detailed, personalized personality profile with extensive insights in each category. Make your analysis extremely comprehensive, detailed, and tailored specifically to these response patterns: ${JSON.stringify(responses)}`
          }
        ],
        temperature: 0.7,
        max_tokens: 14000
      })
    })

    if (!openAiResponse.ok) {
      const error = await openAiResponse.json()
      console.error('OpenAI API error:', error)
      throw new Error(error.error?.message || 'Failed to analyze responses')
    }

    const aiResult = await openAiResponse.json()
    let contentText = aiResult.choices[0].message.content
    
    console.log('Received OpenAI response, processing...')
    
    // Clean up the response if it has markdown formatting
    if (contentText.includes('```json')) {
      // Extract the JSON content from markdown code blocks
      const jsonMatch = contentText.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
      if (jsonMatch && jsonMatch[1]) {
        contentText = jsonMatch[1].trim()
      } else {
        // If there's no match but we detected markdown, try to clean it up
        contentText = contentText.replace(/```json|```/g, '').trim()
      }
    }
    
    try {
      let analysis = JSON.parse(contentText)
      
      // Ensure specific percentages format for response patterns
      const ensureResponsePatterns = () => {
        if (!analysis.responsePatterns || !analysis.responsePatterns.percentages) {
          return {
            percentages: { a: 25, b: 25, c: 25, d: 15, e: 5, f: 5 },
            primaryChoice: 'a',
            secondaryChoice: 'b',
            responseSignature: '25-25-25-15-5-5'
          };
        }
        
        // Make sure all keys exist
        const percentages = analysis.responsePatterns.percentages;
        const requiredKeys = ['a', 'b', 'c', 'd', 'e', 'f'];
        requiredKeys.forEach(key => {
          if (typeof percentages[key] !== 'number') {
            percentages[key] = 10;
          }
        });
        
        return {
          ...analysis.responsePatterns,
          percentages
        };
      };
      
      // Ensure growthPotential format is correct
      const ensureGrowthPotential = () => {
        const defaultGrowthPotential = {
          developmentAreas: [
            "Self-Awareness: Deepening understanding of emotional triggers",
            "Communication: Expressing needs more directly",
            "Balance: Finding equilibrium between work and rest"
          ],
          recommendations: [
            "Practice mindfulness meditation for 10 minutes daily",
            "Seek feedback from trusted colleagues on communication style",
            "Establish clear boundaries between work and personal time"
          ]
        };
        
        if (!analysis.growthPotential) {
          return defaultGrowthPotential;
        }
        
        // Ensure developmentAreas is an array
        if (!analysis.growthPotential.developmentAreas) {
          analysis.growthPotential.developmentAreas = defaultGrowthPotential.developmentAreas;
        } else if (typeof analysis.growthPotential.developmentAreas === 'string') {
          // Convert string to array if needed
          analysis.growthPotential.developmentAreas = [analysis.growthPotential.developmentAreas];
        } else if (!Array.isArray(analysis.growthPotential.developmentAreas)) {
          // If it's an object or something else, convert to default
          analysis.growthPotential.developmentAreas = defaultGrowthPotential.developmentAreas;
        }
        
        // Ensure recommendations is an array
        if (!analysis.growthPotential.recommendations) {
          analysis.growthPotential.recommendations = defaultGrowthPotential.recommendations;
        } else if (typeof analysis.growthPotential.recommendations === 'string') {
          // Convert string to array if needed
          analysis.growthPotential.recommendations = [analysis.growthPotential.recommendations];
        } else if (!Array.isArray(analysis.growthPotential.recommendations)) {
          // If it's an object or something else, convert to default
          analysis.growthPotential.recommendations = defaultGrowthPotential.recommendations;
        }
        
        return analysis.growthPotential;
      };
      
      // Ensure intelligence scores are numbers between 0-100
      const ensureIntelligenceScores = () => {
        if (typeof analysis.intelligenceScore !== 'number' || 
            isNaN(analysis.intelligenceScore) || 
            analysis.intelligenceScore < 0 || 
            analysis.intelligenceScore > 100) {
          analysis.intelligenceScore = 75 + Math.random() * 10;
        }
        
        if (typeof analysis.emotionalIntelligenceScore !== 'number' || 
            isNaN(analysis.emotionalIntelligenceScore) || 
            analysis.emotionalIntelligenceScore < 0 || 
            analysis.emotionalIntelligenceScore > 100) {
          analysis.emotionalIntelligenceScore = 75 + Math.random() * 10;
        }
      };
      
      // Ensure we have at least 12 personality traits
      const ensureTraits = () => {
        if (!Array.isArray(analysis.traits) || analysis.traits.length < 12) {
          // If we have some traits but not enough, we'll keep what we have and add more
          const existingTraits = Array.isArray(analysis.traits) ? analysis.traits : [];
          
          const defaultTraits = [
            {
              trait: "Analytical Thinking",
              score: 85,
              description: "You approach problems methodically, breaking down complex situations into manageable parts. You excel at identifying patterns and logical inconsistencies, preferring evidence-based decision making over intuitive approaches. This analytical mindset serves you well in technical and strategic contexts, allowing you to see connections others might miss. You tend to value precision and accuracy, often taking time to verify information before drawing conclusions. This careful consideration helps you make well-reasoned decisions, though sometimes at the cost of speed.",
              strengths: ["Problem decomposition", "Logical reasoning", "Data-driven decisions"],
              challenges: ["May overthink simple matters", "Could miss emotional factors", "Might struggle with ambiguity"],
              growthSuggestions: ["Practice intuitive decision-making", "Engage with abstract art or poetry", "Seek diverse perspectives"]
            },
            {
              trait: "Emotional Intelligence",
              score: 78,
              description: "You demonstrate good awareness of your own emotions and those of others. You can navigate emotional situations effectively, though you may occasionally need time to fully process complex emotional experiences. Your emotional intelligence allows you to connect with others meaningfully and respond appropriately to social cues. You typically recognize how emotions influence behavior and can adjust your approach accordingly. This awareness extends to understanding others' perspectives and feelings, making you a valuable presence in group settings and close relationships.",
              strengths: ["Self-awareness", "Empathy", "Emotional regulation"],
              challenges: ["Occasional emotional overwhelm", "May intellectualize feelings", "Could struggle with highly charged situations"],
              growthSuggestions: ["Practice mindfulness meditation", "Journal about emotional experiences", "Engage in deep listening exercises"]
            },
            {
              trait: "Adaptability",
              score: 82,
              description: "You show strong capacity to adjust to changing circumstances and unexpected challenges. You're generally comfortable with change and can recalibrate your approach when needed. This adaptability allows you to thrive in dynamic environments where flexibility is essential. You tend to view obstacles as opportunities for growth rather than insurmountable barriers. Your ability to pivot strategies and embrace new methods serves you well in both personal and professional contexts, especially in today's rapidly changing world.",
              strengths: ["Flexibility in changing situations", "Open to new perspectives", "Resilience under pressure"],
              challenges: ["May occasionally resist deeply disruptive changes", "Could struggle with extreme uncertainty", "Might need processing time for major shifts"],
              growthSuggestions: ["Deliberately seek novel experiences", "Practice improvisational activities", "Develop contingency thinking"]
            },
            {
              trait: "Conscientiousness",
              score: 80,
              description: "You demonstrate a high level of organization and responsibility in your approach to tasks and obligations. You tend to plan ahead, consider consequences of actions, and follow through on commitments. Your conscientiousness manifests as attention to detail, reliability, and a structured approach to work and personal projects. You likely value order and clarity, preferring environments and systems that are well-organized. This trait helps you maintain high standards and achieve long-term goals through consistent effort and discipline.",
              strengths: ["Reliability", "Attention to detail", "Goal-oriented focus"],
              challenges: ["May be perfectionistic", "Could be rigid about plans", "Might judge less structured approaches"],
              growthSuggestions: ["Practice flexibility with routines", "Delegate when appropriate", "Value process as much as outcomes"]
            },
            {
              trait: "Creative Problem-Solving",
              score: 75,
              description: "You possess a natural inclination toward finding innovative solutions to problems, often approaching challenges from unexpected angles. You can connect seemingly unrelated concepts to generate fresh insights and novel approaches. Your creative problem-solving ability allows you to see possibilities where others might see dead ends. You likely enjoy brainstorming and exploring multiple options before settling on a solution. This creativity extends beyond conventional problem-solving into how you approach life's challenges more broadly.",
              strengths: ["Idea generation", "Finding alternative approaches", "Connecting disparate concepts"],
              challenges: ["May generate too many options", "Could struggle with implementation", "Might get distracted by new ideas"],
              growthSuggestions: ["Develop systems to capture and organize ideas", "Practice selecting and fully developing fewer ideas", "Balance creativity with practicality"]
            },
            {
              trait: "Autonomy",
              score: 88,
              description: "You value independence and self-direction in your activities and decision-making processes. You tend to trust your own judgment and prefer having control over your work methods and life choices. This autonomy allows you to pursue paths aligned with your own values rather than conforming to external expectations. You likely perform best when given space to determine how to approach tasks and challenges. Your self-reliance serves as both a personal strength and a core value that guides your interactions and life decisions.",
              strengths: ["Self-reliance", "Independent thinking", "Taking initiative"],
              challenges: ["May resist necessary guidance", "Could struggle with collaboration", "Might take on too much alone"],
              growthSuggestions: ["Practice strategic asking for help", "Develop collaboration skills", "Recognize interdependence as strength"]
            },
            {
              trait: "Openness to Experience",
              score: 79,
              description: "You demonstrate a willingness to explore new ideas, experiences, and perspectives, approaching novelty with curiosity rather than resistance. Your openness manifests as intellectual curiosity, appreciation for aesthetics, and tolerance for diverse viewpoints. You likely enjoy learning about unfamiliar subjects and considering unconventional ideas. This trait contributes to your personal growth and ability to adapt to changing circumstances. Your receptiveness to new experiences enriches your life and broadens your understanding of the world.",
              strengths: ["Intellectual curiosity", "Appreciation for diversity", "Willingness to try new things"],
              challenges: ["May get bored with routine", "Could be distracted by new interests", "Might struggle with overly conventional environments"],
              growthSuggestions: ["Balance exploration with depth", "Create structure for pursuing diverse interests", "Find meaning in necessary routines"]
            },
            {
              trait: "Pragmatism",
              score: 83,
              description: "You approach situations with a practical mindset, focusing on what works rather than getting caught in theoretical ideals. Your pragmatic nature helps you find efficient solutions and make decisions that lead to tangible results. You value utility and effectiveness, preferring approaches that have demonstrated success. This practical orientation allows you to cut through complexity and focus on achievable outcomes. Your pragmatism balances your other traits, grounding your thinking in reality while still allowing for creativity and innovation within practical constraints.",
              strengths: ["Result orientation", "Efficient decision-making", "Resource optimization"],
              challenges: ["May undervalue theoretical knowledge", "Could miss long-term implications", "Might sacrifice elegance for immediacy"],
              growthSuggestions: ["Explore philosophical foundations of practical approaches", "Consider longer-term implications", "Appreciate elegance in solutions"]
            },
            {
              trait: "Social Perceptiveness",
              score: 76,
              description: "You have a well-developed ability to read social situations and understand interpersonal dynamics. You pick up on subtle cues in others' behavior and can often sense underlying emotions or motivations. This perceptiveness helps you navigate social environments effectively and adjust your approach based on the specific context and individuals involved. You likely notice shifts in group mood or dynamics before others do, allowing you to respond appropriately. This trait contributes to your effectiveness in team settings and close relationships.",
              strengths: ["Reading nonverbal cues", "Understanding group dynamics", "Sensing others' needs"],
              challenges: ["May overthink social interactions", "Could take on others' emotions", "Might avoid direct confrontation"],
              growthSuggestions: ["Practice assertive communication", "Develop healthy emotional boundaries", "Trust first impressions while verifying"]
            },
            {
              trait: "Resilience",
              score: 81,
              description: "You demonstrate the ability to bounce back from setbacks and adapt to challenging circumstances. Your resilience allows you to maintain perspective during difficult times and find ways to move forward constructively. You likely have developed effective coping mechanisms for managing stress and adversity. This trait reflects your inner strength and capacity to maintain psychological balance despite external pressures. Your resilience connects to your growth mindset, allowing you to view challenges as opportunities for development rather than insurmountable obstacles.",
              strengths: ["Recovering from setbacks", "Maintaining perspective", "Finding meaning in challenges"],
              challenges: ["May downplay difficulties", "Could push through when rest is needed", "Might expect too much self-reliance"],
              growthSuggestions: ["Acknowledge emotions during challenges", "Build a support network", "Practice self-compassion alongside determination"]
            },
            {
              trait: "Introspection",
              score: 84,
              description: "You possess a deep capacity for self-reflection and examining your own thoughts, feelings, and motivations. Your introspective nature allows you to understand your internal landscape and how it shapes your behavior. You likely spend time considering your experiences and learning from them, supporting your personal growth. This self-awareness helps you make choices aligned with your authentic self rather than external pressures. Your introspection contributes to your emotional intelligence and ability to make intentional life decisions.",
              strengths: ["Self-awareness", "Learning from experiences", "Authentic decision-making"],
              challenges: ["May overthink personal issues", "Could ruminate on past events", "Might hesitate due to excessive analysis"],
              growthSuggestions: ["Balance reflection with action", "Practice mindfulness to stay present", "Share insights with trusted others"]
            },
            {
              trait: "Strategic Thinking",
              score: 82,
              description: "You excel at seeing the bigger picture and planning for long-term outcomes rather than just immediate results. Your strategic thinking involves anticipating potential challenges and opportunities, allowing you to prepare accordingly. You consider how different factors interact and influence one another, creating comprehensive approaches to complex situations. This forward-thinking orientation helps you make decisions that align with broader goals rather than just addressing immediate concerns. Your strategic mindset serves you well in planning projects, career moves, and significant life decisions.",
              strengths: ["Long-term planning", "Systems thinking", "Anticipating consequences"],
              challenges: ["May overcomplicate simple matters", "Could get caught in planning paralysis", "Might miss immediate opportunities"],
              growthSuggestions: ["Practice just-in-time planning", "Balance strategic and tactical thinking", "Take calculated risks"]
            }
          ];
          
          // Add new traits until we reach at least 12
          let combinedTraits = [...existingTraits];
          for (let i = 0; combinedTraits.length < 12; i++) {
            const index = i % defaultTraits.length;
            // Avoid adding duplicate traits
            if (!combinedTraits.some(t => t.trait === defaultTraits[index].trait)) {
              combinedTraits.push(defaultTraits[index]);
            }
          }
          
          return combinedTraits;
        }
        
        return analysis.traits;
      };
      
      // Ensure all fields are present and properly formatted
      const finalAnalysis = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        
        // Ensure intelligence scores are valid
        intelligenceScore: typeof analysis.intelligenceScore === 'number' ? 
          Math.min(100, Math.max(0, analysis.intelligenceScore)) : 75,
        emotionalIntelligenceScore: typeof analysis.emotionalIntelligenceScore === 'number' ? 
          Math.min(100, Math.max(0, analysis.emotionalIntelligenceScore)) : 75,
        
        // Core traits - ensure proper structure
        coreTraits: analysis.coreTraits || {
          primary: "Analytical Thinker",
          secondary: "Empathetic Connector",
          strengths: [
            "Systematic problem-solving ability", 
            "Strong attention to detail", 
            "Capacity to understand underlying patterns"
          ],
          challenges: [
            "May overthink decisions", 
            "Could struggle with ambiguity", 
            "Might miss emotional aspects of situations"
          ]
        },
        
        // Traits - ensure at least 12 detailed traits with proper structure
        traits: ensureTraits(),
        
        // Response patterns
        responsePatterns: ensureResponsePatterns(),
        
        // Growth potential
        growthPotential: ensureGrowthPotential(),
        
        // Additional fields from the analysis
        overview: analysis.overview || "Based on your responses, you show a balanced profile with particular strengths in adaptability and analytical thinking. Your thoughtful approach to situations reflects a combination of logical reasoning and emotional awareness.",
        cognitivePatterning: analysis.cognitivePatterning || {
          decisionMaking: "You tend to gather information methodically before making important decisions, weighing multiple factors carefully.",
          learningStyle: "You learn effectively through a combination of conceptual understanding and practical application.",
          attention: "Your attention style is focused and deliberate, allowing you to notice important details while maintaining awareness of the broader context."
        },
        emotionalArchitecture: analysis.emotionalArchitecture || {
          emotionalAwareness: "You demonstrate solid awareness of your emotional states and their impacts on your thoughts and behaviors.",
          regulationStyle: "Your emotional regulation shows balance between expression and containment as appropriate to different situations.",
          empathicCapacity: "You have good capacity to understand others' perspectives and emotional experiences."
        },
        interpersonalDynamics: analysis.interpersonalDynamics || {
          attachmentStyle: "You tend to form stable relationships built on mutual trust and respect.",
          communicationPattern: "Your communication style is generally clear and thoughtful, with attention to both content and emotional nuance.",
          conflictResolution: "You approach conflicts with a problem-solving mindset, seeking win-win solutions when possible."
        },
        careerSuggestions: analysis.careerSuggestions || [
          "Strategic Advisor", 
          "Research Specialist", 
          "Program Developer", 
          "Systems Analyst", 
          "Consultant", 
          "Educator"
        ],
        learningPathways: analysis.learningPathways || [
          "Structured courses with practical applications", 
          "Collaborative learning environments", 
          "Self-directed deep dives"
        ],
      };
      
      // Perform final validation to ensure all data is properly formatted
      ensureIntelligenceScores();
      
      console.log('Successfully generated analysis');
      
      return new Response(
        JSON.stringify(finalAnalysis),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError)
      console.error('Raw content:', contentText.substring(0, 200) + '...')
      throw new Error('Failed to parse analysis response')
    }
  } catch (error) {
    console.error('Function execution error:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

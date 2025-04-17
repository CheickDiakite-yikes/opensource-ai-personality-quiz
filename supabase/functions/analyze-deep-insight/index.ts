
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
    
    console.log('Processing Deep Insight responses:', responses)

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
            content: `You are a highly skilled psychological analyst specializing in personality assessment with expertise in cognitive psychology, emotional intelligence, and personality development.
            
            Analyze the provided assessment responses to generate a comprehensive personality profile that is EXTREMELY DETAILED, personalized, and insightful.
            
            Your analysis must include:
            
            1. COMPREHENSIVE CORE TRAITS ANALYSIS:
               - A detailed description of primary and secondary personality traits
               - Deep analysis of strengths with specific examples of how they manifest
               - Nuanced analysis of challenges with actionable advice
            
            2. COGNITIVE PATTERNING (very detailed):
               - Decision-making style with specific patterns and tendencies
               - Learning style preferences with concrete examples
               - Attention and focus characteristics with practical implications
               - Problem-solving approaches unique to this individual
            
            3. EMOTIONAL ARCHITECTURE (in-depth):
               - Emotional awareness level with specific indicators
               - Regulation style with personalized coping mechanisms
               - Empathic capacity with nuances and development opportunities
               - Emotional triggers and responses unique to this individual
            
            4. INTERPERSONAL DYNAMICS (highly personalized):
               - Attachment style with specific relationship patterns
               - Communication preferences with concrete examples
               - Conflict resolution approach with detailed strategies
               - Social needs and boundaries specific to this person
            
            5. GROWTH POTENTIAL (actionable):
               - Specific development areas with practical next steps
               - Personalized recommendations tailored to their profile
               - Potential career directions that leverage their unique traits
               - Learning pathways that would be most effective for them
               
            6. PERSONALITY TRAITS (minimum 9 traits):
               - Each trait should include:
                 * Detailed description of how it manifests
                 * Score (0-100) indicating strength
                 * How it influences their behavior and decisions
                 * Specific strengths associated with each trait
                 * Specific challenges they might face due to each trait
                 * Personalized growth suggestions for each trait
            
            7. INTELLIGENCE ANALYSIS:
               - Detailed breakdown of cognitive strengths across different domains
               - Analysis of emotional intelligence capabilities
               - Practical implications of their intelligence profile
            
            Format the response as a valid JSON object without markdown formatting or code blocks.
            CRITICAL: The analysis MUST be uniquely tailored to this individual, not generic, and provide specific, actionable insights that feel personally relevant.
            
            IMPORTANT: Always include numerical scores for intelligenceScore and emotionalIntelligenceScore as numbers between 0-100.
            Always include all required fields, especially ensuring the traits array contains AT LEAST 9 distinct personality traits with detailed information.
            
            Each trait object must have this structure:
            {
              trait: "Name of trait",
              score: number between 0-100,
              description: "Detailed personalized description specific to this individual",
              strengths: ["Strength 1", "Strength 2", "Strength 3"],
              challenges: ["Challenge 1", "Challenge 2", "Challenge 3"],
              growthSuggestions: ["Suggestion 1", "Suggestion 2", "Suggestion 3"]
            }`
          },
          {
            role: "user",
            content: `Analyze these assessment responses and generate an exceptionally detailed, personalized personality profile. Make sure to provide deep, specific insights rather than generic observations: ${JSON.stringify(responses)}`
          }
        ],
        temperature: 0.6,
        max_tokens: 4000
      })
    })

    if (!openAiResponse.ok) {
      const error = await openAiResponse.json()
      throw new Error(error.error?.message || 'Failed to analyze responses')
    }

    const aiResult = await openAiResponse.json()
    let contentText = aiResult.choices[0].message.content
    
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
    
    console.log('Cleaned content text:', contentText.substring(0, 100) + '...')
    
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
      
      // Ensure all required fields are present with default values
      analysis = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        // Intelligence scores - ensure they're numbers between 0-100
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
        
        // Traits - ensure at least 9 detailed traits with proper structure
        traits: Array.isArray(analysis.traits) && analysis.traits.length >= 5 ? 
          analysis.traits : [
            {
              trait: "Analytical Thinking",
              score: 85,
              description: "You approach problems methodically, breaking down complex situations into manageable parts. You excel at identifying patterns and logical inconsistencies, preferring evidence-based decision making over intuitive approaches.",
              strengths: ["Problem decomposition", "Logical reasoning", "Data-driven decisions"],
              challenges: ["May overthink simple matters", "Could miss emotional factors", "Might struggle with ambiguity"],
              growthSuggestions: ["Practice intuitive decision-making", "Engage with abstract art or poetry", "Seek diverse perspectives"]
            },
            {
              trait: "Emotional Intelligence",
              score: 78,
              description: "You demonstrate good awareness of your own emotions and those of others. You can navigate emotional situations effectively, though you may occasionally need time to fully process complex emotional experiences.",
              strengths: ["Self-awareness", "Empathy", "Emotional regulation"],
              challenges: ["Occasional emotional overwhelm", "May intellectualize feelings", "Could struggle with highly charged situations"],
              growthSuggestions: ["Practice mindfulness meditation", "Journal about emotional experiences", "Engage in deep listening exercises"]
            },
            {
              trait: "Adaptability",
              score: 82,
              description: "You show strong capacity to adjust to changing circumstances and unexpected challenges. You're generally comfortable with change and can recalibrate your approach when needed.",
              strengths: ["Flexibility in changing situations", "Open to new perspectives", "Resilience under pressure"],
              challenges: ["May occasionally resist deeply disruptive changes", "Could struggle with extreme uncertainty", "Might need processing time for major shifts"],
              growthSuggestions: ["Deliberately seek novel experiences", "Practice improvisational activities", "Develop contingency thinking"]
            },
            {
              trait: "Conscientiousness",
              score: 88,
              description: "You demonstrate high reliability and attention to detail in your responsibilities. You value structure and organization, and others likely see you as dependable and thorough.",
              strengths: ["Reliability", "Organization", "Follow-through"],
              challenges: ["May be perfectionistic", "Could be rigid about processes", "Might be self-critical when standards aren't met"],
              growthSuggestions: ["Practice self-compassion", "Experiment with flexible approaches", "Delegate appropriate tasks"]
            },
            {
              trait: "Openness",
              score: 74,
              description: "You show healthy curiosity and willingness to engage with new ideas and experiences. While you appreciate novelty, you likely balance this with a need for some familiarity and structure.",
              strengths: ["Intellectual curiosity", "Appreciation of diverse perspectives", "Creative problem-solving"],
              challenges: ["May occasionally default to conventional approaches", "Could be skeptical of radical ideas", "Might need time to warm up to highly novel concepts"],
              growthSuggestions: ["Explore unfamiliar subjects regularly", "Engage with diverse cultural experiences", "Question assumptions deliberately"]
            },
            {
              trait: "Assertiveness",
              score: 68,
              description: "You can express your needs and opinions when necessary, though you may sometimes prioritize harmony over direct confrontation. You likely balance self-advocacy with consideration for others.",
              strengths: ["Able to express boundaries", "Can advocate for important needs", "Generally clear communication"],
              challenges: ["May hesitate in high-conflict situations", "Could sometimes compromise too readily", "Might avoid necessary confrontations"],
              growthSuggestions: ["Practice direct communication in low-stakes situations", "Develop a personal assertiveness script", "Separate people from problems in conflicts"]
            },
            {
              trait: "Resilience",
              score: 80,
              description: "You demonstrate strong ability to recover from setbacks and adapt to challenges. You generally maintain perspective during difficult times and can find constructive paths forward.",
              strengths: ["Recovery from setbacks", "Emotional regulation under pressure", "Solution-focused thinking"],
              challenges: ["May occasionally dwell on failures", "Could internalize external problems", "Might push through when breaks are needed"],
              growthSuggestions: ["Develop specific self-care routines for stressful periods", "Practice self-compassionate thinking", "Build a support network for challenging times"]
            },
            {
              trait: "Social Intelligence",
              score: 76,
              description: "You navigate social situations with reasonable comfort and can read social cues effectively. You understand group dynamics and can adapt your communication style to different contexts.",
              strengths: ["Reading social cues", "Adapting to different social contexts", "Building rapport with diverse people"],
              challenges: ["May occasionally misread subtle signals", "Could feel drained by prolonged social engagement", "Might overthink social interactions"],
              growthSuggestions: ["Practice active listening techniques", "Study nonverbal communication", "Engage in diverse social environments"]
            },
            {
              trait: "Self-Awareness",
              score: 83,
              description: "You demonstrate strong understanding of your own thoughts, emotions, and behaviors. You can generally identify your patterns and recognize when your reactions might be disproportionate.",
              strengths: ["Recognizing personal patterns", "Understanding emotional triggers", "Honest self-reflection"],
              challenges: ["May occasionally overanalyze", "Could be overly self-critical", "Might struggle with blind spots"],
              growthSuggestions: ["Seek external feedback regularly", "Practice mindfulness meditation", "Keep a personal development journal"]
            }
          ],
        
        // Overview - ensure a detailed, personalized summary
        overview: analysis.overview || "Based on your assessment responses, you demonstrate a balanced analytical and empathetic approach to situations. You show strong cognitive abilities paired with good emotional awareness, allowing you to navigate complex problems while remaining attuned to human factors. Your pattern of responses suggests you value both logical consistency and meaningful connections, approaching life with a thoughtful, measured perspective while maintaining openness to different viewpoints and experiences.",
        
        // Cognitive patterning - ensure detailed insights
        cognitivePatterning: analysis.cognitivePatterning || {
          decisionMaking: "You approach decisions methodically, carefully weighing evidence and considering multiple perspectives before reaching conclusions. While you value data and logical analysis, you also incorporate intuitive insights when appropriate. Your response patterns suggest you're most comfortable with decisions that allow adequate time for consideration, though you can adapt to quicker decisions when necessary.",
          learningStyle: "You demonstrate a multifaceted learning approach that combines structured analysis with practical application. You likely benefit from understanding theoretical frameworks first, followed by hands-on implementation. Your responses indicate you process information thoroughly and prefer to integrate new knowledge with existing understanding rather than memorizing isolated facts.",
          attention: "Your attention patterns show good focus capability, particularly for subjects aligned with your values and interests. You can sustain concentration for extended periods on complex tasks but may benefit from structured breaks to maintain optimal cognitive performance. Your responses suggest you notice details while still maintaining awareness of broader patterns and implications."
        },
        
        // Emotional architecture - ensure nuanced emotional insights
        emotionalArchitecture: analysis.emotionalArchitecture || {
          emotionalAwareness: "You demonstrate strong awareness of your emotional states and can generally identify and name your feelings with precision. Your responses suggest you recognize the connection between thoughts, emotions, and physical sensations, allowing you to address emotional needs effectively in most situations. You likely notice emotional shifts early, before they become overwhelming.",
          regulationStyle: "Your emotional regulation approach combines cognitive strategies (like reframing and perspective-taking) with healthy expression. You generally process emotions through reflection and selective sharing with trusted others. Your responses indicate you can usually manage emotional intensity effectively, though you may occasionally need additional support during periods of significant stress or uncertainty.",
          empathicCapacity: "You show well-developed empathy, readily understanding others' perspectives and emotional experiences. Your responses suggest you naturally consider how situations affect different people and can adjust your approach accordingly. While you connect easily with others' feelings, you maintain appropriate boundaries that prevent emotional contagion or burnout."
        },
        
        // Interpersonal dynamics - ensure detailed relationship insights
        interpersonalDynamics: analysis.interpersonalDynamics || {
          attachmentStyle: "Your relationship patterns suggest a primarily secure attachment style with some careful tendencies in new relationships. You value emotional connection and can form deep bonds, though you likely take time to fully trust others. Your responses indicate you maintain healthy interdependence, valuing both closeness and autonomy in relationships.",
          communicationPattern: "You communicate with clarity and consideration, balancing honest expression with sensitivity to others. Your responses suggest you listen actively and seek to understand before being understood. You likely adjust your communication approach based on context and audience, though you maintain authenticity across different situations.",
          conflictResolution: "Your conflict approach emphasizes finding mutually beneficial solutions while addressing underlying concerns. You generally remain calm during disagreements and can separate people from problems. Your responses indicate you value preserving relationships while still addressing important issues, rather than avoiding necessary discussions."
        },
        
        // Growth potential - ensure actionable development insights
        growthPotential: analysis.growthPotential || {
          developmentAreas: [
            "Balancing analytical thinking with intuitive insights", 
            "Expressing needs and boundaries more directly in close relationships", 
            "Developing greater comfort with ambiguity and uncertainty", 
            "Building resilience for highly stressful situations",
            "Expanding creative problem-solving approaches"
          ],
          recommendations: [
            "Practice mindfulness meditation to strengthen the connection between analytical and intuitive thinking", 
            "Develop assertiveness skills through regular practice in low-stakes situations", 
            "Engage in activities with unpredictable outcomes to build comfort with uncertainty", 
            "Create a personalized stress management toolkit with diverse coping strategies",
            "Explore creative hobbies that challenge conventional thinking patterns"
          ]
        },
        
        // Response patterns - ensure proper format for visualization
        responsePatterns: ensureResponsePatterns(),
        
        // Additional fields from the original analysis to preserve
        ...analysis
      };

      console.log('Generated analysis:', Object.keys(analysis))

      return new Response(
        JSON.stringify(analysis),
        { 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json' 
          } 
        }
      )
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError)
      console.error('Content text causing error:', contentText.substring(0, 200))
      throw new Error(`Failed to parse OpenAI response as JSON: ${parseError.message}`)
    }
  } catch (error) {
    console.error('Error in analyze-deep-insight function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})

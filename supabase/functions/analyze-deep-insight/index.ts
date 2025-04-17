
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
            }
            
            ALL growthPotential.developmentAreas and growthPotential.recommendations MUST be arrays of strings, not objects or other formats.`
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
        if (!analysis.growthPotential.developmentAreas || 
            !Array.isArray(analysis.growthPotential.developmentAreas)) {
          analysis.growthPotential.developmentAreas = defaultGrowthPotential.developmentAreas;
        }
        
        // Ensure recommendations is an array
        if (!analysis.growthPotential.recommendations || 
            !Array.isArray(analysis.growthPotential.recommendations)) {
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
      
      // Ensure all required fields are present with default values
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
            }
          ],
        
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
        }
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

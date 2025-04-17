
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
            content: `You are a highly skilled psychological analyst specializing in personality assessment. 
            Analyze the provided assessment responses to generate a comprehensive personality profile.
            Your analysis should be detailed, balanced, and focus on core traits, cognitive patterns, 
            emotional architecture, and growth potential. Format the response as a valid JSON object without markdown formatting or code blocks.
            
            IMPORTANT: Always include numerical scores for intelligenceScore and emotionalIntelligenceScore as numbers between 0-100.
            Always include all required fields: coreTraits (with primary and secondary properties), traits, intelligence, overview.
            
            Ensure traits is an array of objects with the following structure:
            traits: [
              {
                trait: "name of the trait",
                score: number,
                description: "description of the trait",
                strengths: ["strength 1", "strength 2"],
                challenges: ["challenge 1", "challenge 2"],
                growthSuggestions: ["suggestion 1", "suggestion 2"]
              }
            ]`
          },
          {
            role: "user",
            content: `Analyze these assessment responses and generate a complete personality profile: ${JSON.stringify(responses)}`
          }
        ],
        temperature: 0.7
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
      
      // Ensure all required fields are present with default values
      analysis = {
        ...analysis,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        intelligenceScore: analysis.intelligenceScore || 75, // Default if missing
        emotionalIntelligenceScore: analysis.emotionalIntelligenceScore || 75, // Default if missing
        coreTraits: analysis.coreTraits || {
          primary: "Balanced Individual",
          secondary: "Adaptive Thinker",
          strengths: ["Adaptability", "Balance"],
          challenges: ["May lack specialization"]
        },
        traits: Array.isArray(analysis.traits) ? analysis.traits : [],
        overview: analysis.overview || "Analysis overview not available.",
        cognitivePatterning: analysis.cognitivePatterning || {
          decisionMaking: "You have a balanced approach to decision making, considering both facts and intuition.",
          learningStyle: "You learn through a combination of practical experience and theoretical understanding.",
          attention: "Your attention tends to be focused, though you can switch contexts when needed."
        },
        emotionalArchitecture: analysis.emotionalArchitecture || {
          emotionalAwareness: "You have a moderate level of awareness regarding your emotional states.",
          regulationStyle: "You generally manage emotions effectively through various coping strategies.",
          empathicCapacity: "You can understand and relate to others' emotions in most situations."
        },
        growthPotential: analysis.growthPotential || {
          developmentAreas: ["Self-awareness", "Communication skills", "Stress management"],
          recommendations: ["Practice mindfulness", "Seek feedback", "Establish healthy boundaries"]
        }
      }

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

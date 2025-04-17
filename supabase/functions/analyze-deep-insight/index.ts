
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
            emotional architecture, and growth potential. Format the response as a valid JSON object without markdown formatting or code blocks.`
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
      const analysis = JSON.parse(contentText)
      
      // Add metadata
      const enrichedAnalysis = {
        ...analysis,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      }

      console.log('Generated analysis:', Object.keys(enrichedAnalysis))

      return new Response(
        JSON.stringify(enrichedAnalysis),
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

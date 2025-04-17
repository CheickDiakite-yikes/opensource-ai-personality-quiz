
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
            emotional architecture, and growth potential. Format the response as a structured JSON object.`
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
    const analysis = JSON.parse(aiResult.choices[0].message.content)

    // Add metadata
    const enrichedAnalysis = {
      ...analysis,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }

    console.log('Generated analysis:', enrichedAnalysis)

    return new Response(
      JSON.stringify(enrichedAnalysis),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    )
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

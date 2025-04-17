
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

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
    console.log('Sample response keys:', Object.keys(responses).slice(0, 5))

    // Measure execution time for debugging
    const startTime = Date.now()
    
    // Ensure OPENAI_API_KEY is available
    const openAiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openAiApiKey) {
      throw new Error('OPENAI_API_KEY is not set in environment variables')
    }

    const openAiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a world-class psychological analyst specializing in creating extremely detailed personality profiles. Generate an EXCEPTIONALLY COMPREHENSIVE analysis (minimum 10,000 words) with these requirements:

1. CORE TRAITS ANALYSIS (minimum 1000 words):
- Primary and secondary personality traits with detailed manifestations
- In-depth analysis of trait interactions and their impact
- Comprehensive strengths analysis with real-world examples
- Detailed challenges analysis with specific growth strategies

2. COGNITIVE PATTERNING (minimum 1500 words):
- Decision-making style with specific scenarios and examples
- Learning preferences with optimal environments and methods
- Attention patterns and focus characteristics
- Problem-solving approaches with detailed examples
- Information processing style
- Critical thinking patterns
- Strategic thinking capabilities
- Cognitive strengths and blind spots
- Memory and recall patterns
- Analytical vs. intuitive thinking balance

3. EMOTIONAL ARCHITECTURE (minimum 1500 words):
- Detailed emotional awareness assessment
- Comprehensive regulation style analysis
- In-depth empathic capacity evaluation
- Emotional patterns and triggers
- Emotional resilience profile
- Emotional expression style
- Self-awareness patterns
- Emotional intelligence components
- Stress response patterns
- Emotional growth opportunities

4. INTERPERSONAL DYNAMICS (minimum 1500 words):
- Detailed attachment style analysis
- Communication patterns in different contexts
- Conflict resolution approaches
- Social needs and boundaries
- Trust-building patterns
- Leadership style
- Collaboration preferences
- Group dynamics
- Relationship patterns
- Social intelligence profile

5. CAREER & PROFESSIONAL (minimum 1500 words):
- Detailed work style analysis
- Professional strengths and challenges
- Leadership potential
- Team dynamics
- Career path recommendations
- Professional development opportunities
- Work environment preferences
- Management style preferences
- Professional growth trajectory
- Success factors

6. GROWTH & DEVELOPMENT (minimum 1500 words):
- Comprehensive development areas
- Detailed recommendations for each area
- Long-term growth potential
- Personal insights and reflections
- Specific action steps
- Growth milestones
- Development timeline
- Support system recommendations
- Resources and tools
- Progress indicators

7. PERSONALITY TRAITS (minimum 1500 words):
- Minimum 12 distinct traits
- Each trait must include:
  * Detailed description (minimum 200 words)
  * Score (0-100)
  * Real-world manifestations
  * Specific strengths (minimum 5)
  * Specific challenges (minimum 5)
  * Growth suggestions (minimum 5)
  * Interaction with other traits

8. RESPONSE PATTERNS (crucial for visualization):
- Detailed percentage distribution for all response types (a, b, c, d, e, f)
- Primary and secondary choice identification
- Pattern analysis and implications
- Response signature generation
- Must follow exact format:
  {
    percentages: { a: number, b: number, c: number, d: number, e: number, f: number },
    primaryChoice: string,
    secondaryChoice: string,
    responseSignature: string
  }

CRITICAL REQUIREMENTS:
1. All sections must be exceptionally detailed and personalized
2. Include specific, actionable insights
3. Maintain consistent data structure for visualization
4. Ensure all numerical scores are between 0-100
5. Format as valid JSON without markdown
6. Include intelligence and emotional intelligence scores
7. Provide comprehensive arrays for all list-type data

The analysis must be uniquely tailored to the individual based on their specific response patterns.`
          },
          {
            role: "user",
            content: `Analyze these responses and generate an exceptionally detailed, personalized profile with extensive insights in each category: ${JSON.stringify(responses)}`
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
    
    console.log('Received OpenAI response in', (Date.now() - startTime)/1000, 'seconds')
    console.log('Response length:', contentText.length, 'characters')
    
    // Clean up the response if it has markdown formatting
    if (contentText.includes('```json')) {
      const jsonMatch = contentText.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
      if (jsonMatch && jsonMatch[1]) {
        contentText = jsonMatch[1].trim()
        console.log('Extracted JSON from markdown code block')
      } else {
        contentText = contentText.replace(/```json|```/g, '').trim()
        console.log('Removed markdown code block markers')
      }
    }
    
    try {
      console.log('Attempting to parse JSON response...')
      let analysis = JSON.parse(contentText)
      console.log('Successfully parsed JSON response')

      // Validate response pattern format
      console.log('Validating responsePatterns format...')
      if (!analysis.responsePatterns || !analysis.responsePatterns.percentages) {
        console.warn('Response patterns missing or invalid, generating fallback')
        analysis.responsePatterns = {
          percentages: { 
            a: Math.round(Math.random() * 30 + 10),
            b: Math.round(Math.random() * 30 + 10),
            c: Math.round(Math.random() * 20 + 10),
            d: Math.round(Math.random() * 10 + 5),
            e: Math.round(Math.random() * 5 + 5),
            f: Math.round(Math.random() * 5 + 5)
          },
          primaryChoice: 'a',
          secondaryChoice: 'b',
          responseSignature: '25-25-25-15-5-5'
        }
      } else {
        console.log('Valid responsePatterns found:', analysis.responsePatterns.responseSignature)
      }

      // Ensure emotionalArchitecture has all required fields
      console.log('Validating emotionalArchitecture...')
      analysis.emotionalArchitecture = {
        ...analysis.emotionalArchitecture,
        emotionalPatterns: analysis.emotionalArchitecture?.emotionalPatterns || "Your emotional patterns show a balanced approach to processing and expressing emotions.",
        emotionalStrengths: analysis.emotionalArchitecture?.emotionalStrengths || [
          "Strong emotional awareness",
          "Effective self-regulation",
          "Good empathic understanding"
        ],
        emotionalChallenges: analysis.emotionalArchitecture?.emotionalChallenges || [
          "Managing intense emotions",
          "Balancing emotional needs",
          "Setting emotional boundaries"
        ],
        recommendations: analysis.emotionalArchitecture?.recommendations || [
          "Practice mindfulness regularly",
          "Develop emotional vocabulary",
          "Establish emotional boundaries"
        ]
      }

      // Ensure interpersonalDynamics has all required fields
      console.log('Validating interpersonalDynamics...')
      analysis.interpersonalDynamics = {
        ...analysis.interpersonalDynamics,
        socialNeedsBalance: analysis.interpersonalDynamics?.socialNeedsBalance || "You maintain a healthy balance between social connection and personal space.",
        trustBuilding: analysis.interpersonalDynamics?.trustBuilding || "You build trust through consistent and authentic interactions.",
        boundarySettings: analysis.interpersonalDynamics?.boundarySettings || "You set appropriate boundaries while remaining open to meaningful connections."
      }

      // Ensure growthPotential has all required fields
      console.log('Validating growthPotential...')
      analysis.growthPotential = {
        ...analysis.growthPotential,
        longTermGoals: analysis.growthPotential?.longTermGoals || [
          "Develop advanced emotional regulation skills",
          "Enhance leadership capabilities",
          "Build stronger professional relationships"
        ],
        personalInsights: analysis.growthPotential?.personalInsights || "Your growth journey shows strong potential for personal and professional development."
      }

      console.log('Successfully generated enhanced analysis')
      console.log('Total processing time:', (Date.now() - startTime)/1000, 'seconds')
      
      return new Response(
        JSON.stringify(analysis),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError)
      console.error('First 100 chars of response:', contentText.substring(0, 100))
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

import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { responses, assessmentId, userId } = await req.json();
    
    if (!responses || !Array.isArray(responses) || responses.length === 0) {
      console.error("Invalid responses format:", responses);
      throw new Error("Invalid or empty responses array");
    }

    if (!assessmentId) {
      console.error("Missing assessment ID");
      throw new Error("Missing assessment ID");
    }

    console.log(`Processing ${responses.length} responses for assessment ${assessmentId}, user ${userId || 'anonymous'}`);

    // Categorize responses by category for better analysis
    const categorizedResponses = responses.reduce((acc, response) => {
      const category = response.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(response);
      return acc;
    }, {});

    console.log("Response distribution by category:", 
      Object.entries(categorizedResponses)
        .map(([category, items]) => `${category}: ${items.length} responses`)
        .join(', ')
    );

    // Create a detailed system prompt for comprehensive analysis
    const systemPrompt = `You are an expert AI psychologist tasked with analyzing ${responses.length} comprehensive personality assessment responses.
Focus on providing deep insights into personality traits, cognitive patterns, emotional intelligence, and growth potential.
Be thorough in your analysis of each response category while maintaining a holistic view of the individual.`;

    // Create a detailed user prompt with categorized responses
    const analysisPrompt = `Based on these ${responses.length} assessment responses, provide a comprehensive personality analysis:

${Object.entries(categorizedResponses).map(([category, items]) => 
  `${category} (${items.length} responses):
  ${items.map(r => `- Question: ${r.questionId}, Answer: ${r.answer}`).join('\n  ')}`
).join('\n\n')}

Provide a detailed analysis covering:
1. Overall personality profile and key traits
2. Cognitive patterns and intelligence assessment
3. Emotional intelligence evaluation
4. Core values and motivations
5. Growth areas and development pathways
6. Relationship patterns and compatibility insights
7. Career alignment and suggestions
8. Learning style and preferences`;

    console.log("Calling OpenAI for analysis...");
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: analysisPrompt }
        ],
        temperature: 0.7,
        max_tokens: 4000,
        frequency_penalty: 0.5,
        presence_penalty: 0.5,
      }),
    });

    const aiResponse = await response.json();
    
    if (!aiResponse.choices || !aiResponse.choices[0]?.message?.content) {
      console.error("Invalid AI response:", aiResponse);
      throw new Error("Invalid AI response format");
    }

    const analysisText = aiResponse.choices[0].message.content;
    
    console.log("AI analysis received, extracting structured data...");

    // Extract structured data from AI response
    const traits = extractTraits(analysisText);
    const intelligence = extractIntelligence(analysisText);
    const overview = extractOverview(analysisText);
    const valueSystem = extractValueSystem(analysisText);
    const motivators = extractMotivators(analysisText);
    const growthAreas = extractGrowthAreas(analysisText);
    const careerSuggestions = extractCareerSuggestions(analysisText);
    const learningPathways = extractLearningPathways(analysisText);
    const relationshipPatterns = extractRelationshipPatterns(analysisText);
    const roadmap = extractRoadmap(analysisText);

    // Create analysis object with all required fields
    const analysisId = crypto.randomUUID();
    const comprehensiveAnalysis = {
      id: analysisId,
      assessment_id: assessmentId,
      user_id: userId || null,
      overview,
      traits,
      intelligence,
      intelligence_score: calculateIntelligenceScore(intelligence),
      emotional_intelligence_score: calculateEmotionalScore(analysisText),
      value_system: valueSystem,
      motivators,
      growth_areas: growthAreas,
      career_suggestions: careerSuggestions,
      learning_pathways: learningPathways,
      relationship_patterns: relationshipPatterns,
      roadmap
    };

    // Save analysis to database with 3 retries
    let dbError = null;
    let saveSuccess = false;
    
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`Attempt ${attempt} to save analysis to database...`);
        
        const { error } = await fetch(
          `https://fhmvdprcmhkolyzuecrr.supabase.co/rest/v1/comprehensive_analyses`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': `${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
              'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
            },
            body: JSON.stringify({
              id: analysisId,
              assessment_id: assessmentId,
              user_id: userId || null,
              overview: overview,
              traits: traits,
              intelligence: intelligence,
              intelligence_score: comprehensiveAnalysis.intelligence_score,
              emotional_intelligence_score: comprehensiveAnalysis.emotional_intelligence_score,
              value_system: valueSystem,
              motivators: motivators,
              growth_areas: growthAreas,
              relationship_patterns: relationshipPatterns,
              career_suggestions: careerSuggestions,
              learning_pathways: learningPathways,
              roadmap: roadmap,
              result: comprehensiveAnalysis
            })
          }
        ).then(res => res.json());

        if (error) {
          console.error(`Error saving analysis on attempt ${attempt}:`, error);
          dbError = error;
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, 1000));
        } else {
          console.log("Analysis saved to database successfully with ID:", analysisId);
          saveSuccess = true;
          break;
        }
      } catch (error) {
        console.error(`Exception on save attempt ${attempt}:`, error);
        dbError = error;
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    if (!saveSuccess) {
      console.error("All attempts to save analysis failed, last error:", dbError);
      throw new Error(`Failed to save analysis after 3 attempts: ${dbError?.message || "Unknown error"}`);
    }

    console.log("Analysis completed successfully, returning ID:", analysisId);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        analysisId: analysisId, 
        analysis: comprehensiveAnalysis,
        message: "Analysis completed and saved successfully" 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Error in analyze-comprehensive-responses:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: "Failed to analyze comprehensive assessment responses"
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

function extractTraits(text) {
  const traitMatches = text.match(/(?:trait|characteristic|quality):\s*([^.!?\n]+)/gi) || [];
  const traits = traitMatches.map(match => {
    const traitName = match.split(':')[1].trim();
    return {
      name: traitName,
      trait: traitName,
      score: Math.random() * 0.5 + 0.5, // Generate score between 0.5 and 1.0
      description: `Strong presence of ${traitName.toLowerCase()} in personality profile`,
      strengths: [`Good at leveraging ${traitName.toLowerCase()}`],
      challenges: [`May sometimes overuse ${traitName.toLowerCase()}`],
      growthSuggestions: [`Work on balancing ${traitName.toLowerCase()} with other traits`],
      impact: [`Influences decision making through ${traitName.toLowerCase()}`],
      recommendations: [`Consider situations where ${traitName.toLowerCase()} is most effective`]
    };
  });
  return traits.length > 0 ? traits : generateDefaultTraits();
}

function extractIntelligence(text) {
  const intelligenceTypes = ['Analytical', 'Emotional', 'Practical', 'Creative', 'Social'];
  const domains = intelligenceTypes.map(type => ({
    name: `${type} Intelligence`,
    score: Math.random() * 0.4 + 0.6, // Generate score between 0.6 and 1.0
    description: `Capacity for ${type.toLowerCase()} thinking and problem-solving`
  }));

  return {
    type: "Multi-faceted Intelligence",
    score: domains.reduce((acc, domain) => acc + domain.score, 0) / domains.length,
    description: "Shows balanced intellectual capabilities across multiple domains",
    strengths: ["Analytical thinking", "Problem-solving", "Pattern recognition"],
    areas_for_development: ["Complex system analysis", "Abstract reasoning"],
    learning_style: "Adaptive",
    cognitive_preferences: ["Structured learning", "Practical application"],
    domains
  };
}

function extractOverview(text) {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
  return sentences.slice(0, 3).join('. ') + '.';
}

function extractValueSystem(text) {
  const valueWords = text.match(/\b(integrity|honesty|respect|growth|achievement|balance|harmony|creativity|wisdom|justice)\b/gi) || [];
  const uniqueValues = [...new Set(valueWords.map(v => v.toLowerCase()))];
  
  return {
    strengths: uniqueValues.slice(0, 4),
    weaknesses: ["May prioritize some values over others", "Could benefit from broader perspective"],
    description: "Demonstrates a balanced and principled value system"
  };
}

function extractMotivators(text) {
  const motivationPatterns = text.match(/\b(achieve|learn|grow|help|create|lead|explore|understand|improve|succeed)\b/gi) || [];
  return [...new Set(motivationPatterns.map(m => `Desire to ${m.toLowerCase()}`))];
}

function extractGrowthAreas(text) {
  const growthPatterns = text.match(/\b(develop|improve|enhance|strengthen|practice|master|learn|adapt|grow)\b/gi) || [];
  return [...new Set(growthPatterns.map(g => `Continue to ${g.toLowerCase()} capabilities`))];
}

function extractCareerSuggestions(text) {
  const defaultSuggestions = [
    "Strategic Leadership Roles",
    "Creative Problem-Solving Positions",
    "Analytical Research Roles",
    "People-Focused Careers",
    "Innovation-Driven Positions"
  ];
  
  const careerMatches = text.match(/career[^.!?]*[.!?]/gi) || [];
  return careerMatches.length > 0 
    ? careerMatches.map(m => m.replace(/career:?\s*/i, '').trim())
    : defaultSuggestions;
}

function extractLearningPathways(text) {
  return [
    "Structured academic learning",
    "Practical hands-on experience",
    "Collaborative group projects",
    "Self-directed research",
    "Mentorship and coaching"
  ];
}

function extractRelationshipPatterns(text) {
  return {
    strengths: [
      "Strong communication skills",
      "Empathetic understanding",
      "Reliable and trustworthy"
    ],
    challenges: [
      "May need to establish better boundaries",
      "Could improve active listening",
      "Balance between personal and professional relationships"
    ],
    compatibleTypes: [
      "Goal-oriented individuals",
      "Emotionally intelligent partners",
      "Growth-minded collaborators"
    ]
  };
}

function extractRoadmap(text) {
  return `Focus on leveraging identified strengths while addressing growth areas. 
Prioritize continuous learning and development in both professional and personal domains. 
Maintain balance between analytical and emotional aspects of personality.`;
}

function calculateIntelligenceScore(intelligence) {
  if (!intelligence || !intelligence.domains) {
    return 75; // Default score if no data
  }
  
  const weights = {
    'Analytical Intelligence': 0.25,
    'Emotional Intelligence': 0.25,
    'Practical Intelligence': 0.2,
    'Creative Intelligence': 0.15,
    'Social Intelligence': 0.15
  };
  
  return Math.round(
    intelligence.domains.reduce((acc, domain) => {
      const weight = weights[domain.name] || 0.2;
      return acc + (domain.score * 100 * weight);
    }, 0)
  );
}

function calculateEmotionalScore(text) {
  const emotionalKeywords = [
    'empathy', 'awareness', 'regulation', 'social', 'motivation',
    'understanding', 'perception', 'management', 'relationship'
  ];
  
  const matches = emotionalKeywords.reduce((count, keyword) => {
    const regex = new RegExp(keyword, 'gi');
    const matches = text.match(regex);
    return count + (matches ? matches.length : 0);
  }, 0);
  
  // Calculate score based on keyword density
  const baseScore = Math.min(100, Math.max(50, matches * 5));
  
  // Add some randomness within a reasonable range
  const variance = Math.random() * 10 - 5; // -5 to +5
  
  return Math.round(Math.max(50, Math.min(100, baseScore + variance)));
}

function generateDefaultTraits() {
  return [
    {
      name: "Analytical Thinking",
      trait: "Analytical Thinking",
      score: 0.85,
      description: "Strong capacity for logical analysis and problem-solving",
      strengths: ["Systematic approach", "Detail-oriented", "Problem-solving"],
      challenges: ["May overthink decisions", "Could be too methodical"],
      growthSuggestions: ["Balance analysis with intuition", "Practice quick decisions"],
      impact: ["Enhanced decision-making", "Improved problem resolution"],
      recommendations: ["Leverage analytical skills in complex situations"]
    },
    {
      name: "Emotional Intelligence",
      trait: "Emotional Intelligence",
      score: 0.78,
      description: "Good awareness of emotions and social dynamics",
      strengths: ["Empathy", "Social awareness", "Emotional regulation"],
      challenges: ["May be too sensitive", "Could absorb others' emotions"],
      growthSuggestions: ["Develop emotional boundaries", "Practice self-care"],
      impact: ["Better relationships", "Enhanced communication"],
      recommendations: ["Use EQ to build stronger connections"]
    }
  ];
}

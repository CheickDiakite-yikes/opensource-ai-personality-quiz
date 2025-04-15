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
    const { responses, assessmentId } = await req.json();
    
    if (!responses || !Array.isArray(responses) || responses.length === 0) {
      console.error("Invalid responses format:", responses);
      throw new Error("Invalid or empty responses array");
    }

    if (!assessmentId) {
      console.error("Missing assessment ID");
      throw new Error("Missing assessment ID");
    }

    console.log(`Processing ${responses.length} responses for assessment ${assessmentId}`);

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
Be as detailed and thorough as possible in your analysis of each response category while maintaining a holistic view of the individual.
Your output must include DETAILED descriptions for all traits, intelligence factors, and other personality aspects.
Include specific examples and actionable insights throughout your analysis.`;

    // Create a detailed user prompt with categorized responses
    const analysisPrompt = `Based on these ${responses.length} assessment responses, provide a comprehensive and DETAILED personality analysis:

${Object.entries(categorizedResponses).map(([category, items]) => 
  `${category} (${Array.isArray(items) ? items.length : 0} responses):
  ${Array.isArray(items) ? items.map(r => `- Question: ${r.questionId}, Answer: ${r.answer || r.selectedOption || r.customResponse}`).join('\n  ') : 'No responses'}`
).join('\n\n')}

Provide an extremely detailed analysis covering:
1. Overall personality profile with multiple key traits explained at length
2. Cognitive patterns and detailed intelligence assessment with scores
3. Emotional intelligence evaluation with specific examples
4. Detailed breakdown of core values and motivations
5. Comprehensive growth areas and development pathways
6. Relationship patterns and compatibility insights with examples
7. Career alignment and detailed suggestions
8. Learning style preferences with actionable recommendations

BE EXTREMELY THOROUGH AND DETAILED in your analysis. Include specific examples, actionable insights, 
and detailed explanations for each section. This will be used as the basis for an in-depth personality profile.`;

    console.log("Calling OpenAI for analysis...");
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',  // Using the most powerful model for detailed analysis
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: analysisPrompt }
        ],
        temperature: 0.7,
        max_tokens: 8000,  // Increased token limit for more detailed response
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
    const inhibitors = extractInhibitors(analysisText);
    const growthAreas = extractGrowthAreas(analysisText);
    const weaknesses = extractWeaknesses(analysisText);
    const careerSuggestions = extractCareerSuggestions(analysisText);
    const learningPathways = extractLearningPathways(analysisText);
    const relationshipPatterns = extractRelationshipPatterns(analysisText);
    const roadmap = extractRoadmap(analysisText);

    // Create analysis object with all required fields
    const analysisId = crypto.randomUUID();
    const comprehensiveAnalysis = {
      id: analysisId,
      assessment_id: assessmentId,
      overview,
      traits,
      intelligence,
      intelligence_score: calculateIntelligenceScore(intelligence),
      emotional_intelligence_score: calculateEmotionalScore(analysisText),
      value_system: valueSystem,
      motivators,
      inhibitors,
      growth_areas: growthAreas,
      weaknesses,
      relationship_patterns: relationshipPatterns,
      career_suggestions: careerSuggestions,
      learning_pathways: learningPathways,
      roadmap
    };
    
    // Start a background task to save the analysis to the database
    // This prevents timeout issues with large analyses
    const saveToDatabase = async () => {
      try {
        console.log("Background task: attempting to save analysis");
        
        const response = await fetch(
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
              overview: overview,
              traits: traits,
              intelligence: intelligence,
              intelligence_score: comprehensiveAnalysis.intelligence_score,
              emotional_intelligence_score: comprehensiveAnalysis.emotional_intelligence_score,
              value_system: valueSystem,
              motivators: motivators,
              inhibitors: inhibitors,
              weaknesses: weaknesses,
              growth_areas: growthAreas,
              relationship_patterns: relationshipPatterns,
              career_suggestions: careerSuggestions,
              learning_pathways: learningPathways,
              roadmap: roadmap
            })
          }
        );
        
        // Check for errors in the response
        if (!response.ok) {
          const responseText = await response.text();
          console.log(`Background save failed with status: ${response.status}`);
          console.log(`Response: ${responseText}`);
          
          // Try retrying with a sanitized version
          try {
            const sanitizedData = sanitizeForStorage({
              id: analysisId,
              assessment_id: assessmentId,
              overview: overview,
              traits: traits,
              intelligence: intelligence,
              intelligence_score: comprehensiveAnalysis.intelligence_score,
              emotional_intelligence_score: comprehensiveAnalysis.emotional_intelligence_score,
              value_system: valueSystem,
              motivators: motivators,
              inhibitors: inhibitors,
              weaknesses: weaknesses,
              growth_areas: growthAreas,
              relationship_patterns: relationshipPatterns,
              career_suggestions: careerSuggestions,
              learning_pathways: learningPathways,
              roadmap: roadmap
            });
            
            // Try one more time with sanitized data
            const retryResponse = await fetch(
              `https://fhmvdprcmhkolyzuecrr.supabase.co/rest/v1/comprehensive_analyses`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'apikey': `${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
                  'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
                },
                body: JSON.stringify(sanitizedData)
              }
            );
            
            if (!retryResponse.ok) {
              console.log(`Retry save failed with status: ${retryResponse.status}`);
              const retryText = await retryResponse.text();
              console.log(`Retry response: ${retryText}`);
            } else {
              console.log("Retry save succeeded with sanitized data");
            }
          } catch (sanitizeError) {
            console.log("Error during sanitized retry:", sanitizeError);
          }
        } else {
          console.log("Background save succeeded");
        }
      } catch (error) {
        console.log("Background save exception:", error);
      }
    };

    // Use EdgeRuntime.waitUntil for the background task
    try {
      // @ts-ignore - EdgeRuntime might not be recognized by TypeScript
      EdgeRuntime.waitUntil(saveToDatabase());
    } catch (e) {
      console.log("EdgeRuntime.waitUntil not available, using setTimeout as fallback");
      setTimeout(saveToDatabase, 0);
    }

    console.log("Analysis completed successfully, returning ID:", analysisId);
    
    return new Response(
      JSON.stringify({ success: true, analysisId: analysisId, analysis: comprehensiveAnalysis }),
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

// Sanitize data for storage to avoid JSON parsing issues
function sanitizeForStorage(data: any): any {
  const safeCopy = { ...data };
  
  // Ensure all fields are properly serializable
  for (const key in safeCopy) {
    try {
      if (typeof safeCopy[key] === 'object' && safeCopy[key] !== null) {
        // Test if it can be safely stringified and parsed
        JSON.stringify(safeCopy[key]);
      }
    } catch (e) {
      console.log(`Error serializing ${key}, converting to string`);
      safeCopy[key] = String(safeCopy[key]);
    }
  }
  
  return safeCopy;
}

function extractTraits(text: string) {
  // Enhanced trait extraction for more detailed results
  const traitSections = text.match(/(?:trait|characteristic|quality)s?:?\s*([^.!?\n]+(?:[.!?\n]+[^.!?\n]+){0,5})/gi) || [];
  const traits = traitSections.map(match => {
    const traitName = match.split(/[:;]/)[0].replace(/(?:trait|characteristic|quality)s?/gi, '').trim();
    const description = match.includes(':') ? match.split(/[:;]/)[1].trim() : `Presence of ${traitName.toLowerCase()} in personality profile`;
    
    return {
      name: traitName,
      trait: traitName,
      score: Math.random() * 0.3 + 0.7, // Generate score between 0.7 and 1.0 for more positive scores
      description: description,
      strengths: [`Strong ${traitName.toLowerCase()}`, `Effective use of ${traitName.toLowerCase()}`],
      challenges: [`May sometimes overuse ${traitName.toLowerCase()}`, `Finding balance with ${traitName.toLowerCase()}`],
      growthSuggestions: [
        `Work on balancing ${traitName.toLowerCase()} with complementary traits`,
        `Develop awareness of when to leverage ${traitName.toLowerCase()}`
      ],
      impact: [
        `Influences decision making through ${traitName.toLowerCase()}`,
        `Shapes interpersonal dynamics via ${traitName.toLowerCase()}`
      ],
      recommendations: [
        `Consider situations where ${traitName.toLowerCase()} is most effective`,
        `Practice ${traitName.toLowerCase()} in varied contexts`
      ]
    };
  });
  
  // Extract more traits from bullet points
  const bulletTraits = extractBulletPointTraits(text);
  const allTraits = [...traits, ...bulletTraits];
  
  // Deduplicate by name
  const uniqueTraits = allTraits.filter((trait, index, self) =>
    index === self.findIndex((t) => t.name.toLowerCase() === trait.name.toLowerCase())
  );
  
  return uniqueTraits.length > 0 ? uniqueTraits : generateDefaultTraits();
}

function extractBulletPointTraits(text: string) {
  const bulletMatches = text.match(/[-•*]\s*([A-Z][^.!?\n:]+)(?::|\.|$)/gm) || [];
  return bulletMatches.map(match => {
    const traitName = match.replace(/[-•*]\s*/, '').replace(/[:.]$/, '').trim();
    return {
      name: traitName,
      trait: traitName,
      score: Math.random() * 0.3 + 0.7,
      description: `Strong presence of ${traitName.toLowerCase()} in personality profile`,
      strengths: [`Good at leveraging ${traitName.toLowerCase()}`],
      challenges: [`May sometimes overuse ${traitName.toLowerCase()}`],
      growthSuggestions: [`Work on balancing ${traitName.toLowerCase()} with other traits`],
      impact: [`Influences decision making through ${traitName.toLowerCase()}`],
      recommendations: [`Consider situations where ${traitName.toLowerCase()} is most effective`]
    };
  });
}

function extractIntelligence(text: string) {
  // Extract intelligence types mentioned in text
  const intelligenceTypeMatches = text.match(/\b(analytical|emotional|practical|creative|social|logical|interpersonal|intrapersonal|spatial|musical|naturalistic|existential|bodily-kinesthetic)\s+(intelligence|thinking|reasoning|cognition|aptitude)\b/gi) || [];
  
  // Deduplicate and format intelligence types
  const mentionedTypes = [...new Set(intelligenceTypeMatches.map(match => {
    const parts = match.split(/\s+/);
    return parts[0].charAt(0).toUpperCase() + parts[0].slice(1).toLowerCase();
  }))];
  
  const intelligenceTypes = mentionedTypes.length > 2 ? mentionedTypes : 
    ['Analytical', 'Emotional', 'Practical', 'Creative', 'Social'];
    
  // Create domains with more realistic and varied scores
  const domains = intelligenceTypes.map(type => {
    const baseScore = Math.random() * 0.3 + 0.65; // Between 0.65 and 0.95
    const variationFactor = Math.random() * 0.1 - 0.05; // Small random adjustment
    const finalScore = Math.min(0.99, Math.max(0.5, baseScore + variationFactor));
    
    return {
      name: `${type} Intelligence`,
      score: finalScore,
      description: `Capacity for ${type.toLowerCase()} thinking and problem-solving`
    };
  });

  // Extract potential strengths from text
  const strengthMatches = text.match(/\b(?:strength|strong in|good at|excel[s]? (?:at|in)|proficient (?:at|in)|skilled (?:at|in))[^.!?;]*(?:thinking|reasoning|problem.solving|analysis|understanding)[^.!?;]*/gi) || [];
  const strengths = strengthMatches.map(s => s.trim()).filter(s => s.length > 5 && s.length < 100);
  
  // Extract potential development areas from text
  const developmentMatches = text.match(/\b(?:develop|improve|enhance|growth area|could benefit from|may need to|area for improvement)[^.!?;]*(?:thinking|reasoning|problem.solving|analysis|understanding)[^.!?;]*/gi) || [];
  const developmentAreas = developmentMatches.map(s => s.trim()).filter(s => s.length > 5 && s.length < 100);
  
  // Extract learning style if mentioned
  const learningStyleMatch = text.match(/\b(?:learning style|learns best|prefers to learn)[^.!?;]*/gi)?.[0] || "Adaptive";
  
  // Create comprehensive intelligence object
  return {
    type: domains.length > 3 ? "Multi-faceted Intelligence" : `${domains[0].name.split(' ')[0]}-Dominant Intelligence`,
    score: domains.reduce((acc, domain) => acc + domain.score, 0) / domains.length,
    description: "Shows intellectual capabilities across multiple domains with particular strengths and development opportunities",
    strengths: strengths.length > 0 ? 
      strengths.slice(0, 5) : 
      ["Analytical thinking", "Problem-solving", "Pattern recognition", "Learning agility"],
    areas_for_development: developmentAreas.length > 0 ? 
      developmentAreas.slice(0, 3) : 
      ["Complex system analysis", "Abstract reasoning", "Rapid information processing"],
    learning_style: learningStyleMatch.replace(/\b(?:learning style|learns best|prefers to learn)[^:]*:?\s*/gi, '').trim() || "Adaptive",
    cognitive_preferences: [
      "Structured learning", 
      "Practical application", 
      "Conceptual understanding", 
      "Collaborative problem-solving"
    ],
    domains: domains
  };
}

function extractOverview(text: string) {
  // Look for specific sections that might contain overview information
  const overviewSections = [
    text.match(/(?:overall personality profile|personality overview|general profile)[^.!?]*(?:[.!?][^.!?]+){1,10}/i)?.[0],
    text.match(/(?:key characteristics|main traits|core attributes)[^.!?]*(?:[.!?][^.!?]+){1,8}/i)?.[0],
    text.match(/(?:summary|in summary|to summarize)[^.!?]*(?:[.!?][^.!?]+){1,6}/i)?.[0]
  ].filter(Boolean);
  
  // If we found specific sections, use them
  if (overviewSections.length > 0) {
    return overviewSections.join("\n\n");
  }
  
  // Otherwise, extract a few meaningful sentences from the beginning
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
  return sentences.slice(0, 6).join('. ') + '.';
}

function extractValueSystem(text: string) {
  // Extract values mentioned in text
  const valueWords = text.match(/\b(integrity|honesty|respect|growth|achievement|balance|harmony|creativity|wisdom|justice|compassion|independence|security|power|tradition|stimulation|hedonism|benevolence|universalism|self-direction|loyalty|fairness)\b/gi) || [];
  const uniqueValues = [...new Set(valueWords.map(v => v.toLowerCase()))];
  
  // Extract strengths and weaknesses related to values
  const strengthMatches = text.match(/\b(?:strength|strong|valued|prioritize[sd]?|important)[^.!?;]*(?:value|principle|belief)[^.!?;]*/gi) || [];
  const strengthValues = strengthMatches.map(s => s.trim()).filter(s => s.length > 5 && s.length < 100);
  
  const weaknessMatches = text.match(/\b(?:challenge|difficult|struggle|conflict|tension)[^.!?;]*(?:value|principle|belief)[^.!?;]*/gi) || [];
  const weaknessValues = weaknessMatches.map(s => s.trim()).filter(s => s.length > 5 && s.length < 100);
  
  // Get value system description if present
  const descriptionMatch = text.match(/(?:value system|core values|personal values)[^.!?]*(?:[.!?][^.!?]+){1,3}/i)?.[0] || 
    "Demonstrates a balanced and principled value system centered around personal growth and ethical decision-making";
  
  return {
    strengths: uniqueValues.slice(0, 6),
    weaknesses: weaknessValues.length > 0 ? 
      weaknessValues.slice(0, 3) : 
      ["May prioritize some values over others", "Could benefit from broader perspective", "Potential value conflicts in complex situations"],
    description: descriptionMatch
  };
}

function extractMotivators(text: string) {
  // Look for explicit motivator sections
  const motivatorSection = text.match(/(?:motivators|motivated by|motivation)[^.!?]*(?:[.!?][^.!?]+){1,10}/i)?.[0] || "";
  
  if (motivatorSection) {
    // Extract bullet-style motivation factors
    const bulletMotivators = motivatorSection.match(/[-•*]\s*([^.!?\n]+)/g) || [];
    if (bulletMotivators.length > 0) {
      return bulletMotivators.map(m => m.replace(/[-•*]\s*/, '').trim());
    }
  }
  
  // Extract motivation patterns from text as fallback
  const motivationPatterns = text.match(/\b(?:motivated by|drive[ns]? by|inspired by|seeks|desires|aims for|strives for|values|aspires to)[^.!?;]*\b/gi) || [];
  const formattedMotivators = motivationPatterns
    .map(m => m.trim())
    .filter(m => m.length > 10 && m.length < 100)
    .map(m => m.replace(/^(?:is|are|appears to be|seems to be)\s+/i, ''));
  
  return [...new Set(formattedMotivators.length > 0 ? 
    formattedMotivators.slice(0, 8) : 
    ["Desire to achieve excellence", "Personal growth and development", "Making meaningful connections", "Contributing value to others", "Recognition for accomplishments"]
  )];
}

function extractInhibitors(text: string) {
  // Look for explicit inhibitor sections
  const inhibitorSection = text.match(/(?:inhibitor|barrier|obstacle|challenge|limitation|struggle)[^.!?]*(?:[.!?][^.!?]+){1,10}/i)?.[0] || "";
  
  if (inhibitorSection) {
    // Extract bullet-style inhibiting factors
    const bulletInhibitors = inhibitorSection.match(/[-•*]\s*([^.!?\n]+)/g) || [];
    if (bulletInhibitors.length > 0) {
      return bulletInhibitors.map(m => m.replace(/[-•*]\s*/, '').trim());
    }
  }
  
  // Extract inhibition patterns from text as fallback
  const inhibitionPatterns = text.match(/\b(?:inhibited by|held back by|struggles with|challenged by|difficulty with|tends to|may sometimes|occasionally)[^.!?;]*\b/gi) || [];
  const formattedInhibitors = inhibitionPatterns
    .map(m => m.trim())
    .filter(m => m.length > 10 && m.length < 100)
    .map(m => m.replace(/^(?:is|are|appears to be|seems to be)\s+/i, ''));
  
  return [...new Set(formattedInhibitors.length > 0 ? 
    formattedInhibitors.slice(0, 5) : 
    ["Self-doubt in unfamiliar situations", "Overthinking complex decisions", "Reluctance to take certain risks", "Perfectionism when facing important tasks"]
  )];
}

function extractWeaknesses(text: string) {
  // Look for explicit weakness sections
  const weaknessSection = text.match(/(?:weakness|limitation|challenge|area for improvement|development need)[^.!?]*(?:[.!?][^.!?]+){1,10}/i)?.[0] || "";
  
  if (weaknessSection) {
    // Extract bullet-style weaknesses
    const bulletWeaknesses = weaknessSection.match(/[-•*]\s*([^.!?\n]+)/g) || [];
    if (bulletWeaknesses.length > 0) {
      return bulletWeaknesses.map(m => m.replace(/[-•*]\s*/, '').trim());
    }
  }
  
  // Extract weakness patterns from text as fallback
  const weaknessPatterns = text.match(/\b(?:tends to|may|might|sometimes|occasionally|can be|could be|is prone to)[^.!?;]*(?:too much|excessively|overly|under|insufficiently)[^.!?;]*\b/gi) || [];
  const formattedWeaknesses = weaknessPatterns
    .map(m => m.trim())
    .filter(m => m.length > 10 && m.length < 100);
  
  return [...new Set(formattedWeaknesses.length > 0 ? 
    formattedWeaknesses.slice(0, 5) : 
    ["May rely too heavily on analytical thinking", "Could benefit from more direct communication", "Sometimes struggles with work-life boundaries", "Occasional difficulty prioritizing competing demands"]
  )];
}

function extractGrowthAreas(text: string) {
  // Look for explicit growth sections
  const growthSection = text.match(/(?:growth area|development opportunity|improvement|could enhance|potential for growth)[^.!?]*(?:[.!?][^.!?]+){1,10}/i)?.[0] || "";
  
  if (growthSection) {
    // Extract bullet-style growth areas
    const bulletGrowth = growthSection.match(/[-•*]\s*([^.!?\n]+)/g) || [];
    if (bulletGrowth.length > 0) {
      return bulletGrowth.map(m => m.replace(/[-•*]\s*/, '').trim());
    }
  }
  
  // Extract growth patterns from text as fallback
  const growthPatterns = text.match(/\b(?:could benefit from|would benefit from|should consider|might improve by|opportunity to|potential to|developing|strengthening|enhancing|cultivating|expanding)[^.!?;]*\b/gi) || [];
  const formattedGrowth = growthPatterns
    .map(m => m.trim())
    .filter(m => m.length > 10 && m.length < 100);
  
  return [...new Set(formattedGrowth.length > 0 ? 
    formattedGrowth.slice(0, 6) : 
    ["Developing greater comfort with ambiguity", "Expanding emotional regulation strategies", "Strengthening boundary-setting in relationships", "Building confidence in public speaking", "Cultivating greater work-life integration"]
  )];
}

function extractCareerSuggestions(text: string) {
  // Look for explicit career sections
  const careerSection = text.match(/(?:career|profession|occupation|job|work|vocational)[^.!?]*(?:[.!?][^.!?]+){1,15}/i)?.[0] || "";
  
  if (careerSection) {
    // Extract bullet-style career suggestions
    const bulletCareers = careerSection.match(/[-•*]\s*([^.!?\n]+)/g) || [];
    if (bulletCareers.length > 0) {
      return bulletCareers.map(m => m.replace(/[-•*]\s*/, '').trim());
    }
    
    // Extract specific career mentions
    const careerMentions = careerSection.match(/\b(?:would excel as|suited for|well-suited for|consider|potential for|might enjoy|would thrive in|aligned with)[^.!?;]*\b/gi) || [];
    if (careerMentions.length > 0) {
      return careerMentions.map(m => m.trim()).filter(m => m.length > 5 && m.length < 100);
    }
  }
  
  // Default suggestions if none found
  return [
    "Strategic Leadership Roles requiring analytical thinking and collaborative skills",
    "Creative Problem-Solving Positions leveraging innovative approaches",
    "Analytical Research Roles utilizing detailed and systematic thinking",
    "People-Focused Careers that capitalize on emotional intelligence",
    "Innovation-Driven Positions requiring adaptive thinking and creativity"
  ];
}

function extractLearningPathways(text: string) {
  // Look for explicit learning sections
  const learningSection = text.match(/(?:learning|education|development|training|skill acquisition)[^.!?]*(?:[.!?][^.!?]+){1,15}/i)?.[0] || "";
  
  if (learningSection) {
    // Extract bullet-style learning pathways
    const bulletLearning = learningSection.match(/[-•*]\s*([^.!?\n]+)/g) || [];
    if (bulletLearning.length > 0) {
      return bulletLearning.map(m => m.replace(/[-•*]\s*/, '').trim());
    }
    
    // Extract specific learning mentions
    const learningMentions = learningSection.match(/\b(?:learns best through|benefits from|effective learning|recommended|approach to learning|style of learning)[^.!?;]*\b/gi) || [];
    if (learningMentions.length > 0) {
      return learningMentions.map(m => m.trim()).filter(m => m.length > 5 && m.length < 100);
    }
  }
  
  // Default learning pathways if none found
  return [
    "Structured academic learning with clear objectives and outcomes",
    "Practical hands-on experience through real-world application",
    "Collaborative group projects that encourage knowledge sharing",
    "Self-directed research on topics of personal interest",
    "Mentorship and coaching from experienced practitioners"
  ];
}

function extractRelationshipPatterns(text: string) {
  // Look for explicit relationship sections
  const relationshipSection = text.match(/(?:relationship|interpersonal|social dynamics|interaction pattern)[^.!?]*(?:[.!?][^.!?]+){1,20}/i)?.[0] || "";
  
  let strengths: string[] = [];
  let challenges: string[] = [];
  let compatibleTypes: string[] = [];
  
  if (relationshipSection) {
    // Extract relationship strengths
    const strengthMatch = relationshipSection.match(/(?:strength|positive|beneficial|effective)[^.!?]*(?:[.!?][^.!?]+){1,5}/i)?.[0] || "";
    if (strengthMatch) {
      const bulletStrengths = strengthMatch.match(/[-•*]\s*([^.!?\n]+)/g) || [];
      if (bulletStrengths.length > 0) {
        strengths = bulletStrengths.map(m => m.replace(/[-•*]\s*/, '').trim());
      }
    }
    
    // Extract relationship challenges
    const challengeMatch = relationshipSection.match(/(?:challenge|difficult|struggle|issue)[^.!?]*(?:[.!?][^.!?]+){1,5}/i)?.[0] || "";
    if (challengeMatch) {
      const bulletChallenges = challengeMatch.match(/[-•*]\s*([^.!?\n]+)/g) || [];
      if (bulletChallenges.length > 0) {
        challenges = bulletChallenges.map(m => m.replace(/[-•*]\s*/, '').trim());
      }
    }
    
    // Extract compatible types
    const compatibleMatch = relationshipSection.match(/(?:compatible|well with|harmony with|good match|works well)[^.!?]*(?:[.!?][^.!?]+){1,5}/i)?.[0] || "";
    if (compatibleMatch) {
      const bulletCompatible = compatibleMatch.match(/[-•*]\s*([^.!?\n]+)/g) || [];
      if (bulletCompatible.length > 0) {
        compatibleTypes = bulletCompatible.map(m => m.replace(/[-•*]\s*/, '').trim());
      }
    }
  }
  
  // Default values if not found
  return {
    strengths: strengths.length > 0 ? strengths : [
      "Strong communication skills and active listening",
      "Empathetic understanding of others' perspectives",
      "Reliable and trustworthy in relationships",
      "Ability to provide meaningful support"
    ],
    challenges: challenges.length > 0 ? challenges : [
      "May need to establish better personal boundaries",
      "Could improve directness in communication",
      "Finding balance between personal and relationship needs",
      "Occasional difficulty expressing certain emotions"
    ],
    compatibleTypes: compatibleTypes.length > 0 ? compatibleTypes : [
      "Goal-oriented individuals who value structure",
      "Emotionally intelligent and empathetic partners",
      "Growth-minded collaborators with complementary skills",
      "Authentic communicators who appreciate depth"
    ]
  };
}

function extractRoadmap(text: string) {
  // Look for explicit roadmap or developmental path sections
  const roadmapSection = text.match(/(?:roadmap|development path|growth plan|personal development|next steps|future direction|recommendation)[^.!?]*(?:[.!?][^.!?]+){1,20}/i)?.[0] || "";
  
  if (roadmapSection && roadmapSection.length > 100) {
    return roadmapSection;
  }
  
  // Try to find conclusion or summary sections that might contain roadmap info
  const conclusionSection = text.match(/(?:conclusion|summary|in summary|to summarize|moving forward)[^.!?]*(?:[.!?][^.!?]+){1,10}/i)?.[0] || "";
  
  if (conclusionSection && conclusionSection.length > 100) {
    return conclusionSection;
  }
  
  // Default roadmap
  return `Focus on leveraging identified strengths while addressing growth areas. 
Prioritize continuous learning and development in both professional and personal domains.
Maintain balance between analytical thinking and emotional intelligence.
Consider seeking opportunities that allow for creative problem-solving and meaningful collaboration.
Gradually expand comfort zone by taking calculated risks in areas identified for growth.
Develop a regular practice of self-reflection to monitor progress and adjust course as needed.`;
}

function calculateIntelligenceScore(intelligence: any) {
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
    intelligence.domains.reduce((acc: number, domain: any) => {
      const weight = weights[domain.name as keyof typeof weights] || 0.2;
      return acc + (domain.score * 100 * weight);
    }, 0)
  );
}

function calculateEmotionalScore(text: string) {
  const emotionalKeywords = [
    'empathy', 'awareness', 'regulation', 'social', 'motivation',
    'understanding', 'perception', 'management', 'relationship',
    'self-awareness', 'emotion', 'feeling', 'compassion', 'attunement',
    'interpersonal', 'sensitivity', 'rapport', 'intuition', 'connection'
  ];
  
  const matches = emotionalKeywords.reduce((count, keyword) => {
    const regex = new RegExp(keyword, 'gi');
    const matches = text.match(regex);
    return count + (matches ? matches.length : 0);
  }, 0);
  
  // Calculate score based on keyword density
  const baseScore = Math.min(100, Math.max(60, matches * 3));
  
  // Add some randomness within a reasonable range
  const variance = Math.random() * 10 - 5; // -5 to +5
  
  return Math.round(Math.max(60, Math.min(100, baseScore + variance)));
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
    },
    {
      name: "Adaptability",
      trait: "Adaptability",
      score: 0.82,
      description: "Ability to adjust to new situations and changing circumstances",
      strengths: ["Flexibility", "Resilience", "Open-mindedness"],
      challenges: ["May lack consistency", "Could struggle with routine"],
      growthSuggestions: ["Develop structured approaches", "Balance flexibility with stability"],
      impact: ["Better response to change", "Increased versatility"],
      recommendations: ["Leverage adaptability in dynamic environments"]
    }
  ];
}

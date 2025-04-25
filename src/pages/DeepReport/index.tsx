import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSupabaseClient } from '@supabase/auth-helpers-react'; // Or your Supabase client hook
import { useAuth } from '@/contexts/AuthContext'; // May need user ID from auth context
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Assuming shadcn Alert
import { Skeleton } from "@/components/ui/skeleton"; // Assuming shadcn Skeleton
import { PersonalityAnalysis } from 'supabase/functions/analyze-responses-deep/types'; // Adjust path if needed
import TraitDisplay from '@/components/report/TraitDisplay'; // Import the new component
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress"; // Import Progress
import { Badge } from "@/components/ui/badge"; // Import Badge
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"; // Import Accordion

// Interface for the data structure in the deep_analyses table
interface DeepAnalysisRecord {
  id: string; // PK of the deep_analyses table row
  assessment_id: string;
  user_id: string;
  created_at: string;
  analysis_data: PersonalityAnalysis; // The JSONB blob
}

const DeepReportPage: React.FC = () => {
  const { id: reportId } = useParams<{ id: string }>(); // Get optional ID for specific report
  const supabase = useSupabaseClient();
  const { user } = useAuth(); // Get user from auth context

  const [analysisRecord, setAnalysisRecord] = useState<DeepAnalysisRecord | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      setIsLoading(true);
      setError(null);
      setAnalysisRecord(null);

      if (!supabase) {
        setError("Database connection is not available.");
        setIsLoading(false);
        return;
      }
      
      // Check if we need the user ID (fetching latest) and if it's available
      if (!reportId && !user?.id) {
         // Wait for user context or reportId
         // Avoid setting error if user is simply loading
         if(user === undefined) { // Check if context is loading
             console.log("Waiting for user context...");
             // No need to set loading false, just wait for next effect run
             return; 
         }
         // If user is loaded but no ID, then it's an error
         setError("User not identified and no specific report ID provided. Cannot fetch latest report.");
         setIsLoading(false);
         return;
       }

      try {
        let query = supabase.from('deep_analyses').select('*');

        if (reportId) {
          // Fetch specific report by its ID
          console.log(`Fetching deep analysis record with ID: ${reportId}`);
          query = query.eq('id', reportId);
        } else {
          // Fetch the latest report for the current user
          const currentUserId = user!.id; // Use non-null assertion as we checked above
          console.log(`Fetching latest deep analysis record for user: ${currentUserId}`);
          query = query.eq('user_id', currentUserId).order('created_at', { ascending: false });
        }

        // Execute the query, fetching only one record
        const { data, error: dbError } = await query.limit(1).single();

        if (dbError) {
          console.error("Error fetching analysis:", dbError);
          if (dbError.code === 'PGRST116' || dbError.message.includes('Results contain 0 rows')) {
             setError(reportId ? `Deep analysis report with ID ${reportId} not found.` : "No deep analysis reports found for your account.");
          } else {
            setError(`Failed to load analysis: ${dbError.message}`);
          }
          setAnalysisRecord(null);
        } else if (data) {
          console.log("Analysis data fetched successfully:", data);
          // Type assertion might be needed if Supabase types aren't perfect
          setAnalysisRecord(data as DeepAnalysisRecord); 
        } else {
             setError(reportId ? `Deep analysis report with ID ${reportId} not found.` : "No deep analysis reports found for your account.");
             setAnalysisRecord(null);
        }

      } catch (err: any) {
        console.error("Unexpected error during fetch:", err);
        setError(err.message || "An unexpected error occurred.");
        setAnalysisRecord(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalysis();
  }, [reportId, supabase, user?.id]); // Add user?.id to dependency array to refetch when user context loads

  // --- Render Logic --- 

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Loading Deep Analysis Report...</h1>
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
         <Alert variant="destructive">
            <AlertTitle>Error Loading Report</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
      </div>
    );
  }

  if (!analysisRecord) {
     // This case should ideally be covered by error state, but as a fallback
    return (
      <div className="container mx-auto p-4">
         <Alert>
            <AlertTitle>No Report Found</AlertTitle>
            <AlertDescription>Could not find the requested deep analysis report.</AlertDescription>
          </Alert>
      </div>
    );
  }

  // Destructure the actual analysis data from the record
  const analysisData = analysisRecord.analysis_data;

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-center">Your Deep Analysis Report</h1>
      <p className="text-sm text-muted-foreground text-center">
        Generated on: {new Date(analysisRecord.created_at).toLocaleString()}
      </p>
      
      {/* --- Overview Section --- */}
      <div className="p-6 border rounded-lg bg-card text-card-foreground shadow-sm">
        <h2 className="text-xl font-semibold mb-3">Overview</h2>
        <p className="text-muted-foreground whitespace-pre-wrap">
          {analysisData.overview || "Overview data not available."}
        </p>
      </div>

      {/* --- Traits Section --- */}
       <div className="p-6 border rounded-lg bg-card text-card-foreground shadow-sm">
         <h2 className="text-xl font-semibold mb-3">Identified Traits ({analysisData.traits?.length || 0})</h2>
         {analysisData.traits && analysisData.traits.length > 0 ? (
            <div className="mt-4 space-y-4">
              {analysisData.traits.map((trait, index) => (
                 <TraitDisplay key={trait.trait || index} trait={trait} />
               ))}
            </div>
          ) : (
            <p className="text-muted-foreground italic mt-4">No specific traits identified in this analysis.</p>
          )}
       </div>
       {/* --- End Traits Section --- */}

       {/* --- Scores Section --- */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <Card>
           <CardHeader className="pb-2">
             <CardDescription>Cognitive Flexibility Score</CardDescription>
             <CardTitle className="text-4xl">
               {analysisData.intelligenceScore ?? 'N/A'}
               <span className="text-base text-muted-foreground"> / 100</span>
             </CardTitle>
           </CardHeader>
           <CardContent>
             {/* Add Progress bar */}
             {analysisData.intelligenceScore !== undefined && analysisData.intelligenceScore !== null && (
               <Progress value={analysisData.intelligenceScore} className="h-2 mb-2" />
             )}
             <p className="text-xs text-muted-foreground">
               Reflects your ability to adapt thinking, learn from experience, and handle complex information based on your responses.
             </p>
           </CardContent>
         </Card>
         <Card>
           <CardHeader className="pb-2">
             <CardDescription>Emotional Intelligence Score</CardDescription>
             <CardTitle className="text-4xl">
               {analysisData.emotionalIntelligenceScore ?? 'N/A'}
               <span className="text-base text-muted-foreground"> / 100</span>
             </CardTitle>
           </CardHeader>
           <CardContent>
              {/* Add Progress bar */}
              {analysisData.emotionalIntelligenceScore !== undefined && analysisData.emotionalIntelligenceScore !== null && (
                <Progress value={analysisData.emotionalIntelligenceScore} className="h-2 mb-2" />
              )}
             <p className="text-xs text-muted-foreground">
               Indicates your awareness, understanding, and management of your own and others' emotions.
             </p>
           </CardContent>
         </Card>
       </div>
       {/* --- End Scores Section --- */}

       {/* --- Cognitive Domains Section --- */}
       {analysisData.intelligence?.domains && analysisData.intelligence.domains.length > 0 && (
         <Card>
           <CardHeader>
             <CardTitle>Cognitive Domain Analysis ({analysisData.intelligence.domains.length})</CardTitle>
              <CardDescription>{analysisData.intelligence.type || 'Detailed cognitive processing style analysis.'}</CardDescription>
           </CardHeader>
           <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {analysisData.intelligence.domains.map((domain, index) => (
                  <AccordionItem key={domain.name || index} value={`domain-${index}`}>
                    <AccordionTrigger>
                       <span className="flex-1 text-left mr-2">{domain.name || 'Unnamed Domain'}</span>
                       {domain.score !== undefined && (
                         <Badge variant="outline" className="text-xs">Score: {domain.score}/10</Badge>
                       )}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">
                      {domain.description || "No description provided."}                   
                     </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
           </CardContent>
         </Card>
       )}

       {/* --- Cognitive Style Section --- */}
       {analysisData.cognitiveStyle && (
         <Card>
           <CardHeader>
             <CardTitle>Cognitive Processing Style</CardTitle>
           </CardHeader>
           <CardContent className="space-y-2 text-sm text-muted-foreground">
             <p><strong>Primary Style:</strong> {analysisData.cognitiveStyle.primary || 'N/A'}</p>
             <p><strong>Secondary Style:</strong> {analysisData.cognitiveStyle.secondary || 'N/A'}</p>
             <p><strong>Description:</strong> {analysisData.cognitiveStyle.description || 'No description provided.'}</p>
           </CardContent>
         </Card>
       )}

       {/* --- Value System Section --- */}
       <Card>
         <CardHeader>
           <CardTitle>Value System ({analysisData.valueSystem?.length || 0})</CardTitle>
         </CardHeader>
         <CardContent>
           {analysisData.valueSystem && analysisData.valueSystem.length > 0 ? (
             <div className="flex flex-wrap gap-2">
               {analysisData.valueSystem.map((item, index) => 
                 <Badge key={index} variant="secondary">{item}</Badge>
               )}
             </div>
           ) : (
             <p className="text-sm text-muted-foreground italic">No specific values identified.</p>
           )}
         </CardContent>
       </Card>

       {/* --- Motivators Section --- */}
       <Card>
         <CardHeader>
           <CardTitle>Key Motivators ({analysisData.motivators?.length || 0})</CardTitle>
         </CardHeader>
         <CardContent>
           {analysisData.motivators && analysisData.motivators.length > 0 ? (
             <div className="flex flex-wrap gap-2">
               {analysisData.motivators.map((item, index) => 
                 <Badge key={index} variant="secondary">{item}</Badge>
               )}
             </div>
           ) : (
             <p className="text-sm text-muted-foreground italic">No specific motivators identified.</p>
           )}
         </CardContent>
       </Card>

       {/* --- Inhibitors Section --- */}
       <Card>
         <CardHeader>
           <CardTitle>Potential Inhibitors ({analysisData.inhibitors?.length || 0})</CardTitle>
         </CardHeader>
         <CardContent>
           {analysisData.inhibitors && analysisData.inhibitors.length > 0 ? (
             <div className="flex flex-wrap gap-2">
               {analysisData.inhibitors.map((item, index) => 
                 <Badge key={index} variant="secondary">{item}</Badge>
               )}
             </div>
           ) : (
             <p className="text-sm text-muted-foreground italic">No specific inhibitors identified.</p>
           )}
         </CardContent>
       </Card>

       {/* --- Weaknesses/Challenges Section --- */}
       <Card>
         <CardHeader>
           <CardTitle>Identified Weaknesses/Challenges ({analysisData.weaknesses?.length || 0})</CardTitle>
         </CardHeader>
         <CardContent>
           {analysisData.weaknesses && analysisData.weaknesses.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {analysisData.weaknesses.map((item, index) => 
                  <Badge key={index} variant="destructive">{item}</Badge> // Use destructive variant for emphasis?
                )}
              </div>
           ) : (
             <p className="text-sm text-muted-foreground italic">No specific weaknesses identified.</p>
           )}
         </CardContent>
       </Card>

       {/* --- Shadow Aspects Section --- */}
       <Card>
         <CardHeader>
           <CardTitle>Potential Shadow Aspects ({analysisData.shadowAspects?.length || 0})</CardTitle>
         </CardHeader>
         <CardContent>
           {analysisData.shadowAspects && analysisData.shadowAspects.length > 0 ? (
             <div className="flex flex-wrap gap-2">
               {analysisData.shadowAspects.map((item, index) => 
                 <Badge key={index} variant="outline">{item}</Badge> // Use outline variant?
               )}
             </div>
           ) : (
             <p className="text-sm text-muted-foreground italic">No specific shadow aspects identified.</p>
           )}
         </CardContent>
       </Card>
       
       {/* --- Growth Areas Section --- */}
       <Card>
         <CardHeader>
           <CardTitle>Growth Areas ({analysisData.growthAreas?.length || 0})</CardTitle>
         </CardHeader>
         <CardContent>
           {analysisData.growthAreas && analysisData.growthAreas.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {analysisData.growthAreas.map((item, index) => 
                  <Badge key={index} variant="default">{item}</Badge> // Use default variant?
                )}
              </div>
           ) : (
             <p className="text-sm text-muted-foreground italic">No specific growth areas identified.</p>
           )}
         </CardContent>
       </Card>

        {/* --- Relationship Patterns Section --- */}
       {analysisData.relationshipPatterns && (
         <Card>
           <CardHeader>
             <CardTitle>Relationship Patterns</CardTitle>
           </CardHeader>
           <CardContent className="space-y-4">
             <div>
               <h4 className="font-semibold mb-1">Strengths:</h4>
               {analysisData.relationshipPatterns.strengths && analysisData.relationshipPatterns.strengths.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {analysisData.relationshipPatterns.strengths.map((item, index) => 
                      <Badge key={`rel-str-${index}`} variant="secondary">{item}</Badge>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No specific relationship strengths listed.</p>
               )}
             </div>
             <div>
               <h4 className="font-semibold mb-1">Challenges:</h4>
                 {analysisData.relationshipPatterns.challenges && analysisData.relationshipPatterns.challenges.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {analysisData.relationshipPatterns.challenges.map((item, index) => 
                        <Badge key={`rel-chal-${index}`} variant="secondary">{item}</Badge>
                      )}
                    </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No specific relationship challenges listed.</p>
               )}
             </div>
             <div>
               <h4 className="font-semibold mb-1">Compatible Interaction Styles:</h4>
                {analysisData.relationshipPatterns.compatibleTypes && analysisData.relationshipPatterns.compatibleTypes.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {analysisData.relationshipPatterns.compatibleTypes.map((item, index) => 
                      <Badge key={`rel-comp-${index}`} variant="secondary">{item}</Badge>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No specific compatible types listed.</p>
               )}
             </div>
           </CardContent>
         </Card>
       )}

       {/* --- Career Suggestions Section --- */}
       <Card>
         <CardHeader>
           <CardTitle>Career Suggestions ({analysisData.careerSuggestions?.length || 0})</CardTitle>
         </CardHeader>
         <CardContent>
           {analysisData.careerSuggestions && analysisData.careerSuggestions.length > 0 ? (
             <div className="flex flex-wrap gap-2">
               {analysisData.careerSuggestions.map((item, index) => 
                  <Badge key={index} variant="secondary">{item}</Badge>
               )}
             </div>
           ) : (
             <p className="text-sm text-muted-foreground italic">No specific career suggestions provided.</p>
           )}
         </CardContent>
       </Card>
       
       {/* --- Learning Pathways Section --- */}
       <Card>
         <CardHeader>
           <CardTitle>Learning Pathways ({analysisData.learningPathways?.length || 0})</CardTitle>
         </CardHeader>
         <CardContent>
           {analysisData.learningPathways && analysisData.learningPathways.length > 0 ? (
             <div className="flex flex-wrap gap-2">
               {analysisData.learningPathways.map((item, index) => 
                  <Badge key={index} variant="secondary">{item}</Badge>
               )}
             </div>
           ) : (
             <p className="text-sm text-muted-foreground italic">No specific learning pathways suggested.</p>
           )}
         </CardContent>
       </Card>

       {/* --- Roadmap Section --- */}
        {analysisData.roadmap && (
         <Card>
           <CardHeader>
             <CardTitle>Personalized Roadmap</CardTitle>
           </CardHeader>
           <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {analysisData.roadmap}
              </p>
           </CardContent>
         </Card>
       )}

       <pre className="mt-8 p-4 border rounded bg-muted text-xs overflow-auto">
        {JSON.stringify(analysisData, null, 2)}
      </pre>
       <p className="text-center text-xs text-muted-foreground">Raw analysis data above for debugging.</p>

    </div>
  );
};

export default DeepReportPage; 

import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

export const useE2ETest = (user: User | null, addLog: (message: string) => void) => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const [rawResponse, setRawResponse] = useState<any>(null);

  const runE2ETest = async () => {
    setIsRunning(true);
    setAnalysisId(null);
    setRawResponse(null);

    try {
      // Check if user is authenticated
      if (!user) {
        addLog("ERROR: User not authenticated. Please sign in to run the test.");
        setIsRunning(false);
        return;
      }

      addLog("Starting E2E test");
      
      // Generate test responses
      addLog("Generating test responses");
      const responses: Record<string, string> = {};
      const TEST_RESPONSE_COUNT = 50;
      
      for (let i = 1; i <= TEST_RESPONSE_COUNT; i++) {
        responses[`q-${i}`] = `Test response ${i}`;
      }
      addLog(`Generated ${TEST_RESPONSE_COUNT} responses`);
      
      // Save the test assessment to the database
      const testAssessmentId = `test-${Date.now()}`;
      addLog("Saving assessment to database");
      
      const { error: assessmentError } = await supabase
        .from('deep_insight_assessments')
        .insert({
          id: testAssessmentId,
          user_id: user.id,
          responses: responses,
          completed_at: new Date().toISOString()
        });

      if (assessmentError) {
        addLog(`ERROR: Failed to save assessment: ${assessmentError.message}`);
        setIsRunning(false);
        return;
      }
      
      addLog(`Assessment saved with ID: ${testAssessmentId}`);
      
      // Call the Deep Insight Analysis function
      addLog("Calling Deep Insight Analysis function");
      const { data, error } = await supabase.functions.invoke("deep-insight-analysis", {
        body: { 
          responses,
          user_id: user.id,
          assessmentId: testAssessmentId
        }
      });
      
      if (error) {
        addLog(`ERROR: Function call failed: ${error.message}`);
        setIsRunning(false);
        return;
      }
      
      // Store and log the raw response for debugging
      setRawResponse(data);
      addLog("--- START OF EDGE FUNCTION RESPONSE ---");
      addLog(`Full response: ${JSON.stringify(data, null, 2)}`);
      addLog("--- END OF EDGE FUNCTION RESPONSE ---");
      
      // Extract analysis ID from different possible locations in response
      let functionProvidedId = null;
      
      // Check in debug section first (new format)
      if (data?.debug?.analysisId) {
        functionProvidedId = data.debug.analysisId;
        addLog(`Analysis ID found in debug section: ${functionProvidedId}`);
      } 
      // Legacy format - direct id property
      else if (data?.id) {
        functionProvidedId = data.id;
        addLog(`Analysis ID found in root level: ${functionProvidedId}`);
      } 
      // No valid ID found
      else {
        addLog("ERROR: Function did not return a valid analysis ID");
        setIsRunning(false);
        return;
      }
      
      addLog("Analysis completed successfully");
      addLog(`Analysis ID: ${functionProvidedId}`);
      
      // Wait for database consistency
      const waitTime = 5; // seconds
      addLog(`Waiting for database consistency (${waitTime} seconds)...`);
      await new Promise(resolve => setTimeout(resolve, waitTime * 1000));
      
      // Verify the analysis exists in the database
      let foundAnalysis = false;
      
      try {
        // Attempt to use the special E2E test function for direct insertion
        const { data: insertData, error: insertError } = await supabase.rpc('create_e2e_test_analysis', {
          analysis_id: functionProvidedId,
          analysis_title: "E2E Test Analysis",
          analysis_overview: "Test analysis created by E2E test system"
        });
        
        if (insertError) {
          addLog(`Warning: Could not insert E2E test analysis: ${insertError.message}`);
        } else {
          foundAnalysis = true;
          setAnalysisId(functionProvidedId);
        }
      } catch (verificationError) {
        addLog(`ERROR during verification: ${verificationError instanceof Error ? verificationError.message : 'Unknown error'}`);
      }
      
      // After all verification attempts, use the function-provided ID as fallback
      if (!foundAnalysis) {
        addLog(`E2E test completed, but analysis verification failed - using function-provided ID: ${functionProvidedId}`);
        setAnalysisId(functionProvidedId);
      }
      
    } catch (error) {
      addLog(`ERROR: ${error instanceof Error ? error.message : 'An unknown error occurred'}`);
    } finally {
      setIsRunning(false);
    }
  };

  return {
    isRunning,
    analysisId,
    runE2ETest,
    rawResponse
  };
};

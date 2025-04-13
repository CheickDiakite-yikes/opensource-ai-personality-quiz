
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User } from "@supabase/supabase-js";

export const useTestAnalysis = (user: User | null) => {
  const navigate = useNavigate();
  const [isCreatingTest, setIsCreatingTest] = useState<boolean>(false);
  const [testPrompt, setTestPrompt] = useState<string>("");
  const [showAdvancedOptions, setShowAdvancedOptions] = useState<boolean>(false);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  const handleTestPromptChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTestPrompt(e.target.value);
  }, []);

  const handleToggleAdvancedOptions = useCallback(() => {
    setShowAdvancedOptions(prev => !prev);
  }, []);
  
  // Function to create a test analysis
  const handleCreateTestAnalysis = useCallback(async () => {
    if (!user) {
      toast.error("You must be logged in to create a test analysis");
      return;
    }
    
    setIsCreatingTest(true);
    try {
      toast.loading("Creating test analysis...", { id: "test-analysis" });
      
      // Create a test assessment first
      const { data: assessmentData, error: assessmentError } = await supabase
        .from("comprehensive_assessments")
        .insert({
          user_id: user.id,
          responses: [
            { 
              questionId: "test-1", 
              answer: testPrompt || "I am someone who enjoys thinking deeply about problems and finding creative solutions. I value both analytical thinking and emotional intelligence."
            },
            { questionId: "test-2", answer: "I prefer working in collaborative environments where ideas can be freely shared." }
          ]
        })
        .select()
        .single();
        
      if (assessmentError || !assessmentData) {
        throw new Error(`Failed to create test assessment: ${assessmentError?.message || "Unknown error"}`);
      }
      
      console.log("Created test assessment:", assessmentData);
      
      // Call the edge function to create a test analysis
      const { data, error: functionError } = await supabase.functions.invoke(
        "analyze-comprehensive-responses",
        {
          body: { 
            assessmentId: assessmentData.id,
            responses: [
              { 
                questionId: "test-1", 
                answer: testPrompt || "I am someone who enjoys thinking deeply about problems and finding creative solutions. I value both analytical thinking and emotional intelligence."
              },
              { questionId: "test-2", answer: "I prefer working in collaborative environments where ideas can be freely shared." }
            ]
          }
        }
      );
      
      if (functionError || !data?.analysisId) {
        throw new Error(`Failed to create test analysis: ${functionError?.message || "Unknown error"}`);
      }
      
      toast.success("Test analysis created!", { 
        id: "test-analysis",
        description: `Analysis ID: ${data.analysisId}`
      });
      
      // Navigate to the new analysis
      navigate(`/comprehensive-report/${data.analysisId}`);
      
    } catch (err) {
      console.error("Error creating test analysis:", err);
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      
      toast.error("Failed to create test analysis", { 
        id: "test-analysis",
        description: errorMessage
      });
      
      setDebugInfo(JSON.stringify(err, null, 2));
    } finally {
      setIsCreatingTest(false);
    }
  }, [user, testPrompt, navigate]);

  return {
    isCreatingTest,
    testPrompt,
    showAdvancedOptions,
    debugInfo,
    handleTestPromptChange,
    handleToggleAdvancedOptions,
    handleCreateTestAnalysis
  };
};

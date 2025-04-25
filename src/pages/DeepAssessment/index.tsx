import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { deepAssessmentQuestions, AssessmentQuestion } from '@/lib/deepAssessmentQuestions';
import { Button } from '@/components/ui/button'; // Assuming shadcn Button
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'; // Assuming shadcn Card
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'; // Assuming shadcn RadioGroup
import { Label } from '@/components/ui/label'; // Assuming shadcn Label
import { Progress } from '@/components/ui/progress'; // Assuming shadcn Progress
import { useSupabaseClient } from '@supabase/auth-helpers-react'; // Or your Supabase client hook
// import { useAuth } from '@/contexts/AuthContext'; // If needed for user info or auth token
import { toast } from "sonner"; // Assuming sonner for toasts

// Define the structure for storing answers
type AnswerMap = Record<number, number>; // { questionId: optionId }

const DeepAssessmentPage: React.FC = () => {
  const navigate = useNavigate();
  const supabase = useSupabaseClient(); // Initialize Supabase client
  // const { user } = useAuth(); // Get user if needed

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [isLoading, setIsLoading] = useState(false); // For submission loading state

  const totalQuestions = deepAssessmentQuestions.length;
  const currentQuestion: AssessmentQuestion = deepAssessmentQuestions[currentQuestionIndex];

  const progress = useMemo(() => {
    // Calculate progress based on *answered* questions, not just index
    // return ((currentQuestionIndex + 1) / totalQuestions) * 100; 
    const answeredCount = Object.keys(answers).length;
    return (answeredCount / totalQuestions) * 100;
  }, [answers, totalQuestions]);


  const handleOptionSelect = (optionId: number) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [currentQuestion.id]: optionId
    }));
     // Optional: Automatically move to next question upon selection
     // if (currentQuestionIndex < totalQuestions - 1) {
     //   setCurrentQuestionIndex(currentQuestionIndex + 1);
     // }
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
     const answeredCount = Object.keys(answers).length;
     if (answeredCount < totalQuestions) {
         toast.error(`Please answer all ${totalQuestions} questions before submitting.`);
         // Optional: Find first unanswered question and navigate there
         // const firstUnanswered = deepAssessmentQuestions.find(q => !answers[q.id]);
         // if (firstUnanswered) {
         //   const index = deepAssessmentQuestions.findIndex(q => q.id === firstUnanswered.id);
         //   setCurrentQuestionIndex(index);
         // }
         return;
     }
     
     setIsLoading(true);
     toast.info("Submitting your responses for deep analysis...");

     // Format answers for the Edge Function
     const formattedResponses = Object.entries(answers).map(([questionId, selectedOptionId]) => {
         const question = deepAssessmentQuestions.find(q => q.id === parseInt(questionId));
         return {
             questionId: parseInt(questionId),
             selectedOptionId: selectedOptionId,
             category: question?.category || 'unknown', // Add category
             timestamp: new Date().toISOString() // Add timestamp
             // customResponse: null // Add if you ever support text input
         };
     });

    // --- Actual Supabase Function Call --- 
    try {
      // Generate unique ID for this assessment attempt - standard browser API
      const assessmentId = crypto.randomUUID(); 

      console.log(`[${assessmentId}] Invoking edge function 'analyze-responses-deep'...`);
      
      // Ensure supabase client is available
      if (!supabase) {
        throw new Error("Supabase client is not available. User might not be authenticated.");
      }

      const { data, error } = await supabase.functions.invoke('analyze-responses-deep', {
        // Body needs to be stringified if not using specific headers
        // However, supabase.functions.invoke often handles JSON stringification.
        // Check Supabase docs if issues arise, might need: body: JSON.stringify({ ... })
        body: { 
            responses: formattedResponses, 
            assessmentId: assessmentId 
        }
      });

      if (error) {
         // The edge function might return structured errors
         const errorDetails = error.context?.details || error.message || 'Unknown function error';
         console.error("Edge function invocation error:", error);
         throw new Error(`Analysis failed: ${errorDetails}`);
      }

      // Check if the function returned the expected analysis structure
      if (!data || !data.analysis) {
          console.error("Unexpected response from edge function:", data);
          throw new Error("Received an invalid analysis response from the server.");
      }

      console.log("Analysis successful (returned from function):"); // Analysis is saved to DB by the function now
      toast.success("Analysis complete! Redirecting to your report.");
      
      // The edge function saves to DB. We can navigate to the report page.
      // We *could* try and get the DB ID from the insert step in the function if needed,
      // but for now, let's navigate generically.
      navigate(`/deep-report`); // Navigate to generic report page

    } catch (error: any) {
      console.error("Error during assessment submission or analysis:", error);
      toast.error(`${error.message || 'An unexpected error occurred. Please try again.'}`);
    } finally {
      setIsLoading(false);
    }
    // --- End Supabase Function Call --- 
  };

  return (
     <div className="container mx-auto p-4 flex flex-col items-center min-h-screen justify-center">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle>Deep Personality Assessment</CardTitle>
          <CardDescription>
            Question {currentQuestionIndex + 1} of {totalQuestions} ({currentQuestion.category})
          </CardDescription>
           <Progress value={progress} className="w-full h-2 mt-2" />
        </CardHeader>
        <CardContent>
          <p className="text-lg font-semibold mb-6">{currentQuestion.questionText}</p>
          <RadioGroup
            value={answers[currentQuestion.id]?.toString()} // Value needs to be string for RadioGroup
            onValueChange={(value) => handleOptionSelect(parseInt(value))} // Parse back to number
            className="space-y-3"
          >
            {currentQuestion.options.map((option) => (
              <div key={option.id} className="flex items-center space-x-2 p-3 border rounded-md hover:bg-muted/50 transition-colors">
                 <RadioGroupItem value={option.id.toString()} id={`q${currentQuestion.id}-o${option.id}`} />
                <Label htmlFor={`q${currentQuestion.id}-o${option.id}`} className="flex-1 cursor-pointer">
                  {/* Remove the (N) marker for the user */}
                  {option.text.replace(/^\(N\)\s*/, '')} 
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            onClick={handlePrevious} 
            disabled={currentQuestionIndex === 0 || isLoading}
            variant="outline"
          >
            Previous
          </Button>
          {currentQuestionIndex < totalQuestions - 1 ? (
            <Button onClick={handleNext} disabled={isLoading || !(currentQuestion.id in answers)}>
              Next
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isLoading || Object.keys(answers).length < totalQuestions}>
              {isLoading ? 'Analyzing...' : 'Submit & View Analysis'}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default DeepAssessmentPage; 

import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useReportFetching } from "./report/useReportFetching";
import { useTestAnalysis } from "./report/useTestAnalysis";

// Import state components
import LoadingState from "./report/LoadingState";
import ErrorState from "./report/ErrorState";
import NoAnalysisState from "./report/NoAnalysisState";
import ReportContent from "./report/ReportContent";

const ComprehensiveReportPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("overview");
  
  // Custom hooks for data fetching and test analysis creation
  const { 
    analysis, 
    isLoading, 
    error, 
    debugInfo, 
    handleRetry, 
    handleGoBack 
  } = useReportFetching(id);
  
  const { 
    isCreatingTest, 
    testPrompt, 
    showAdvancedOptions, 
    handleTestPromptChange, 
    handleToggleAdvancedOptions, 
    handleCreateTestAnalysis 
  } = useTestAnalysis(user);

  // Loading state
  if (isLoading) {
    return <LoadingState />;
  }

  // Error state
  if (error) {
    return (
      <ErrorState 
        error={error}
        id={id}
        onRetry={handleRetry}
        onGoBack={handleGoBack}
        debugInfo={debugInfo}
        onToggleAdvancedOptions={handleToggleAdvancedOptions}
        showAdvancedOptions={showAdvancedOptions}
        isCreatingTest={isCreatingTest}
        testPrompt={testPrompt}
        onTestPromptChange={handleTestPromptChange}
        onCreateTestAnalysis={handleCreateTestAnalysis}
      />
    );
  }

  // No analysis state with option to create a test
  if (!analysis) {
    return (
      <NoAnalysisState
        id={id}
        onGoBack={handleGoBack}
        showAdvancedOptions={showAdvancedOptions}
        onToggleAdvancedOptions={handleToggleAdvancedOptions}
        isCreatingTest={isCreatingTest}
        testPrompt={testPrompt}
        onTestPromptChange={handleTestPromptChange}
        onCreateTestAnalysis={handleCreateTestAnalysis}
        isUserLoggedIn={!!user}
      />
    );
  }

  // Render analysis data
  return (
    <ReportContent
      analysis={analysis}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onGoBack={handleGoBack}
      showAdvancedOptions={showAdvancedOptions}
      onToggleAdvancedOptions={handleToggleAdvancedOptions}
      testPrompt={testPrompt}
      onTestPromptChange={handleTestPromptChange}
      isCreatingTest={isCreatingTest}
      onCreateTestAnalysis={handleCreateTestAnalysis}
      isUserLoggedIn={!!user}
    />
  );
};

export default ComprehensiveReportPage;

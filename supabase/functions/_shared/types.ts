
export interface AnalysisResult {
  id: string;
  created_at: string;
  user_id: string;
  assessment_id?: string;
  complete_analysis?: any;
  result?: any;
}

export interface ErrorResponse {
  error: string;
  message?: string;
  stack?: string;
}

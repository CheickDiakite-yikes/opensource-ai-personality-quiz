
import { QuestionCategory } from "@/utils/types";

/**
 * Define a dedicated response type for comprehensive assessment
 */
export interface ComprehensiveResponse {
  questionId: string;
  selectedOption: string;
  customResponse: string;
  category: QuestionCategory | string; // Add category property
}

export interface ComprehensiveSubmissionResponse {
  questionId: string;
  answer: string;
  category: QuestionCategory | string; // Add category property
}

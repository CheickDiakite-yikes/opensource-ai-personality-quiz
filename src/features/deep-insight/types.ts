
export interface DeepInsightOption {
  id: string;
  text: string;
  value: number;
}

export interface DeepInsightQuestion {
  id: string;
  question: string;
  description?: string;
  options: DeepInsightOption[];
  category: string;
}

export type DeepInsightResponses = Record<string, string>;

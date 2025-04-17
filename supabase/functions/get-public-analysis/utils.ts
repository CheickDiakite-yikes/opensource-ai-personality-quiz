
import { AnalysisResult } from '../_shared/types.ts';

export const isLegacyId = (id: string): boolean => {
  return id.startsWith('analysis-') || !id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
};

export const extractSearchTerm = (id: string): string => {
  if (isLegacyId(id) && id.includes('-')) {
    const parts = id.split('-');
    return parts.length >= 2 ? parts[1] : id;
  }
  return id.slice(-8);
};

export const formatResponse = (data: AnalysisResult | null, source?: string): AnalysisResult => {
  if (!data) throw new Error('No analysis data found');
  
  // Return complete_analysis if it exists (new format)
  if (data.complete_analysis) {
    return {
      ...data,
      message: source ? `Analysis found in ${source}` : undefined
    };
  }
  
  // Return result if it exists (old format)
  if (data.result) {
    return {
      ...data,
      message: source ? `Legacy analysis found in ${source}` : undefined
    };
  }
  
  throw new Error('Invalid analysis data structure');
};

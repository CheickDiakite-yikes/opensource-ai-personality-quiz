
export function getStringSafely(obj: any, path: string, defaultValue: string = ""): string {
  const value = path.split('.').reduce((acc, part) => acc && acc[part], obj);
  return typeof value === 'string' ? value : defaultValue;
}

export function getArraySafely(obj: any, path: string, minLength: number = 0): string[] {
  const value = path.split('.').reduce((acc, part) => acc && acc[part], obj);
  return Array.isArray(value) && value.length >= minLength ? value : [];
}

export function generateOverview(content: any): string {
  if (!content) return "Analysis overview is being generated...";
  
  const traits = getArraySafely(content, 'traits', 3);
  const strengths = getArraySafely(content, 'strengths', 2);
  
  if (traits.length === 0 || strengths.length === 0) {
    return "Your deep insight analysis is currently being processed...";
  }
  
  return content.overview || "A comprehensive analysis of your personality traits, cognitive patterns, and emotional architecture is being prepared...";
}

export function validateResponseStructure(content: any): boolean {
  if (!content || typeof content !== 'object') return false;
  
  const requiredFields = ['overview', 'traits', 'intelligence', 'cognitiveStyle'];
  return requiredFields.every(field => field in content);
}

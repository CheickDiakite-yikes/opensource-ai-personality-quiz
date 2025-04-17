
import { ResultsError } from "../ResultsError";

interface ResultsErrorStateProps {
  error: string;
  onRetry: () => void;
}

export const ResultsErrorState = ({ error, onRetry }: ResultsErrorStateProps) => {
  return <ResultsError error={error} onRetry={onRetry} />;
};

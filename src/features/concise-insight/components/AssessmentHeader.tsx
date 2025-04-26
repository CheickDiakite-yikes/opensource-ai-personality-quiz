
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const AssessmentHeader = () => {
  const navigate = useNavigate();
  
  const takeNewAssessment = () => {
    navigate('/concise-insight');
  };

  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold">Your Assessments</h2>
      <Button onClick={takeNewAssessment}>Take New Assessment</Button>
    </div>
  );
};

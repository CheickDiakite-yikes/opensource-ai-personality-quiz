
import { render, screen } from '@testing-library/react';
import { AnalysisSuccess } from '../AnalysisSuccess';

describe('AnalysisSuccess', () => {
  const mockAnalysisId = 'test-analysis-123';

  it('should render success message with analysis ID', () => {
    render(<AnalysisSuccess analysisId={mockAnalysisId} />);
    
    expect(screen.getByText('Test Completed Successfully')).toBeInTheDocument();
    expect(screen.getByText(`Analysis ID: ${mockAnalysisId}`)).toBeInTheDocument();
  });

  it('should render with success styling', () => {
    render(<AnalysisSuccess analysisId={mockAnalysisId} />);
    
    const card = screen.getByRole('article');
    expect(card).toHaveClass('bg-green-50', 'dark:bg-green-900/20');
  });
});

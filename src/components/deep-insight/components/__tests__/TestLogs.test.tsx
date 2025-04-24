
import { render, screen } from '@testing-library/react';
import { TestLogs } from '../TestLogs';

describe('TestLogs', () => {
  const mockLogs = [
    '2024-04-24T10:00:00.000Z - Test started',
    '2024-04-24T10:00:01.000Z - Processing data',
    '2024-04-24T10:00:02.000Z - Test completed'
  ];

  it('should render all logs', () => {
    render(<TestLogs logs={mockLogs} />);
    
    mockLogs.forEach(log => {
      expect(screen.getByText(log)).toBeInTheDocument();
    });
  });

  it('should render with correct styling', () => {
    render(<TestLogs logs={mockLogs} />);
    
    const preElement = screen.getByRole('document');
    expect(preElement).toHaveClass('bg-muted', 'p-4', 'rounded-lg');
  });

  it('should render empty state correctly', () => {
    render(<TestLogs logs={[]} />);
    
    const preElement = screen.getByRole('document');
    expect(preElement).toBeInTheDocument();
    expect(preElement.textContent).toBe('');
  });
});

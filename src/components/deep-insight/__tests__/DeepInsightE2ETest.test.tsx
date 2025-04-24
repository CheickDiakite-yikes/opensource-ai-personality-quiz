
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DeepInsightE2ETest from '../DeepInsightE2ETest';
import { useAuth } from '@/contexts/AuthContext';

// Mock AuthContext
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

// Mock the hooks
vi.mock('../hooks/useTestLogs', () => ({
  useTestLogs: () => ({
    logs: ['Test log 1', 'Test log 2'],
    addLog: vi.fn(),
    clearLogs: vi.fn(),
  }),
}));

vi.mock('../hooks/useE2ETest', () => ({
  useE2ETest: () => ({
    isRunning: false,
    analysisId: null,
    runE2ETest: vi.fn(),
  }),
}));

describe('DeepInsightE2ETest', () => {
  beforeEach(() => {
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ user: { id: 'test-user' } });
  });

  it('renders the main test page correctly', () => {
    render(<DeepInsightE2ETest />);
    
    expect(screen.getByText('Deep Insight E2E Test')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent('Run E2E Test');
  });

  it('displays test logs', () => {
    render(<DeepInsightE2ETest />);
    
    expect(screen.getByText('Test log 1')).toBeInTheDocument();
    expect(screen.getByText('Test log 2')).toBeInTheDocument();
  });

  it('disables the run button when test is in progress', () => {
    vi.mock('../hooks/useE2ETest', () => ({
      useE2ETest: () => ({
        isRunning: true,
        analysisId: null,
        runE2ETest: vi.fn(),
      }),
    }), { virtual: true });

    render(<DeepInsightE2ETest />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('Running Test...');
  });

  it('shows success message when analysis is complete', () => {
    vi.mock('../hooks/useE2ETest', () => ({
      useE2ETest: () => ({
        isRunning: false,
        analysisId: 'test-analysis-123',
        runE2ETest: vi.fn(),
      }),
    }), { virtual: true });

    render(<DeepInsightE2ETest />);
    expect(screen.getByText('Test Completed Successfully')).toBeInTheDocument();
  });
});

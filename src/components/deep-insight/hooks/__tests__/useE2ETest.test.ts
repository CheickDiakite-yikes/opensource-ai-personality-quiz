
import { renderHook, act } from '@testing-library/react';
import { useE2ETest } from '../useE2ETest';
import { supabase } from '@/integrations/supabase/client';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: vi.fn().mockResolvedValue({ error: null }),
      select: vi.fn().mockResolvedValue({ data: [{ id: 'test-id' }], error: null }),
    })),
    functions: {
      invoke: vi.fn().mockResolvedValue({ 
        data: { id: 'analysis-123' }, 
        error: null 
      }),
    },
  },
}));

describe('useE2ETest', () => {
  const mockUser = { id: 'test-user-id' } as any;
  const mockAddLog = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with correct default values', () => {
    const { result } = renderHook(() => useE2ETest(mockUser, mockAddLog));
    
    expect(result.current.isRunning).toBe(false);
    expect(result.current.analysisId).toBeNull();
  });

  it('should handle test run success', async () => {
    const { result } = renderHook(() => useE2ETest(mockUser, mockAddLog));

    await act(async () => {
      await result.current.runE2ETest();
    });

    expect(result.current.analysisId).toBe('analysis-123');
    expect(result.current.isRunning).toBe(false);
    expect(mockAddLog).toHaveBeenCalledWith('Analysis completed successfully');
  });

  it('should handle errors when user is not authenticated', async () => {
    const { result } = renderHook(() => useE2ETest(null, mockAddLog));

    await act(async () => {
      await result.current.runE2ETest();
    });

    expect(mockAddLog).toHaveBeenCalledWith('ERROR: User not authenticated. Please sign in to run the test.');
    expect(result.current.isRunning).toBe(false);
  });
});

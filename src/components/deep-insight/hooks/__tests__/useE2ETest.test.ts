
import { renderHook, act } from '@testing-library/react';
import { useE2ETest } from '../useE2ETest';
import { supabase } from '@/integrations/supabase/client';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: vi.fn().mockResolvedValue({ error: null }),
      select: vi.fn().mockResolvedValue({ data: [{ id: 'test-id' }], error: null }),
      order: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
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
    // Mock timer functions
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should initialize with correct default values', () => {
    const { result } = renderHook(() => useE2ETest(mockUser, mockAddLog));
    
    expect(result.current.isRunning).toBe(false);
    expect(result.current.analysisId).toBeNull();
  });

  it('should handle test run success', async () => {
    // Mock successful database verification
    (supabase.from as any).mockImplementation(() => ({
      select: vi.fn().mockImplementation(() => ({
        eq: vi.fn().mockImplementation(() => ({
          limit: vi.fn().mockResolvedValue({ 
            data: [{ id: 'analysis-123', created_at: new Date().toISOString() }], 
            error: null 
          })
        }))
      })),
      insert: vi.fn().mockResolvedValue({ error: null })
    }));
    
    const { result } = renderHook(() => useE2ETest(mockUser, mockAddLog));

    await act(async () => {
      await result.current.runE2ETest();
      // Fast-forward timers to handle the setTimeout for database verification
      vi.runAllTimers();
    });

    expect(result.current.analysisId).toBe('analysis-123');
    expect(result.current.isRunning).toBe(false);
    expect(mockAddLog).toHaveBeenCalledWith('Analysis completed successfully');
    expect(mockAddLog).toHaveBeenCalledWith(expect.stringMatching(/verified in database/));
  });

  it('should handle errors when user is not authenticated', async () => {
    const { result } = renderHook(() => useE2ETest(null, mockAddLog));

    await act(async () => {
      await result.current.runE2ETest();
    });

    expect(mockAddLog).toHaveBeenCalledWith('ERROR: User not authenticated. Please sign in to run the test.');
    expect(result.current.isRunning).toBe(false);
  });
  
  it('should handle database verification with multiple attempts', async () => {
    // Mock first verification fail then alternative lookup success
    const mockFrom = vi.fn();
    const currentTime = new Date();
    const recentTime = new Date(currentTime.getTime() - 10000).toISOString(); // 10 seconds ago
    
    mockFrom.mockImplementationOnce(() => ({
      select: vi.fn().mockImplementation(() => ({
        eq: vi.fn().mockImplementation(() => ({
          limit: vi.fn().mockResolvedValue({ data: [], error: null })
        }))
      }))
    })).mockImplementationOnce(() => ({
      select: vi.fn().mockImplementation(() => ({
        eq: vi.fn().mockImplementation(() => ({
          limit: vi.fn().mockResolvedValue({ data: [], error: null })
        }))
      }))
    })).mockImplementationOnce(() => ({
      select: vi.fn().mockImplementation(() => ({
        eq: vi.fn().mockImplementation(() => ({
          order: vi.fn().mockImplementation(() => ({
            limit: vi.fn().mockResolvedValue({ 
              data: [{ id: 'different-id', created_at: recentTime }], 
              error: null 
            })
          }))
        }))
      }))
    })).mockImplementationOnce(() => ({
      insert: vi.fn().mockResolvedValue({ error: null })
    }));
    
    (supabase.from as any).mockImplementation(mockFrom);
    
    const { result } = renderHook(() => useE2ETest(mockUser, mockAddLog));

    await act(async () => {
      await result.current.runE2ETest();
      // Fast-forward timers to handle the setTimeout
      vi.runAllTimers();
    });

    expect(result.current.analysisId).toBe('analysis-123');
    expect(mockAddLog).toHaveBeenCalledWith('Warning: Direct lookup failed. Trying UUID lookup...');
    expect(mockAddLog).toHaveBeenCalledWith(expect.stringMatching(/Found most recent analysis/));
    expect(mockAddLog).toHaveBeenCalledWith(expect.stringMatching(/Analysis ID mismatch but recently created/));
  });
  
  it('should handle the case when no analysis is found at all', async () => {
    // Mock all verification attempts failing
    const mockFrom = vi.fn();
    mockFrom.mockImplementationOnce(() => ({
      select: vi.fn().mockImplementation(() => ({
        eq: vi.fn().mockImplementation(() => ({
          limit: vi.fn().mockResolvedValue({ data: [], error: null })
        }))
      }))
    })).mockImplementationOnce(() => ({
      select: vi.fn().mockImplementation(() => ({
        eq: vi.fn().mockImplementation(() => ({
          limit: vi.fn().mockResolvedValue({ data: [], error: null })
        }))
      }))
    })).mockImplementationOnce(() => ({
      select: vi.fn().mockImplementation(() => ({
        eq: vi.fn().mockImplementation(() => ({
          order: vi.fn().mockImplementation(() => ({
            limit: vi.fn().mockResolvedValue({ data: [], error: null })
          }))
        }))
      }))
    })).mockImplementationOnce(() => ({
      select: vi.fn().mockResolvedValue({ data: [], error: null })
    })).mockImplementationOnce(() => ({
      select: vi.fn().mockResolvedValue({ count: 0 })
    })).mockImplementationOnce(() => ({
      insert: vi.fn().mockResolvedValue({ error: null })
    }));
    
    (supabase.from as any).mockImplementation(mockFrom);
    
    const { result } = renderHook(() => useE2ETest(mockUser, mockAddLog));

    await act(async () => {
      await result.current.runE2ETest();
      // Fast-forward timers to handle the setTimeout
      vi.runAllTimers();
    });

    expect(result.current.analysisId).toBe('analysis-123');
    expect(mockAddLog).toHaveBeenCalledWith('Warning: Direct lookup failed. Trying UUID lookup...');
    expect(mockAddLog).toHaveBeenCalledWith(expect.stringMatching(/Warning: Analysis with ID .* not found in database/));
    expect(mockAddLog).toHaveBeenCalledWith(expect.stringMatching(/E2E test completed, but analysis verification failed/));
  });
  
  it('should handle string format conversion for UUID lookups', async () => {
    // Mock first verification failing with direct UUID but succeeding with string conversion
    const mockFrom = vi.fn();
    const currentTime = new Date().toISOString();
    
    mockFrom.mockImplementationOnce(() => ({
      select: vi.fn().mockImplementation(() => ({
        eq: vi.fn().mockImplementation(() => ({
          limit: vi.fn().mockResolvedValue({ data: [], error: null })
        }))
      }))
    })).mockImplementationOnce(() => ({
      select: vi.fn().mockImplementation(() => ({
        eq: vi.fn().mockImplementation(() => ({
          limit: vi.fn().mockResolvedValue({ 
            data: [{ id: 'analysis-123', created_at: currentTime }], 
            error: null 
          })
        }))
      }))
    })).mockImplementationOnce(() => ({
      insert: vi.fn().mockResolvedValue({ error: null })
    }));
    
    (supabase.from as any).mockImplementation(mockFrom);
    
    const { result } = renderHook(() => useE2ETest(mockUser, mockAddLog));

    await act(async () => {
      await result.current.runE2ETest();
      // Fast-forward timers to handle the setTimeout
      vi.runAllTimers();
    });

    expect(result.current.analysisId).toBe('analysis-123');
    expect(mockAddLog).toHaveBeenCalledWith(expect.stringMatching(/Analysis verified with string conversion/));
    expect(mockAddLog).toHaveBeenCalledWith(expect.stringMatching(/E2E test completed successfully with verified analysis/));
  });
});

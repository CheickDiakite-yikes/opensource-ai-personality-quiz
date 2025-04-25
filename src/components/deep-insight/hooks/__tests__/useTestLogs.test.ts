
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useTestLogs } from '../useTestLogs';

describe('useTestLogs', () => {
  it('should initialize with empty logs', () => {
    const { result } = renderHook(() => useTestLogs());
    expect(result.current.logs).toEqual([]);
  });

  it('should add new log messages', () => {
    const { result } = renderHook(() => useTestLogs());
    
    act(() => {
      result.current.addLog('Test message');
    });

    expect(result.current.logs).toHaveLength(1);
    expect(result.current.logs[0]).toContain('Test message');
  });

  it('should clear all logs', () => {
    const { result } = renderHook(() => useTestLogs());
    
    act(() => {
      result.current.addLog('Test message 1');
      result.current.addLog('Test message 2');
      result.current.clearLogs();
    });

    expect(result.current.logs).toEqual([]);
  });

  it('should include timestamp in log messages', () => {
    const { result } = renderHook(() => useTestLogs());
    
    act(() => {
      result.current.addLog('Test message');
    });

    const logMessage = result.current.logs[0];
    expect(logMessage).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
  });
});

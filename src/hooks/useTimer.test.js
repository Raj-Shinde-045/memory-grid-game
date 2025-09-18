import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import useTimer from './useTimer';

// Mock timers
vi.useFakeTimers();

describe('useTimer', () => {
  beforeEach(() => {
    vi.clearAllTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.useFakeTimers();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useTimer());

    expect(result.current.timeRemaining).toBe(0);
    expect(result.current.isRunning).toBe(false);
    expect(result.current.isPaused).toBe(false);
    expect(typeof result.current.startTimer).toBe('function');
    expect(typeof result.current.pauseTimer).toBe('function');
    expect(typeof result.current.resumeTimer).toBe('function');
    expect(typeof result.current.resetTimer).toBe('function');
    expect(typeof result.current.getFormattedTime).toBe('function');
    expect(typeof result.current.getProgress).toBe('function');
  });

  it('should start timer with correct duration', () => {
    const { result } = renderHook(() => useTimer());

    act(() => {
      result.current.startTimer(3000);
    });

    expect(result.current.timeRemaining).toBe(3000);
    expect(result.current.isRunning).toBe(true);
    expect(result.current.isPaused).toBe(false);
  });

  it('should countdown correctly', () => {
    const { result } = renderHook(() => useTimer());

    act(() => {
      result.current.startTimer(3000);
    });

    // Advance timer by 500ms
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current.timeRemaining).toBe(2500);
    expect(result.current.isRunning).toBe(true);
  });

  it('should call onComplete callback when timer reaches zero', () => {
    const onComplete = vi.fn();
    const { result } = renderHook(() => useTimer());

    act(() => {
      result.current.startTimer(1000, onComplete);
    });

    // Advance timer to completion
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.timeRemaining).toBe(0);
    expect(result.current.isRunning).toBe(false);
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('should pause timer correctly', () => {
    const { result } = renderHook(() => useTimer());

    act(() => {
      result.current.startTimer(3000);
    });

    // Advance timer by 500ms
    act(() => {
      vi.advanceTimersByTime(500);
    });

    act(() => {
      result.current.pauseTimer();
    });

    expect(result.current.timeRemaining).toBe(2500);
    expect(result.current.isRunning).toBe(false);
    expect(result.current.isPaused).toBe(true);

    // Advance timer while paused - should not change
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.timeRemaining).toBe(2500);
  });

  it('should resume timer correctly', () => {
    const { result } = renderHook(() => useTimer());

    act(() => {
      result.current.startTimer(3000);
    });

    // Advance and pause
    act(() => {
      vi.advanceTimersByTime(500);
    });

    act(() => {
      result.current.pauseTimer();
    });

    // Resume
    act(() => {
      result.current.resumeTimer();
    });

    expect(result.current.timeRemaining).toBe(2500);
    expect(result.current.isRunning).toBe(true);
    expect(result.current.isPaused).toBe(false);

    // Continue countdown
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current.timeRemaining).toBe(2000);
  });

  it('should reset timer correctly', () => {
    const { result } = renderHook(() => useTimer());

    act(() => {
      result.current.startTimer(3000);
    });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    act(() => {
      result.current.resetTimer();
    });

    expect(result.current.timeRemaining).toBe(0);
    expect(result.current.isRunning).toBe(false);
    expect(result.current.isPaused).toBe(false);
  });

  it('should format time correctly', () => {
    const { result } = renderHook(() => useTimer());

    // Test various time values
    act(() => {
      result.current.startTimer(3200);
    });
    expect(result.current.getFormattedTime()).toBe('3.2s');

    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current.getFormattedTime()).toBe('3.0s');

    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current.getFormattedTime()).toBe('2.5s');

    act(() => {
      vi.advanceTimersByTime(1400);
    });
    expect(result.current.getFormattedTime()).toBe('1.1s');
  });

  it('should calculate progress correctly', () => {
    const { result } = renderHook(() => useTimer());

    act(() => {
      result.current.startTimer(2000);
    });

    expect(result.current.getProgress(2000)).toBe(100);

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current.getProgress(2000)).toBe(75);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.getProgress(2000)).toBe(25);

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current.getProgress(2000)).toBe(0);
  });

  it('should handle invalid duration gracefully', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { result } = renderHook(() => useTimer());

    act(() => {
      result.current.startTimer(-1000);
    });

    expect(result.current.timeRemaining).toBe(0);
    expect(result.current.isRunning).toBe(false);
    expect(consoleSpy).toHaveBeenCalledWith('Timer duration must be a positive number');

    act(() => {
      result.current.startTimer(0);
    });

    expect(result.current.timeRemaining).toBe(0);
    expect(result.current.isRunning).toBe(false);

    consoleSpy.mockRestore();
  });

  it('should not pause when not running', () => {
    const { result } = renderHook(() => useTimer());

    act(() => {
      result.current.pauseTimer();
    });

    expect(result.current.isRunning).toBe(false);
    expect(result.current.isPaused).toBe(false);
  });

  it('should not resume when not paused', () => {
    const { result } = renderHook(() => useTimer());

    act(() => {
      result.current.startTimer(3000);
    });

    act(() => {
      result.current.resumeTimer();
    });

    expect(result.current.isRunning).toBe(true);
    expect(result.current.isPaused).toBe(false);
  });

  it('should handle multiple start calls correctly', () => {
    const onComplete1 = vi.fn();
    const onComplete2 = vi.fn();
    const { result } = renderHook(() => useTimer());

    act(() => {
      result.current.startTimer(3000, onComplete1);
    });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Start new timer - should clear previous
    act(() => {
      result.current.startTimer(2000, onComplete2);
    });

    expect(result.current.timeRemaining).toBe(2000);

    // Complete second timer
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(onComplete1).not.toHaveBeenCalled();
    expect(onComplete2).toHaveBeenCalledTimes(1);
  });

  it('should cleanup interval on unmount', () => {
    const { result, unmount } = renderHook(() => useTimer());

    act(() => {
      result.current.startTimer(3000);
    });

    expect(result.current.isRunning).toBe(true);

    unmount();

    // Timer should be cleaned up
    expect(vi.getTimerCount()).toBe(0);
  });
});
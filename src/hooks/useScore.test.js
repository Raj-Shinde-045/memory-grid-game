import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import useScore from './useScore';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('useScore', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  describe('initialization', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => useScore());

      expect(result.current.currentScore).toBe(0);
      expect(result.current.highScore).toBe(0);
    });

    it('should load high score from localStorage on mount', () => {
      localStorageMock.getItem.mockReturnValue('500');
      
      const { result } = renderHook(() => useScore());

      expect(localStorageMock.getItem).toHaveBeenCalledWith('memory-grid-game-high-score');
      expect(result.current.highScore).toBe(500);
    });

    it('should handle invalid high score in localStorage', () => {
      localStorageMock.getItem.mockReturnValue('invalid');
      
      const { result } = renderHook(() => useScore());

      expect(result.current.highScore).toBe(0);
    });

    it('should handle negative high score in localStorage', () => {
      localStorageMock.getItem.mockReturnValue('-100');
      
      const { result } = renderHook(() => useScore());

      expect(result.current.highScore).toBe(0);
    });

    it('should handle localStorage errors gracefully', () => {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });
      
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      const { result } = renderHook(() => useScore());

      expect(result.current.highScore).toBe(0);
      expect(consoleSpy).toHaveBeenCalledWith('Failed to load high score from localStorage:', expect.any(Error));
      
      consoleSpy.mockRestore();
    });
  });

  describe('calculateLevelScore', () => {
    it('should calculate score based on level', () => {
      const { result } = renderHook(() => useScore());

      expect(result.current.calculateLevelScore(1)).toBe(100);
      expect(result.current.calculateLevelScore(2)).toBe(200);
      expect(result.current.calculateLevelScore(5)).toBe(500);
    });

    it('should include time bonus in calculation', () => {
      const { result } = renderHook(() => useScore());

      expect(result.current.calculateLevelScore(1, 50)).toBe(150);
      expect(result.current.calculateLevelScore(3, 25)).toBe(325);
    });

    it('should handle invalid level input', () => {
      const { result } = renderHook(() => useScore());
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      expect(result.current.calculateLevelScore(0)).toBe(0);
      expect(result.current.calculateLevelScore(-1)).toBe(0);
      expect(result.current.calculateLevelScore('invalid')).toBe(0);

      expect(consoleSpy).toHaveBeenCalledTimes(3);
      consoleSpy.mockRestore();
    });

    it('should handle invalid time bonus input', () => {
      const { result } = renderHook(() => useScore());
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      expect(result.current.calculateLevelScore(1, -10)).toBe(100);
      expect(result.current.calculateLevelScore(1, 'invalid')).toBe(100);

      expect(consoleSpy).toHaveBeenCalledTimes(2);
      consoleSpy.mockRestore();
    });
  });

  describe('addScore', () => {
    it('should add points to current score', () => {
      const { result } = renderHook(() => useScore());

      act(() => {
        result.current.addScore(100);
      });

      expect(result.current.currentScore).toBe(100);

      act(() => {
        result.current.addScore(50);
      });

      expect(result.current.currentScore).toBe(150);
    });

    it('should update high score when current score exceeds it', () => {
      const { result } = renderHook(() => useScore());

      act(() => {
        result.current.addScore(300);
      });

      expect(result.current.currentScore).toBe(300);
      expect(result.current.highScore).toBe(300);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('memory-grid-game-high-score', '300');
    });

    it('should not update high score when current score is lower', () => {
      localStorageMock.getItem.mockReturnValue('500');
      const { result } = renderHook(() => useScore());

      act(() => {
        result.current.addScore(200);
      });

      expect(result.current.currentScore).toBe(200);
      expect(result.current.highScore).toBe(500);
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });

    it('should handle invalid points input', () => {
      const { result } = renderHook(() => useScore());
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      act(() => {
        result.current.addScore(-10);
      });

      act(() => {
        result.current.addScore('invalid');
      });

      expect(result.current.currentScore).toBe(0);
      expect(consoleSpy).toHaveBeenCalledTimes(2);
      consoleSpy.mockRestore();
    });

    it('should handle localStorage save errors gracefully', () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });
      
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const { result } = renderHook(() => useScore());

      act(() => {
        result.current.addScore(100);
      });

      expect(result.current.currentScore).toBe(100);
      expect(result.current.highScore).toBe(100);
      expect(consoleSpy).toHaveBeenCalledWith('Failed to save high score to localStorage:', expect.any(Error));
      
      consoleSpy.mockRestore();
    });
  });

  describe('addLevelScore', () => {
    it('should calculate and add level score', () => {
      const { result } = renderHook(() => useScore());

      act(() => {
        result.current.addLevelScore(2);
      });

      expect(result.current.currentScore).toBe(200);
    });

    it('should calculate and add level score with time bonus', () => {
      const { result } = renderHook(() => useScore());

      act(() => {
        result.current.addLevelScore(3, 75);
      });

      expect(result.current.currentScore).toBe(375);
    });

    it('should return the calculated score', () => {
      const { result } = renderHook(() => useScore());
      let returnedScore;

      act(() => {
        returnedScore = result.current.addLevelScore(4, 25);
      });

      expect(returnedScore).toBe(425);
      expect(result.current.currentScore).toBe(425);
    });
  });

  describe('resetCurrentScore', () => {
    it('should reset current score to 0', () => {
      const { result } = renderHook(() => useScore());

      act(() => {
        result.current.addScore(300);
      });

      expect(result.current.currentScore).toBe(300);

      act(() => {
        result.current.resetCurrentScore();
      });

      expect(result.current.currentScore).toBe(0);
      expect(result.current.highScore).toBe(300); // High score should remain
    });
  });

  describe('setHighScore', () => {
    it('should manually set high score', () => {
      const { result } = renderHook(() => useScore());

      act(() => {
        result.current.setHighScore(1000);
      });

      expect(result.current.highScore).toBe(1000);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('memory-grid-game-high-score', '1000');
    });

    it('should handle invalid high score input', () => {
      const { result } = renderHook(() => useScore());
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      act(() => {
        result.current.setHighScore(-100);
      });

      act(() => {
        result.current.setHighScore('invalid');
      });

      expect(result.current.highScore).toBe(0);
      expect(consoleSpy).toHaveBeenCalledTimes(2);
      consoleSpy.mockRestore();
    });
  });

  describe('isNewHighScore', () => {
    it('should return true when current score equals high score and is greater than 0', () => {
      const { result } = renderHook(() => useScore());

      act(() => {
        result.current.addScore(250);
      });

      expect(result.current.isNewHighScore()).toBe(true);
    });

    it('should return false when current score is 0', () => {
      const { result } = renderHook(() => useScore());

      expect(result.current.isNewHighScore()).toBe(false);
    });

    it('should return false when current score is less than high score', () => {
      localStorageMock.getItem.mockReturnValue('500');
      const { result } = renderHook(() => useScore());

      act(() => {
        result.current.addScore(200);
      });

      expect(result.current.isNewHighScore()).toBe(false);
    });

    it('should return false after resetting current score', () => {
      const { result } = renderHook(() => useScore());

      act(() => {
        result.current.addScore(300);
      });

      expect(result.current.isNewHighScore()).toBe(true);

      act(() => {
        result.current.resetCurrentScore();
      });

      expect(result.current.isNewHighScore()).toBe(false);
    });
  });
});
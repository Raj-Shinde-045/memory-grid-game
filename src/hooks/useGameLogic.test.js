import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import useGameLogic from './useGameLogic';

describe('useGameLogic', () => {
  let mockGameState;
  let mockGameActions;

  beforeEach(() => {
    mockGameState = {
      currentSequence: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      playerSequence: [],
      gameStatus: 'playing',
      currentLevel: 1,
      gridSize: 3
    };

    mockGameActions = {
      addToPlayerSequence: vi.fn(),
      setGameStatus: vi.fn(),
      updateScore: vi.fn(),
      advanceLevel: vi.fn(),
      resetPlayerSequence: vi.fn()
    };
  });

  describe('validateCellClick', () => {
    it('should return invalid when game is not in playing state', () => {
      mockGameState.gameStatus = 'preview';
      const { result } = renderHook(() => useGameLogic(mockGameState, mockGameActions));

      const validation = result.current.validateCellClick(1);

      expect(validation.isValid).toBe(false);
      expect(validation.reason).toBe('Game not in playing state');
    });

    it('should return valid for correct first click', () => {
      const { result } = renderHook(() => useGameLogic(mockGameState, mockGameActions));

      const validation = result.current.validateCellClick(1);

      expect(validation.isValid).toBe(true);
      expect(validation.reason).toBe('Correct');
    });

    it('should return invalid for incorrect first click', () => {
      const { result } = renderHook(() => useGameLogic(mockGameState, mockGameActions));

      const validation = result.current.validateCellClick(2);

      expect(validation.isValid).toBe(false);
      expect(validation.reason).toBe('Expected 1, got 2');
    });

    it('should validate correct sequence progression', () => {
      mockGameState.playerSequence = [1, 2];
      const { result } = renderHook(() => useGameLogic(mockGameState, mockGameActions));

      const validation = result.current.validateCellClick(3);

      expect(validation.isValid).toBe(true);
      expect(validation.reason).toBe('Correct');
    });

    it('should invalidate incorrect sequence progression', () => {
      mockGameState.playerSequence = [1, 2];
      const { result } = renderHook(() => useGameLogic(mockGameState, mockGameActions));

      const validation = result.current.validateCellClick(5);

      expect(validation.isValid).toBe(false);
      expect(validation.reason).toBe('Expected 3, got 5');
    });
  });

  describe('handleCellClick', () => {
    it('should handle correct first click', () => {
      const { result } = renderHook(() => useGameLogic(mockGameState, mockGameActions));

      act(() => {
        const clickResult = result.current.handleCellClick(1);
        expect(clickResult.success).toBe(true);
        expect(clickResult.gameOver).toBe(false);
        expect(clickResult.levelComplete).toBe(false);
      });

      expect(mockGameActions.addToPlayerSequence).toHaveBeenCalledWith(1);
      expect(mockGameActions.setGameStatus).not.toHaveBeenCalled();
    });

    it('should handle incorrect click and trigger game over', () => {
      const { result } = renderHook(() => useGameLogic(mockGameState, mockGameActions));

      act(() => {
        const clickResult = result.current.handleCellClick(2);
        expect(clickResult.success).toBe(false);
        expect(clickResult.gameOver).toBe(true);
        expect(clickResult.reason).toBe('Expected 1, got 2');
      });

      expect(mockGameActions.setGameStatus).toHaveBeenCalledWith('gameover');
      expect(mockGameActions.addToPlayerSequence).not.toHaveBeenCalled();
    });

    it('should handle level completion', () => {
      // Set up state where player has clicked 8 out of 9 cells
      mockGameState.playerSequence = [1, 2, 3, 4, 5, 6, 7, 8];
      const { result } = renderHook(() => useGameLogic(mockGameState, mockGameActions));

      act(() => {
        const clickResult = result.current.handleCellClick(9);
        expect(clickResult.success).toBe(true);
        expect(clickResult.levelComplete).toBe(true);
        expect(clickResult.score).toBe(190); // Base score calculation for level 1
      });

      expect(mockGameActions.addToPlayerSequence).toHaveBeenCalledWith(9);
      expect(mockGameActions.updateScore).toHaveBeenCalledWith(190);
      expect(mockGameActions.setGameStatus).toHaveBeenCalledWith('levelcomplete');
    });

    it('should not allow clicks when game is not in playing state', () => {
      mockGameState.gameStatus = 'preview';
      const { result } = renderHook(() => useGameLogic(mockGameState, mockGameActions));

      act(() => {
        const clickResult = result.current.handleCellClick(1);
        expect(clickResult.success).toBe(false);
        expect(clickResult.gameOver).toBe(true);
      });

      expect(mockGameActions.setGameStatus).toHaveBeenCalledWith('gameover');
    });
  });

  describe('calculateLevelScore', () => {
    it('should calculate correct score for level 1', () => {
      const { result } = renderHook(() => useGameLogic(mockGameState, mockGameActions));

      const score = result.current.calculateLevelScore(1);
      
      // Base score (100) * level (1) + grid size bonus (3*3*10 = 90) = 190
      expect(score).toBe(190);
    });

    it('should calculate correct score for level 2', () => {
      const { result } = renderHook(() => useGameLogic(mockGameState, mockGameActions));

      const score = result.current.calculateLevelScore(2);
      
      // Base score (100) * level (2) + grid size bonus (4*4*10 = 160) = 360
      expect(score).toBe(360);
    });

    it('should calculate correct score for level 3', () => {
      const { result } = renderHook(() => useGameLogic(mockGameState, mockGameActions));

      const score = result.current.calculateLevelScore(3);
      
      // Base score (100) * level (3) + grid size bonus (5*5*10 = 250) = 550
      expect(score).toBe(550);
    });
  });

  describe('isCellClickable', () => {
    it('should return false when game is not in playing state', () => {
      mockGameState.gameStatus = 'preview';
      const { result } = renderHook(() => useGameLogic(mockGameState, mockGameActions));

      expect(result.current.isCellClickable(1)).toBe(false);
    });

    it('should return true for the next expected cell', () => {
      const { result } = renderHook(() => useGameLogic(mockGameState, mockGameActions));

      expect(result.current.isCellClickable(1)).toBe(true);
    });

    it('should return false for cells that are not next in sequence', () => {
      const { result } = renderHook(() => useGameLogic(mockGameState, mockGameActions));

      expect(result.current.isCellClickable(2)).toBe(false);
      expect(result.current.isCellClickable(5)).toBe(false);
    });

    it('should return true for correct next cell after some clicks', () => {
      mockGameState.playerSequence = [1, 2, 3];
      const { result } = renderHook(() => useGameLogic(mockGameState, mockGameActions));

      expect(result.current.isCellClickable(4)).toBe(true);
      expect(result.current.isCellClickable(1)).toBe(false);
      expect(result.current.isCellClickable(5)).toBe(false);
    });
  });

  describe('isCellClicked', () => {
    it('should return false for unclicked cells', () => {
      const { result } = renderHook(() => useGameLogic(mockGameState, mockGameActions));

      expect(result.current.isCellClicked(1)).toBe(false);
      expect(result.current.isCellClicked(5)).toBe(false);
    });

    it('should return true for clicked cells', () => {
      mockGameState.playerSequence = [1, 2, 3];
      const { result } = renderHook(() => useGameLogic(mockGameState, mockGameActions));

      expect(result.current.isCellClicked(1)).toBe(true);
      expect(result.current.isCellClicked(2)).toBe(true);
      expect(result.current.isCellClicked(3)).toBe(true);
      expect(result.current.isCellClicked(4)).toBe(false);
    });
  });

  describe('startPlaying', () => {
    it('should reset player sequence and set status to playing', () => {
      const { result } = renderHook(() => useGameLogic(mockGameState, mockGameActions));

      act(() => {
        result.current.startPlaying();
      });

      expect(mockGameActions.resetPlayerSequence).toHaveBeenCalled();
      expect(mockGameActions.setGameStatus).toHaveBeenCalledWith('playing');
    });
  });

  describe('handleLevelAdvancement', () => {
    it('should call advanceLevel action', () => {
      const { result } = renderHook(() => useGameLogic(mockGameState, mockGameActions));

      act(() => {
        result.current.handleLevelAdvancement();
      });

      expect(mockGameActions.advanceLevel).toHaveBeenCalled();
    });
  });

  describe('resetGameLogic', () => {
    it('should reset player sequence', () => {
      const { result } = renderHook(() => useGameLogic(mockGameState, mockGameActions));

      act(() => {
        result.current.resetGameLogic();
      });

      expect(mockGameActions.resetPlayerSequence).toHaveBeenCalled();
    });
  });

  describe('integration scenarios', () => {
    it('should handle complete game sequence correctly', () => {
      const { result, rerender } = renderHook(() => useGameLogic(mockGameState, mockGameActions));

      // Click cells 1-8 in sequence
      for (let i = 1; i <= 8; i++) {
        mockGameState.playerSequence = Array.from({ length: i - 1 }, (_, idx) => idx + 1);
        rerender();
        
        act(() => {
          const clickResult = result.current.handleCellClick(i);
          expect(clickResult.success).toBe(true);
          expect(clickResult.levelComplete).toBe(false);
        });
      }

      // Final click should complete the level
      mockGameState.playerSequence = [1, 2, 3, 4, 5, 6, 7, 8];
      rerender();
      act(() => {
        const clickResult = result.current.handleCellClick(9);
        expect(clickResult.success).toBe(true);
        expect(clickResult.levelComplete).toBe(true);
      });

      expect(mockGameActions.setGameStatus).toHaveBeenCalledWith('levelcomplete');
    });

    it('should handle game over scenario correctly', () => {
      const { result, rerender } = renderHook(() => useGameLogic(mockGameState, mockGameActions));

      // Click correct first cell
      act(() => {
        const clickResult = result.current.handleCellClick(1);
        expect(clickResult.success).toBe(true);
      });

      // Click incorrect second cell
      mockGameState.playerSequence = [1];
      rerender();
      act(() => {
        const clickResult = result.current.handleCellClick(3); // Should be 2
        expect(clickResult.success).toBe(false);
        expect(clickResult.gameOver).toBe(true);
      });

      expect(mockGameActions.setGameStatus).toHaveBeenCalledWith('gameover');
    });
  });
});
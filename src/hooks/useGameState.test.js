import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import useGameState from './useGameState';

describe('useGameState', () => {
  let result;

  beforeEach(() => {
    // Mock console.warn to avoid noise in tests
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    
    const { result: hookResult } = renderHook(() => useGameState());
    result = hookResult;
  });

  describe('Initial State', () => {
    it('should initialize with correct default values', () => {
      expect(result.current.gameState).toEqual({
        currentLevel: 1,
        currentScore: 0,
        highScore: 0,
        gridSize: 3,
        gameMode: 'numbers',
        gameStatus: 'menu',
        currentSequence: [],
        playerSequence: [],
        gridData: []
      });
    });
  });

  describe('startGame', () => {
    it('should reset game state and set status to preview', () => {
      // First modify some state
      act(() => {
        result.current.updateScore(100);
        result.current.advanceLevel();
      });

      // Then start a new game
      act(() => {
        result.current.startGame();
      });

      expect(result.current.gameState).toEqual(
        expect.objectContaining({
          currentLevel: 1,
          currentScore: 0,
          gridSize: 3,
          gameStatus: 'preview',
          currentSequence: [],
          playerSequence: [],
          gridData: []
        })
      );
    });
  });

  describe('advanceLevel', () => {
    it('should increment level and grid size', () => {
      act(() => {
        result.current.advanceLevel();
      });

      expect(result.current.gameState.currentLevel).toBe(2);
      expect(result.current.gameState.gridSize).toBe(4);
      expect(result.current.gameState.gameStatus).toBe('preview');
    });

    it('should reset sequences and grid data', () => {
      // Set some data first
      act(() => {
        result.current.setCurrentSequence([1, 2, 3]);
        result.current.addToPlayerSequence(1);
        result.current.setGridData([1, 2, 3, 4]);
      });

      act(() => {
        result.current.advanceLevel();
      });

      expect(result.current.gameState.currentSequence).toEqual([]);
      expect(result.current.gameState.playerSequence).toEqual([]);
      expect(result.current.gameState.gridData).toEqual([]);
    });
  });

  describe('updateScore', () => {
    it('should add points to current score', () => {
      act(() => {
        result.current.updateScore(50);
      });

      expect(result.current.gameState.currentScore).toBe(50);

      act(() => {
        result.current.updateScore(25);
      });

      expect(result.current.gameState.currentScore).toBe(75);
    });

    it('should update high score when current score exceeds it', () => {
      act(() => {
        result.current.updateScore(100);
      });

      expect(result.current.gameState.highScore).toBe(100);
      expect(result.current.gameState.currentScore).toBe(100);
    });

    it('should not decrease high score', () => {
      act(() => {
        result.current.updateScore(100);
        result.current.resetGame();
        result.current.updateScore(50);
      });

      expect(result.current.gameState.highScore).toBe(100);
      expect(result.current.gameState.currentScore).toBe(50);
    });
  });

  describe('setGameStatus', () => {
    it('should update game status with valid values', () => {
      const validStatuses = ['menu', 'preview', 'playing', 'gameover', 'levelcomplete'];

      validStatuses.forEach(status => {
        act(() => {
          result.current.setGameStatus(status);
        });
        expect(result.current.gameState.gameStatus).toBe(status);
      });
    });

    it('should warn and not update with invalid status', () => {
      const initialStatus = result.current.gameState.gameStatus;

      act(() => {
        result.current.setGameStatus('invalid');
      });

      expect(console.warn).toHaveBeenCalledWith('Invalid game status: invalid');
      expect(result.current.gameState.gameStatus).toBe(initialStatus);
    });
  });

  describe('setGridData', () => {
    it('should update grid data with valid array', () => {
      const gridData = [1, 2, 3, 4, 5, 6, 7, 8, 9];

      act(() => {
        result.current.setGridData(gridData);
      });

      expect(result.current.gameState.gridData).toEqual(gridData);
      // Should be a new array (not the same reference)
      expect(result.current.gameState.gridData).not.toBe(gridData);
    });

    it('should warn and not update with non-array', () => {
      const initialGridData = result.current.gameState.gridData;

      act(() => {
        result.current.setGridData('not an array');
      });

      expect(console.warn).toHaveBeenCalledWith('Grid data must be an array');
      expect(result.current.gameState.gridData).toBe(initialGridData);
    });
  });

  describe('setCurrentSequence', () => {
    it('should update current sequence with valid array', () => {
      const sequence = [1, 2, 3, 4];

      act(() => {
        result.current.setCurrentSequence(sequence);
      });

      expect(result.current.gameState.currentSequence).toEqual(sequence);
      // Should be a new array (not the same reference)
      expect(result.current.gameState.currentSequence).not.toBe(sequence);
    });

    it('should warn and not update with non-array', () => {
      const initialSequence = result.current.gameState.currentSequence;

      act(() => {
        result.current.setCurrentSequence('not an array');
      });

      expect(console.warn).toHaveBeenCalledWith('Sequence must be an array');
      expect(result.current.gameState.currentSequence).toBe(initialSequence);
    });
  });

  describe('addToPlayerSequence', () => {
    it('should add values to player sequence', () => {
      act(() => {
        result.current.addToPlayerSequence(1);
      });

      expect(result.current.gameState.playerSequence).toEqual([1]);

      act(() => {
        result.current.addToPlayerSequence(2);
      });

      expect(result.current.gameState.playerSequence).toEqual([1, 2]);
    });
  });

  describe('resetPlayerSequence', () => {
    it('should clear player sequence', () => {
      // Add some values first
      act(() => {
        result.current.addToPlayerSequence(1);
        result.current.addToPlayerSequence(2);
      });

      expect(result.current.gameState.playerSequence).toEqual([1, 2]);

      act(() => {
        result.current.resetPlayerSequence();
      });

      expect(result.current.gameState.playerSequence).toEqual([]);
    });
  });

  describe('toggleGameMode', () => {
    it('should toggle between numbers and emojis', () => {
      expect(result.current.gameState.gameMode).toBe('numbers');

      act(() => {
        result.current.toggleGameMode();
      });

      expect(result.current.gameState.gameMode).toBe('emojis');

      act(() => {
        result.current.toggleGameMode();
      });

      expect(result.current.gameState.gameMode).toBe('numbers');
    });
  });

  describe('resetGame', () => {
    it('should reset all game state except high score', () => {
      // Set up some state
      act(() => {
        result.current.updateScore(100);
        result.current.advanceLevel();
        result.current.setGameStatus('playing');
        result.current.setCurrentSequence([1, 2, 3]);
        result.current.addToPlayerSequence(1);
        result.current.setGridData([1, 2, 3, 4]);
      });

      const highScore = result.current.gameState.highScore;

      act(() => {
        result.current.resetGame();
      });

      expect(result.current.gameState).toEqual({
        currentLevel: 1,
        currentScore: 0,
        highScore: highScore, // Should preserve high score
        gridSize: 3,
        gameMode: 'numbers',
        gameStatus: 'menu',
        currentSequence: [],
        playerSequence: [],
        gridData: []
      });
    });
  });

  describe('setHighScore', () => {
    it('should update high score with valid number', () => {
      act(() => {
        result.current.setHighScore(150);
      });

      expect(result.current.gameState.highScore).toBe(150);
    });

    it('should only increase high score, not decrease', () => {
      act(() => {
        result.current.setHighScore(200);
        result.current.setHighScore(100);
      });

      expect(result.current.gameState.highScore).toBe(200);
    });

    it('should warn and not update with invalid values', () => {
      const initialHighScore = result.current.gameState.highScore;

      act(() => {
        result.current.setHighScore('not a number');
      });

      expect(console.warn).toHaveBeenCalledWith('High score must be a non-negative number');
      expect(result.current.gameState.highScore).toBe(initialHighScore);

      act(() => {
        result.current.setHighScore(-10);
      });

      expect(console.warn).toHaveBeenCalledWith('High score must be a non-negative number');
      expect(result.current.gameState.highScore).toBe(initialHighScore);
    });
  });

  describe('State Transitions', () => {
    it('should handle complete game flow state transitions', () => {
      // Start game
      act(() => {
        result.current.startGame();
      });
      expect(result.current.gameState.gameStatus).toBe('preview');

      // Move to playing
      act(() => {
        result.current.setGameStatus('playing');
      });
      expect(result.current.gameState.gameStatus).toBe('playing');

      // Complete level
      act(() => {
        result.current.setGameStatus('levelcomplete');
        result.current.updateScore(100);
      });
      expect(result.current.gameState.gameStatus).toBe('levelcomplete');
      expect(result.current.gameState.currentScore).toBe(100);

      // Advance level
      act(() => {
        result.current.advanceLevel();
      });
      expect(result.current.gameState.currentLevel).toBe(2);
      expect(result.current.gameState.gameStatus).toBe('preview');

      // Game over
      act(() => {
        result.current.setGameStatus('gameover');
      });
      expect(result.current.gameState.gameStatus).toBe('gameover');
    });

    it('should maintain data integrity during state changes', () => {
      // Set up initial state
      act(() => {
        result.current.setCurrentSequence([1, 2, 3]);
        result.current.addToPlayerSequence(1);
        result.current.addToPlayerSequence(2);
        result.current.setGridData([3, 1, 2]);
      });

      // Verify state is set correctly
      expect(result.current.gameState.currentSequence).toEqual([1, 2, 3]);
      expect(result.current.gameState.playerSequence).toEqual([1, 2]);
      expect(result.current.gameState.gridData).toEqual([3, 1, 2]);

      // Change game status - should not affect other data
      act(() => {
        result.current.setGameStatus('playing');
      });

      expect(result.current.gameState.currentSequence).toEqual([1, 2, 3]);
      expect(result.current.gameState.playerSequence).toEqual([1, 2]);
      expect(result.current.gameState.gridData).toEqual([3, 1, 2]);
    });
  });
});
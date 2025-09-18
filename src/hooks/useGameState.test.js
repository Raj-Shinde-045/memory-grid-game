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
        previewTime: 3000,
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
          previewTime: 3000,
          gameStatus: 'preview',
          currentSequence: [],
          playerSequence: [],
          gridData: []
        })
      );
    });
  });

  describe('calculatePreviewTime', () => {
    it('should return correct preview times for different levels', () => {
      // Level 1: 3 seconds
      expect(result.current.calculatePreviewTime(1)).toBe(3000);
      
      // Level 2: 2 seconds
      expect(result.current.calculatePreviewTime(2)).toBe(2000);
      
      // Level 3 and higher: 1 second (minimum)
      expect(result.current.calculatePreviewTime(3)).toBe(1000);
      expect(result.current.calculatePreviewTime(5)).toBe(1000);
      expect(result.current.calculatePreviewTime(10)).toBe(1000);
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

    it('should update preview time based on level progression', () => {
      // Level 1 -> 2: 3000ms -> 2000ms
      act(() => {
        result.current.advanceLevel();
      });

      expect(result.current.gameState.currentLevel).toBe(2);
      expect(result.current.gameState.previewTime).toBe(2000);

      // Level 2 -> 3: 2000ms -> 1000ms
      act(() => {
        result.current.advanceLevel();
      });

      expect(result.current.gameState.currentLevel).toBe(3);
      expect(result.current.gameState.previewTime).toBe(1000);

      // Level 3 -> 4: should stay at 1000ms (minimum)
      act(() => {
        result.current.advanceLevel();
      });

      expect(result.current.gameState.currentLevel).toBe(4);
      expect(result.current.gameState.previewTime).toBe(1000);
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
        previewTime: 3000,
        gameMode: 'numbers',
        gameStatus: 'menu',
        currentSequence: [],
        playerSequence: [],
        gridData: []
      });
    });

    it('should meet requirement 6.2: reset to level 1 with 3×3 grid', () => {
      // Advance to higher level
      act(() => {
        result.current.advanceLevel();
        result.current.advanceLevel();
      });

      expect(result.current.gameState.currentLevel).toBe(3);
      expect(result.current.gameState.gridSize).toBe(5);

      act(() => {
        result.current.resetGame();
      });

      expect(result.current.gameState.currentLevel).toBe(1);
      expect(result.current.gameState.gridSize).toBe(3);
    });

    it('should meet requirement 6.4: reset current score to 0 but preserve high score', () => {
      // Set up high score
      act(() => {
        result.current.updateScore(500);
      });

      expect(result.current.gameState.currentScore).toBe(500);
      expect(result.current.gameState.highScore).toBe(500);

      // Add more score
      act(() => {
        result.current.updateScore(200);
      });

      expect(result.current.gameState.currentScore).toBe(700);
      expect(result.current.gameState.highScore).toBe(700);

      // Reset game
      act(() => {
        result.current.resetGame();
      });

      expect(result.current.gameState.currentScore).toBe(0);
      expect(result.current.gameState.highScore).toBe(700); // Preserved
    });

    it('should reset game mode to numbers', () => {
      // Switch to emoji mode
      act(() => {
        result.current.toggleGameMode();
      });

      expect(result.current.gameState.gameMode).toBe('emojis');

      act(() => {
        result.current.resetGame();
      });

      expect(result.current.gameState.gameMode).toBe('numbers');
    });

    it('should clear all sequences and grid data', () => {
      // Set up sequences and grid data
      act(() => {
        result.current.setCurrentSequence([5, 3, 1, 4, 2]);
        result.current.addToPlayerSequence(5);
        result.current.addToPlayerSequence(3);
        result.current.setGridData([5, 3, 1, 4, 2]);
      });

      expect(result.current.gameState.currentSequence).toHaveLength(5);
      expect(result.current.gameState.playerSequence).toHaveLength(2);
      expect(result.current.gameState.gridData).toHaveLength(5);

      act(() => {
        result.current.resetGame();
      });

      expect(result.current.gameState.currentSequence).toEqual([]);
      expect(result.current.gameState.playerSequence).toEqual([]);
      expect(result.current.gameState.gridData).toEqual([]);
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

  describe('Level Progression Requirements', () => {
    it('should meet requirement 3.1: 3×3 grid advances to 4×4', () => {
      // Start with 3×3 grid (level 1)
      expect(result.current.gameState.currentLevel).toBe(1);
      expect(result.current.gameState.gridSize).toBe(3);

      // Complete level and advance
      act(() => {
        result.current.advanceLevel();
      });

      // Should now be 4×4 grid (level 2)
      expect(result.current.gameState.currentLevel).toBe(2);
      expect(result.current.gameState.gridSize).toBe(4);
    });

    it('should meet requirement 3.2: grid size increases by 1 each level', () => {
      const levels = [1, 2, 3, 4, 5];
      const expectedGridSizes = [3, 4, 5, 6, 7];

      levels.forEach((level, index) => {
        if (index > 0) {
          act(() => {
            result.current.advanceLevel();
          });
        }
        expect(result.current.gameState.currentLevel).toBe(level);
        expect(result.current.gameState.gridSize).toBe(expectedGridSizes[index]);
      });
    });

    it('should meet requirement 3.3: preview time reduces by 1 second (minimum 1s)', () => {
      // Level 1: 3 seconds
      expect(result.current.gameState.previewTime).toBe(3000);

      // Level 2: 2 seconds
      act(() => {
        result.current.advanceLevel();
      });
      expect(result.current.gameState.previewTime).toBe(2000);

      // Level 3: 1 second (minimum)
      act(() => {
        result.current.advanceLevel();
      });
      expect(result.current.gameState.previewTime).toBe(1000);

      // Level 4: still 1 second (minimum maintained)
      act(() => {
        result.current.advanceLevel();
      });
      expect(result.current.gameState.previewTime).toBe(1000);
    });

    it('should meet requirement 3.4: level 2 shows numbers for 2 seconds', () => {
      act(() => {
        result.current.advanceLevel();
      });
      
      expect(result.current.gameState.currentLevel).toBe(2);
      expect(result.current.gameState.previewTime).toBe(2000);
    });

    it('should meet requirement 3.5: level 3+ shows numbers for 1 second', () => {
      // Advance to level 3
      act(() => {
        result.current.advanceLevel(); // Level 2
        result.current.advanceLevel(); // Level 3
      });
      
      expect(result.current.gameState.currentLevel).toBe(3);
      expect(result.current.gameState.previewTime).toBe(1000);

      // Test higher levels maintain 1 second
      act(() => {
        result.current.advanceLevel(); // Level 4
      });
      
      expect(result.current.gameState.currentLevel).toBe(4);
      expect(result.current.gameState.previewTime).toBe(1000);
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
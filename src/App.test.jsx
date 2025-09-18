import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders the game title', () => {
    render(<App />);
    expect(screen.getByText('Memory Grid Game')).toBeInTheDocument();
  });

  it('renders the start game button', () => {
    render(<App />);
    expect(screen.getByText('Start Game')).toBeInTheDocument();
  });

  it('renders score display components', () => {
    render(<App />);
    expect(screen.getByText('Current Score')).toBeInTheDocument();
    expect(screen.getByText('High Score')).toBeInTheDocument();
    expect(screen.getByText('Level')).toBeInTheDocument();
  });

  describe('Restart Functionality', () => {
    it('should show restart button during active game states', () => {
      // Mock useGameState to return playing state
      const mockUseGameState = vi.fn(() => ({
        gameState: {
          gameStatus: 'playing',
          currentLevel: 2,
          currentScore: 100,
          highScore: 200,
          gridSize: 4,
          previewTime: 2000,
          gameMode: 'numbers',
          currentSequence: [1, 2, 3, 4],
          playerSequence: [1, 2],
          gridData: [3, 1, 4, 2]
        },
        resetGame: vi.fn(),
        startGame: vi.fn()
      }));

      // Mock the hook
      vi.doMock('./hooks/useGameState', () => ({
        default: mockUseGameState
      }));

      render(<App />);
      
      expect(screen.getByRole('button', { name: /restart game/i })).toBeInTheDocument();
      expect(screen.queryByText('Start Game')).not.toBeInTheDocument();
    });

    it('should show restart button in game over state with game over message', () => {
      const mockUseGameState = vi.fn(() => ({
        gameState: {
          gameStatus: 'gameover',
          currentLevel: 3,
          currentScore: 150,
          highScore: 300,
          gridSize: 5,
          previewTime: 1000,
          gameMode: 'numbers',
          currentSequence: [],
          playerSequence: [],
          gridData: []
        },
        resetGame: vi.fn(),
        startGame: vi.fn()
      }));

      vi.doMock('./hooks/useGameState', () => ({
        default: mockUseGameState
      }));

      render(<App />);
      
      expect(screen.getByText('Game Over!')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /restart game/i })).toBeInTheDocument();
      expect(screen.queryByText('Start Game')).not.toBeInTheDocument();
    });

    it('should show start button in menu state', () => {
      const mockUseGameState = vi.fn(() => ({
        gameState: {
          gameStatus: 'menu',
          currentLevel: 1,
          currentScore: 0,
          highScore: 100,
          gridSize: 3,
          previewTime: 3000,
          gameMode: 'numbers',
          currentSequence: [],
          playerSequence: [],
          gridData: []
        },
        resetGame: vi.fn(),
        startGame: vi.fn()
      }));

      vi.doMock('./hooks/useGameState', () => ({
        default: mockUseGameState
      }));

      render(<App />);
      
      expect(screen.getByText('Start Game')).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /restart game/i })).not.toBeInTheDocument();
    });

    it('should call resetGame when restart button is clicked', () => {
      const mockResetGame = vi.fn();
      const mockUseGameState = vi.fn(() => ({
        gameState: {
          gameStatus: 'playing',
          currentLevel: 2,
          currentScore: 100,
          highScore: 200,
          gridSize: 4,
          previewTime: 2000,
          gameMode: 'numbers',
          currentSequence: [1, 2, 3, 4],
          playerSequence: [1, 2],
          gridData: [3, 1, 4, 2]
        },
        resetGame: mockResetGame,
        startGame: vi.fn()
      }));

      vi.doMock('./hooks/useGameState', () => ({
        default: mockUseGameState
      }));

      render(<App />);
      
      const restartButton = screen.getByRole('button', { name: /restart game/i });
      fireEvent.click(restartButton);
      
      expect(mockResetGame).toHaveBeenCalledTimes(1);
    });

    it('should call startGame when start button is clicked', () => {
      const mockStartGame = vi.fn();
      const mockUseGameState = vi.fn(() => ({
        gameState: {
          gameStatus: 'menu',
          currentLevel: 1,
          currentScore: 0,
          highScore: 100,
          gridSize: 3,
          previewTime: 3000,
          gameMode: 'numbers',
          currentSequence: [],
          playerSequence: [],
          gridData: []
        },
        resetGame: vi.fn(),
        startGame: mockStartGame
      }));

      vi.doMock('./hooks/useGameState', () => ({
        default: mockUseGameState
      }));

      render(<App />);
      
      const startButton = screen.getByText('Start Game');
      fireEvent.click(startButton);
      
      expect(mockStartGame).toHaveBeenCalledTimes(1);
    });

    it('should show restart button during preview state', () => {
      const mockUseGameState = vi.fn(() => ({
        gameState: {
          gameStatus: 'preview',
          currentLevel: 1,
          currentScore: 0,
          highScore: 100,
          gridSize: 3,
          previewTime: 3000,
          gameMode: 'numbers',
          currentSequence: [1, 2, 3],
          playerSequence: [],
          gridData: [2, 1, 3]
        },
        resetGame: vi.fn(),
        startGame: vi.fn()
      }));

      vi.doMock('./hooks/useGameState', () => ({
        default: mockUseGameState
      }));

      render(<App />);
      
      expect(screen.getByRole('button', { name: /restart game/i })).toBeInTheDocument();
      expect(screen.queryByText('Start Game')).not.toBeInTheDocument();
    });

    it('should show restart button during level complete state', () => {
      const mockUseGameState = vi.fn(() => ({
        gameState: {
          gameStatus: 'levelcomplete',
          currentLevel: 2,
          currentScore: 200,
          highScore: 300,
          gridSize: 4,
          previewTime: 2000,
          gameMode: 'numbers',
          currentSequence: [],
          playerSequence: [],
          gridData: []
        },
        resetGame: vi.fn(),
        startGame: vi.fn()
      }));

      vi.doMock('./hooks/useGameState', () => ({
        default: mockUseGameState
      }));

      render(<App />);
      
      expect(screen.getByRole('button', { name: /restart game/i })).toBeInTheDocument();
      expect(screen.queryByText('Start Game')).not.toBeInTheDocument();
    });
  });
});
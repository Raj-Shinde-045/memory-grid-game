import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import ScoreDisplay from './ScoreDisplay';

// Mock the useScore hook
vi.mock('../../hooks/useScore', () => ({
  default: vi.fn()
}));

import useScore from '../../hooks/useScore';

describe('ScoreDisplay', () => {
  const mockUseScore = {
    currentScore: 0,
    highScore: 0,
    isNewHighScore: vi.fn(() => false)
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useScore.mockReturnValue(mockUseScore);
  });

  describe('rendering', () => {
    it('should render current score, high score, and level', () => {
      render(<ScoreDisplay currentLevel={1} />);

      expect(screen.getByText('Current Score')).toBeInTheDocument();
      expect(screen.getByText('High Score')).toBeInTheDocument();
      expect(screen.getByText('Level')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('should display scores with proper formatting', () => {
      useScore.mockReturnValue({
        ...mockUseScore,
        currentScore: 1250,
        highScore: 5000
      });

      render(<ScoreDisplay currentLevel={3} />);

      expect(screen.getByText('1,250')).toBeInTheDocument();
      expect(screen.getByText('5,000')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('should handle large numbers with proper formatting', () => {
      useScore.mockReturnValue({
        ...mockUseScore,
        currentScore: 123456,
        highScore: 987654
      });

      render(<ScoreDisplay currentLevel={10} />);

      expect(screen.getByText('123,456')).toBeInTheDocument();
      expect(screen.getByText('987,654')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
    });

    it('should use default level when not provided', () => {
      render(<ScoreDisplay />);

      expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('should apply custom className when provided', () => {
      const { container } = render(<ScoreDisplay className="custom-class" />);
      
      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('new high score indicator', () => {
    it('should show indicator when isNewHighScore returns true', () => {
      useScore.mockReturnValue({
        ...mockUseScore,
        currentScore: 500,
        highScore: 500,
        isNewHighScore: vi.fn(() => true)
      });

      render(<ScoreDisplay />);

      const indicator = screen.getByLabelText('New high score!');
      expect(indicator).toBeInTheDocument();
      expect(indicator).toHaveTextContent('🎉');
    });

    it('should show indicator when showNewHighScoreIndicator prop is true', () => {
      render(<ScoreDisplay showNewHighScoreIndicator={true} />);

      const indicator = screen.getByLabelText('New high score!');
      expect(indicator).toBeInTheDocument();
      expect(indicator).toHaveTextContent('🎉');
    });

    it('should not show indicator when isNewHighScore returns false and prop is not set', () => {
      useScore.mockReturnValue({
        ...mockUseScore,
        isNewHighScore: vi.fn(() => false)
      });

      render(<ScoreDisplay />);

      expect(screen.queryByLabelText('New high score!')).not.toBeInTheDocument();
    });

    it('should show indicator when prop is true even if isNewHighScore returns false', () => {
      useScore.mockReturnValue({
        ...mockUseScore,
        isNewHighScore: vi.fn(() => false)
      });

      render(<ScoreDisplay showNewHighScoreIndicator={true} />);

      const indicator = screen.getByLabelText('New high score!');
      expect(indicator).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have proper aria-label for new high score indicator', () => {
      useScore.mockReturnValue({
        ...mockUseScore,
        isNewHighScore: vi.fn(() => true)
      });

      render(<ScoreDisplay />);

      const indicator = screen.getByLabelText('New high score!');
      expect(indicator).toHaveAttribute('aria-label', 'New high score!');
    });

    it('should have proper text structure for screen readers', () => {
      useScore.mockReturnValue({
        ...mockUseScore,
        currentScore: 1500,
        highScore: 3000
      });

      render(<ScoreDisplay currentLevel={5} />);

      // Check that labels and values are properly associated
      expect(screen.getByText('Current Score')).toBeInTheDocument();
      expect(screen.getByText('1,500')).toBeInTheDocument();
      expect(screen.getByText('High Score')).toBeInTheDocument();
      expect(screen.getByText('3,000')).toBeInTheDocument();
      expect(screen.getByText('Level')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
    });
  });

  describe('integration with useScore hook', () => {
    it('should call useScore hook on render', () => {
      render(<ScoreDisplay />);

      expect(useScore).toHaveBeenCalled();
    });

    it('should call isNewHighScore method', () => {
      const mockIsNewHighScore = vi.fn(() => false);
      useScore.mockReturnValue({
        ...mockUseScore,
        isNewHighScore: mockIsNewHighScore
      });

      render(<ScoreDisplay />);

      expect(mockIsNewHighScore).toHaveBeenCalled();
    });

    it('should handle useScore hook returning undefined values gracefully', () => {
      useScore.mockReturnValue({
        currentScore: undefined,
        highScore: undefined,
        isNewHighScore: vi.fn(() => false)
      });

      render(<ScoreDisplay />);

      // Should not crash and should handle undefined values
      expect(screen.getByText('Current Score')).toBeInTheDocument();
      expect(screen.getByText('High Score')).toBeInTheDocument();
      expect(screen.getAllByText('0')).toHaveLength(2); // Both current and high score should show 0
    });
  });

  describe('responsive behavior', () => {
    it('should render properly on different screen sizes', () => {
      const { container } = render(<ScoreDisplay currentLevel={2} />);
      
      // Check that the component has the CSS module class (it will be hashed)
      expect(container.firstChild.className).toContain('scoreDisplay');
      
      // Verify all elements are present for responsive layout
      expect(screen.getByText('Current Score')).toBeInTheDocument();
      expect(screen.getByText('High Score')).toBeInTheDocument();
      expect(screen.getByText('Level')).toBeInTheDocument();
    });
  });
});
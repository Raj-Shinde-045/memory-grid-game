import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import GridCell from './GridCell';

describe('GridCell', () => {
  const defaultProps = {
    value: 5,
    isRevealed: false,
    isDisabled: false,
    isIncorrect: false,
    onClick: vi.fn(),
    isFlipping: false,
    isClickable: false,
    isClicked: false,
    gameStatus: 'menu'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with question mark when not revealed', () => {
    render(<GridCell {...defaultProps} />);
    expect(screen.getByText('?')).toBeInTheDocument();
  });

  it('renders with value when revealed', () => {
    render(<GridCell {...defaultProps} isRevealed={true} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('calls onClick when clicked and not disabled', () => {
    const mockOnClick = vi.fn();
    render(<GridCell {...defaultProps} onClick={mockOnClick} gameStatus="playing" isClickable={true} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(mockOnClick).toHaveBeenCalledWith(5);
  });

  it('does not call onClick when disabled', () => {
    const mockOnClick = vi.fn();
    render(<GridCell {...defaultProps} onClick={mockOnClick} isDisabled={true} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('handles keyboard events (Enter key)', () => {
    const mockOnClick = vi.fn();
    render(<GridCell {...defaultProps} onClick={mockOnClick} gameStatus="playing" isClickable={true} />);
    
    fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter' });
    expect(mockOnClick).toHaveBeenCalledWith(5);
  });

  it('handles keyboard events (Space key)', () => {
    const mockOnClick = vi.fn();
    render(<GridCell {...defaultProps} onClick={mockOnClick} gameStatus="playing" isClickable={true} />);
    
    fireEvent.keyDown(screen.getByRole('button'), { key: ' ' });
    expect(mockOnClick).toHaveBeenCalledWith(5);
  });

  it('does not handle keyboard events when disabled', () => {
    const mockOnClick = vi.fn();
    render(<GridCell {...defaultProps} onClick={mockOnClick} isDisabled={true} />);
    
    fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter' });
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('applies correct CSS classes based on props', () => {
    const { rerender } = render(<GridCell {...defaultProps} />);
    let cell = screen.getByRole('button');
    expect(cell.className).toContain('gridCell');

    rerender(<GridCell {...defaultProps} isRevealed={true} />);
    cell = screen.getByRole('button');
    expect(cell.className).toContain('gridCell');
    expect(cell.className).toContain('revealed');

    rerender(<GridCell {...defaultProps} isDisabled={true} />);
    cell = screen.getByRole('button');
    expect(cell.className).toContain('gridCell');
    expect(cell.className).toContain('disabled');

    rerender(<GridCell {...defaultProps} isIncorrect={true} />);
    cell = screen.getByRole('button');
    expect(cell.className).toContain('gridCell');
    expect(cell.className).toContain('incorrect');

    rerender(<GridCell {...defaultProps} isFlipping={true} />);
    cell = screen.getByRole('button');
    expect(cell.className).toContain('gridCell');
    expect(cell.className).toContain('flipping');
  });

  it('has correct accessibility attributes', () => {
    render(<GridCell {...defaultProps} gameStatus="playing" isClickable={true} />);
    const cell = screen.getByRole('button');
    
    expect(cell).toHaveAttribute('tabIndex', '0');
    expect(cell).toHaveAttribute('aria-label', 'Grid cell hidden, clickable');
  });

  it('has correct accessibility attributes when revealed', () => {
    render(<GridCell {...defaultProps} isRevealed={true} />);
    const cell = screen.getByRole('button');
    
    expect(cell).toHaveAttribute('aria-label', 'Grid cell with value 5');
  });

  it('has correct accessibility attributes when disabled', () => {
    render(<GridCell {...defaultProps} isDisabled={true} />);
    const cell = screen.getByRole('button');
    
    expect(cell).toHaveAttribute('tabIndex', '-1');
  });

  describe('Game Logic Integration', () => {
    it('prevents clicks during preview phase', () => {
      const mockOnClick = vi.fn();
      render(<GridCell {...defaultProps} onClick={mockOnClick} gameStatus="preview" />);
      
      fireEvent.click(screen.getByRole('button'));
      expect(mockOnClick).not.toHaveBeenCalled();
    });

    it('allows clicks during playing phase when clickable', () => {
      const mockOnClick = vi.fn();
      render(<GridCell {...defaultProps} onClick={mockOnClick} gameStatus="playing" isClickable={true} />);
      
      fireEvent.click(screen.getByRole('button'));
      expect(mockOnClick).toHaveBeenCalledWith(5);
    });

    it('prevents clicks during playing phase when not clickable', () => {
      const mockOnClick = vi.fn();
      render(<GridCell {...defaultProps} onClick={mockOnClick} gameStatus="playing" isClickable={false} />);
      
      fireEvent.click(screen.getByRole('button'));
      expect(mockOnClick).not.toHaveBeenCalled();
    });

    it('prevents clicks when already clicked', () => {
      const mockOnClick = vi.fn();
      render(<GridCell {...defaultProps} onClick={mockOnClick} gameStatus="playing" isClickable={true} isClicked={true} />);
      
      fireEvent.click(screen.getByRole('button'));
      expect(mockOnClick).not.toHaveBeenCalled();
    });

    it('prevents clicks during gameover', () => {
      const mockOnClick = vi.fn();
      render(<GridCell {...defaultProps} onClick={mockOnClick} gameStatus="gameover" isClickable={true} />);
      
      fireEvent.click(screen.getByRole('button'));
      expect(mockOnClick).not.toHaveBeenCalled();
    });

    it('prevents clicks during levelcomplete', () => {
      const mockOnClick = vi.fn();
      render(<GridCell {...defaultProps} onClick={mockOnClick} gameStatus="levelcomplete" isClickable={true} />);
      
      fireEvent.click(screen.getByRole('button'));
      expect(mockOnClick).not.toHaveBeenCalled();
    });

    it('applies clickable class when cell is clickable and game is playing', () => {
      render(<GridCell {...defaultProps} gameStatus="playing" isClickable={true} />);
      const cell = screen.getByRole('button');
      expect(cell.className).toContain('clickable');
    });

    it('applies clicked class when cell is clicked', () => {
      render(<GridCell {...defaultProps} isClicked={true} />);
      const cell = screen.getByRole('button');
      expect(cell.className).toContain('clicked');
    });

    it('shows incorrect feedback animation', async () => {
      vi.useFakeTimers();
      const { rerender } = render(<GridCell {...defaultProps} />);
      
      // Trigger incorrect state
      rerender(<GridCell {...defaultProps} isIncorrect={true} />);
      const cell = screen.getByRole('button');
      expect(cell.className).toContain('incorrect');

      // Fast-forward time to complete the animation
      vi.advanceTimersByTime(500);
      
      // The incorrect class should still be there from the prop, but the internal feedback should be cleared
      expect(cell.className).toContain('incorrect');
      
      // Reset incorrect prop
      rerender(<GridCell {...defaultProps} isIncorrect={false} />);
      expect(cell.className).not.toContain('incorrect');
      
      vi.useRealTimers();
    });

    it('has correct accessibility attributes for clickable cells', () => {
      render(<GridCell {...defaultProps} gameStatus="playing" isClickable={true} />);
      const cell = screen.getByRole('button');
      
      expect(cell).toHaveAttribute('aria-label', 'Grid cell hidden, clickable');
    });

    it('has correct accessibility attributes for clicked cells', () => {
      render(<GridCell {...defaultProps} isClicked={true} isRevealed={true} />);
      const cell = screen.getByRole('button');
      
      expect(cell).toHaveAttribute('aria-label', 'Grid cell with value 5, already clicked');
    });

    it('has data-testid attribute for testing', () => {
      render(<GridCell {...defaultProps} />);
      const cell = screen.getByTestId('grid-cell-5');
      expect(cell).toBeInTheDocument();
    });

    it('handles keyboard events during playing phase', () => {
      const mockOnClick = vi.fn();
      render(<GridCell {...defaultProps} onClick={mockOnClick} gameStatus="playing" isClickable={true} />);
      
      fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter' });
      expect(mockOnClick).toHaveBeenCalledWith(5);
    });

    it('prevents keyboard events during preview phase', () => {
      const mockOnClick = vi.fn();
      render(<GridCell {...defaultProps} onClick={mockOnClick} gameStatus="preview" />);
      
      fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter' });
      expect(mockOnClick).not.toHaveBeenCalled();
    });
  });
});
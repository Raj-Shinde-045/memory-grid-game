import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import GameGrid from './GameGrid';

describe('GameGrid', () => {
  const defaultProps = {
    gridData: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    gridSize: 3,
    onCellClick: vi.fn(),
    revealedCells: [],
    disabledCells: [],
    incorrectCells: [],
    flippingCells: []
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders grid with correct number of cells', () => {
    render(<GameGrid {...defaultProps} />);
    const cells = screen.getAllByRole('button');
    expect(cells).toHaveLength(9);
  });

  it('renders grid with different sizes', () => {
    const { rerender } = render(
      <GameGrid 
        {...defaultProps} 
        gridData={[1, 2, 3, 4]} 
        gridSize={2} 
      />
    );
    let cells = screen.getAllByRole('button');
    expect(cells).toHaveLength(4);

    rerender(
      <GameGrid 
        {...defaultProps} 
        gridData={Array.from({length: 16}, (_, i) => i + 1)} 
        gridSize={4} 
      />
    );
    cells = screen.getAllByRole('button');
    expect(cells).toHaveLength(16);
  });

  it('applies correct CSS custom property for grid size', () => {
    render(<GameGrid {...defaultProps} gridSize={4} />);
    const grid = screen.getByRole('grid');
    expect(grid.style.getPropertyValue('--grid-size')).toBe('4');
  });

  it('passes correct props to GridCell components', () => {
    render(
      <GameGrid 
        {...defaultProps} 
        revealedCells={[0, 2]}
        disabledCells={[1]}
        incorrectCells={[3]}
        flippingCells={[4]}
      />
    );
    
    const cells = screen.getAllByRole('button');
    
    // Check revealed cells show values
    expect(cells[0]).toHaveTextContent('1');
    expect(cells[2]).toHaveTextContent('3');
    
    // Check non-revealed cells show question marks
    expect(cells[1]).toHaveTextContent('?');
  });

  it('calls onCellClick with correct index when cell is clicked', () => {
    const mockOnCellClick = vi.fn();
    render(
      <GameGrid 
        {...defaultProps} 
        onCellClick={mockOnCellClick}
        gameStatus="playing"
        clickableCells={[0, 1, 2, 3, 4]}
      />
    );
    
    const cells = screen.getAllByRole('button');
    fireEvent.click(cells[0]);
    expect(mockOnCellClick).toHaveBeenCalledWith(0);
    
    fireEvent.click(cells[4]);
    expect(mockOnCellClick).toHaveBeenCalledWith(4);
  });

  it('handles empty grid data gracefully', () => {
    render(<GameGrid {...defaultProps} gridData={[]} />);
    const cells = screen.queryAllByRole('button');
    expect(cells).toHaveLength(0);
  });

  it('has correct accessibility attributes', () => {
    render(<GameGrid {...defaultProps} gridSize={3} />);
    const grid = screen.getByRole('grid');
    expect(grid).toHaveAttribute('aria-label', '3x3 memory game grid');
  });

  it('updates accessibility label when grid size changes', () => {
    const { rerender } = render(<GameGrid {...defaultProps} gridSize={3} />);
    let grid = screen.getByRole('grid');
    expect(grid).toHaveAttribute('aria-label', '3x3 memory game grid');

    rerender(<GameGrid {...defaultProps} gridSize={4} />);
    grid = screen.getByRole('grid');
    expect(grid).toHaveAttribute('aria-label', '4x4 memory game grid');
  });

  it('works without onCellClick prop', () => {
    render(<GameGrid {...defaultProps} onCellClick={undefined} />);
    const cells = screen.getAllByRole('button');
    
    // Should not throw error when clicking
    expect(() => {
      fireEvent.click(cells[0]);
    }).not.toThrow();
  });

  it('renders with default props when not provided', () => {
    render(<GameGrid />);
    const grid = screen.getByRole('grid');
    expect(grid).toHaveAttribute('aria-label', '3x3 memory game grid');
    expect(grid.style.getPropertyValue('--grid-size')).toBe('3');
    
    const cells = screen.queryAllByRole('button');
    expect(cells).toHaveLength(0); // Empty gridData by default
  });
});
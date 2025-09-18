import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import GridCell from './GridCell';

describe('GridCell', () => {
  const defaultProps = {
    value: 5,
    isRevealed: false,
    isDisabled: false,
    isIncorrect: false,
    onClick: vi.fn(),
    isFlipping: false
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
    render(<GridCell {...defaultProps} onClick={mockOnClick} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', () => {
    const mockOnClick = vi.fn();
    render(<GridCell {...defaultProps} onClick={mockOnClick} isDisabled={true} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('handles keyboard events (Enter key)', () => {
    const mockOnClick = vi.fn();
    render(<GridCell {...defaultProps} onClick={mockOnClick} />);
    
    fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter' });
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('handles keyboard events (Space key)', () => {
    const mockOnClick = vi.fn();
    render(<GridCell {...defaultProps} onClick={mockOnClick} />);
    
    fireEvent.keyDown(screen.getByRole('button'), { key: ' ' });
    expect(mockOnClick).toHaveBeenCalledTimes(1);
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
    render(<GridCell {...defaultProps} />);
    const cell = screen.getByRole('button');
    
    expect(cell).toHaveAttribute('tabIndex', '0');
    expect(cell).toHaveAttribute('aria-label', 'Grid cell hidden');
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
});
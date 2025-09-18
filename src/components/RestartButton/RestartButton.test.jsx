import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import RestartButton from './RestartButton';

describe('RestartButton', () => {
  it('renders restart button with correct text', () => {
    render(<RestartButton onClick={() => {}} />);
    
    const button = screen.getByRole('button', { name: /restart game/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Restart Game');
  });

  it('calls onClick handler when clicked', () => {
    const mockOnClick = vi.fn();
    render(<RestartButton onClick={mockOnClick} />);
    
    const button = screen.getByRole('button', { name: /restart game/i });
    fireEvent.click(button);
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    const mockOnClick = vi.fn();
    render(<RestartButton onClick={mockOnClick} disabled={true} />);
    
    const button = screen.getByRole('button', { name: /restart game/i });
    expect(button).toBeDisabled();
    
    fireEvent.click(button);
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('is enabled by default', () => {
    render(<RestartButton onClick={() => {}} />);
    
    const button = screen.getByRole('button', { name: /restart game/i });
    expect(button).not.toBeDisabled();
  });

  it('applies custom className', () => {
    render(<RestartButton onClick={() => {}} className="custom-class" />);
    
    const button = screen.getByRole('button', { name: /restart game/i });
    expect(button).toHaveClass('custom-class');
  });

  it('has correct accessibility attributes', () => {
    render(<RestartButton onClick={() => {}} />);
    
    const button = screen.getByRole('button', { name: /restart game/i });
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('aria-label', 'Restart Game');
  });
});
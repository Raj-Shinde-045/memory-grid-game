import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ModeToggle from './ModeToggle';

describe('ModeToggle', () => {
  const mockOnToggle = vi.fn();

  beforeEach(() => {
    mockOnToggle.mockClear();
  });

  it('renders with numbers mode active', () => {
    render(<ModeToggle gameMode="numbers" onToggle={mockOnToggle} />);
    
    expect(screen.getByText('Game Mode:')).toBeInTheDocument();
    expect(screen.getByText('Numbers')).toBeInTheDocument();
    expect(screen.getByTestId('mode-toggle-button')).toBeInTheDocument();
  });

  it('renders with emojis mode active', () => {
    render(<ModeToggle gameMode="emojis" onToggle={mockOnToggle} />);
    
    expect(screen.getByText('Game Mode:')).toBeInTheDocument();
    expect(screen.getByText('Emojis')).toBeInTheDocument();
    expect(screen.getByTestId('mode-toggle-button')).toBeInTheDocument();
  });

  it('calls onToggle when clicked', () => {
    render(<ModeToggle gameMode="numbers" onToggle={mockOnToggle} />);
    
    const toggleButton = screen.getByTestId('mode-toggle-button');
    fireEvent.click(toggleButton);
    
    expect(mockOnToggle).toHaveBeenCalledTimes(1);
  });

  it('calls onToggle when Enter key is pressed', () => {
    render(<ModeToggle gameMode="numbers" onToggle={mockOnToggle} />);
    
    const toggleButton = screen.getByTestId('mode-toggle-button');
    fireEvent.keyDown(toggleButton, { key: 'Enter' });
    
    expect(mockOnToggle).toHaveBeenCalledTimes(1);
  });

  it('calls onToggle when Space key is pressed', () => {
    render(<ModeToggle gameMode="numbers" onToggle={mockOnToggle} />);
    
    const toggleButton = screen.getByTestId('mode-toggle-button');
    fireEvent.keyDown(toggleButton, { key: ' ' });
    
    expect(mockOnToggle).toHaveBeenCalledTimes(1);
  });

  it('does not call onToggle when other keys are pressed', () => {
    render(<ModeToggle gameMode="numbers" onToggle={mockOnToggle} />);
    
    const toggleButton = screen.getByTestId('mode-toggle-button');
    fireEvent.keyDown(toggleButton, { key: 'Tab' });
    
    expect(mockOnToggle).not.toHaveBeenCalled();
  });

  it('does not call onToggle when disabled', () => {
    render(<ModeToggle gameMode="numbers" onToggle={mockOnToggle} disabled={true} />);
    
    const toggleButton = screen.getByTestId('mode-toggle-button');
    fireEvent.click(toggleButton);
    
    expect(mockOnToggle).not.toHaveBeenCalled();
  });

  it('does not call onToggle on keyboard events when disabled', () => {
    render(<ModeToggle gameMode="numbers" onToggle={mockOnToggle} disabled={true} />);
    
    const toggleButton = screen.getByTestId('mode-toggle-button');
    fireEvent.keyDown(toggleButton, { key: 'Enter' });
    
    expect(mockOnToggle).not.toHaveBeenCalled();
  });

  it('has correct aria-label for numbers mode', () => {
    render(<ModeToggle gameMode="numbers" onToggle={mockOnToggle} />);
    
    const toggleButton = screen.getByTestId('mode-toggle-button');
    expect(toggleButton).toHaveAttribute('aria-label', 'Switch to emoji mode');
  });

  it('has correct aria-label for emojis mode', () => {
    render(<ModeToggle gameMode="emojis" onToggle={mockOnToggle} />);
    
    const toggleButton = screen.getByTestId('mode-toggle-button');
    expect(toggleButton).toHaveAttribute('aria-label', 'Switch to number mode');
  });

  it('is disabled when disabled prop is true', () => {
    render(<ModeToggle gameMode="numbers" onToggle={mockOnToggle} disabled={true} />);
    
    const toggleButton = screen.getByTestId('mode-toggle-button');
    expect(toggleButton).toBeDisabled();
  });

  it('is not disabled when disabled prop is false', () => {
    render(<ModeToggle gameMode="numbers" onToggle={mockOnToggle} disabled={false} />);
    
    const toggleButton = screen.getByTestId('mode-toggle-button');
    expect(toggleButton).not.toBeDisabled();
  });

  it('handles missing onToggle prop gracefully', () => {
    render(<ModeToggle gameMode="numbers" />);
    
    const toggleButton = screen.getByTestId('mode-toggle-button');
    
    // Should not throw error
    expect(() => {
      fireEvent.click(toggleButton);
    }).not.toThrow();
  });

  it('displays correct visual indicators for numbers mode', () => {
    render(<ModeToggle gameMode="numbers" onToggle={mockOnToggle} />);
    
    expect(screen.getByText('123')).toBeInTheDocument();
    expect(screen.getByText('😀')).toBeInTheDocument();
  });

  it('displays correct visual indicators for emojis mode', () => {
    render(<ModeToggle gameMode="emojis" onToggle={mockOnToggle} />);
    
    expect(screen.getByText('123')).toBeInTheDocument();
    expect(screen.getByText('😀')).toBeInTheDocument();
  });
});
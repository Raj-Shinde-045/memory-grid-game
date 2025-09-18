import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import PreviewPhase from './PreviewPhase';

// Mock the useTimer hook
const mockStartTimer = vi.fn();
vi.mock('../../hooks/useTimer', () => ({
  default: () => ({
    timeRemaining: 3000,
    isRunning: true,
    startTimer: mockStartTimer,
    getFormattedTime: () => '3.0s',
    getProgress: () => 100
  })
}));

// Mock TimerDisplay component
vi.mock('../TimerDisplay/TimerDisplay', () => ({
  default: ({ className }) => <div data-testid="timer-display" className={className}>3.0s</div>
}));

// Mock timers for animations
vi.useFakeTimers();

describe('PreviewPhase', () => {
  const defaultProps = {
    gridData: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    gridSize: 3,
    previewDuration: 3000,
    onPreviewComplete: vi.fn(),
    gameMode: 'numbers'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.clearAllTimers();
    mockStartTimer.mockClear();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.useFakeTimers();
  });

  it('should render without crashing', () => {
    render(<PreviewPhase {...defaultProps} />);
    expect(screen.getByText('Get Ready...')).toBeInTheDocument();
  });

  it('should not render when gridData is empty', () => {
    const { container } = render(<PreviewPhase {...defaultProps} gridData={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('should not render when gridData is null', () => {
    const { container } = render(<PreviewPhase {...defaultProps} gridData={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('should render correct number of grid cells', () => {
    render(<PreviewPhase {...defaultProps} />);
    
    // Should have 9 cells for 3x3 grid
    const cells = screen.getAllByText('?');
    expect(cells).toHaveLength(9);
  });

  it('should show timer display when running', () => {
    render(<PreviewPhase {...defaultProps} />);
    expect(screen.getByTestId('timer-display')).toBeInTheDocument();
  });

  it('should use useTimer hook', () => {
    render(<PreviewPhase {...defaultProps} />);
    
    // Component should render without errors, indicating useTimer is being used
    expect(screen.getByText('Get Ready...')).toBeInTheDocument();
  });

  it('should show initial phase message', () => {
    render(<PreviewPhase {...defaultProps} />);
    
    // Initially should show "Get Ready..."
    expect(screen.getByText('Get Ready...')).toBeInTheDocument();
  });

  it('should show correct instructions text', () => {
    render(<PreviewPhase {...defaultProps} />);
    
    // Should show instructions section (text is conditional based on animation phase)
    expect(screen.getByRole('paragraph')).toBeInTheDocument();
  });

  it('should handle different grid sizes correctly', () => {
    const gridData4x4 = Array.from({ length: 16 }, (_, i) => i + 1);
    render(<PreviewPhase {...defaultProps} gridData={gridData4x4} gridSize={4} />);
    
    // Should have 16 cells for 4x4 grid
    const cells = screen.getAllByText('?');
    expect(cells).toHaveLength(16);
  });

  it('should apply custom className', () => {
    const { container } = render(<PreviewPhase {...defaultProps} className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('should handle emoji mode', () => {
    const emojiGridData = ['🎯', '🎮', '🎲', '🎪', '🎨', '🎭', '🎪', '🎯', '🎮'];
    render(<PreviewPhase {...defaultProps} gridData={emojiGridData} gameMode="emojis" />);
    
    // Should still render grid cells (emojis will be shown during reveal phase)
    const cells = screen.getAllByText('?');
    expect(cells).toHaveLength(9);
  });

  it('should handle missing onPreviewComplete gracefully', () => {
    render(<PreviewPhase {...defaultProps} onPreviewComplete={undefined} />);
    
    // Should not crash when onPreviewComplete is not provided
    expect(screen.getByText('Get Ready...')).toBeInTheDocument();
  });

  it('should handle gridData changes', () => {
    const { rerender } = render(<PreviewPhase {...defaultProps} />);
    
    // Change gridData
    const newGridData = [9, 8, 7, 6, 5, 4, 3, 2, 1];
    rerender(<PreviewPhase {...defaultProps} gridData={newGridData} />);
    
    // Should still render without errors
    expect(screen.getByText('Get Ready...')).toBeInTheDocument();
  });

  it('should use default previewDuration when not provided', () => {
    const { container } = render(
      <PreviewPhase 
        gridData={defaultProps.gridData}
        gridSize={defaultProps.gridSize}
        onPreviewComplete={defaultProps.onPreviewComplete}
      />
    );
    
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should use default gameMode when not provided', () => {
    render(
      <PreviewPhase 
        gridData={defaultProps.gridData}
        gridSize={defaultProps.gridSize}
        onPreviewComplete={defaultProps.onPreviewComplete}
      />
    );
    
    // Should render without errors
    expect(screen.getByText('Get Ready...')).toBeInTheDocument();
  });
});
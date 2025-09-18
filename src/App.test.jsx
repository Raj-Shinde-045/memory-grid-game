import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
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
});
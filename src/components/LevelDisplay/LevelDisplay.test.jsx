import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LevelDisplay from './LevelDisplay';

describe('LevelDisplay', () => {
  it('renders level information correctly', () => {
    render(
      <LevelDisplay 
        currentLevel={1} 
        gridSize={3} 
        previewTime={3000} 
      />
    );
    
    expect(screen.getByText('Level 1')).toBeInTheDocument();
    expect(screen.getByText('3×3 Grid')).toBeInTheDocument();
    expect(screen.getByText('3s Preview')).toBeInTheDocument();
  });

  it('displays correct information for level 2', () => {
    render(
      <LevelDisplay 
        currentLevel={2} 
        gridSize={4} 
        previewTime={2000} 
      />
    );
    
    expect(screen.getByText('Level 2')).toBeInTheDocument();
    expect(screen.getByText('4×4 Grid')).toBeInTheDocument();
    expect(screen.getByText('2s Preview')).toBeInTheDocument();
  });

  it('displays correct information for level 3+', () => {
    render(
      <LevelDisplay 
        currentLevel={5} 
        gridSize={7} 
        previewTime={1000} 
      />
    );
    
    expect(screen.getByText('Level 5')).toBeInTheDocument();
    expect(screen.getByText('7×7 Grid')).toBeInTheDocument();
    expect(screen.getByText('1s Preview')).toBeInTheDocument();
  });

  it('rounds preview time to nearest second', () => {
    render(
      <LevelDisplay 
        currentLevel={1} 
        gridSize={3} 
        previewTime={2500} 
      />
    );
    
    expect(screen.getByText('3s Preview')).toBeInTheDocument();
  });

  it('handles large grid sizes correctly', () => {
    render(
      <LevelDisplay 
        currentLevel={10} 
        gridSize={12} 
        previewTime={1000} 
      />
    );
    
    expect(screen.getByText('Level 10')).toBeInTheDocument();
    expect(screen.getByText('12×12 Grid')).toBeInTheDocument();
    expect(screen.getByText('1s Preview')).toBeInTheDocument();
  });
});
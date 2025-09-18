import { render, screen, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import ConfettiAnimation from './ConfettiAnimation';

describe('ConfettiAnimation', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders nothing when not active', () => {
    const { container } = render(<ConfettiAnimation isActive={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders confetti particles when active', () => {
    const { container } = render(<ConfettiAnimation isActive={true} particleCount={10} />);
    const confettiContainer = container.querySelector('[class*="confettiContainer"]');
    expect(confettiContainer).toBeInTheDocument();
    
    // Should have the specified number of particles
    const particles = confettiContainer.querySelectorAll('[class*="confettiParticle"]');
    expect(particles).toHaveLength(10);
  });

  it('uses default particle count when not specified', () => {
    const { container } = render(<ConfettiAnimation isActive={true} />);
    const confettiContainer = container.querySelector('[class*="confettiContainer"]');
    const particles = confettiContainer.querySelectorAll('[class*="confettiParticle"]');
    expect(particles).toHaveLength(50); // Default particle count
  });

  it('applies random colors to particles', () => {
    const { container } = render(<ConfettiAnimation isActive={true} particleCount={5} />);
    const confettiContainer = container.querySelector('[class*="confettiContainer"]');
    const particles = confettiContainer.querySelectorAll('[class*="confettiParticle"]');
    
    // Check that particles have background colors
    particles.forEach(particle => {
      expect(particle.style.backgroundColor).toBeTruthy();
    });
  });

  it('applies random sizes to particles', () => {
    const { container } = render(<ConfettiAnimation isActive={true} particleCount={5} />);
    const confettiContainer = container.querySelector('[class*="confettiContainer"]');
    const particles = confettiContainer.querySelectorAll('[class*="confettiParticle"]');
    
    // Check that particles have width and height styles
    particles.forEach(particle => {
      expect(particle.style.width).toBeTruthy();
      expect(particle.style.height).toBeTruthy();
      expect(particle.style.width).toBe(particle.style.height); // Should be square
    });
  });

  it('applies random positions and rotations to particles', () => {
    const { container } = render(<ConfettiAnimation isActive={true} particleCount={5} />);
    const confettiContainer = container.querySelector('[class*="confettiContainer"]');
    const particles = confettiContainer.querySelectorAll('[class*="confettiParticle"]');
    
    particles.forEach(particle => {
      expect(particle.style.left).toBeTruthy();
      expect(particle.style.transform).toContain('rotate');
    });
  });

  it('calls onComplete callback after duration', async () => {
    const onComplete = vi.fn();
    render(
      <ConfettiAnimation 
        isActive={true} 
        duration={1000} 
        onComplete={onComplete}
        particleCount={5}
      />
    );

    // Fast-forward time to complete the animation
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('hides animation after duration', async () => {
    const { container } = render(
      <ConfettiAnimation 
        isActive={true} 
        duration={1000}
        particleCount={5}
      />
    );

    // Initially should be visible
    expect(container.firstChild).toBeInTheDocument();

    // Fast-forward time to complete the animation
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // Should be hidden after duration
    expect(container.firstChild).toBeNull();
  });

  it('uses default duration when not specified', async () => {
    const onComplete = vi.fn();
    render(
      <ConfettiAnimation 
        isActive={true} 
        onComplete={onComplete}
        particleCount={5}
      />
    );

    // Fast-forward time to just before default duration (3000ms)
    act(() => {
      vi.advanceTimersByTime(2999);
    });
    expect(onComplete).not.toHaveBeenCalled();

    // Fast-forward to complete default duration
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('has proper accessibility attributes', () => {
    const { container } = render(<ConfettiAnimation isActive={true} particleCount={5} />);
    const confettiContainer = container.querySelector('[class*="confettiContainer"]');
    expect(confettiContainer).toHaveAttribute('aria-hidden', 'true');
  });

  it('cleans up timers when component unmounts', () => {
    const { unmount } = render(
      <ConfettiAnimation 
        isActive={true} 
        duration={1000}
        particleCount={5}
      />
    );

    // Unmount before animation completes
    unmount();

    // Fast-forward time - should not cause any issues
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // No assertions needed - just ensuring no errors occur
  });

  it('restarts animation when isActive changes from false to true', () => {
    const { rerender, container } = render(
      <ConfettiAnimation isActive={false} particleCount={5} />
    );

    // Initially not visible
    expect(container.querySelector('[class*="confettiContainer"]')).not.toBeInTheDocument();

    // Activate animation
    rerender(<ConfettiAnimation isActive={true} particleCount={5} />);

    // Should now be visible
    expect(container.querySelector('[class*="confettiContainer"]')).toBeInTheDocument();
  });

  it('applies animation delays and durations to particles', () => {
    const { container } = render(<ConfettiAnimation isActive={true} particleCount={5} />);
    const confettiContainer = container.querySelector('[class*="confettiContainer"]');
    const particles = confettiContainer.querySelectorAll('[class*="confettiParticle"]');
    
    particles.forEach(particle => {
      expect(particle.style.animationDelay).toBeTruthy();
      expect(particle.style.animationDuration).toBeTruthy();
    });
  });
});
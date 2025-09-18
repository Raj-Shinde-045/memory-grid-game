import { useEffect, useState } from 'react';
import styles from './ConfettiAnimation.module.css';

const ConfettiAnimation = ({ 
  isActive = false, 
  duration = 3000,
  onComplete,
  particleCount = 50 
}) => {
  const [particles, setParticles] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  // Generate random confetti particles
  useEffect(() => {
    if (isActive) {
      const newParticles = Array.from({ length: particleCount }, (_, index) => ({
        id: index,
        color: getRandomColor(),
        size: Math.random() * 8 + 4, // 4-12px
        initialX: Math.random() * 100, // 0-100% of container width
        initialY: -10, // Start above the container
        rotation: Math.random() * 360,
        animationDelay: Math.random() * 0.5, // 0-0.5s delay
        animationDuration: Math.random() * 2 + 2, // 2-4s duration
        drift: (Math.random() - 0.5) * 100, // -50 to 50px horizontal drift
      }));
      
      setParticles(newParticles);
      setIsVisible(true);

      // Hide animation after duration
      const timer = setTimeout(() => {
        setIsVisible(false);
        setParticles([]);
        if (onComplete) {
          onComplete();
        }
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isActive, duration, onComplete, particleCount]);

  // Generate random colors for confetti
  const getRandomColor = () => {
    const colors = [
      '#FF6B6B', // Red
      '#4ECDC4', // Teal
      '#45B7D1', // Blue
      '#96CEB4', // Green
      '#FFEAA7', // Yellow
      '#DDA0DD', // Plum
      '#98D8C8', // Mint
      '#F7DC6F', // Light Yellow
      '#BB8FCE', // Light Purple
      '#85C1E9', // Light Blue
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  if (!isVisible || particles.length === 0) {
    return null;
  }

  return (
    <div className={styles.confettiContainer} aria-hidden="true">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={styles.confettiParticle}
          style={{
            backgroundColor: particle.color,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.initialX}%`,
            transform: `rotate(${particle.rotation}deg)`,
            animationDelay: `${particle.animationDelay}s`,
            animationDuration: `${particle.animationDuration}s`,
            '--drift': `${particle.drift}px`,
          }}
        />
      ))}
    </div>
  );
};

export default ConfettiAnimation;
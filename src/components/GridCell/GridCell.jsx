import { useState, useEffect } from 'react';
import styles from './GridCell.module.css';

const GridCell = ({ 
  value, 
  isRevealed, 
  isDisabled, 
  isIncorrect,
  onClick,
  isFlipping,
  isClickable = false,
  isClicked = false,
  gameStatus = 'menu'
}) => {
  const [showIncorrectFeedback, setShowIncorrectFeedback] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [showFadeIn, setShowFadeIn] = useState(true);

  // Handle click with game logic integration
  const handleClick = () => {
    // Prevent clicks during preview phase
    if (gameStatus === 'preview') {
      return;
    }

    // Prevent clicks if disabled or already clicked
    if (isDisabled || isClicked) {
      return;
    }

    // Only allow clicks during playing phase and if cell is clickable
    if (gameStatus === 'playing' && isClickable && onClick) {
      // Trigger success animation for correct clicks
      setShowSuccessAnimation(true);
      onClick(value);
    }
  };

  // Show incorrect feedback animation
  useEffect(() => {
    if (isIncorrect) {
      setShowIncorrectFeedback(true);
      const timer = setTimeout(() => {
        setShowIncorrectFeedback(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isIncorrect]);

  // Handle success animation
  useEffect(() => {
    if (showSuccessAnimation) {
      const timer = setTimeout(() => {
        setShowSuccessAnimation(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [showSuccessAnimation]);

  // Handle fade in animation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFadeIn(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  // Determine if cell should be disabled
  const shouldBeDisabled = isDisabled || 
                          gameStatus === 'preview' || 
                          gameStatus === 'menu' ||
                          gameStatus === 'gameover' ||
                          gameStatus === 'levelcomplete' ||
                          (gameStatus === 'playing' && !isClickable && !isClicked);

  const cellClasses = [
    styles.gridCell,
    isRevealed && styles.revealed,
    shouldBeDisabled && styles.disabled,
    (isIncorrect || showIncorrectFeedback) && styles.incorrect,
    isFlipping && styles.flipping,
    isClicked && styles.clicked,
    isClickable && gameStatus === 'playing' && !isClicked && styles.clickable,
    showSuccessAnimation && styles.success,
    showFadeIn && styles.fadeIn
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={cellClasses}
      onClick={handleClick}
      role="button"
      tabIndex={shouldBeDisabled ? -1 : 0}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !shouldBeDisabled) {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={`Grid cell ${isRevealed ? `with value ${value}` : 'hidden'}${isClickable ? ', clickable' : ''}${isClicked ? ', already clicked' : ''}`}
      data-testid={`grid-cell-${value}`}
    >
      {isRevealed ? value : '?'}
    </div>
  );
};

export default GridCell;
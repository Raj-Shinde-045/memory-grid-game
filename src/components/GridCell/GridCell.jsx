import React from 'react';
import styles from './GridCell.module.css';

const GridCell = ({ 
  value, 
  isRevealed, 
  isDisabled, 
  isIncorrect,
  onClick,
  isFlipping 
}) => {
  const handleClick = () => {
    if (!isDisabled && onClick) {
      onClick();
    }
  };

  const cellClasses = [
    styles.gridCell,
    isRevealed && styles.revealed,
    isDisabled && styles.disabled,
    isIncorrect && styles.incorrect,
    isFlipping && styles.flipping
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={cellClasses}
      onClick={handleClick}
      role="button"
      tabIndex={isDisabled ? -1 : 0}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !isDisabled) {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={`Grid cell ${isRevealed ? `with value ${value}` : 'hidden'}`}
    >
      {isRevealed ? value : '?'}
    </div>
  );
};

export default GridCell;
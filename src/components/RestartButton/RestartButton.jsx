import React from 'react';
import styles from './RestartButton.module.css';

const RestartButton = ({ onClick, disabled = false, className = '' }) => {
  return (
    <button
      className={`${styles.restartButton} ${className}`}
      onClick={onClick}
      disabled={disabled}
      type="button"
      aria-label="Restart Game"
    >
      Restart Game
    </button>
  );
};

export default RestartButton;
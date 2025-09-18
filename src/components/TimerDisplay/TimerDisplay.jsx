import React from 'react';
import styles from './TimerDisplay.module.css';

const TimerDisplay = ({ 
  timeRemaining, 
  totalDuration, 
  isRunning, 
  getFormattedTime, 
  getProgress,
  className = '' 
}) => {
  const progress = getProgress(totalDuration);
  const formattedTime = getFormattedTime();
  
  // Determine visual state based on remaining time
  const getTimerState = () => {
    if (!isRunning) return 'idle';
    if (timeRemaining <= 1000) return 'critical'; // Last second
    if (timeRemaining <= 2000) return 'warning'; // Last 2 seconds
    return 'normal';
  };

  const timerState = getTimerState();

  return (
    <div className={`${styles.timerDisplay} ${styles[timerState]} ${className}`}>
      <div className={styles.timerContent}>
        <div className={styles.timeText}>
          {formattedTime}
        </div>
        <div className={styles.progressContainer}>
          <div 
            className={styles.progressBar}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default TimerDisplay;
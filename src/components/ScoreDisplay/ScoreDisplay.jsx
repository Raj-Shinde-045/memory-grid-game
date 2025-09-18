// ScoreDisplay component placeholder
import React from 'react';
import styles from './ScoreDisplay.module.css';

const ScoreDisplay = () => {
  return (
    <div className={styles.scoreDisplay}>
      <div className={`${styles.scoreItem} ${styles.currentScore}`}>
        <div className={styles.scoreLabel}>Current Score</div>
        <div className={styles.scoreValue}>0</div>
      </div>
      <div className={`${styles.scoreItem} ${styles.highScore}`}>
        <div className={styles.scoreLabel}>High Score</div>
        <div className={styles.scoreValue}>0</div>
      </div>
      <div className={styles.levelDisplay}>
        <div className={styles.levelLabel}>Level</div>
        <div className={styles.levelValue}>1</div>
      </div>
    </div>
  );
};

export default ScoreDisplay;
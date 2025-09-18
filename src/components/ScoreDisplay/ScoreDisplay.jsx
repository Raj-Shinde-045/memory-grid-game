import React from 'react';
import PropTypes from 'prop-types';
import useScore from '../../hooks/useScore';
import styles from './ScoreDisplay.module.css';

const ScoreDisplay = ({ 
  currentLevel = 1, 
  showNewHighScoreIndicator = false,
  className = '' 
}) => {
  const { currentScore, highScore, isNewHighScore } = useScore();
  
  // Handle undefined values gracefully
  const safeCurrentScore = currentScore ?? 0;
  const safeHighScore = highScore ?? 0;
  const safeIsNewHighScore = isNewHighScore ? isNewHighScore() : false;
  
  // Show new high score indicator if explicitly passed or if it's a new high score
  const showIndicator = showNewHighScoreIndicator || safeIsNewHighScore;

  // Format numbers with US locale for consistent formatting
  const formatScore = (score) => {
    return score.toLocaleString('en-US');
  };

  return (
    <div className={`${styles.scoreDisplay} ${className}`}>
      <div className={`${styles.scoreItem} ${styles.currentScore}`}>
        <div className={styles.scoreLabel}>Current Score</div>
        <div className={styles.scoreValue}>
          {formatScore(safeCurrentScore)}
          {showIndicator && (
            <span className={styles.newHighScoreIndicator} aria-label="New high score!">
              🎉
            </span>
          )}
        </div>
      </div>
      <div className={`${styles.scoreItem} ${styles.highScore}`}>
        <div className={styles.scoreLabel}>High Score</div>
        <div className={styles.scoreValue}>{formatScore(safeHighScore)}</div>
      </div>
      <div className={styles.levelDisplay}>
        <div className={styles.levelLabel}>Level</div>
        <div className={styles.levelValue}>{currentLevel}</div>
      </div>
    </div>
  );
};

ScoreDisplay.propTypes = {
  currentLevel: PropTypes.number,
  showNewHighScoreIndicator: PropTypes.bool,
  className: PropTypes.string
};

export default ScoreDisplay;
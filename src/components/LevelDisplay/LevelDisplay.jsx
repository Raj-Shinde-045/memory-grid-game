import React from 'react';
import PropTypes from 'prop-types';
import styles from './LevelDisplay.module.css';

const LevelDisplay = ({ currentLevel, gridSize, previewTime }) => {
  const previewTimeSeconds = Math.round(previewTime / 1000);
  
  return (
    <div className={styles.levelDisplay}>
      <div className={styles.levelInfo}>
        <span className={styles.levelNumber}>Level {currentLevel}</span>
        <span className={styles.gridInfo}>{gridSize}×{gridSize} Grid</span>
        <span className={styles.previewInfo}>{previewTimeSeconds}s Preview</span>
      </div>
    </div>
  );
};

LevelDisplay.propTypes = {
  currentLevel: PropTypes.number.isRequired,
  gridSize: PropTypes.number.isRequired,
  previewTime: PropTypes.number.isRequired
};

export default LevelDisplay;
import React, { useEffect, useState } from 'react';
import useTimer from '../../hooks/useTimer';
import TimerDisplay from '../TimerDisplay/TimerDisplay';
import styles from './PreviewPhase.module.css';

const PreviewPhase = ({ 
  gridData, 
  gridSize, 
  previewDuration = 3000, 
  onPreviewComplete,
  gameMode = 'numbers',
  className = '' 
}) => {
  const [showNumbers, setShowNumbers] = useState(false);
  const [animationPhase, setAnimationPhase] = useState('entering'); // 'entering', 'showing', 'exiting'
  
  const {
    timeRemaining,
    isRunning,
    startTimer,
    getFormattedTime,
    getProgress
  } = useTimer();

  // Start preview when component mounts or when gridData changes
  useEffect(() => {
    if (gridData && gridData.length > 0) {
      setAnimationPhase('entering');
      setShowNumbers(false);
      
      // Small delay for entering animation
      const enterTimeout = setTimeout(() => {
        setShowNumbers(true);
        setAnimationPhase('showing');
        
        // Start the countdown timer
        startTimer(previewDuration, () => {
          setAnimationPhase('exiting');
          
          // Hide numbers with exit animation
          setTimeout(() => {
            setShowNumbers(false);
            if (onPreviewComplete) {
              onPreviewComplete();
            }
          }, 300); // Match CSS transition duration
        });
      }, 200);

      return () => {
        clearTimeout(enterTimeout);
      };
    }
  }, [gridData, previewDuration, startTimer, onPreviewComplete]);

  // Don't render if no grid data
  if (!gridData || gridData.length === 0) {
    return null;
  }

  // Create grid cells
  const renderGridCells = () => {
    return gridData.map((value, index) => {
      const row = Math.floor(index / gridSize);
      const col = index % gridSize;
      
      return (
        <div
          key={index}
          className={`${styles.gridCell} ${styles[animationPhase]} ${showNumbers ? styles.revealed : styles.hidden}`}
          style={{
            '--row': row,
            '--col': col,
            '--total-cells': gridData.length,
            '--animation-delay': `${(row + col) * 50}ms`
          }}
        >
          <div className={styles.cellContent}>
            {showNumbers && (
              <span className={styles.cellValue}>
                {gameMode === 'emojis' ? value : value}
              </span>
            )}
            {!showNumbers && (
              <span className={styles.cellPlaceholder}>?</span>
            )}
          </div>
        </div>
      );
    });
  };

  return (
    <div className={`${styles.previewPhase} ${className}`}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          {animationPhase === 'entering' && 'Get Ready...'}
          {animationPhase === 'showing' && 'Memorize the sequence!'}
          {animationPhase === 'exiting' && 'Now click in order!'}
        </h2>
        
        {isRunning && (
          <TimerDisplay
            timeRemaining={timeRemaining}
            totalDuration={previewDuration}
            isRunning={isRunning}
            getFormattedTime={getFormattedTime}
            getProgress={getProgress}
            className={styles.timer}
          />
        )}
      </div>

      <div 
        className={styles.gameGrid}
        style={{
          '--grid-size': gridSize
        }}
      >
        {renderGridCells()}
      </div>

      <div className={styles.instructions}>
        <p>
          {animationPhase === 'showing' && 'Remember the positions of numbers 1 through ' + (gridSize * gridSize)}
          {animationPhase === 'exiting' && 'Click the cells in ascending order: 1, 2, 3...'}
        </p>
      </div>
    </div>
  );
};

export default PreviewPhase;
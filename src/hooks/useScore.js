import { useState, useCallback, useEffect } from 'react';

const SCORE_MULTIPLIER = 100;
const HIGH_SCORE_KEY = 'memory-grid-game-high-score';

const useScore = () => {
  const [currentScore, setCurrentScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  // Load high score from localStorage on mount
  useEffect(() => {
    try {
      const savedHighScore = localStorage.getItem(HIGH_SCORE_KEY);
      if (savedHighScore) {
        const parsedScore = parseInt(savedHighScore, 10);
        if (!isNaN(parsedScore) && parsedScore >= 0) {
          setHighScore(parsedScore);
        }
      }
    } catch (error) {
      console.warn('Failed to load high score from localStorage:', error);
    }
  }, []);

  // Calculate score based on level difficulty
  const calculateLevelScore = useCallback((level, timeBonus = 0) => {
    if (typeof level !== 'number' || level < 1) {
      console.warn('Level must be a positive number');
      return 0;
    }

    if (typeof timeBonus !== 'number' || timeBonus < 0) {
      console.warn('Time bonus must be a non-negative number');
      timeBonus = 0;
    }

    // Base score increases with level difficulty
    // Level 1: 100 points, Level 2: 200 points, etc.
    const baseScore = level * SCORE_MULTIPLIER;
    
    // Add time bonus (if any)
    const totalScore = baseScore + timeBonus;
    
    return totalScore;
  }, []);

  // Add points to current score
  const addScore = useCallback((points) => {
    if (typeof points !== 'number' || points < 0) {
      console.warn('Points must be a non-negative number');
      return;
    }

    setCurrentScore(prevScore => {
      const newScore = prevScore + points;
      
      // Check if this is a new high score
      if (newScore > highScore) {
        setHighScore(newScore);
        
        // Save to localStorage
        try {
          localStorage.setItem(HIGH_SCORE_KEY, newScore.toString());
        } catch (error) {
          console.warn('Failed to save high score to localStorage:', error);
        }
      }
      
      return newScore;
    });
  }, [highScore]);

  // Add score for completing a level
  const addLevelScore = useCallback((level, timeBonus = 0) => {
    const levelScore = calculateLevelScore(level, timeBonus);
    addScore(levelScore);
    return levelScore;
  }, [calculateLevelScore, addScore]);

  // Reset current score to 0
  const resetCurrentScore = useCallback(() => {
    setCurrentScore(0);
  }, []);

  // Manually set high score (for testing or data migration)
  const setHighScoreManually = useCallback((score) => {
    if (typeof score !== 'number' || score < 0) {
      console.warn('High score must be a non-negative number');
      return;
    }

    setHighScore(score);
    
    try {
      localStorage.setItem(HIGH_SCORE_KEY, score.toString());
    } catch (error) {
      console.warn('Failed to save high score to localStorage:', error);
    }
  }, []);

  // Check if current score is a new high score
  const isNewHighScore = useCallback(() => {
    return currentScore > 0 && currentScore === highScore;
  }, [currentScore, highScore]);

  return {
    currentScore,
    highScore,
    calculateLevelScore,
    addScore,
    addLevelScore,
    resetCurrentScore,
    setHighScore: setHighScoreManually,
    isNewHighScore
  };
};

export default useScore;
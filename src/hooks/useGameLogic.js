import { useCallback } from 'react';

const useGameLogic = (gameState, gameActions) => {
  const { 
    currentSequence, 
    playerSequence, 
    gameStatus, 
    currentLevel,
    gridSize 
  } = gameState;
  
  const { 
    addToPlayerSequence, 
    setGameStatus, 
    updateScore, 
    advanceLevel, 
    resetPlayerSequence 
  } = gameActions;

  // Validate if a cell click is correct
  const validateCellClick = useCallback((cellValue) => {
    if (gameStatus !== 'playing') {
      return { isValid: false, reason: 'Game not in playing state' };
    }

    const expectedValue = playerSequence.length + 1;
    const isValid = cellValue === expectedValue;

    return { 
      isValid, 
      reason: isValid ? 'Correct' : `Expected ${expectedValue}, got ${cellValue}` 
    };
  }, [gameStatus, playerSequence]);

  // Handle cell click logic
  const handleCellClick = useCallback((cellValue) => {
    const validation = validateCellClick(cellValue);
    
    if (!validation.isValid) {
      // Game over - incorrect click
      setGameStatus('gameover');
      return { success: false, gameOver: true, reason: validation.reason };
    }

    // Add to player sequence
    addToPlayerSequence(cellValue);
    
    // Check if level is complete
    const newPlayerSequence = [...playerSequence, cellValue];
    const totalCells = gridSize * gridSize;
    
    if (newPlayerSequence.length === totalCells) {
      // Level complete
      const levelScore = calculateLevelScore(currentLevel);
      updateScore(levelScore);
      setGameStatus('levelcomplete');
      return { success: true, levelComplete: true, score: levelScore };
    }

    return { success: true, gameOver: false, levelComplete: false };
  }, [
    validateCellClick, 
    addToPlayerSequence, 
    playerSequence, 
    gridSize, 
    currentLevel, 
    updateScore, 
    setGameStatus
  ]);

  // Calculate score based on level difficulty
  const calculateLevelScore = useCallback((level) => {
    const baseScore = 100;
    const levelMultiplier = level;
    const gridSizeBonus = (level + 2) * (level + 2) * 10; // Grid size bonus
    return baseScore * levelMultiplier + gridSizeBonus;
  }, []);

  // Check if a cell should be clickable
  const isCellClickable = useCallback((cellValue) => {
    if (gameStatus !== 'playing') {
      return false;
    }

    // Cell is clickable if it's the next expected value in sequence
    const expectedValue = playerSequence.length + 1;
    return cellValue === expectedValue;
  }, [gameStatus, playerSequence]);

  // Check if a cell has been clicked (is in player sequence)
  const isCellClicked = useCallback((cellValue) => {
    return playerSequence.includes(cellValue);
  }, [playerSequence]);

  // Start playing phase (called after preview ends)
  const startPlaying = useCallback(() => {
    resetPlayerSequence();
    setGameStatus('playing');
  }, [resetPlayerSequence, setGameStatus]);

  // Handle level advancement
  const handleLevelAdvancement = useCallback(() => {
    advanceLevel();
  }, [advanceLevel]);

  // Reset game logic state
  const resetGameLogic = useCallback(() => {
    resetPlayerSequence();
  }, [resetPlayerSequence]);

  return {
    handleCellClick,
    validateCellClick,
    isCellClickable,
    isCellClicked,
    startPlaying,
    handleLevelAdvancement,
    resetGameLogic,
    calculateLevelScore
  };
};

export default useGameLogic;
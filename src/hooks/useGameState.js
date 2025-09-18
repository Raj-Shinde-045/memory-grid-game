import { useState, useCallback } from 'react';

const useGameState = () => {
  const [gameState, setGameState] = useState({
    currentLevel: 1,
    currentScore: 0,
    highScore: 0,
    gridSize: 3,
    gameMode: 'numbers', // 'numbers' | 'emojis'
    gameStatus: 'menu', // 'menu' | 'preview' | 'playing' | 'gameover' | 'levelcomplete'
    currentSequence: [],
    playerSequence: [],
    gridData: []
  });

  // Start a new game
  const startGame = useCallback(() => {
    setGameState(prevState => ({
      ...prevState,
      currentLevel: 1,
      currentScore: 0,
      gridSize: 3,
      gameStatus: 'preview',
      currentSequence: [],
      playerSequence: [],
      gridData: []
    }));
  }, []);

  // Advance to next level
  const advanceLevel = useCallback(() => {
    setGameState(prevState => ({
      ...prevState,
      currentLevel: prevState.currentLevel + 1,
      gridSize: prevState.gridSize + 1,
      gameStatus: 'preview',
      currentSequence: [],
      playerSequence: [],
      gridData: []
    }));
  }, []);

  // Update score
  const updateScore = useCallback((points) => {
    setGameState(prevState => {
      const newScore = prevState.currentScore + points;
      const newHighScore = Math.max(prevState.highScore, newScore);
      
      return {
        ...prevState,
        currentScore: newScore,
        highScore: newHighScore
      };
    });
  }, []);

  // Set game status
  const setGameStatus = useCallback((status) => {
    // Validate status
    const validStatuses = ['menu', 'preview', 'playing', 'gameover', 'levelcomplete'];
    if (!validStatuses.includes(status)) {
      console.warn(`Invalid game status: ${status}`);
      return;
    }

    setGameState(prevState => ({
      ...prevState,
      gameStatus: status
    }));
  }, []);

  // Set grid data
  const setGridData = useCallback((gridData) => {
    if (!Array.isArray(gridData)) {
      console.warn('Grid data must be an array');
      return;
    }

    setGameState(prevState => ({
      ...prevState,
      gridData: [...gridData]
    }));
  }, []);

  // Set current sequence
  const setCurrentSequence = useCallback((sequence) => {
    if (!Array.isArray(sequence)) {
      console.warn('Sequence must be an array');
      return;
    }

    setGameState(prevState => ({
      ...prevState,
      currentSequence: [...sequence]
    }));
  }, []);

  // Add to player sequence
  const addToPlayerSequence = useCallback((value) => {
    setGameState(prevState => ({
      ...prevState,
      playerSequence: [...prevState.playerSequence, value]
    }));
  }, []);

  // Reset player sequence
  const resetPlayerSequence = useCallback(() => {
    setGameState(prevState => ({
      ...prevState,
      playerSequence: []
    }));
  }, []);

  // Toggle game mode
  const toggleGameMode = useCallback(() => {
    setGameState(prevState => ({
      ...prevState,
      gameMode: prevState.gameMode === 'numbers' ? 'emojis' : 'numbers'
    }));
  }, []);

  // Reset game
  const resetGame = useCallback(() => {
    setGameState(prevState => ({
      ...prevState,
      currentLevel: 1,
      currentScore: 0,
      gridSize: 3,
      gameStatus: 'menu',
      currentSequence: [],
      playerSequence: [],
      gridData: []
    }));
  }, []);

  // Set high score (for loading from localStorage)
  const setHighScore = useCallback((score) => {
    if (typeof score !== 'number' || score < 0) {
      console.warn('High score must be a non-negative number');
      return;
    }

    setGameState(prevState => ({
      ...prevState,
      highScore: Math.max(prevState.highScore, score)
    }));
  }, []);

  return {
    gameState,
    startGame,
    advanceLevel,
    updateScore,
    setGameStatus,
    setGridData,
    setCurrentSequence,
    addToPlayerSequence,
    resetPlayerSequence,
    toggleGameMode,
    resetGame,
    setHighScore
  };
};

export default useGameState;
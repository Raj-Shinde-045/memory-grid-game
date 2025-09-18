// Custom hook for game state management - placeholder
import { useState } from 'react';

const useGameState = () => {
  // Game state implementation will be added in later tasks
  const [gameState, setGameState] = useState({
    currentLevel: 1,
    score: 0,
    gameStatus: 'menu'
  });

  return { gameState, setGameState };
};

export default useGameState;
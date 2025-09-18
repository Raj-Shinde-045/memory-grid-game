import React, { useState, useEffect } from 'react';
import GameGrid from './components/GameGrid/GameGrid';
import ScoreDisplay from './components/ScoreDisplay/ScoreDisplay';
import ConfettiAnimation from './components/ConfettiAnimation/ConfettiAnimation';
import RestartButton from './components/RestartButton/RestartButton';
import useGameState from './hooks/useGameState';
import './App.css';

function App() {
  const { gameState, resetGame, startGame } = useGameState();
  const [showConfetti, setShowConfetti] = useState(false);

  // Trigger confetti animation when level is completed
  useEffect(() => {
    if (gameState.gameStatus === 'levelcomplete') {
      setShowConfetti(true);
    }
  }, [gameState.gameStatus]);

  // Handle confetti animation completion
  const handleConfettiComplete = () => {
    setShowConfetti(false);
  };

  // Handle restart button click
  const handleRestart = () => {
    resetGame();
  };

  // Handle start game button click
  const handleStartGame = () => {
    startGame();
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Memory Grid Game</h1>
        <ScoreDisplay />
      </header>
      
      <main className="app-main">
        <GameGrid />
        
        <div className="game-controls">
          {gameState.gameStatus === 'menu' && (
            <button className="start-button" onClick={handleStartGame}>
              Start Game
            </button>
          )}
          
          {(gameState.gameStatus === 'playing' || 
            gameState.gameStatus === 'preview' || 
            gameState.gameStatus === 'levelcomplete') && (
            <RestartButton onClick={handleRestart} />
          )}
          
          {gameState.gameStatus === 'gameover' && (
            <div className="gameover-controls">
              <h2>Game Over!</h2>
              <RestartButton onClick={handleRestart} />
            </div>
          )}
        </div>
      </main>

      {/* Confetti animation for level completion */}
      <ConfettiAnimation 
        isActive={showConfetti}
        duration={3000}
        onComplete={handleConfettiComplete}
        particleCount={60}
      />
    </div>
  );
}

export default App;

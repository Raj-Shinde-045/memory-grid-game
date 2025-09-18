import React from 'react';
import GameGrid from './components/GameGrid/GameGrid';
import ScoreDisplay from './components/ScoreDisplay/ScoreDisplay';
import useGameState from './hooks/useGameState';
import './App.css';

function App() {
  const { gameState } = useGameState();

  return (
    <div className="app">
      <header className="app-header">
        <h1>Memory Grid Game</h1>
        <ScoreDisplay />
      </header>
      
      <main className="app-main">
        <GameGrid />
        
        <div className="game-controls">
          <button className="start-button">
            Start Game
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;

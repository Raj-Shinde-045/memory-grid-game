import React from 'react';
import GridCell from '../GridCell/GridCell';
import styles from './GameGrid.module.css';

const GameGrid = ({ 
  gridData = [], 
  gridSize = 3, 
  onCellClick,
  revealedCells = [],
  disabledCells = [],
  incorrectCells = [],
  flippingCells = []
}) => {
  const handleCellClick = (index) => {
    if (onCellClick) {
      onCellClick(index);
    }
  };

  return (
    <div 
      className={styles.gameGrid} 
      style={{ '--grid-size': gridSize }}
      role="grid"
      aria-label={`${gridSize}x${gridSize} memory game grid`}
    >
      {gridData.map((value, index) => (
        <GridCell
          key={index}
          value={value}
          isRevealed={revealedCells.includes(index)}
          isDisabled={disabledCells.includes(index)}
          isIncorrect={incorrectCells.includes(index)}
          isFlipping={flippingCells.includes(index)}
          onClick={() => handleCellClick(index)}
        />
      ))}
    </div>
  );
};

export default GameGrid;
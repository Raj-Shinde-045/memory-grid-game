/**
 * Fisher-Yates shuffle algorithm to randomly shuffle an array
 * @param {Array} array - The array to shuffle
 * @returns {Array} - A new shuffled array
 */
export function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Generate a random grid with numbers 1 to N where N = size * size
 * @param {number} size - The size of the grid (e.g., 3 for a 3x3 grid)
 * @returns {Array} - Array of shuffled numbers from 1 to N
 */
export function generateRandomGrid(size) {
  if (!size || size < 1) {
    throw new Error('Grid size must be a positive number');
  }
  
  const totalCells = size * size;
  const numbers = Array.from({ length: totalCells }, (_, i) => i + 1);
  return shuffleArray(numbers);
}

/**
 * Calculate grid size based on level
 * @param {number} level - The current level (starting from 1)
 * @returns {number} - The grid size for the given level
 */
export function calculateGridSize(level) {
  if (!level || level < 1) {
    throw new Error('Level must be a positive number');
  }
  
  // Start with 3x3 grid and increase by 1 for each level
  return 2 + level;
}

/**
 * Get the total number of cells for a given grid size
 * @param {number} size - The grid size
 * @returns {number} - The total number of cells
 */
export function getTotalCells(size) {
  if (!size || size < 1) {
    throw new Error('Grid size must be a positive number');
  }
  
  return size * size;
}

/**
 * Convert a linear index to row and column coordinates
 * @param {number} index - The linear index (0-based)
 * @param {number} size - The grid size
 * @returns {Object} - Object with row and col properties
 */
export function indexToCoordinates(index, size) {
  if (index < 0 || size < 1) {
    throw new Error('Invalid index or grid size');
  }
  
  return {
    row: Math.floor(index / size),
    col: index % size
  };
}

/**
 * Convert row and column coordinates to a linear index
 * @param {number} row - The row (0-based)
 * @param {number} col - The column (0-based)
 * @param {number} size - The grid size
 * @returns {number} - The linear index
 */
export function coordinatesToIndex(row, col, size) {
  if (row < 0 || col < 0 || size < 1) {
    throw new Error('Invalid coordinates or grid size');
  }
  
  return row * size + col;
}

/**
 * Check if all numbers from 1 to N are present in the grid
 * @param {Array} gridData - The grid data array
 * @param {number} expectedSize - The expected grid size
 * @returns {boolean} - True if all numbers are present
 */
export function validateGridData(gridData, expectedSize) {
  if (!Array.isArray(gridData)) {
    return false;
  }
  
  const expectedLength = expectedSize * expectedSize;
  if (gridData.length !== expectedLength) {
    return false;
  }
  
  const expectedNumbers = Array.from({ length: expectedLength }, (_, i) => i + 1);
  const sortedGridData = [...gridData].sort((a, b) => a - b);
  
  return expectedNumbers.every((num, index) => num === sortedGridData[index]);
}
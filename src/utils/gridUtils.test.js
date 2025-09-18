import { describe, it, expect, vi } from 'vitest';
import {
  shuffleArray,
  generateRandomGrid,
  calculateGridSize,
  getTotalCells,
  indexToCoordinates,
  coordinatesToIndex,
  validateGridData
} from './gridUtils';

describe('gridUtils', () => {
  describe('shuffleArray', () => {
    it('returns an array with the same length', () => {
      const original = [1, 2, 3, 4, 5];
      const shuffled = shuffleArray(original);
      expect(shuffled).toHaveLength(original.length);
    });

    it('contains all original elements', () => {
      const original = [1, 2, 3, 4, 5];
      const shuffled = shuffleArray(original);
      original.forEach(item => {
        expect(shuffled).toContain(item);
      });
    });

    it('does not modify the original array', () => {
      const original = [1, 2, 3, 4, 5];
      const originalCopy = [...original];
      shuffleArray(original);
      expect(original).toEqual(originalCopy);
    });

    it('handles empty array', () => {
      const result = shuffleArray([]);
      expect(result).toEqual([]);
    });

    it('handles single element array', () => {
      const result = shuffleArray([42]);
      expect(result).toEqual([42]);
    });

    it('produces different results with multiple calls (probabilistic)', () => {
      const original = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const results = [];
      
      // Generate multiple shuffles
      for (let i = 0; i < 10; i++) {
        results.push(shuffleArray(original).join(','));
      }
      
      // At least some should be different (very high probability)
      const uniqueResults = new Set(results);
      expect(uniqueResults.size).toBeGreaterThan(1);
    });
  });

  describe('generateRandomGrid', () => {
    it('generates grid with correct number of elements', () => {
      const grid = generateRandomGrid(3);
      expect(grid).toHaveLength(9);
    });

    it('contains numbers from 1 to N', () => {
      const grid = generateRandomGrid(3);
      const expectedNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      const sortedGrid = [...grid].sort((a, b) => a - b);
      expect(sortedGrid).toEqual(expectedNumbers);
    });

    it('works with different grid sizes', () => {
      const grid2x2 = generateRandomGrid(2);
      expect(grid2x2).toHaveLength(4);
      expect([...grid2x2].sort((a, b) => a - b)).toEqual([1, 2, 3, 4]);

      const grid4x4 = generateRandomGrid(4);
      expect(grid4x4).toHaveLength(16);
      expect([...grid4x4].sort((a, b) => a - b)).toEqual(
        Array.from({ length: 16 }, (_, i) => i + 1)
      );
    });

    it('throws error for invalid size', () => {
      expect(() => generateRandomGrid(0)).toThrow('Grid size must be a positive number');
      expect(() => generateRandomGrid(-1)).toThrow('Grid size must be a positive number');
      expect(() => generateRandomGrid()).toThrow('Grid size must be a positive number');
    });

    it('produces different arrangements (probabilistic)', () => {
      const grids = [];
      for (let i = 0; i < 10; i++) {
        grids.push(generateRandomGrid(3).join(','));
      }
      
      const uniqueGrids = new Set(grids);
      expect(uniqueGrids.size).toBeGreaterThan(1);
    });
  });

  describe('calculateGridSize', () => {
    it('calculates correct grid size for different levels', () => {
      expect(calculateGridSize(1)).toBe(3); // Level 1: 3x3
      expect(calculateGridSize(2)).toBe(4); // Level 2: 4x4
      expect(calculateGridSize(3)).toBe(5); // Level 3: 5x5
      expect(calculateGridSize(10)).toBe(12); // Level 10: 12x12
    });

    it('throws error for invalid level', () => {
      expect(() => calculateGridSize(0)).toThrow('Level must be a positive number');
      expect(() => calculateGridSize(-1)).toThrow('Level must be a positive number');
      expect(() => calculateGridSize()).toThrow('Level must be a positive number');
    });
  });

  describe('getTotalCells', () => {
    it('calculates correct total cells', () => {
      expect(getTotalCells(3)).toBe(9);
      expect(getTotalCells(4)).toBe(16);
      expect(getTotalCells(5)).toBe(25);
      expect(getTotalCells(1)).toBe(1);
    });

    it('throws error for invalid size', () => {
      expect(() => getTotalCells(0)).toThrow('Grid size must be a positive number');
      expect(() => getTotalCells(-1)).toThrow('Grid size must be a positive number');
      expect(() => getTotalCells()).toThrow('Grid size must be a positive number');
    });
  });

  describe('indexToCoordinates', () => {
    it('converts index to correct coordinates for 3x3 grid', () => {
      expect(indexToCoordinates(0, 3)).toEqual({ row: 0, col: 0 });
      expect(indexToCoordinates(1, 3)).toEqual({ row: 0, col: 1 });
      expect(indexToCoordinates(2, 3)).toEqual({ row: 0, col: 2 });
      expect(indexToCoordinates(3, 3)).toEqual({ row: 1, col: 0 });
      expect(indexToCoordinates(4, 3)).toEqual({ row: 1, col: 1 });
      expect(indexToCoordinates(8, 3)).toEqual({ row: 2, col: 2 });
    });

    it('works with different grid sizes', () => {
      expect(indexToCoordinates(0, 2)).toEqual({ row: 0, col: 0 });
      expect(indexToCoordinates(3, 2)).toEqual({ row: 1, col: 1 });
      
      expect(indexToCoordinates(0, 4)).toEqual({ row: 0, col: 0 });
      expect(indexToCoordinates(15, 4)).toEqual({ row: 3, col: 3 });
    });

    it('throws error for invalid inputs', () => {
      expect(() => indexToCoordinates(-1, 3)).toThrow('Invalid index or grid size');
      expect(() => indexToCoordinates(0, 0)).toThrow('Invalid index or grid size');
    });
  });

  describe('coordinatesToIndex', () => {
    it('converts coordinates to correct index for 3x3 grid', () => {
      expect(coordinatesToIndex(0, 0, 3)).toBe(0);
      expect(coordinatesToIndex(0, 1, 3)).toBe(1);
      expect(coordinatesToIndex(0, 2, 3)).toBe(2);
      expect(coordinatesToIndex(1, 0, 3)).toBe(3);
      expect(coordinatesToIndex(1, 1, 3)).toBe(4);
      expect(coordinatesToIndex(2, 2, 3)).toBe(8);
    });

    it('works with different grid sizes', () => {
      expect(coordinatesToIndex(0, 0, 2)).toBe(0);
      expect(coordinatesToIndex(1, 1, 2)).toBe(3);
      
      expect(coordinatesToIndex(0, 0, 4)).toBe(0);
      expect(coordinatesToIndex(3, 3, 4)).toBe(15);
    });

    it('throws error for invalid inputs', () => {
      expect(() => coordinatesToIndex(-1, 0, 3)).toThrow('Invalid coordinates or grid size');
      expect(() => coordinatesToIndex(0, -1, 3)).toThrow('Invalid coordinates or grid size');
      expect(() => coordinatesToIndex(0, 0, 0)).toThrow('Invalid coordinates or grid size');
    });
  });

  describe('validateGridData', () => {
    it('validates correct grid data', () => {
      expect(validateGridData([1, 2, 3, 4], 2)).toBe(true);
      expect(validateGridData([9, 1, 5, 3, 7, 2, 8, 4, 6], 3)).toBe(true);
      expect(validateGridData([1], 1)).toBe(true);
    });

    it('rejects invalid grid data', () => {
      // Wrong length
      expect(validateGridData([1, 2, 3], 2)).toBe(false);
      expect(validateGridData([1, 2, 3, 4, 5], 2)).toBe(false);
      
      // Missing numbers
      expect(validateGridData([1, 1, 3, 4], 2)).toBe(false);
      expect(validateGridData([1, 2, 3, 5], 2)).toBe(false);
      
      // Wrong numbers
      expect(validateGridData([0, 1, 2, 3], 2)).toBe(false);
      expect(validateGridData([2, 3, 4, 5], 2)).toBe(false);
    });

    it('handles non-array input', () => {
      expect(validateGridData(null, 2)).toBe(false);
      expect(validateGridData(undefined, 2)).toBe(false);
      expect(validateGridData('not an array', 2)).toBe(false);
      expect(validateGridData(123, 2)).toBe(false);
    });

    it('handles empty array', () => {
      expect(validateGridData([], 0)).toBe(true);
      expect(validateGridData([], 1)).toBe(false);
    });
  });

  describe('integration tests', () => {
    it('indexToCoordinates and coordinatesToIndex are inverse operations', () => {
      const size = 4;
      for (let i = 0; i < size * size; i++) {
        const coords = indexToCoordinates(i, size);
        const backToIndex = coordinatesToIndex(coords.row, coords.col, size);
        expect(backToIndex).toBe(i);
      }
    });

    it('generateRandomGrid produces valid grid data', () => {
      for (let size = 1; size <= 5; size++) {
        const grid = generateRandomGrid(size);
        expect(validateGridData(grid, size)).toBe(true);
      }
    });

    it('calculateGridSize and getTotalCells work together', () => {
      for (let level = 1; level <= 10; level++) {
        const gridSize = calculateGridSize(level);
        const totalCells = getTotalCells(gridSize);
        expect(totalCells).toBe(gridSize * gridSize);
      }
    });
  });
});
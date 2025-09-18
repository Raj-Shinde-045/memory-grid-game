import { 
  getEmojisForGrid, 
  getEmojiByIndex, 
  hasEnoughEmojis, 
  getMaxEmojiGridSize 
} from './emojiUtils';

describe('emojiUtils', () => {
  describe('getEmojisForGrid', () => {
    it('should return empty array for count 0', () => {
      const result = getEmojisForGrid(0);
      expect(result).toEqual([]);
    });

    it('should return empty array for negative count', () => {
      const result = getEmojisForGrid(-1);
      expect(result).toEqual([]);
    });

    it('should return correct number of emojis for valid count', () => {
      const result = getEmojisForGrid(5);
      expect(result).toHaveLength(5);
      expect(result.every(emoji => typeof emoji === 'string')).toBe(true);
    });

    it('should return first N emojis in order', () => {
      const result = getEmojisForGrid(3);
      expect(result[0]).toBe('🐶');
      expect(result[1]).toBe('🐱');
      expect(result[2]).toBe('🐭');
    });

    it('should handle requests larger than dataset', () => {
      const result = getEmojisForGrid(1000);
      expect(result.length).toBeLessThanOrEqual(100); // Our dataset has 100 emojis
    });
  });

  describe('getEmojiByIndex', () => {
    it('should return correct emoji for valid 1-based index', () => {
      const result = getEmojiByIndex(1);
      expect(result).toBe('🐶');
    });

    it('should return correct emoji for index 2', () => {
      const result = getEmojiByIndex(2);
      expect(result).toBe('🐱');
    });

    it('should return fallback emoji for index 0', () => {
      const result = getEmojiByIndex(0);
      expect(result).toBe('❓');
    });

    it('should return fallback emoji for negative index', () => {
      const result = getEmojiByIndex(-1);
      expect(result).toBe('❓');
    });

    it('should return fallback emoji for index too large', () => {
      const result = getEmojiByIndex(1000);
      expect(result).toBe('❓');
    });
  });

  describe('hasEnoughEmojis', () => {
    it('should return true for 3x3 grid', () => {
      const result = hasEnoughEmojis(3);
      expect(result).toBe(true);
    });

    it('should return true for 5x5 grid', () => {
      const result = hasEnoughEmojis(5);
      expect(result).toBe(true);
    });

    it('should return true for 10x10 grid', () => {
      const result = hasEnoughEmojis(10);
      expect(result).toBe(true);
    });

    it('should return false for very large grid', () => {
      const result = hasEnoughEmojis(20);
      expect(result).toBe(false);
    });

    it('should return true for 1x1 grid', () => {
      const result = hasEnoughEmojis(1);
      expect(result).toBe(true);
    });
  });

  describe('getMaxEmojiGridSize', () => {
    it('should return a reasonable maximum grid size', () => {
      const result = getMaxEmojiGridSize();
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThanOrEqual(10);
      expect(Number.isInteger(result)).toBe(true);
    });

    it('should return a size that fits within emoji dataset', () => {
      const maxSize = getMaxEmojiGridSize();
      const requiredEmojis = maxSize * maxSize;
      expect(hasEnoughEmojis(maxSize)).toBe(true);
    });
  });

  describe('emoji dataset integrity', () => {
    it('should have all unique emojis', () => {
      const emojis = getEmojisForGrid(100); // Get all available emojis
      const uniqueEmojis = new Set(emojis);
      expect(uniqueEmojis.size).toBe(emojis.length);
    });

    it('should have emojis that are strings', () => {
      const emojis = getEmojisForGrid(10);
      emojis.forEach(emoji => {
        expect(typeof emoji).toBe('string');
        expect(emoji.length).toBeGreaterThan(0);
      });
    });
  });
});
/**
 * Emoji dataset utility for the memory grid game
 * Provides distinguishable emojis for game mode
 */

// Carefully selected emojis that are visually distinct and universally supported
const EMOJI_DATASET = [
  '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯',
  '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦆',
  '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋',
  '🐌', '🐞', '🐜', '🦟', '🦗', '🕷️', '🦂', '🐢', '🐍', '🦎',
  '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟',
  '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦏', '🦛',
  '🐘', '🦒', '🦘', '🐪', '🐫', '🦙', '🦥', '🦨', '🦡', '🐾',
  '🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒',
  '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬',
  '🥒', '🌶️', '🫑', '🌽', '🥕', '🫒', '🧄', '🧅', '🥔', '🍠'
];

/**
 * Get a subset of emojis for a specific grid size
 * @param {number} count - Number of emojis needed
 * @returns {string[]} Array of emoji strings
 */
export const getEmojisForGrid = (count) => {
  if (count <= 0) {
    return [];
  }
  
  if (count > EMOJI_DATASET.length) {
    console.warn(`Requested ${count} emojis but only ${EMOJI_DATASET.length} available`);
    return EMOJI_DATASET.slice();
  }
  
  return EMOJI_DATASET.slice(0, count);
};

/**
 * Get emoji by index (1-based indexing to match game logic)
 * @param {number} index - 1-based index
 * @returns {string} Emoji string
 */
export const getEmojiByIndex = (index) => {
  if (index < 1 || index > EMOJI_DATASET.length) {
    console.warn(`Invalid emoji index: ${index}`);
    return '❓';
  }
  
  return EMOJI_DATASET[index - 1];
};

/**
 * Check if we have enough emojis for a given grid size
 * @param {number} gridSize - Grid size (e.g., 3 for 3x3 grid)
 * @returns {boolean} True if we have enough emojis
 */
export const hasEnoughEmojis = (gridSize) => {
  const requiredCount = gridSize * gridSize;
  return requiredCount <= EMOJI_DATASET.length;
};

/**
 * Get the maximum supported grid size for emoji mode
 * @returns {number} Maximum grid size
 */
export const getMaxEmojiGridSize = () => {
  return Math.floor(Math.sqrt(EMOJI_DATASET.length));
};

export default {
  getEmojisForGrid,
  getEmojiByIndex,
  hasEnoughEmojis,
  getMaxEmojiGridSize
};
import styles from './ModeToggle.module.css';

const ModeToggle = ({ gameMode, onToggle, disabled = false }) => {
  const handleToggle = () => {
    if (!disabled && onToggle) {
      onToggle();
    }
  };

  const handleKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
      e.preventDefault();
      handleToggle();
    }
  };

  return (
    <div className={styles.modeToggleContainer}>
      <label className={styles.modeToggleLabel}>
        Game Mode:
      </label>
      <button
        className={`${styles.modeToggle} ${disabled ? styles.disabled : ''}`}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-label={`Switch to ${gameMode === 'numbers' ? 'emoji' : 'number'} mode`}
        data-testid="mode-toggle-button"
      >
        <span className={`${styles.toggleOption} ${gameMode === 'numbers' ? styles.active : ''}`}>
          123
        </span>
        <span className={`${styles.toggleOption} ${gameMode === 'emojis' ? styles.active : ''}`}>
          😀
        </span>
        <div className={`${styles.toggleSlider} ${gameMode === 'emojis' ? styles.sliderRight : ''}`} />
      </button>
      <span className={styles.modeLabel}>
        {gameMode === 'numbers' ? 'Numbers' : 'Emojis'}
      </span>
    </div>
  );
};

export default ModeToggle;
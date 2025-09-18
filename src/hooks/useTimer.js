import { useState, useEffect, useCallback, useRef } from 'react';

const useTimer = () => {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);
  const onCompleteRef = useRef(null);

  // Clear any existing interval
  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Start timer with duration in milliseconds and optional callback
  const startTimer = useCallback((duration, onComplete) => {
    if (typeof duration !== 'number' || duration <= 0) {
      console.warn('Timer duration must be a positive number');
      return;
    }

    clearTimer();
    setTimeRemaining(duration);
    setIsRunning(true);
    setIsPaused(false);
    onCompleteRef.current = onComplete;

    intervalRef.current = setInterval(() => {
      setTimeRemaining(prevTime => {
        const newTime = prevTime - 100; // Update every 100ms for smooth countdown
        
        if (newTime <= 0) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          setIsRunning(false);
          setIsPaused(false);
          
          // Call completion callback if provided
          if (onCompleteRef.current && typeof onCompleteRef.current === 'function') {
            onCompleteRef.current();
          }
          
          return 0;
        }
        
        return newTime;
      });
    }, 100);
  }, [clearTimer]);

  // Pause the timer
  const pauseTimer = useCallback(() => {
    if (isRunning && !isPaused) {
      clearTimer();
      setIsPaused(true);
      setIsRunning(false);
    }
  }, [isRunning, isPaused, clearTimer]);

  // Resume the timer
  const resumeTimer = useCallback(() => {
    if (isPaused && timeRemaining > 0) {
      setIsPaused(false);
      setIsRunning(true);
      
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prevTime => {
          const newTime = prevTime - 100;
          
          if (newTime <= 0) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            setIsRunning(false);
            setIsPaused(false);
            
            // Call completion callback if provided
            if (onCompleteRef.current && typeof onCompleteRef.current === 'function') {
              onCompleteRef.current();
            }
            
            return 0;
          }
          
          return newTime;
        });
      }, 100);
    }
  }, [isPaused, timeRemaining]);

  // Reset the timer
  const resetTimer = useCallback(() => {
    clearTimer();
    setTimeRemaining(0);
    setIsRunning(false);
    setIsPaused(false);
    onCompleteRef.current = null;
  }, [clearTimer]);

  // Get formatted time string (e.g., "3.2s")
  const getFormattedTime = useCallback(() => {
    if (timeRemaining <= 0) {
      return '0.0s';
    }
    
    const totalSeconds = timeRemaining / 1000;
    const seconds = Math.floor(totalSeconds);
    const tenths = Math.floor((totalSeconds - seconds) * 10);
    
    return `${seconds}.${tenths}s`;
  }, [timeRemaining]);

  // Get progress percentage (0-100)
  const getProgress = useCallback((totalDuration) => {
    if (!totalDuration || totalDuration <= 0) {
      return 0;
    }
    
    return Math.max(0, Math.min(100, (timeRemaining / totalDuration) * 100));
  }, [timeRemaining]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, [clearTimer]);

  return {
    timeRemaining,
    isRunning,
    isPaused,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    getFormattedTime,
    getProgress
  };
};

export default useTimer;
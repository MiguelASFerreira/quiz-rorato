"use client";

import { useState, useEffect, useRef } from "react";

export function useTimer(initialTimeInMinutes: number = 3) {
  const [timeLeft, setTimeLeft] = useState(initialTimeInMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [totalTime, setTotalTime] = useState(initialTimeInMinutes * 60);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const newTime = initialTimeInMinutes * 60;
    setTimeLeft(newTime);
    setTotalTime(newTime);
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [initialTimeInMinutes]);

  const startTimer = () => {
    setIsRunning(true);
  };

  const resetTimer = (newTimeInMinutes?: number) => {
    const newTime = newTimeInMinutes
      ? newTimeInMinutes * 60
      : initialTimeInMinutes * 60;
    setTimeLeft(newTime);
    setTotalTime(newTime);
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const getTimeSpent = () => {
    return totalTime - timeLeft;
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const getProgressPercentage = () => {
    if (totalTime === 0) return 0;
    return Math.round(((totalTime - timeLeft) / totalTime) * 100);
  };

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, timeLeft]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    timeLeft,
    totalTime,
    isRunning,
    startTimer,
    resetTimer,
    getTimeSpent,
    formatTime: (seconds?: number) => formatTime(seconds ?? timeLeft),
    getProgressPercentage,
    isTimeUp: timeLeft === 0,
    timeLeftFormatted: formatTime(timeLeft),
    timeSpentFormatted: formatTime(getTimeSpent()),
  };
}

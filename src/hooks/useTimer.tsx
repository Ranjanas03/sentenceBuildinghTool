import { useState, useEffect } from 'react';

const useTimer = (initialTime: number) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (timeLeft === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const resetTimer = () => setTimeLeft(initialTime);
  const startTimer = () => setTimeLeft(initialTime);

  return { timeLeft, resetTimer, startTimer };
};

export default useTimer;

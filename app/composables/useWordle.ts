import { useState, useEffect, useCallback } from 'react';

interface Guess {
  word: string;
  colors: string[];
}

export function useWordle() {
  const [secretWord, setSecretWord] = useState<string>('');
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>('');
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  const WORD_LENGTH = 5;
  const MAX_ATTEMPTS = 6;

  // Fetch a random 5-letter word from the API.
  const fetchRandomWord = useCallback(async () => {
    try {
      const response = await fetch('https://random-word-api.herokuapp.com/word?length=5');
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setSecretWord(data[0].toUpperCase());
      }
    } catch (error) {
      console.error('Error fetching random word:', error);
    }
  }, []);

  const computeColors = useCallback((guess: string, answer: string): string[] => {
    const colors: string[] = new Array(guess.length).fill('absent');
    const answerLetterCount = new Map<string, number>();

    // Count letters in the answer
    for (const letter of answer) {
      answerLetterCount.set(letter, (answerLetterCount.get(letter) || 0) + 1);
    }

    // First pass: mark correct positions (green)
    for (let i = 0; i < guess.length; i++) {
      if (guess[i] === answer[i]) {
        colors[i] = 'correct';
        answerLetterCount.set(guess[i], answerLetterCount.get(guess[i])! - 1);
      }
    }

    // Second pass: mark present letters (yellow)
    for (let i = 0; i < guess.length; i++) {
      if (colors[i] === 'correct') continue;
      if (answerLetterCount.get(guess[i]) && answerLetterCount.get(guess[i])! > 0) {
        colors[i] = 'present';
        answerLetterCount.set(guess[i], answerLetterCount.get(guess[i])! - 1);
      }
    }

    return colors;
  }, []);

  const checkGuess = useCallback(() => {
    if (currentGuess.length !== WORD_LENGTH) return;
    const guessUpper = currentGuess.toUpperCase();
    setGuesses((prevGuesses) => [
      ...prevGuesses,
      { word: guessUpper, colors: computeColors(guessUpper, secretWord) },
    ]);
    setCurrentGuess('');
  }, [currentGuess, secretWord, computeColors]);

  const restartGame = useCallback(async () => {
    setGuesses([]);
    setCurrentGuess('');
    setIsGameOver(false);
    await fetchRandomWord();
  }, [fetchRandomWord]);

  useEffect(() => {
    fetchRandomWord();
  }, [fetchRandomWord]);

  useEffect(() => {
    if (guesses.some((guess) => guess.word === secretWord)) {
      setIsGameOver(true);
    } else if (guesses.length >= MAX_ATTEMPTS) {
      setIsGameOver(true);
    }
  }, [guesses, secretWord]);

  // Compute the board state
  const board = Array.from({ length: MAX_ATTEMPTS }, (_, i) => {
    if (i < guesses.length) {
      return guesses[i];
    } else if (i === guesses.length) {
      return {
        word: currentGuess.padEnd(WORD_LENGTH, ' '),
        colors: new Array(WORD_LENGTH).fill(''),
      };
    } else {
      return {
        word: ' '.repeat(WORD_LENGTH),
        colors: new Array(WORD_LENGTH).fill(''),
      };
    }
  });

  const isWin = guesses.some((guess) => guess.word === secretWord);

  // Global keydown event handler
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (isGameOver) return;
      const key = event.key.toUpperCase();
      if (key === 'BACKSPACE') {
        setCurrentGuess((prev) => prev.slice(0, -1));
      } else if (key === 'ENTER') {
        checkGuess();
      } else if (/^[A-Z]$/.test(key) && currentGuess.length < WORD_LENGTH) {
        setCurrentGuess((prev) => prev + key);
      }
    },
    [isGameOver, currentGuess, checkGuess]
  );

  // Add event listener on mount and remove on unmount
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return { board, isGameOver, isWin, restartGame, checkGuess, currentGuess, secretWord };
}

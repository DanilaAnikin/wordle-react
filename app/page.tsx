"use client"; // because of useWordle.ts file

import GuessGrid from './components/GuessGrid';
import { useWordle } from './composables/useWordle';

export default function Page() {
  const { board, isGameOver, isWin, restartGame, secretWord } = useWordle();

  return (
    <div className="flex flex-col items-center p-4">
      <GuessGrid board={board} />
      {isGameOver && (
        <div className="mt-4 flex flex-col items-center">
          {isWin ? (
            <p className="text-green-600 text-xl font-bold">
              Well done, you guessed the word in {board.length} try{board.length > 1 ? 'ies' : ''}!
            </p>
          ) : (
            <p className="text-red-500 text-xl">
              Game Over! The word was { secretWord }.
            </p>
          )}
          <button
            onClick={restartGame}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Restart Game
          </button>
        </div>
      )}
    </div>
  );
}

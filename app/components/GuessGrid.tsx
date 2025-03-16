import React from 'react';
import GuessRow from './GuessRow';

interface Guess {
  word: string;
  colors: ('correct' | 'present' | 'absent' | '')[];
}

interface GuessGridProps {
  board: Guess[];
}

const GuessGrid: React.FC<GuessGridProps> = ({ board }) => {
  return (
    <div>
      {board.map((row, index) => (
        <GuessRow key={index} guess={row} />
      ))}
    </div>
  );
};

export default GuessGrid;

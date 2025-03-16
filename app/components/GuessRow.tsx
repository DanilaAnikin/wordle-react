import React from 'react';
import LetterBox from './LetterBox';

interface Guess {
  word: string;
  colors: ('correct' | 'present' | 'absent' | '')[];
}

interface GuessRowProps {
  guess: Guess;
}

const GuessRow: React.FC<GuessRowProps> = ({ guess }) => {
  return (
    <div className="flex gap-2 mb-2">
      {guess.word.split('').map((letter, index) => (
        <LetterBox key={index} letter={letter === ' ' ? '' : letter} status={guess.colors[index] as 'correct' | 'present' | 'absent'} />
      ))}
    </div>
  );
};

export default GuessRow;

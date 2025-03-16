import React from 'react';

interface LetterBoxProps {
  letter: string;
  status?: 'correct' | 'present' | 'absent';
}

const LetterBox: React.FC<LetterBoxProps> = ({ letter, status }) => {
  const getColorClass = () => {
    switch (status) {
      case 'correct':
        return 'bg-green-500 border-green-500 text-white';
      case 'present':
        return 'bg-yellow-500 border-yellow-500 text-white';
      case 'absent':
        return 'bg-gray-400 border-gray-400 text-white';
      default:
        return 'bg-gray-300 border-gray-300 text-black';
    }
  };

  return (
    <div
      className={`w-12 h-12 flex items-center justify-center text-xl font-bold uppercase border ${getColorClass()}`}
    >
      {letter}
    </div>
  );
};

export default LetterBox;

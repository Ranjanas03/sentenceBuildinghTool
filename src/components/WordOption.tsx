import React from "react";

type WordOptionProps = {
  word: string;
  onSelect: (word: string) => void;
};

export const WordOption: React.FC<WordOptionProps> = ({ word, onSelect }) => {
  return (
    <button
      className="bg-blue-500 text-white px-4 py-2 rounded"
      onClick={() => onSelect(word)}
    >
      {word}
    </button>
  );
};

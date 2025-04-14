import React, { useState } from "react";
import { WordOption } from "./WordOption";

type QuestionCardProps = {
  question: string;
  options: string[];
  onSelectWord: (word: string) => void;
};

const QuestionCard: React.FC<QuestionCardProps> = ({ question, options, onSelectWord }) => {
  const [selectedWords, setSelectedWords] = useState<string[]>([]);

  const handleWordSelect = (word: string) => {
    if (!selectedWords.includes(word)) {
      setSelectedWords((prev) => [...prev, word]);
      onSelectWord(word);
    } else {
      setSelectedWords((prev) => prev.filter((w) => w !== word));
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <p>{question}</p>
      </div>
      <div className="flex gap-4">
        {options.map((word) => (
          <WordOption key={word} word={word} onSelect={handleWordSelect} />
        ))}
      </div>
      <div>
        {selectedWords.map((word, index) => (
          <span key={index} className="mr-2 text-xl">
            {word}
          </span>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;

import { useState, useEffect } from 'react';

interface FourPositionToggleProps {
  labels: [string, string, string, string];
  onChange: (label: string) => void;
  initial?: number;
}

const FourPositionToggle = ({ labels, onChange, initial = 0 }: FourPositionToggleProps) => {
  const [activeIndex, setActiveIndex] = useState(initial);
  
  console.log('FourPositionToggle loaded with labels:', labels);

  useEffect(() => {
    setActiveIndex(initial);
  }, [initial]);

  const handleClick = (index: number) => {
    setActiveIndex(index);
    onChange(labels[index]);
  };

  return (
    <div className="flex bg-gray-800 rounded-lg p-1 space-x-1">
      {labels.map((label, index) => (
        <button
          key={index}
          onClick={() => handleClick(index)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            activeIndex === index
              ? 'bg-blue-600 text-white shadow-lg'
              : 'text-gray-300 hover:text-white hover:bg-gray-700'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default FourPositionToggle;
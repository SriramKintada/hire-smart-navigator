import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface ThreePositionToggleProps {
  onChange?: (label: string) => void;
  initial?: number;
  labels?: string[];
}

export default function ThreePositionToggle({ onChange, initial = 1, labels = ["Left", "Middle", "Right"] }: ThreePositionToggleProps) {
  const [selected, setSelected] = useState(initial); // 0: Left, 1: Middle, 2: Right
  const width = 140; // px per option

  useEffect(() => {
    setSelected(initial);
  }, [initial]);

  return (
    <div className="w-full flex justify-center">
      <div className="relative flex bg-[#23243a] border border-[#2a2b3d] rounded-full shadow-xl px-2 py-2 gap-2" style={{ width: `${width * labels.length + 16}px` }}>
        {/* Animated highlight */}
        <motion.div
          className="absolute top-2 left-2 h-12 rounded-full bg-blue-600/90 shadow-lg border-2 border-blue-400 z-0"
          style={{ width: `${width - 8}px` }}
          animate={{ x: selected * (width + 8) }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
        {labels.map((label, idx) => (
          <button
            key={label}
            className={`relative z-10 flex-1 h-12 mx-0 rounded-full transition-colors duration-200 text-lg flex flex-col items-center justify-center font-semibold min-w-0
              ${selected === idx
                ? "text-white font-bold"
                : "text-gray-300 hover:text-white font-medium"}
            `}
            style={{ minWidth: width - 8 }}
            onClick={() => {
              setSelected(idx);
              onChange && onChange(label);
            }}
            type="button"
          >
            <span className="leading-tight whitespace-nowrap">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
} 
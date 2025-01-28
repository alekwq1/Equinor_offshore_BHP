// src/components/StartExploringButton.tsx
import React from "react";

interface StartExploringButtonProps {
  onClick?: () => void;
}

const StartExploringButton: React.FC<StartExploringButtonProps> = ({
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="
        relative
        w-40 h-40
        rounded-full
        bg-gradient-to-r from-blue-600 to-blue-400
        text-white
        overflow-hidden
        flex flex-col items-center justify-center
        shadow-lg
        transition-transform transform-gpu
        hover:scale-110
        active:scale-90
      "
    >
      {/* 
        Pulsujący „krąg” w tle.
        'absolute inset-0' sprawia, że wypełnia cały przycisk.
        'animate-ping' tworzy efekt „fali” rozchodzącej się od środka.
      */}
      <span
        className="
          absolute inset-0
          rounded-full
          bg-blue-500
          opacity-30
          animate-ping
        "
      />

      {/* 
        Właściwa treść przycisku, która jest 'nad' tłem
        (dzięki relative z-index).
      */}
      <span className="relative z-10 text-xl font-bold uppercase">
        Start Exploring
      </span>

      {/* 
        Symbol/ikona. Możesz dodać np. „play” albo „+” w SVG.
        Tu daję krzyżyk, który ładnie pokazuje się jako plus w stylu startu. 
      */}
      <svg
        className="relative z-10 w-6 h-6 mt-2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    </button>
  );
};

export default StartExploringButton;

// src/components/VideoModal.tsx
import React from "react";

interface VideoModalProps {
  onClose: () => void;
  youtubeUrl: string; // GŁÓWNA ZMIANA: przyjmujemy link do YouTube
}

const VideoModal: React.FC<VideoModalProps> = ({ onClose, youtubeUrl }) => {
  const handleOverlayClick = () => onClose();
  const handleModalClick = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <div
        className="bg-white p-4 rounded shadow-lg max-w-xl w-full"
        onClick={handleModalClick}
      >
        <div className="flex justify-end">
          <button onClick={onClose} className="text-gray-600 font-bold">
            X
          </button>
        </div>
        <h2 className="text-xl font-bold mb-2">YouTube Video</h2>
        {/* IFRAME zamiast <video> */}
        <iframe
          className="w-full aspect-video"
          src={youtubeUrl}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default VideoModal;

interface HelpModalProps {
  onClose: () => void; // Funkcja do zamykania okna
}

const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  const handleOverlayClick = () => {
    // Kliknięcie w tło zamyka okno
    onClose();
  };

  const handleModalClick = (e: React.MouseEvent) => {
    // Zatrzymujemy propagację, aby kliknięcie wewnątrz modala go nie zamykało
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <div
        className="bg-white p-4 rounded shadow-lg max-w-md w-full"
        onClick={handleModalClick}
      >
        <div className="flex justify-end">
          <button onClick={onClose} className="text-gray-600 font-bold">
            X
          </button>
        </div>
        <h2 className="text-xl font-bold mb-2">HELP Modal</h2>
        <p className="mb-4">Tutaj możesz dodać różne informacje pomocnicze.</p>
      </div>
    </div>
  );
};

export default HelpModal;

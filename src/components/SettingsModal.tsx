interface SettingsModalProps {
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const handleOverlayClick = () => {
    onClose();
  };

  const handleModalClick = (e: React.MouseEvent) => {
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
        <h2 className="text-xl font-bold mb-2">SETTINGS Modal</h2>
        <p className="mb-4">Możesz tu dodać np. różne opcje konfiguracji.</p>
      </div>
    </div>
  );
};

export default SettingsModal;

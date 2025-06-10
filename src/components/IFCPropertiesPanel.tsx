import { IFCElementProperties } from "./IFCModel"; // Upewnij się, że ścieżka się zgadza!

type IFCPropertiesPanelProps = {
  properties: IFCElementProperties;
  onClose: () => void;
};

export function IFCPropertiesPanel({
  properties,
  onClose,
}: IFCPropertiesPanelProps) {
  return (
    <div
      className="fixed top-4 right-4 p-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg max-w-xs"
      style={{
        zIndex: 2002,
        pointerEvents: "auto",
        boxShadow: "0 8px 32px rgba(0,0,0,0.28)",
      }}
    >
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-bold text-lg">IFC Properties</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>
      <div className="space-y-2 text-sm max-h-96 overflow-y-auto">
        {Object.entries(properties).map(([key, value]) => {
          const displayValue = value?.value ?? JSON.stringify(value);
          return (
            <div key={key} className="break-words">
              <span className="font-medium">{key}:</span> {String(displayValue)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default IFCPropertiesPanel;

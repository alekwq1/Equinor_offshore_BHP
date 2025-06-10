type TopBarButtonsProps = {
  objectUrl: string | null;
  showIFC: boolean;
  setShowIFC: (v: boolean) => void;
};

export function TopBarButtons({
  objectUrl,
  showIFC,
  setShowIFC,
}: TopBarButtonsProps) {
  if (!objectUrl) return null;

  return (
    <div
      style={{
        position: "fixed",
        left: 24,
        top: 24,
        zIndex: 50,
        background: "rgba(255,255,255,0.91)",
        backdropFilter: "blur(8px)",
        borderRadius: 11,
        boxShadow: "0 2px 8px rgba(33,140,227,0.08)",
        padding: "10px 18px",
        display: "flex",
        gap: 16,
      }}
    >
      <button
        onClick={() => setShowIFC(!showIFC)}
        style={{
          padding: "8px 22px",
          fontSize: 17,
          fontWeight: 600,
          borderRadius: 8,
          border: "none",
          background: showIFC ? "#16a34a" : "#ef4444",
          color: "white",
          transition: "background 0.2s",
          cursor: "pointer",
        }}
      >
        {showIFC ? "Hide IFC" : "Show IFC"}
      </button>
    </div>
  );
}

export default TopBarButtons;

import { useState } from "react";
type HowToUseModalProps = {
  onClose: () => void;
};

export function HowToUseModal({ onClose }: HowToUseModalProps) {
  const [isCloseHovered, setIsCloseHovered] = useState(false);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 1001,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(2px)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "white",
          padding: "2rem",
          borderRadius: "12px",
          maxWidth: "500px",
          position: "relative",
          boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ marginTop: 0, color: "#2261c5" }}>User manual</h2>
        <div style={{ lineHeight: 1.6 }}>
          <ul>
            <li>
              <b>WASD</b> – move camera
            </li>
            <li>
              <b>Q/E</b> – up/down camera
            </li>
            <li>
              <b>F</b> – fullscreen, <b>ESC</b> – exit fullscreen
            </li>
            <li>
              <b>R</b> – reset camera
            </li>
            <li>
              <b>Left mouse button</b> – rotate view
            </li>
            <li>
              <b>Right mouse button</b> – pan view
            </li>
            <li>
              <b>Mouse wheel</b> – zoom
            </li>
            <li>
              <b>Click info points</b>{" "}
              <span style={{ fontWeight: 700 }}>🏠</span> /{" "}
              <span style={{ fontWeight: 700 }}>🏗️</span> to focus camera and
              show info
            </li>
            <li>
              <b>Show IFC / GLB</b> – toggle models
            </li>
            <li>
              <b>GLB panel:</b> load, show/hide, and adjust XYZ position &
              rotation
            </li>
          </ul>
        </div>
        <button
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: "none",
            border: "none",
            fontSize: "1.5rem",
            cursor: "pointer",
            color: isCloseHovered ? "#2261c5" : "#666",
          }}
          onMouseEnter={() => setIsCloseHovered(true)}
          onMouseLeave={() => setIsCloseHovered(false)}
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default HowToUseModal;

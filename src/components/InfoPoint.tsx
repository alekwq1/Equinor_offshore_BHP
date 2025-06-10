import { Html } from "@react-three/drei";

export interface InfoPointData {
  id: string;
  position: [number, number, number];
  label: string;
  icon: string;
  content: string;
}

type InfoPointProps = {
  point: InfoPointData;
  isActive: boolean;
  onClick: () => void;
  onClose: () => void;
};

export function InfoPoint({
  point,
  isActive,
  onClick,
  onClose,
}: InfoPointProps) {
  return (
    <Html position={point.position} center>
      <div
        style={{
          background: "rgba(33, 140, 227, 0.9)",
          borderRadius: "50%",
          width: 38,
          height: 38,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "white",
          fontSize: 24,
          transition: "transform 0.18s cubic-bezier(.33,1.81,.73,.98)",
          transform: isActive ? "scale(1.23)" : "scale(1)",
          boxShadow: isActive
            ? "0 0 0 4px rgba(33,140,227,0.23)"
            : "0 2px 12px rgba(33,140,227,0.1)",
        }}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        {point.icon}
      </div>
      {isActive && (
        <div
          style={{
            position: "absolute",
            bottom: 48,
            left: "50%",
            transform: "translateX(-50%)",
            background: "white",
            borderRadius: 14,
            padding: "1.2rem",
            boxShadow: "0 8px 32px rgba(0,0,0,0.22)",
            width: 270,
            zIndex: 10,
            animation: "fadeIn .28s cubic-bezier(.47,2,.41,.92)",
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", marginBottom: 8 }}
          >
            <span style={{ fontSize: 22, marginRight: 8 }}>{point.icon}</span>
            <b style={{ fontSize: 16, color: "#2261c5" }}>{point.label}</b>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              style={{
                marginLeft: "auto",
                fontSize: 22,
                color: "#2261c5",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </div>
          <div style={{ color: "#444", whiteSpace: "pre-line", fontSize: 14 }}>
            {point.content}
          </div>
        </div>
      )}
    </Html>
  );
}

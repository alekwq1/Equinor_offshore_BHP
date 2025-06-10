type LoadingOverlayProps = {
  progress: number;
};

export function LoadingOverlay({ progress }: LoadingOverlayProps) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(255,255,255,0.9)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2001,
        fontSize: "1.5rem",
        fontWeight: "bold",
        color: "#2261c5",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            width: 64,
            height: 64,
            margin: "0 auto 16px auto",
            border: "6px solid #eee",
            borderTop: "6px solid #2190e3",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
        <div
          style={{
            fontSize: "2rem",
            color: "#2261c5",
            fontWeight: 700,
            marginBottom: 10,
            marginTop: 10,
          }}
        >
          Loading the model...
        </div>
        <div
          style={{
            width: 260,
            height: 12,
            background: "#e3ebf4",
            borderRadius: 8,
            margin: "0 auto",
            overflow: "hidden",
            marginBottom: 12,
            boxShadow: "0 2px 8px rgba(33,140,227,0.08)",
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              background: "linear-gradient(90deg, #2190e3 40%, #43d4ff 100%)",
              borderRadius: 8,
              transition: "width 0.17s cubic-bezier(.39,1.77,.71,.86)",
            }}
          />
        </div>
        <div style={{ color: "#2271c5", fontWeight: 600, fontSize: 18 }}>
          {progress}% loaded
        </div>
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }
      `}</style>
    </div>
  );
}

export default LoadingOverlay;

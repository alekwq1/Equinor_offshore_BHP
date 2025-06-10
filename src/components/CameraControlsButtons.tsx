type CameraControlsButtonsProps = {
  resetCamera: () => void;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
};

export function CameraControlsButtons({
  resetCamera,
  isFullscreen,
  toggleFullscreen,
}: CameraControlsButtonsProps) {
  return (
    <div
      style={{
        position: "fixed",
        right: 32,
        bottom: 26,
        zIndex: 40,
        display: "flex",
        gap: 16,
      }}
    >
      <button
        style={{
          background: "#2190e3",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: 54,
          height: 54,
          fontSize: 26,
          boxShadow: "0 2px 10px rgba(33,140,227,0.16)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        title="Reset camera"
        onClick={resetCamera}
      >
        🎥
      </button>
      <button
        style={{
          background: "#2190e3",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: 54,
          height: 54,
          fontSize: 27,
          boxShadow: "0 2px 10px rgba(33,140,227,0.16)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
        onClick={toggleFullscreen}
      >
        {isFullscreen ? "⤡" : "⤢"}
      </button>
    </div>
  );
}

export default CameraControlsButtons;

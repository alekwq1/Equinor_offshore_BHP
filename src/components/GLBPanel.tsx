type GLBPanelProps = {
  showGLB1: boolean;
  setShowGLB1: (v: boolean) => void;
  showGLB2: boolean;
  setShowGLB2: (v: boolean) => void;
  glbUrl1: string;
  setGlbUrl1: (url: string) => void;
  glbUrl2: string | null;
  setGlbUrl2: (url: string | null) => void;
  glbPos1: [number, number, number];
  setGlbPos1: (pos: [number, number, number]) => void;
  glbRot1: [number, number, number];
  setGlbRot1: (rot: [number, number, number]) => void;
  glbPos2: [number, number, number];
  setGlbPos2: (pos: [number, number, number]) => void;
  glbRot2: [number, number, number];
  setGlbRot2: (rot: [number, number, number]) => void;
};

function degToRad(deg: number) {
  return (deg * Math.PI) / 180;
}

export function GLBPanel(props: GLBPanelProps) {
  const {
    showGLB1,
    setShowGLB1,
    showGLB2,
    setShowGLB2,
    glbUrl1,
    setGlbUrl1,
    glbUrl2,
    setGlbUrl2,
    glbPos1,
    setGlbPos1,
    glbRot1,
    setGlbRot1,
    glbPos2,
    setGlbPos2,
    glbRot2,
    setGlbRot2,
  } = props;

  function handleFileChange(
    idx: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (idx === 0) setGlbUrl1(url);
    if (idx === 1) setGlbUrl2(url);
  }

  function handleGlbPos(idx: number, axis: number, value: number) {
    const setter = idx === 0 ? setGlbPos1 : setGlbPos2;
    const current = idx === 0 ? glbPos1 : glbPos2;
    setter(
      current.map((v, i) => (i === axis ? value : v)) as [
        number,
        number,
        number
      ]
    );
  }

  function handleGlbRot(idx: number, axis: number, value: number) {
    const setter = idx === 0 ? setGlbRot1 : setGlbRot2;
    const current = idx === 0 ? glbRot1 : glbRot2;
    setter(
      current.map((v, i) => (i === axis ? degToRad(value) : v)) as [
        number,
        number,
        number
      ]
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        left: 22,
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 60,
        background: "#fff",
        borderRadius: 11,
        boxShadow: "0 2px 12px #bbb7",
        padding: "14px 22px",
        minWidth: 250,
      }}
    >
      <div
        style={{
          fontWeight: 700,
          fontSize: 17,
          color: "#2261c5",
          marginBottom: 10,
        }}
      >
        GLB Models
      </div>
      {[0, 1].map((idx) => (
        <div key={idx} style={{ marginBottom: 13 }}>
          <div style={{ fontWeight: 600, color: "#555", marginBottom: 5 }}>
            Model {idx + 1}
          </div>
          <div
            style={{
              display: "flex",
              gap: 6,
              alignItems: "center",
              marginBottom: 4,
            }}
          >
            <input
              type="file"
              accept=".glb"
              onChange={(e) => handleFileChange(idx, e)}
              style={{ width: 120 }}
            />
            <button
              style={{
                padding: "5px 14px",
                borderRadius: 8,
                border: "none",
                background:
                  idx === 0
                    ? showGLB1
                      ? "#16a34a"
                      : "#ef4444"
                    : showGLB2
                    ? "#16a34a"
                    : "#ef4444",
                color: "#fff",
                fontWeight: 700,
                cursor: "pointer",
                fontSize: 15,
              }}
              onClick={() =>
                idx === 0 ? setShowGLB1(!showGLB1) : setShowGLB2(!showGLB2)
              }
            >
              {idx === 0
                ? showGLB1
                  ? "Hide"
                  : "Show"
                : showGLB2
                ? "Hide"
                : "Show"}
            </button>
          </div>
          <div
            style={{
              display: "flex",
              gap: 4,
              alignItems: "center",
              fontSize: 14,
              marginBottom: 2,
            }}
          >
            <span>XYZ:</span>
            {[0, 1, 2].map((ax) => (
              <input
                key={ax}
                type="number"
                value={idx === 0 ? glbPos1[ax] : glbPos2[ax]}
                step={0.1}
                style={{ width: 34, marginLeft: 2 }}
                onChange={(e) =>
                  handleGlbPos(idx, ax, parseFloat(e.target.value))
                }
                title={`Position ${["X", "Y", "Z"][ax]}`}
              />
            ))}
          </div>
          <div
            style={{
              display: "flex",
              gap: 4,
              alignItems: "center",
              fontSize: 14,
            }}
          >
            <span>Rot:</span>
            {[0, 1, 2].map((ax) => (
              <input
                key={ax}
                type="number"
                value={Math.round(
                  ((((idx === 0 ? glbRot1[ax] : glbRot2[ax]) * 180) / Math.PI) *
                    100) /
                    100
                )}
                step={1}
                min={-180}
                max={180}
                style={{ width: 34, marginLeft: 2 }}
                onChange={(e) =>
                  handleGlbRot(idx, ax, parseFloat(e.target.value))
                }
                title={`Rotation ${["X", "Y", "Z"][ax]} (deg)`}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default GLBPanel;

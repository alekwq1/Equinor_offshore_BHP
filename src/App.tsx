import React, { Suspense } from "react";
import {
  Environment,
  OrbitControls,
  PerformanceMonitor,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Splat } from "./splat-object"; // Ensure this component exists
import { Leva, useControls } from "leva";
import { useState, useRef, useEffect } from "react";
import * as THREE from "three";

const urls = [
  "https://huggingface.co/datasets/Alekso/Equinor_Base_20240604/resolve/main/EQUINOR_20240604.splat",
];

interface LoadingScreenProps {
  progress: number;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ progress }) => (
  <div
    className={`loading-screen ${
      progress < 100 ? "" : "loading-screen--hidden"
    }`}
  >
    <div className="loading-screen_container">
      <h1 className="loading-screen__title">EQ_LEBA_BASE</h1>
      <div className="progress__container">
        <div className="progress__bar" style={{ width: `${progress}%` }}></div>
      </div>
      <p>Loading model: {progress.toFixed(2)}%</p>
    </div>
  </div>
);

function App() {
  const { url, throttleDpr, maxDpr, throttleSplats, maxSplats } = useControls({
    url: { label: "Model URL", options: urls },
    throttleDpr: { label: "Degrade pixel ratio based on perf.", value: false },
    maxDpr: { label: "Max pixel ratio", value: window?.devicePixelRatio ?? 1 },
    throttleSplats: {
      label: "Degrade splat count based on perf.",
      value: false,
    },
    maxSplats: { label: "Max splat count", value: 10000000 },
  });

  const [factor, setFactor] = useState(1);
  const dpr = Math.min(maxDpr, Math.round(0.5 + 1.5 * factor));
  const effectiveDpr = throttleDpr ? Math.min(maxDpr, dpr) : maxDpr;
  const [splats, setSplats] = useState(maxSplats);
  const effectiveSplats = throttleSplats
    ? Math.min(maxSplats, splats)
    : maxSplats;

  const [progress, setProgress] = useState(0);
  const [loadedData, setLoadedData] = useState<Blob | null>(null);
  const axesRef = useRef<THREE.AxesHelper | null>(null);

  useEffect(() => {
    const downloadFile = async () => {
      const response = await fetch(url);
      const reader = response.body?.getReader();
      const contentLength = response.headers.get("content-length");
      let receivedLength = 0;
      const chunks: Uint8Array[] = [];

      if (!contentLength) {
        console.warn("Nie można odczytać długości pliku!");
        return;
      }

      const totalLength = parseInt(contentLength, 10);

      while (receivedLength < totalLength) {
        const { done, value } = (await reader?.read()) ?? {};
        if (done) break;
        if (value) {
          chunks.push(value);
          receivedLength += value.length;
          setProgress((receivedLength / totalLength) * 100);
        }
      }

      setLoadedData(new Blob(chunks));
    };

    downloadFile();
  }, [url]);

  return (
    <>
      <Leva oneLineLabels collapsed />
      <LoadingScreen progress={progress} />
      <Canvas
        className="h-full w-full bg-black"
        gl={{ antialias: false }}
        dpr={effectiveDpr}
        camera={{ position: [7, 8, 2.5], fov: 40 }}
      >
        <PerformanceMonitor
          ms={250}
          iterations={1}
          step={1}
          onIncline={({ factor }) => {
            setFactor(factor);
            setSplats(
              Math.min(
                maxSplats,
                Math.round((0.9 + 0.2 * factor) * effectiveSplats)
              )
            );
          }}
          onDecline={({ factor }) => {
            setFactor(factor);
            setSplats(
              Math.min(
                maxSplats,
                Math.round((0.9 + 0.2 * factor) * effectiveSplats)
              )
            );
          }}
        />
        <OrbitControls
          target={[0, -2, 3]}
          minDistance={8}
          maxDistance={13}
          minPolarAngle={Math.PI / 20}
          maxPolarAngle={Math.PI / 3}
          enablePan={false}
          onChange={(e) => {
            if (e && axesRef.current) {
              const { x, y, z } = e.target.target;
              axesRef.current.position.set(x, y, z);
            }
          }}
        />
        <Suspense fallback={null}>
          {loadedData ? (
            <group position={[0, 0, 0]} scale={[10, 10, 10]}>
              <Splat
                url={URL.createObjectURL(loadedData)}
                maxSplats={effectiveSplats}
              />
            </group>
          ) : (
            <mesh position={[10, 1, 5]}>
              <sphereGeometry args={[0.1, 16, 16]} />
              <meshStandardMaterial color="red" />
            </mesh>
          )}
          <Environment preset="city" />
        </Suspense>
      </Canvas>
      <div className="absolute bottom-0 left-0 rounded-lg bg-white shadow border-gray-200 p-2 m-4">
        {factor < 1.0 && (throttleSplats || throttleDpr) && (
          <div className="text-red-500">
            Quality degraded to save FPS! You can disable this in settings.
          </div>
        )}
        {factor < 0.5 && !throttleSplats && !throttleDpr && (
          <div className="text-red-500">
            FPS degraded! You can enable quality tuning in settings.
          </div>
        )}
        <div>Perf factor: {factor.toFixed(2)}</div>
        <div>Applied pixel ratio: {effectiveDpr.toFixed(2)}</div>
        <div>Applied splat count: {(effectiveSplats / 1e6).toFixed(2)}M</div>
      </div>
    </>
  );
}

export default App;

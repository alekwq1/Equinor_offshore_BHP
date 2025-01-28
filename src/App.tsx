import React, { Suspense, useState, useRef, useEffect } from "react";
import {
  Environment,
  OrbitControls,
  PerformanceMonitor,
  TransformControls,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Splat } from "./splat-object";
import { Leva, useControls } from "leva";
import * as THREE from "three";
import VideoModal from "./components/VideoModal.tsx";
import HelpModal from "./components/HelpModal.tsx";
import SettingsModal from "./components/SettingsModal.tsx";
import StartExploringButton from "./components/StartExploringButton.tsx";
import IFCModel, { type IFCProps } from "./components/IFCModel.tsx";

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
  const [isTransforming, setIsTransforming] = useState(false);
  const { url, throttleDpr, maxDpr, throttleSplats, maxSplats, transformMode } =
    useControls({
      url: { label: "Model URL", options: urls },
      throttleDpr: {
        label: "Degrade pixel ratio based on perf.",
        value: false,
      },
      maxDpr: {
        label: "Max pixel ratio",
        value: window?.devicePixelRatio ?? 1,
      },
      throttleSplats: {
        label: "Degrade splat count based on perf.",
        value: false,
      },
      maxSplats: { label: "Max splat count", value: 10000000 },
      transformMode: {
        // dodaj tę nową właściwość
        label: "Tryb transformacji",
        options: {
          Przesuń: "translate",
          Obróć: "rotate",
          Skaluj: "scale",
        },
        value: "translate", // wartość domyślna
      },
    });

  const [hasStarted, setHasStarted] = useState(false);
  const [factor, setFactor] = useState(1);
  const dpr = Math.min(maxDpr, Math.round(0.5 + 1.5 * factor));
  const effectiveDpr = throttleDpr ? Math.min(maxDpr, dpr) : maxDpr;
  const [splats, setSplats] = useState(maxSplats);
  const effectiveSplats = throttleSplats
    ? Math.min(maxSplats, splats)
    : maxSplats;

  const [progress, setProgress] = useState(0);
  const [loadedData, setLoadedData] = useState<Blob | null>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [ifcProperties, setIfcProperties] = useState<IFCProps | null>(null);
  const axesRef = useRef<THREE.AxesHelper | null>(null);

  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    if (loadedData) {
      const url = URL.createObjectURL(loadedData);
      setObjectUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [loadedData]);

  const openVideoModal = () => setIsVideoOpen(true);
  const closeVideoModal = () => setIsVideoOpen(false);

  const openHelpModal = () => setIsHelpOpen(true);
  const closeHelpModal = () => setIsHelpOpen(false);

  const openSettingsModal = () => setIsSettingsOpen(true);
  const closeSettingsModal = () => setIsSettingsOpen(false);

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

      const blob = new Blob(chunks);
      setLoadedData(blob);
    };

    downloadFile();
  }, [url]);

  return (
    <>
      <Leva oneLineLabels collapsed />
      <LoadingScreen progress={progress} />

      {progress >= 100 && !hasStarted && (
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <StartExploringButton
            onClick={() => {
              console.log("Start Exploring clicked!");
              setHasStarted(true);
            }}
          />
        </div>
      )}

      <div className="absolute top-4 left-4 flex space-x-2 z-[999]">
        <button
          onClick={openVideoModal}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          VIDEO
        </button>
        <button
          onClick={openHelpModal}
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
        >
          HELP
        </button>
        <button
          onClick={openSettingsModal}
          className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
        >
          SETTINGS
        </button>
      </div>

      {isVideoOpen && (
        <VideoModal
          onClose={closeVideoModal}
          youtubeUrl="https://www.youtube.com/embed/PrSc-xK2gLE"
        />
      )}
      {isHelpOpen && <HelpModal onClose={closeHelpModal} />}
      {isSettingsOpen && <SettingsModal onClose={closeSettingsModal} />}

      <Canvas
        className="h-full w-full bg-black"
        gl={{ antialias: false }}
        dpr={effectiveDpr}
        camera={{ position: [150, 150, 32], fov: 40 }}
      >
        <ambientLight intensity={0.8} />
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
          enabled={!isTransforming}
          target={[0, -25, 45]}
          minDistance={35}
          maxDistance={220}
          minPolarAngle={Math.PI / 20}
          maxPolarAngle={Math.PI / 3}
          enablePan={true}
          // Dodaj te nowe właściwości
          rotateSpeed={0.6} // Kontroluje prędkość obracania (domyślnie 1)
          enableDamping={false} // Wyłącza płynne wygaszanie ruchu
          dampingFactor={0} // Całkowicie wyłącza efekt bezwładności
          autoRotate={false} // Wyłącza automatyczne obracanie
          onChange={(e) => {
            if (e && axesRef.current) {
              const { x, y, z } = e.target.target;
              axesRef.current.position.set(x, y, z);
            }
          }}
        />
        <Suspense fallback={null}>
          {objectUrl ? (
            <group position={[0, 0, 0]} scale={[270, 270, 270]}>
              <Splat url={objectUrl} maxSplats={effectiveSplats} />
            </group>
          ) : (
            <mesh position={[10, 1, 5]}>
              <sphereGeometry args={[0.1, 16, 16]} />
              <meshStandardMaterial color="red" />
            </mesh>
          )}
          <IFCModel onPropertiesSelected={setIfcProperties} />

          <TransformControls
            mode={transformMode as "translate" | "rotate" | "scale"}
            space="world"
            onMouseDown={() => setIsTransforming(true)}
            onMouseUp={() => setIsTransforming(false)}
          >
            <group position={[0, 0, 0]}>
              <mesh scale={[1, 1, 1]}>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial
                  color="orange"
                  transparent
                  opacity={0.7}
                  wireframe={false}
                />
              </mesh>
              <axesHelper args={[1.5]} />
            </group>
          </TransformControls>

          <Environment preset="city" />
        </Suspense>
      </Canvas>

      {ifcProperties && (
        <div className="absolute top-4 right-4 p-4 bg-white shadow-lg rounded-lg max-w-xs max-h-60 overflow-auto">
          <h2 className="font-bold text-lg mb-2">Właściwości IFC</h2>
          <div className="text-sm space-y-1">
            {Object.entries(ifcProperties).map(([key, value]) => (
              <div key={key}>
                <span className="font-semibold">{key}:</span>{" "}
                {String((value as { value?: unknown })?.value)}
              </div>
            ))}
          </div>
        </div>
      )}

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

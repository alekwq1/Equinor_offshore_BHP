import React, { Suspense, useState, useEffect } from "react";
import {
  Environment,
  OrbitControls,
  PerformanceMonitor,
  TransformControls,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Splat } from "./splat-object";
import { Leva, useControls } from "leva";
import VideoModal from "./components/VideoModal.tsx";
import HelpModal from "./components/HelpModal.tsx";
import SettingsModal from "./components/SettingsModal.tsx";
import IFCModel, { type IFCProps } from "./components/IFCModel.tsx";

const urls = [
  "https://huggingface.co/datasets/Alekso/Equinor_Base_20240604/resolve/main/EQUINOR_20240604.splat",
  "https://huggingface.co/Alekso/Equinor29012025/resolve/main/Equinor_29_01_2025.splat",
];

interface LoadingScreenProps {
  progress: number;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ progress }) => (
  <div
    className={`fixed inset-0 bg-black transition-opacity duration-1000 ${
      progress < 100 ? "opacity-100" : "opacity-0 pointer-events-none"
    }`}
  >
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          EQ_LEBA_BASE
        </h1>
        <div className="w-64 h-2 bg-gray-700 rounded-full mx-auto">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-white text-lg">{progress.toFixed(0)}% loaded</p>
      </div>
    </div>
  </div>
);

const LandingPage: React.FC<{
  onStart: () => void;
  onOpenVideo: () => void;
  onOpenHelp: () => void;
  onOpenSettings: () => void;
}> = ({ onStart, onOpenVideo, onOpenHelp, onOpenSettings }) => (
  <div className="fixed inset-0 z-50">
    {/* Warstwy tła - dodajemy pointer-events-none */}
    <div className="absolute inset-0 bg-gradient-to-b from-black/90 to-black/30 pointer-events-none">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-90 pointer-events-none" />
    </div>

    <nav className="absolute top-0 left-0 z-50 flex items-start p-6 md:p-8">
      <div className="flex gap-4 md:gap-6">
        <button
          onClick={onOpenVideo}
          className="text-white hover:text-blue-400 transition-colors"
        >
          Video
        </button>
        <button
          onClick={onOpenHelp}
          className="text-white hover:text-blue-400 transition-colors"
        >
          Help
        </button>
        <button
          onClick={onOpenSettings}
          className="text-white hover:text-blue-400 transition-colors"
        >
          Settings
        </button>

        <div className="fixed bottom-4 left-4 z-50 flex gap-4">
          <a
            href="https://www.instagram.com/equinor/?hl=en"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-blue-400 transition-colors"
          >
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
          </a>
          <a
            href="https://x.com/Equinor"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-blue-400 transition-colors"
          >
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
            </svg>
          </a>
          <a
            href="https://www.facebook.com/Equinor/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-blue-400 transition-colors"
          >
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </a>
        </div>
      </div>
    </nav>

    {/* Główna zawartość - zmniejszamy z-index */}
    <div className="absolute inset-0 flex flex-col items-center text-center px-4 z-30">
      <h1 className="text-4xl md:text-4xl font-bold text-white leading-tight mt-8">
        Discover the Future of Energy Infrastructure
      </h1>
      <div className="flex-grow flex items-center justify-center">
        <button
          onClick={onStart}
          className="relative bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg md:text-xl transition-all duration-500 transform hover:scale-[1.03] hover:shadow-2xl group overflow-hidden"
        >
          <span className="relative z-10 inline-block transition-transform duration-300 group-hover:-translate-y-[2px]">
            Start Virtual Tour
          </span>
          <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute inset-0 border-2 border-blue-400 rounded-full animate-border-pulse" />
          </div>
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <div className="absolute top-0 -left-full h-full w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-shimmer transition-all duration-1000" />
          </div>
          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-blue-600/40 via-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </button>
      </div>
      <p className="text-lg md:text-xl text-gray-300 mb-16 -mt-4">
        Immersive 3D exploration of Equinor's O&M Leba Base
      </p>
    </div>

    {/* Przyciski na dole - dodajemy z-50 i poprawiamy linki */}
    <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-8 z-50">
      {[
        {
          label: "Technology",
          url: "https://www.equinor.com/energy/digitalisation",
        },
        {
          label: "Sustainability",
          url: "https://www.equinor.com/sustainability",
        },
        {
          label: "Innovation",
          url: "https://www.equinor.com/energy/innovation",
        },
        {
          label: "Contact",
          url: "https://www.equinor.com/about-us/contact-us",
        },
      ].map((button) => (
        <a
          key={button.label}
          href={button.url}
          className="text-gray-300 hover:text-white text-sm uppercase tracking-wider transition-colors px-2 py-1"
          target="_blank"
          rel="noopener noreferrer"
        >
          {button.label}
        </a>
      ))}
    </div>
  </div>
);

function App() {
  const [isTransforming, setIsTransforming] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadedData, setLoadedData] = useState<Blob | null>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [ifcProperties, setIfcProperties] = useState<IFCProps | null>(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAssistantEnlarged, setIsAssistantEnlarged] = useState(false);
  const [assistantText, setAssistantText] = useState("");

  const { url, throttleDpr, maxDpr, throttleSplats, maxSplats, transformMode } =
    useControls({
      url: { label: "Model URL", options: urls },
      throttleDpr: { value: false },
      maxDpr: { value: window?.devicePixelRatio ?? 1 },
      throttleSplats: { value: false },
      maxSplats: { value: 10000000 },
      transformMode: {
        options: { Przesuń: "translate", Obróć: "rotate", Skaluj: "scale" },
        value: "translate",
      },
    });

  const [factor, setFactor] = useState(1);
  const dpr = Math.min(maxDpr, Math.round(0.5 + 1.5 * factor));
  const effectiveDpr = throttleDpr ? Math.min(maxDpr, dpr) : maxDpr;
  const [splats, setSplats] = useState(maxSplats);
  const effectiveSplats = throttleSplats
    ? Math.min(maxSplats, splats)
    : maxSplats;

  useEffect(() => {
    if (loadedData) {
      const url = URL.createObjectURL(loadedData);
      setObjectUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [loadedData]);

  useEffect(() => {
    const downloadFile = async () => {
      const response = await fetch(url);
      const reader = response.body?.getReader();
      const contentLength = response.headers.get("content-length");
      let receivedLength = 0;
      const chunks: Uint8Array[] = [];

      if (!contentLength) return;

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
      {/* Virtual Assistant */}
      <div
        className="fixed bottom-4 right-4 z-[100] cursor-pointer"
        onClick={() => {
          setIsAssistantEnlarged(!isAssistantEnlarged);
          setAssistantText((prev) =>
            prev ? "" : "How can I assist you today?"
          );
        }}
      >
        <div
          className={`relative transition-transform duration-300 ease-in-out ${
            isAssistantEnlarged ? "scale-150 origin-bottom-right" : "scale-100"
          }`}
        >
          <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm shadow-lg ring-2 ring-blue-200">
            <img
              src="/assistant.png"
              alt="Virtual Assistant"
              className="w-full h-full rounded-full object-cover p-2"
            />
            <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs text-white animate-pulse">
              ?
            </div>
          </div>
        </div>

        {assistantText && (
          <div className="absolute right-0 -top-[200px] w-64 p-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg text-sm border border-blue-100">
            {assistantText}
            <div className="mt-2 space-y-2">
              <div className="text-gray-600">
                1. Loading progress: {progress.toFixed(0)}%
              </div>
              <div className="text-gray-600">2. Click anywhere to start</div>
              <div className="text-gray-600">3. Use WASD to move</div>
            </div>
          </div>
        )}
      </div>
      {progress >= 100 && !hasStarted && (
        <LandingPage
          onStart={() => setHasStarted(true)}
          onOpenVideo={() => setIsVideoOpen(true)}
          onOpenHelp={() => setIsHelpOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
      )}
      {isVideoOpen && (
        <VideoModal
          onClose={() => setIsVideoOpen(false)}
          youtubeUrl="https://www.youtube.com/embed/PrSc-xK2gLE"
        />
      )}
      {isHelpOpen && <HelpModal onClose={() => setIsHelpOpen(false)} />}
      {isSettingsOpen && (
        <SettingsModal onClose={() => setIsSettingsOpen(false)} />
      )}
      {hasStarted && (
        <Canvas
          className="h-full w-full"
          gl={{ antialias: false }}
          dpr={effectiveDpr}
          camera={{ position: [150, 150, 32], fov: 40 }}
        >
          <ambientLight intensity={0.8} />
          <PerformanceMonitor
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
          >
            <OrbitControls
              enabled={!isTransforming} // Blokuj kamerę, gdy transformControls są aktywne
              enableDamping={false} // Wyłącz inercję (natychmiastowe zatrzymanie kamery)
              target={[0, -25, 45]}
              minDistance={35}
              maxDistance={220}
              minPolarAngle={Math.PI / 20}
              maxPolarAngle={Math.PI / 3}
              rotateSpeed={0.6}
            />
            <Suspense fallback={null}>
              {objectUrl && (
                <group position={[0, 0, 0]} scale={[270, 270, 270]}>
                  <Splat url={objectUrl} maxSplats={effectiveSplats} />
                </group>
              )}
              <IFCModel onPropertiesSelected={setIfcProperties} />
              <TransformControls
                mode={transformMode as "translate" | "rotate" | "scale"}
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
                    />
                  </mesh>
                  <axesHelper args={[1.5]} />
                </group>
              </TransformControls>
              <Environment preset="city" />
            </Suspense>
          </PerformanceMonitor>
        </Canvas>
      )}
      {ifcProperties && (
        <div className="fixed top-4 right-4 p-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg max-w-xs">
          <h2 className="font-bold text-lg mb-2">IFC Properties</h2>
          <div className="space-y-2 text-sm">
            {Object.entries(ifcProperties).map(([key, value]) => (
              <div key={key}>
                <span className="font-medium">{key}:</span>{" "}
                {String((value as { value?: unknown })?.value)}
              </div>
            ))}
          </div>
        </div>
      )}
      {hasStarted && (
        <div className="fixed bottom-4 right-4 z-50 group">
          <div className="relative w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm shadow-lg cursor-pointer transition-transform duration-300 hover:scale-110">
            <img
              src="/assistant.png" // Bezpośrednia ścieżka do pliku w folderze public
              alt="Virtual Assistant"
              className="w-full h-full rounded-full object-cover p-2"
            />
            <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs text-white animate-pulse">
              ?
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;

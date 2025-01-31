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
import IFCModel, { type IFCElementProperties } from "./components/IFCModel.tsx";

const degToRad = (deg: number) => (deg * Math.PI) / 180;

const splatOptions = [
  {
    name: "29.01.2025",
    url: "https://huggingface.co/Alekso/Equinor29012025/resolve/main/Equinor_29_01_2025.splat",
    position: [-27, -33, 87] as [number, number, number],
    rotation: [degToRad(-8), degToRad(-54), degToRad(-5)] as [
      number,
      number,
      number
    ],
    scale: [23.8, 23.8, 23.8] as [number, number, number],
  },
  {
    name: "04.06.2024",
    url: "https://huggingface.co/datasets/Alekso/Equinor_Base_20240604/resolve/main/EQUINOR_20240604.splat",
    position: [0, 101, 0] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
    scale: [270, 270, 270] as [number, number, number],
  },
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
      </div>
    </nav>

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
  const [isSplatLoading, setIsSplatLoading] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [loadedData, setLoadedData] = useState<(Blob | null)[]>(
    splatOptions.map(() => null)
  );
  const [objectUrls, setObjectUrls] = useState<(string | null)[]>(
    splatOptions.map(() => null)
  );
  const [activeSplatIndex, setActiveSplatIndex] = useState(0);

  const [ifcProperties, setIfcProperties] =
    useState<IFCElementProperties | null>(null);
  const [showIFC, setShowIFC] = useState(true);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAssistantEnlarged, setIsAssistantEnlarged] = useState(false);
  const [assistantText, setAssistantText] = useState("");
  const handleStart = () => {
    setHasStarted(true);
    if (isFirstLoad) {
      setIsSplatLoading(true);
      setTimeout(() => {
        setIsSplatLoading(false);
        setIsFirstLoad(false);
      }, 2000);
    }
  };
  const { throttleDpr, maxDpr, throttleSplats, maxSplats, transformMode } =
    useControls({
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
    setIsSplatLoading(true);
    const timer = setTimeout(() => setIsSplatLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [activeSplatIndex]);

  useEffect(() => {
    const newUrls = loadedData.map((data) =>
      data ? URL.createObjectURL(data) : null
    );
    setObjectUrls(newUrls);
    return () => newUrls.forEach((url) => url && URL.revokeObjectURL(url));
  }, [loadedData]);

  // Zmień useEffect odpowiedzialny za ładowanie danych na:
  useEffect(() => {
    const downloadFile = async (
      url: string,
      index: number,
      trackProgress: boolean
    ) => {
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
          if (trackProgress) {
            setProgress((receivedLength / totalLength) * 100);
          }
        }
      }

      const blob = new Blob(chunks);
      setLoadedData((prev) => {
        const newData = [...prev];
        newData[index] = blob;
        return newData;
      });

      if (trackProgress) {
        setProgress(100); // Gwarantuj 100% po załadowaniu pierwszego pliku
      }
    };

    // Najpierw załaduj pierwszy splat z progresem
    downloadFile(splatOptions[0].url, 0, true).then(() => {
      // Następnie załaduj pozostałe w tle bez śledzenia progresu
      splatOptions.slice(1).forEach((option, index) => {
        downloadFile(option.url, index + 1, false);
      });
    });
  }, []);

  return (
    <>
      <Leva oneLineLabels collapsed />

      {hasStarted && (
        <div className="fixed left-4 top-4 z-50 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4">
          <div className="flex flex-col gap-4">
            <button
              onClick={() => setShowIFC(!showIFC)}
              className={`px-4 py-2 rounded-md text-sm ${
                showIFC
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-red-600 text-white hover:bg-red-700"
              } transition-colors`}
            >
              {showIFC ? "Hide IFC Models" : "Show IFC Models"}
            </button>

            {/* Lista modeli Splat */}
            <div className="flex flex-col gap-2">
              {splatOptions.map((option, index) => (
                <button
                  key={option.url}
                  onClick={() => setActiveSplatIndex(index)}
                  className={`px-4 py-2 rounded-md text-sm ${
                    activeSplatIndex === index
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {option.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <LoadingScreen progress={progress} />

      {isSplatLoading && (
        <div className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="relative mx-auto w-32 h-32">
              <div className="absolute inset-0 border-4 border-yellow-500 rounded-full animate-spin [animation-duration:2s]"></div>
              <div className="absolute inset-0 border-4 border-yellow-500 rounded-full animate-spin [animation-duration:3s] [animation-direction:reverse]"></div>
              <div className="absolute inset-0 flex items-center justify-center text-4xl">
                🚧
              </div>
            </div>
            <p className="text-xl font-bold text-yellow-500 animate-pulse">
              Loading the model...
            </p>
          </div>
        </div>
      )}

      <div
        className="fixed bottom-4 right-4 z-[100] cursor-pointer"
        onClick={() => {
          setIsAssistantEnlarged(!isAssistantEnlarged);
          setAssistantText((prev) => (prev ? "" : "Demolition stage"));
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
          <div className="absolute right-0 -top-[200px] w-80 p-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg text-sm border border-blue-100">
            {assistantText}
            <div className="mt-2 space-y-2">
              <div className="text-gray-600">
                🚧 Safety first! Loading progress: {progress.toFixed(0)}%
              </div>
              <div className="text-gray-600">
                🔹 Hard hats and high-visibility vests are mandatory.
              </div>
              <div className="text-gray-600">
                🔹 Do not enter the demolition zone without authorization.
              </div>
              <div className="text-gray-600">
                🔹 Keep a safe distance from machinery - operators may not see
                you!
              </div>
              <div className="text-gray-600">
                🔹 Debris and waste must be disposed of in designated areas.
              </div>
            </div>
          </div>
        )}
      </div>
      {progress >= 100 && !hasStarted && (
        <LandingPage
          onStart={handleStart}
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
          camera={{
            position: [150, 150, 32],
            fov: 40,
            near: 0.1,
            far: 100000,
          }}
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
              enabled={!isTransforming}
              enableDamping={false}
              target={[0, 55, 95]}
              minDistance={90}
              maxDistance={150}
              minPolarAngle={Math.PI / 20}
              maxPolarAngle={Math.PI / 3}
              rotateSpeed={0.6}
            />
            <Suspense fallback={null}>
              {splatOptions.map(
                (option, index) =>
                  objectUrls[index] &&
                  activeSplatIndex === index && (
                    <group
                      key={option.url}
                      position={option.position}
                      rotation={option.rotation}
                      scale={option.scale}
                    >
                      <Splat
                        url={objectUrls[index]!}
                        maxSplats={effectiveSplats}
                      />
                    </group>
                  )
              )}

              <IFCModel
                onPropertiesSelected={setIfcProperties}
                visible={showIFC}
                rotationY={95}
              />
              <TransformControls
                mode={transformMode as "translate" | "rotate" | "scale"}
                onMouseDown={() => setIsTransforming(true)}
                onMouseUp={() => setIsTransforming(false)}
                showX={false} // Ukrywa oś X
                showY={false} // Pozostawia oś Y widoczną
                showZ={false} // Pozostawia oś Z widoczną
              >
                {/*
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
                */}
              </TransformControls>
              <Environment preset="city" />
            </Suspense>
          </PerformanceMonitor>
        </Canvas>
      )}
      {showIFC && ifcProperties && (
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
    </>
  );
}

export default App;

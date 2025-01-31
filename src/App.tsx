import React, { Suspense, useState, useEffect } from "react";
import {
  Environment,
  OrbitControls,
  PerformanceMonitor,
  Billboard,
  Text,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Splat } from "./splat-object";
import { Leva, useControls } from "leva";
import VideoModal from "./components/VideoModal.tsx";
import HelpModal from "./components/HelpModal.tsx";
import SettingsModal from "./components/SettingsModal.tsx";
import IFCModel, { type IFCElementProperties } from "./components/IFCModel.tsx";

interface InfoPoint {
  position: [number, number, number];
  title: string;
  content: string;
  imageUrl?: string;
  markerScale?: number;
}
interface InfoPointMarkerProps {
  position: [number, number, number];
  title: string;
  onClick: () => void;
  markerScale?: number;
}
const degToRad = (deg: number) => (deg * Math.PI) / 180;
const isMobile = () => window.innerWidth < 768;

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
    infoPoints: [
      {
        position: [3.2, 3.5, 1.9],
        title: "Construction Site Entrance",
        content:
          "The designated access point for workers, vehicles, and deliveries. Often secured with gates, checkpoints, and safety signage to control entry and ensure site regulations are followed.",
        markerScale: 0.2, // Tutaj ustawiamy skalę
      },
      {
        position: [2, 3.5, 2.2],
        title: "Construction Site Office",
        content:
          "A central hub on a construction site for project management, coordination, and documentation. Used by site managers and engineers for planning, monitoring progress, and meetings. Equipped with essential tools and technology for efficient oversight",
        markerScale: 0.2, // Tutaj ustawiamy skalę
      },
    ] as InfoPoint[],
  },
  {
    name: "04.06.2024",
    url: "https://huggingface.co/datasets/Alekso/Equinor_Base_20240604/resolve/main/EQUINOR_20240604.splat",
    position: [0, 101, 0] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
    scale: [270, 270, 270] as [number, number, number],
    infoPoints: [
      {
        position: [0, 3.2, 4.8],
        title: "Cooling System",
        content:
          "Advanced liquid cooling infrastructure maintaining optimal temperatures. Utilizes geothermal energy for 40% increased efficiency.",
        imageUrl:
          "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      },
    ] as InfoPoint[],
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
        <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-4">
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

    <nav className="absolute top-0 left-0 z-50 flex items-start p-4 md:p-8">
      <div className="flex gap-3 md:gap-6">
        <button
          onClick={onOpenVideo}
          className="text-white hover:text-blue-400 transition-colors text-sm md:text-base"
        >
          Video
        </button>
        <button
          onClick={onOpenHelp}
          className="text-white hover:text-blue-400 transition-colors text-sm md:text-base"
        >
          Help
        </button>
        <button
          onClick={onOpenSettings}
          className="text-white hover:text-blue-400 transition-colors text-sm md:text-base"
        >
          Settings
        </button>
      </div>
    </nav>

    <div className="absolute inset-0 flex flex-col items-center text-center px-4 z-30">
      <h1 className="text-2xl md:text-4xl font-bold text-white mt-8 md:leading-tight">
        Discover the Future of Energy Infrastructure
      </h1>
      <div className="flex-grow flex items-center justify-center">
        <button
          onClick={onStart}
          className="relative bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 md:px-8 md:py-4 rounded-full text-base md:text-lg transition-all duration-500 transform hover:scale-[1.03] hover:shadow-2xl"
        >
          Start Virtual Tour
        </button>
      </div>
      <p className="text-gray-300 text-base md:text-lg mb-8 md:mb-16 -mt-2 md:-mt-4">
        Immersive 3D exploration of Equinor's O&M Leba Base
      </p>
    </div>

    <div className="absolute bottom-4 md:bottom-8 left-0 right-0 flex justify-center gap-4 md:gap-8 z-50">
      {[
        { label: "Technology", url: "https://www.equinor.com" },
        { label: "Sustainability", url: "https://www.equinor.com" },
        { label: "Innovation", url: "https://www.equinor.com" },
        { label: "Contact", url: "https://www.equinor.com" },
      ].map((button) => (
        <a
          key={button.label}
          href={button.url}
          className="text-gray-300 hover:text-white text-xs md:text-sm uppercase tracking-wider px-1.5 py-0.5"
          target="_blank"
          rel="noopener noreferrer"
        >
          {button.label}
        </a>
      ))}
    </div>
  </div>
);

const InfoPointMarker: React.FC<InfoPointMarkerProps> = ({
  position,
  title,
  onClick,
  markerScale = 1,
}) => (
  <Billboard position={position}>
    <group scale={[markerScale, markerScale, markerScale]}>
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        <circleGeometry args={[0.8, 32]} />
        <meshStandardMaterial color="#3b82f6" transparent opacity={0.8} />
      </mesh>
      <Text
        position={[0, 1.2, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {title}
      </Text>
    </group>
  </Billboard>
);

const InfoPointModal = ({
  infoPoint,
  onClose,
}: {
  infoPoint: InfoPoint | null;
  onClose: () => void;
}) => {
  if (!infoPoint) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1000] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl max-w-2xl w-full overflow-hidden shadow-2xl transition-all duration-300 scale-95 hover:scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-gray-800">
              {infoPoint.title}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              ✕
            </button>
          </div>
          {infoPoint.imageUrl && (
            <img
              src={infoPoint.imageUrl}
              alt={infoPoint.title}
              className="w-full h-48 object-cover rounded-lg"
            />
          )}
          <p className="text-gray-600 leading-relaxed">{infoPoint.content}</p>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [isTransforming] = useState(false);
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
  const [selectedInfoPoint, setSelectedInfoPoint] = useState<InfoPoint | null>(
    null
  );

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

  const { throttleDpr, maxDpr, throttleSplats, maxSplats } = useControls({
    throttleDpr: { value: false },
    maxDpr: {
      value: isMobile()
        ? Math.min(window.devicePixelRatio, 1.5)
        : window.devicePixelRatio,
    },
    throttleSplats: { value: false },
    maxSplats: { value: isMobile() ? 5000000 : 10000000 },
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
    const downloadFile = async (
      url: string,
      index: number,
      trackProgress: boolean
    ) => {
      try {
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
            if (trackProgress)
              setProgress((receivedLength / totalLength) * 100);
          }
        }

        const blob = new Blob(chunks);
        setLoadedData((prev) => {
          const newData = [...prev];
          newData[index] = blob;
          return newData;
        });

        if (trackProgress) setProgress(100);
      } catch (error) {
        console.error("Error loading splat:", error);
      }
    };

    downloadFile(splatOptions[0].url, 0, true).then(() => {
      splatOptions.slice(1).forEach((option, index) => {
        downloadFile(option.url, index + 1, false);
      });
    });
  }, []);

  useEffect(() => {
    const newUrls = loadedData.map((data) =>
      data ? URL.createObjectURL(data) : null
    );
    setObjectUrls(newUrls);
    return () => newUrls.forEach((url) => url && URL.revokeObjectURL(url));
  }, [loadedData]);

  return (
    <>
      <Leva oneLineLabels collapsed />

      {hasStarted && (
        <div
          className={`fixed ${
            isMobile() ? "left-2 top-2" : "left-4 top-4"
          } z-50 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-2`}
        >
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setShowIFC(!showIFC)}
              className={`px-3 py-1.5 text-sm rounded-md ${
                showIFC ? "bg-green-600 text-white" : "bg-red-600 text-white"
              }`}
            >
              {showIFC ? "Hide IFC" : "Show IFC"}
            </button>
            {splatOptions.map((option, index) => (
              <button
                key={option.url}
                onClick={() => setActiveSplatIndex(index)}
                className={`px-3 py-1.5 text-sm rounded-md ${
                  activeSplatIndex === index
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100"
                }`}
              >
                {option.name}
              </button>
            ))}
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
        className={`fixed ${
          isMobile() ? "bottom-2 right-2" : "bottom-4 right-4"
        } z-[100] cursor-pointer`}
        onClick={() => {
          setIsAssistantEnlarged(!isAssistantEnlarged);
          setAssistantText((prev) => (prev ? "" : "Demolition stage"));
        }}
      >
        <div
          className={`relative transition-transform duration-300 ${
            isAssistantEnlarged ? "scale-150" : "scale-100"
          }`}
        >
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/90 backdrop-blur-sm shadow-lg ring-2 ring-blue-200">
            <img
              src="/assistant.png"
              alt="Virtual Assistant"
              className="w-full h-full rounded-full object-cover p-1 md:p-2"
            />
            <div className="absolute -right-1 -top-1 flex h-4 w-4 md:h-5 md:w-5 items-center justify-center rounded-full bg-blue-500 text-xs text-white animate-pulse">
              ?
            </div>
          </div>
        </div>

        {assistantText && (
          <div
            className={`absolute right-0 ${
              isMobile() ? "-top-40" : "-top-[200px]"
            } w-72 md:w-80 p-3 md:p-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg text-xs md:text-sm border border-blue-100`}
          >
            {assistantText}
            <div className="mt-2 space-y-1 md:space-y-2">
              {[
                "🚧 Safety first! Loading progress: " +
                  progress.toFixed(0) +
                  "%",
                "🔹 Hard hats and high-visibility vests are mandatory",
                "🔹 Do not enter the demolition zone without authorization",
                "🔹 Keep a safe distance from machinery",
                "🔹 Dispose debris in designated areas",
              ].map((text, i) => (
                <div key={i} className="text-gray-600">
                  {text}
                </div>
              ))}
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
          className="h-full w-full touch-action-none"
          gl={{ antialias: false }}
          dpr={effectiveDpr}
          camera={{
            position: isMobile() ? [180, 180, 40] : [150, 150, 32],
            fov: isMobile() ? 35 : 60,
            near: 0.01,
            far: 500000,
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
              enableDamping={true}
              dampingFactor={0.05}
              target={[0, 55, 95]}
              minDistance={isMobile() ? 30 : 50}
              maxDistance={isMobile() ? 100 : 150}
              minPolarAngle={Math.PI / 27}
              maxPolarAngle={Math.PI / 4.2}
              rotateSpeed={isMobile() ? 0.4 : 0.6}
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
                      {option.infoPoints?.map((point, i) => (
                        <InfoPointMarker
                          key={i}
                          position={point.position}
                          title={point.title}
                          onClick={() => setSelectedInfoPoint(point)}
                          markerScale={point.markerScale} // Przekazanie skali
                        />
                      ))}
                    </group>
                  )
              )}
              <IFCModel
                onPropertiesSelected={setIfcProperties}
                visible={showIFC}
                rotationY={95}
              />
              {/*
              <TransformControls
                mode={transformMode as "translate" | "rotate" | "scale"}
                onMouseDown={() => setIsTransforming(true)}
                onMouseUp={() => setIsTransforming(false)}
              >
              
                <mesh scale={[1, 1, 1]}>
                  <boxGeometry args={[1, 1, 1]} />
                  <meshStandardMaterial
                    color="orange"
                    transparent
                    opacity={0.7}
                  />
                </mesh>
                
              </TransformControls>*/}
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

      {selectedInfoPoint && (
        <InfoPointModal
          infoPoint={selectedInfoPoint}
          onClose={() => setSelectedInfoPoint(null)}
        />
      )}
    </>
  );
}

export default App;

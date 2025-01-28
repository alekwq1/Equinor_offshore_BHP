import React, { useEffect, useRef, useState, useCallback } from "react";
import { useThree } from "@react-three/fiber";
import { IFCLoader } from "web-ifc-three";
import * as THREE from "three";
export interface IFCProps {
  GlobalId?: string;
  Name?: string;
  Description?: string;
  onPropertiesSelected?: (props: IFCProps | null) => void;
}

const IFCModel: React.FC<IFCProps> = ({ onPropertiesSelected }) => {
  const { scene, camera, gl } = useThree();
  const ifcLoaderRef = useRef<IFCLoader | null>(null);
  const [selectedProps, setSelectedProps] = useState<IFCProps | null>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);

  useEffect(() => {
    const ifcLoader = new IFCLoader();
    ifcLoader.ifcManager.setWasmPath("/");

    ifcLoader.load(
      "/model.ifc",
      (model) => {
        model.scale.set(0.1, 0.1, 0.1);
        model.position.set(-6, -1.5, 2);
        scene.add(model);
        modelRef.current = model;
      },
      undefined,
      (error) => console.error("Błąd ładowania modelu IFC:", error)
    );

    ifcLoaderRef.current = ifcLoader;

    return () => {
      if (modelRef.current) {
        scene.remove(modelRef.current);
        modelRef.current = null;
      }
      ifcLoaderRef.current = null;
    };
  }, [scene]);

  const handlePointerDown = useCallback(
    async (event: PointerEvent) => {
      if (!ifcLoaderRef.current || !modelRef.current) return;

      const rect = gl.domElement.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects([modelRef.current], true);
      if (intersects.length === 0) return;

      const intersected = intersects[0];

      if (!(intersected.object instanceof THREE.Mesh) || !intersected.face)
        return;

      try {
        const expressId = ifcLoaderRef.current.ifcManager.getExpressId(
          intersected.object.geometry,
          intersected.faceIndex ?? 0
        );

        if (!expressId) return;

        const properties =
          await ifcLoaderRef.current.ifcManager.getItemProperties(0, expressId);
        setSelectedProps(properties);
      } catch (error) {
        console.error("Błąd podczas przetwarzania:", error);
      }
    },
    [camera, gl.domElement]
  );

  useEffect(() => {
    const canvas = gl.domElement;
    canvas.addEventListener("pointerdown", handlePointerDown);
    return () => canvas.removeEventListener("pointerdown", handlePointerDown);
  }, [gl.domElement, handlePointerDown]);

  useEffect(() => {
    if (onPropertiesSelected) {
      onPropertiesSelected(selectedProps);
    }
  }, [selectedProps, onPropertiesSelected]);

  return null;
};

export default IFCModel;

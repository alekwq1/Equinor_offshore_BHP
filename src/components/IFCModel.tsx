import React, { useEffect, useRef, useState, useCallback } from "react";
import { useThree } from "@react-three/fiber";
import { IFCLoader } from "web-ifc-three";
import * as THREE from "three";

export interface IFCProps {
  onPropertiesSelected?: (props: IFCElementProperties | null) => void;
  visible: boolean;
  rotationY?: number;
}

export type IFCElementProperties = {
  GlobalId?: { value: string };
  Name?: { value: string };
  Description?: { value: string };
  [key: string]: { value: unknown } | undefined;
};

const IFCModel: React.FC<IFCProps> = ({
  onPropertiesSelected,
  visible,
  rotationY = 95,
}) => {
  const { scene, camera, gl } = useThree();
  const ifcLoaderRef = useRef<IFCLoader | null>(null);
  const [selectedProps, setSelectedProps] =
    useState<IFCElementProperties | null>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);

  // Ładowanie modelu
  useEffect(() => {
    const ifcLoader = new IFCLoader();
    ifcLoader.ifcManager.setWasmPath("/");

    ifcLoader.load(
      "/model.ifc",
      (model) => {
        model.scale.set(1, 1, 1);
        model.position.set(18.5, 50.4, 120);
        model.rotation.y = THREE.MathUtils.degToRad(rotationY);
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
  }, [scene, rotationY]);

  // Aktualizacja widoczności modelu
  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.visible = visible;
    }
  }, [visible]);

  // Obsługa kliknięć
  const handlePointerDown = useCallback(
    async (event: PointerEvent) => {
      if (!visible || !ifcLoaderRef.current || !modelRef.current) return;

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
          (await ifcLoaderRef.current.ifcManager.getItemProperties(
            0,
            expressId
          )) as IFCElementProperties;
        setSelectedProps(properties);
      } catch (error) {
        console.error("Błąd podczas przetwarzania:", error);
      }
    },
    [camera, gl.domElement, visible]
  );

  // Event listeners
  useEffect(() => {
    const canvas = gl.domElement;
    canvas.addEventListener("pointerdown", handlePointerDown);
    return () => canvas.removeEventListener("pointerdown", handlePointerDown);
  }, [gl.domElement, handlePointerDown]);

  // Propagacja właściwości
  useEffect(() => {
    if (onPropertiesSelected) {
      onPropertiesSelected(visible ? selectedProps : null);
    }
  }, [selectedProps, onPropertiesSelected, visible]);

  return null;
};

export default IFCModel;

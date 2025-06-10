declare module "splat-object" {
  import * as THREE from "three";
  import { ForwardRefExoticComponent, RefAttributes } from "react";

  interface SplatProps {
    url?: string;
    position?: [number, number, number];
    scale?: [number, number, number];
    opacity?: number;
    maxSplats?: number;
  }

  const Splat: ForwardRefExoticComponent<
    SplatProps & RefAttributes<THREE.Mesh>
  >;
  export default Splat;
}

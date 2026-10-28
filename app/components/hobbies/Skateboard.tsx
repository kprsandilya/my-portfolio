"use client";

import { useEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

// Lightweight skateboard model (base-color textures only, quantized
// geometry), about 1.6 MB.
export const SKATEBOARD_URL = "/skateboard-lite.glb";

export type Axis = "x" | "y" | "z";

// Loads the skateboard model, centers it, and scales it so its longest side
// is `length` units. Also reports which axis that longest side runs along,
// so callers can spin the board around its length for a kickflip.
export function useSkateboard(length = 3) {
  const { scene } = useGLTF(SKATEBOARD_URL);

  return useMemo(() => {
    // Clone so several canvases can show the board at once, and give this
    // copy its own materials so its glow can be set independently.
    const object = scene.clone(true);
    object.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.isMesh) mesh.material = (mesh.material as THREE.Material).clone();
    });
    const box = new THREE.Box3().setFromObject(object);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    const longest = Math.max(size.x, size.y, size.z);
    const scale = longest > 0 ? length / longest : 1;
    const longAxis: Axis = size.x === longest ? "x" : size.y === longest ? "y" : "z";
    // The thinnest side is the deck's thickness, i.e. the board's "up".
    const thinnest = Math.min(size.x, size.y, size.z);
    const upAxis: Axis = size.y === thinnest ? "y" : size.z === thinnest ? "z" : "x";

    object.position.sub(center);
    const wrapper = new THREE.Group();
    wrapper.add(object);
    wrapper.scale.setScalar(scale);

    return { object: wrapper, longAxis, upAxis };
  }, [scene, length]);
}

// Board lying flat with its length along world X, ready to roll or flip.
// `glow` tints the board with a soft emissive color so the mostly black deck
// stands out against dark backgrounds.
export function FlatSkateboard({ length = 3, glow, glowStrength = 0.35 }: { length?: number; glow?: string; glowStrength?: number }) {
  const { object, longAxis, upAxis } = useSkateboard(length);

  useEffect(() => {
    object.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      const mat = mesh.material as THREE.MeshStandardMaterial;
      if (!mat.emissive) return;
      mat.emissive.set(glow ?? "#000000");
      mat.emissiveIntensity = glow ? glowStrength : 0;
    });
  }, [object, glow, glowStrength]);

  // Rotate the model so long axis -> X and up axis -> Y.
  const rotation = useMemo(() => {
    const q = new THREE.Quaternion();
    const from = new THREE.Matrix4();
    const axes: Record<Axis, THREE.Vector3> = {
      x: new THREE.Vector3(1, 0, 0),
      y: new THREE.Vector3(0, 1, 0),
      z: new THREE.Vector3(0, 0, 1),
    };
    const long = axes[longAxis];
    const up = axes[upAxis];
    const side = new THREE.Vector3().crossVectors(long, up);
    // Columns are where world X, Y, Z map from in model space.
    from.makeBasis(long, up, side).invert();
    q.setFromRotationMatrix(from);
    return new THREE.Euler().setFromQuaternion(q);
  }, [longAxis, upAxis]);

  return (
    <group rotation={rotation}>
      <primitive object={object} />
    </group>
  );
}


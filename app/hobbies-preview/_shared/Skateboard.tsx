"use client";

import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

export const SKATEBOARD_URL = "/skateboard-opt.glb";

export type Axis = "x" | "y" | "z";

// Loads the skateboard model, centers it, and scales it so its longest side
// is `length` units. Also reports which axis that longest side runs along,
// so callers can spin the board around its length for a kickflip.
export function useSkateboard(length = 3) {
  const { scene } = useGLTF(SKATEBOARD_URL);

  return useMemo(() => {
    // Clone so several canvases can show the board at once.
    const object = scene.clone(true);
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
export function FlatSkateboard({ length = 3 }: { length?: number }) {
  const { object, longAxis, upAxis } = useSkateboard(length);

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

useGLTF.preload(SKATEBOARD_URL);

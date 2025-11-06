"use client";

import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import React, { useRef, useMemo } from "react";

// ✅ Poincaré disc shader (rewired for React Three Fiber)
const fragmentShader = /* glsl */ `
precision highp float;
varying vec2 vUv;

uniform vec3 iResolution;
uniform float iTime;
uniform float u_speed;
uniform float u_rotationSpeed;
uniform float u_animationScale;
uniform float u_colorIntensity;
uniform float u_polygonType;

// ---- Original logic adapted ----
vec2 complexMul(vec2 a, vec2 b) {
  return vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
}

vec2 complexDiv(vec2 a, vec2 b) {
  return vec2(a.x * b.x + a.y * b.y, a.y * b.x - a.x * b.y) / dot(b, b);
}

vec2 mobius(vec2 z, vec2 a) {
  return complexDiv(z + a, a * z + 1.0);
}

float sdPolygon(vec2 p, int n) {
  float a = atan(p.y, p.x) + 3.14159;
  float r = length(p);
  return cos(floor(0.5 + float(n) * a / (2.0 * 3.14159)) * (2.0 * 3.14159 / float(n)) - a) * r - 0.8;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  // Convert from screen space
  vec2 uv = (2.0 * fragCoord - iResolution.xy) / iResolution.y;

  // Rotate over time
  float rotation = iTime * u_rotationSpeed;
  mat2 rot = mat2(cos(rotation), -sin(rotation), sin(rotation), cos(rotation));
  uv = rot * uv;

  // Apply Möbius transformation
  vec2 a = vec2(sin(iTime * u_speed), cos(iTime * u_speed)) * 0.5;
  uv = mobius(uv, a);

  // Distance to polygon
  int sides = int(u_polygonType);
  float d = sdPolygon(uv * (1.0 + sin(iTime * u_animationScale)), sides);

  // Color
  float color = smoothstep(0.0, 0.02, abs(d));
  vec3 finalColor = mix(vec3(0.05, 0.1, 0.2), vec3(0.8, 0.9, 1.0), color * u_colorIntensity);

  fragColor = vec4(finalColor, 1.0);
}

void main() {
  vec2 fragCoord = vUv * iResolution.xy;
  vec4 fragColor;
  mainImage(fragColor, fragCoord);
  gl_FragColor = fragColor;
}
`;

// Simple passthrough vertex shader
const vertexShader = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

function PoincareShaderPlane() {
  const meshRef = useRef<THREE.Mesh>(null);

  const uniforms = useMemo(
    () => ({
      iTime: { value: 0.0 },
      iResolution: { value: new THREE.Vector3() },
      u_speed: { value: 0.8 },
      u_rotationSpeed: { value: 0.2 },
      u_animationScale: { value: 1.5 },
      u_colorIntensity: { value: 1.2 },
      u_polygonType: { value: 7.0 },
    }),
    []
  );

  useFrame(({ clock, size }) => {
    uniforms.iTime.value = clock.getElapsedTime();
    uniforms.iResolution.value.set(size.width, size.height, 1);
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

export default function PoincareDiscAnimationShaders({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={`relative overflow-hidden ${className || ""}`}>
      {/* Three.js shader background */}
      <Canvas className="absolute inset-0" gl={{ antialias: true }}>
        <PoincareShaderPlane />
      </Canvas>

      {/* Overlayed content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
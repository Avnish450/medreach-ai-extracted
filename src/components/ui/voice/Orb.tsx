"use client";

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere, Environment } from '@react-three/drei';
import * as THREE from 'three';

interface VoiceOrbProps {
  state: "idle" | "listening" | "processing" | "speaking" | "error";
}

const OrbMesh = ({ state }: { state: VoiceOrbProps['state'] }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);

  // Target values based on state
  const getTargetProperties = () => {
    switch (state) {
      case 'listening':
        return { color: '#ef4444', distort: 0.6, speed: 5, scale: 1.2 };
      case 'processing':
        return { color: '#8b5cf6', distort: 0.4, speed: 3, scale: 1.1 };
      case 'speaking':
        return { color: '#10b981', distort: 0.3, speed: 2, scale: 1.15 };
      case 'error':
        return { color: '#dc2626', distort: 0.8, speed: 8, scale: 1.0 };
      case 'idle':
      default:
        return { color: '#0d9488', distort: 0.2, speed: 1, scale: 1.0 };
    }
  };

  useFrame((_state, delta) => {
    if (!meshRef.current || !materialRef.current) return;
    
    const target = getTargetProperties();
    const targetColor = new THREE.Color(target.color);

    // Smoothly interpolate current values towards target values
    materialRef.current.color.lerp(targetColor, delta * 2);
    materialRef.current.distort = THREE.MathUtils.lerp(materialRef.current.distort, target.distort, delta * 3);
    materialRef.current.speed = THREE.MathUtils.lerp(materialRef.current.speed, target.speed, delta * 2);
    
    meshRef.current.scale.lerp(new THREE.Vector3(target.scale, target.scale, target.scale), delta * 3);
  });

  return (
    <Sphere ref={meshRef} args={[1, 64, 64]} scale={1}>
      <MeshDistortMaterial
        ref={materialRef}
        color="#0d9488"
        envMapIntensity={0.8}
        clearcoat={1}
        clearcoatRoughness={0.1}
        metalness={0.2}
        roughness={0.1}
        distort={0.2}
        speed={1}
      />
    </Sphere>
  );
};

export const VoiceOrb = ({ state }: VoiceOrbProps) => {
  return (
    <div className="w-full h-full min-h-[300px] flex items-center justify-center relative">
      <Canvas camera={{ position: [0, 0, 3] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#0d9488" />
        <Environment preset="city" />
        <OrbMesh state={state} />
      </Canvas>
    </div>
  );
};

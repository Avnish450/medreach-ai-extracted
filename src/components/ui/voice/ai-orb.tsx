"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Sphere, Environment, Float } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
import type { VoiceState } from "@/lib/voice/speech-engine";

interface OrbProps {
  state: VoiceState;
  audioLevel?: number; // 0-1, from mic input
}

const STATE_COLORS = {
  idle: { primary: "#14b8a6", secondary: "#0f766e" },
  listening: { primary: "#22c55e", secondary: "#16a34a" },
  processing: { primary: "#a855f7", secondary: "#7e22ce" },
  speaking: { primary: "#3b82f6", secondary: "#1d4ed8" },
  error: { primary: "#ef4444", secondary: "#b91c1c" },
};

function OrbMesh({ state, audioLevel = 0 }: OrbProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);

  useFrame((_, delta) => {
    if (!meshRef.current || !materialRef.current) return;

    // Rotate slowly
    meshRef.current.rotation.y += delta * 0.2;
    meshRef.current.rotation.x += delta * 0.1;

    // Scale based on state
    let targetScale = 1;
    let targetDistort = 0.3;
    let targetSpeed = 1;

    switch (state) {
      case "listening":
        targetScale = 1.1 + audioLevel * 0.3;
        targetDistort = 0.5 + audioLevel * 0.3;
        targetSpeed = 3;
        break;
      case "speaking":
        targetScale = 1.05 + Math.sin(Date.now() * 0.005) * 0.05;
        targetDistort = 0.4;
        targetSpeed = 2;
        break;
      case "processing":
        targetScale = 0.95;
        targetDistort = 0.6;
        targetSpeed = 4;
        break;
      case "error":
        targetScale = 0.9;
        targetDistort = 0.8;
        break;
      default: // idle
        targetScale = 1;
        targetDistort = 0.3;
        targetSpeed = 1;
    }

    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    materialRef.current.distort = THREE.MathUtils.lerp(materialRef.current.distort, targetDistort, 0.1);
    materialRef.current.speed = THREE.MathUtils.lerp(materialRef.current.speed, targetSpeed, 0.1);
  });

  const currentColors = STATE_COLORS[state];

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <Sphere ref={meshRef} args={[1.5, 64, 64]}>
        <MeshDistortMaterial
          ref={materialRef}
          color={currentColors.primary}
          emissive={currentColors.secondary}
          emissiveIntensity={0.4}
          roughness={0.15}
          metalness={0.8}
          clearcoat={1}
          clearcoatRoughness={0.1}
          distort={0.4}
          speed={2}
          envMapIntensity={2}
        />
      </Sphere>
      {/* Inner glowing core */}
      <Sphere args={[1.0, 32, 32]}>
        <meshBasicMaterial color={currentColors.primary} transparent opacity={0.3} />
      </Sphere>
    </Float>
  );
}

export function AIOrb({ state, audioLevel }: OrbProps) {
  return (
    <div className="w-full flex-grow min-h-0 relative flex items-center justify-center py-4">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.2} />
        <directionalLight position={[5, 5, 5]} intensity={2} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={1} color={STATE_COLORS[state].primary} />
        <Environment preset="city" />
        <OrbMesh state={state} audioLevel={audioLevel} />
      </Canvas>

      {/* Pulsing rings overlay */}
      {(state === "listening" || state === "speaking") && (
        <>
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-64 h-64 rounded-full border-2 border-teal-500/30 animate-ping" />
          </div>
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-80 h-80 rounded-full border-2 border-teal-500/20 animate-ping" style={{ animationDelay: "0.5s" }} />
          </div>
        </>
      )}

      {/* State label */}
      <div className="absolute bottom-8 left-0 right-0 text-center pointer-events-none">
        <p className="text-sm font-semibold text-primary/80 uppercase tracking-[0.3em] drop-shadow-md">
          {state === "idle" && "Tap Mic to speak"}
          {state === "listening" && "🎙️ Listening..."}
          {state === "processing" && "🧠 Thinking..."}
          {state === "speaking" && "🔊 Speaking..."}
          {state === "error" && "⚠️ Error"}
        </p>
      </div>
    </div>
  );
}

'use client';

import React, { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { MeshDistortMaterial, Float, Stars } from '@react-three/drei';
import * as THREE from 'three';

// ─── Interactive Mouse-Reactive Core ─────────────────────────
function QuantumMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    // Smooth mouse parallax target
    const targetX = pointer.x * 0.4;
    const targetY = pointer.y * 0.4;

    if (meshRef.current) {
      meshRef.current.rotation.y += 0.008;
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetY + Math.sin(t * 0.5) * 0.15, 0.05);
      meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, -targetX + Math.cos(t * 0.4) * 0.1, 0.05);
    }

    if (innerRef.current) {
      innerRef.current.rotation.y -= 0.012;
      innerRef.current.rotation.x += 0.006;
      const pulse = 0.5 + 0.5 * Math.sin(t * 2);
      const mat = innerRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.8 + pulse * 0.6;
    }
  });

  return (
    <group>
      {/* Inner Glowing Plasma Nucleus */}
      <mesh ref={innerRef} scale={0.65}>
        <icosahedronGeometry args={[1, 3]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#00f0ff"
          emissiveIntensity={1.2}
          roughness={0.1}
          metalness={0.8}
          wireframe={true}
        />
      </mesh>

      {/* Outer Iridescent Fluid Membrane */}
      <mesh ref={meshRef} scale={1.2}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial
          color="#0ea5e9"
          emissive="#0284c7"
          emissiveIntensity={0.4}
          roughness={0.1}
          metalness={0.9}
          clearcoat={1}
          clearcoatRoughness={0.1}
          distort={0.42}
          speed={2.2}
          transparent
          opacity={0.85}
        />
      </mesh>
    </group>
  );
}

// ─── Orbital Energy Rings ─────────────────────────────────────
function OrbitalRing({ radius, tilt, speed, color }: {
  radius: number; tilt: [number, number, number]; speed: number; color: string;
}) {
  const ringRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ringRef.current) return;
    ringRef.current.rotation.z = state.clock.getElapsedTime() * speed;
  });

  return (
    <group rotation={tilt}>
      <group ref={ringRef}>
        <mesh>
          <torusGeometry args={[radius, 0.008, 16, 120]} />
          <meshBasicMaterial color={color} transparent opacity={0.4} />
        </mesh>

        {/* Orbiting Photon Satellite */}
        <mesh position={[radius, 0, 0]}>
          <sphereGeometry args={[0.045, 12, 12]} />
          <meshBasicMaterial color={color} />
        </mesh>
      </group>
    </group>
  );
}

// ─── Floating Constellation Particles ────────────────────────
function ParticleCloud() {
  const count = 90;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 1.6 + Math.random() * 1.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.cos(phi);
      arr[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    return arr;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#38bdf8"
        size={0.025}
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} color="#38bdf8" />
      <directionalLight position={[-5, -5, -5]} intensity={0.8} color="#c084fc" />
      <pointLight position={[0, 0, 2]} intensity={2} color="#00f0ff" />

      <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.4}>
        <QuantumMesh />
        <OrbitalRing radius={1.7} tilt={[Math.PI / 4, 0, 0]} speed={0.5} color="#38bdf8" />
        <OrbitalRing radius={1.9} tilt={[-Math.PI / 3, Math.PI / 6, 0]} speed={-0.35} color="#c084fc" />
        <OrbitalRing radius={2.1} tilt={[Math.PI / 6, -Math.PI / 4, 0]} speed={0.4} color="#34d399" />
        <ParticleCloud />
      </Float>
    </>
  );
}

export function RotatingMicrobe() {
  return (
    <div className="relative w-full h-[460px] md:h-[520px] flex items-center justify-center">
      {/* Multi-layered ambient background glow */}
      <div className="absolute w-72 h-72 rounded-full bg-sky-500/15 blur-3xl animate-pulse-subtle pointer-events-none" />
      <div className="absolute w-60 h-60 rounded-full bg-purple-500/10 blur-2xl pointer-events-none" />
      
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 4.2], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}

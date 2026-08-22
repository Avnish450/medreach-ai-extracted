'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Expanding ring that pulses outward like a heartbeat
function PulseRing({ delay, color, speed = 1 }: {
  delay: number;
  color: string;
  speed?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = ((state.clock.getElapsedTime() * speed) + delay) % 3;
    const progress = t / 3;
    const scale = 0.3 + progress * 2.5;
    const opacity = (1 - progress) * 0.7;
    meshRef.current.scale.setScalar(scale);
    const mat = meshRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = opacity;
  });

  const geo = useMemo(() => {
    return new THREE.RingGeometry(0.95, 1.0, 64);
  }, []);

  return (
    <mesh ref={meshRef} geometry={geo} rotation={[Math.PI / 2, 0, 0]}>
      <meshBasicMaterial color={color} transparent opacity={0.5} side={THREE.DoubleSide} />
    </mesh>
  );
}

// Wireframe globe
function WireframeGlobe() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.y = t * 0.2;
    meshRef.current.rotation.x = Math.sin(t * 0.3) * 0.06;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 24, 24]} />
      <meshStandardMaterial
        color="#0ea5e9"
        emissive="#0284c7"
        emissiveIntensity={0.4}
        roughness={0.1}
        metalness={0.6}
        wireframe
        transparent
        opacity={0.55}
      />
    </mesh>
  );
}

// Solid core of the globe
function GlobeCore() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = 0.3 + 0.2 * Math.abs(Math.sin(t * 0.8));
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.85, 32, 32]} />
      <meshStandardMaterial
        color="#020817"
        emissive="#0ea5e9"
        emissiveIntensity={0.3}
        roughness={0.4}
        metalness={0.8}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
}

// Location pin markers on globe
function GlobePin({ lat, lon }: { lat: number; lon: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  const [x, y, z] = useMemo(() => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const r = 1.05;
    return [
      -r * Math.sin(phi) * Math.cos(theta),
      r * Math.cos(phi),
      r * Math.sin(phi) * Math.sin(theta),
    ];
  }, [lat, lon]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.scale.setScalar(1 + 0.3 * Math.abs(Math.sin(t * 2 + lat)));
  });

  return (
    <mesh ref={meshRef} position={[x, y, z]}>
      <sphereGeometry args={[0.04, 8, 8]} />
      <meshStandardMaterial
        color="#f43f5e"
        emissive="#f43f5e"
        emissiveIntensity={1.5}
      />
    </mesh>
  );
}

// Orbiting satellite dot
function OrbitingDot({ radius, speed, phase, color }: {
  radius: number;
  speed: number;
  phase: number;
  color: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime() * speed + phase;
    meshRef.current.position.set(
      radius * Math.cos(t),
      radius * Math.sin(t * 0.4) * 0.3,
      radius * Math.sin(t)
    );
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.035, 8, 8]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1.2}
      />
    </mesh>
  );
}

function GlobeScene() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.05;
  });

  // City locations (lat, lon)
  const cities = [
    { lat: 40.7, lon: -74.0 },  // New York
    { lat: 51.5, lon: -0.1 },   // London
    { lat: 35.7, lon: 139.7 },  // Tokyo
    { lat: 28.6, lon: 77.2 },   // Delhi
    { lat: -33.9, lon: 151.2 }, // Sydney
    { lat: 48.9, lon: 2.3 },    // Paris
  ];

  return (
    <group ref={groupRef}>
      <GlobeCore />
      <WireframeGlobe />

      {/* Heartbeat pulse rings */}
      <PulseRing delay={0} color="#0ea5e9" speed={0.7} />
      <PulseRing delay={1} color="#06d6a0" speed={0.7} />
      <PulseRing delay={2} color="#8b5cf6" speed={0.7} />

      {/* City pins */}
      {cities.map((city, i) => (
        <GlobePin key={i} lat={city.lat} lon={city.lon} />
      ))}

      {/* Orbiting dots */}
      <OrbitingDot radius={1.4} speed={0.4} phase={0} color="#0ea5e9" />
      <OrbitingDot radius={1.6} speed={0.25} phase={Math.PI} color="#06d6a0" />
      <OrbitingDot radius={1.3} speed={0.6} phase={Math.PI / 2} color="#8b5cf6" />

      {/* Lighting */}
      <pointLight position={[3, 2, 3]} intensity={0.8} color="#0ea5e9" />
      <pointLight position={[-3, -2, -3]} intensity={0.5} color="#8b5cf6" />
      <ambientLight intensity={0.2} />
    </group>
  );
}

export function HeartbeatGlobe() {
  return (
    <div className="relative w-full h-[380px]">
      <div className="absolute inset-0 rounded-full bg-sky-500/5 blur-3xl" />
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0.5, 3.5], fov: 48 }}
        gl={{ antialias: true, alpha: true }}
      >
        <GlobeScene />
      </Canvas>
    </div>
  );
}

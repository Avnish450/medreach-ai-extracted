'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Individual node in the neural network
function NeuralNode({ position, color, size = 0.08 }: {
  position: [number, number, number];
  color: string;
  size?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.scale.setScalar(
      size * (1 + 0.15 * Math.sin(t * 2 + position[0] * 3 + position[1]))
    );
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.8}
        roughness={0.2}
        metalness={0.1}
      />
    </mesh>
  );
}

// Animated connection line between two nodes
function NeuralConnection({ start, end, color }: {
  start: [number, number, number];
  end: [number, number, number];
  color: string;
}) {
  const lineRef = useRef<THREE.Line>(null);

  const points = useMemo(() => {
    return [new THREE.Vector3(...start), new THREE.Vector3(...end)];
  }, [start, end]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    return geo;
  }, [points]);

  useFrame((state) => {
    if (!lineRef.current) return;
    const t = state.clock.getElapsedTime();
    const mat = lineRef.current.material as THREE.LineBasicMaterial;
    mat.opacity = 0.15 + 0.35 * Math.abs(Math.sin(t * 1.5 + start[0] * 2));
  });

  return (
    // @ts-expect-error - three.js line primitive
    <line ref={lineRef} geometry={geometry}>
      <lineBasicMaterial
        color={color}
        transparent
        opacity={0.3}
      />
    </line>
  );
}

// Flowing data pulse along a connection
function DataPulse({ start, end, color, speed = 1 }: {
  start: [number, number, number];
  end: [number, number, number];
  color: string;
  speed?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = (state.clock.getElapsedTime() * speed * 0.4) % 1;
    meshRef.current.position.set(
      start[0] + (end[0] - start[0]) * t,
      start[1] + (end[1] - start[1]) * t,
      start[2] + (end[2] - start[2]) * t
    );
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.035, 8, 8]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={2}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
}

function NetworkScene() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.12;
    groupRef.current.rotation.x = Math.sin(t * 0.18) * 0.1;
  });

  // Layer 1: 4 input nodes
  const layer1: [number, number, number][] = [
    [-1.4, 0.9, 0], [-1.4, 0.3, 0], [-1.4, -0.3, 0], [-1.4, -0.9, 0]
  ];

  // Layer 2: 5 hidden nodes
  const layer2: [number, number, number][] = [
    [-0.3, 1.1, 0.3], [-0.3, 0.5, -0.3], [-0.3, 0, 0.2],
    [-0.3, -0.5, -0.2], [-0.3, -1.1, 0.1]
  ];

  // Layer 3: 4 hidden nodes
  const layer3: [number, number, number][] = [
    [0.7, 0.8, -0.2], [0.7, 0.2, 0.3], [0.7, -0.3, -0.1], [0.7, -0.9, 0.2]
  ];

  // Layer 4: 2 output nodes
  const layer4: [number, number, number][] = [
    [1.5, 0.4, 0], [1.5, -0.4, 0]
  ];

  const tealColor = '#0ea5e9';
  const violetColor = '#8b5cf6';
  const greenColor = '#06d6a0';

  return (
    <group ref={groupRef}>
      {/* Layer 1 nodes */}
      {layer1.map((pos, i) => (
        <NeuralNode key={`l1-${i}`} position={pos} color={tealColor} size={0.09} />
      ))}

      {/* Layer 2 nodes */}
      {layer2.map((pos, i) => (
        <NeuralNode key={`l2-${i}`} position={pos} color={violetColor} size={0.085} />
      ))}

      {/* Layer 3 nodes */}
      {layer3.map((pos, i) => (
        <NeuralNode key={`l3-${i}`} position={pos} color={tealColor} size={0.08} />
      ))}

      {/* Layer 4 output nodes */}
      {layer4.map((pos, i) => (
        <NeuralNode key={`l4-${i}`} position={pos} color={greenColor} size={0.11} />
      ))}

      {/* Connections: L1 → L2 */}
      {layer1.flatMap((s, i) =>
        layer2.map((e, j) => (
          <NeuralConnection key={`c12-${i}-${j}`} start={s} end={e} color={tealColor} />
        ))
      )}

      {/* Connections: L2 → L3 */}
      {layer2.flatMap((s, i) =>
        layer3.map((e, j) => (
          <NeuralConnection key={`c23-${i}-${j}`} start={s} end={e} color={violetColor} />
        ))
      )}

      {/* Connections: L3 → L4 */}
      {layer3.flatMap((s, i) =>
        layer4.map((e, j) => (
          <NeuralConnection key={`c34-${i}-${j}`} start={s} end={e} color={greenColor} />
        ))
      )}

      {/* Flowing data pulses */}
      {layer1.map((s, i) => (
        <DataPulse key={`p1-${i}`} start={s} end={layer2[i % 5]} color={tealColor} speed={0.8 + i * 0.2} />
      ))}
      {layer2.map((s, i) => (
        <DataPulse key={`p2-${i}`} start={s} end={layer3[i % 4]} color={violetColor} speed={0.7 + i * 0.15} />
      ))}
      {layer3.map((s, i) => (
        <DataPulse key={`p3-${i}`} start={s} end={layer4[i % 2]} color={greenColor} speed={1 + i * 0.2} />
      ))}

      {/* Ambient lighting orb */}
      <pointLight position={[0, 0, 2]} intensity={0.6} color="#0ea5e9" />
      <pointLight position={[0, 0, -2]} intensity={0.4} color="#8b5cf6" />
    </group>
  );
}

export function NeuralNetwork() {
  return (
    <div className="relative w-full h-[400px]">
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-sky-500/5 via-violet-500/5 to-emerald-500/5 blur-2xl" />
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 3.5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[3, 3, 3]} intensity={0.5} />
        <NetworkScene />
      </Canvas>
    </div>
  );
}

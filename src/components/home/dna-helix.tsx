'use client';

import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars } from '@react-three/drei';
import * as THREE from 'three';

// ─── Animated glowing sphere at each base pair ─────────────────
function BaseSphere({ position, color, phaseOffset }: {
    position: [number, number, number];
    color: string;
    phaseOffset: number;
}) {
    const meshRef = useRef<THREE.Mesh>(null);
    useFrame((state) => {
        if (!meshRef.current) return;
        const t = state.clock.getElapsedTime();
        const mat = meshRef.current.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = 0.5 + 0.5 * Math.abs(Math.sin(t * 2.5 + phaseOffset));
        meshRef.current.scale.setScalar(1 + 0.12 * Math.abs(Math.sin(t * 2 + phaseOffset)));
    });
    return (
        <mesh ref={meshRef} position={position}>
            <sphereGeometry args={[0.065, 16, 16]} />
            <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={0.8}
                roughness={0.1}
                metalness={0.3}
            />
        </mesh>
    );
}

// ─── Rung cylinder between two strands ────────────────────────
function Rung({ p1, p2 }: { p1: THREE.Vector3; p2: THREE.Vector3 }) {
    const mid = useMemo(() => p1.clone().add(p2).multiplyScalar(0.5), [p1, p2]);
    const dir = useMemo(() => p2.clone().sub(p1), [p1, p2]);
    const len = useMemo(() => dir.length(), [dir]);
    const quat = useMemo(() => {
        const q = new THREE.Quaternion();
        q.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
        return q;
    }, [dir]);

    return (
        <mesh position={mid} quaternion={quat}>
            <cylinderGeometry args={[0.014, 0.014, len, 8]} />
            <meshStandardMaterial
                color="#6366f1"
                emissive="#4338ca"
                emissiveIntensity={0.6}
                roughness={0.2}
                metalness={0.5}
                transparent
                opacity={0.75}
            />
        </mesh>
    );
}

// ─── Traveling pulse bead ──────────────────────────────────────
function PulseBead({ points, speed, phase, color }: {
    points: THREE.Vector3[];
    speed: number;
    phase: number;
    color: string;
}) {
    const meshRef = useRef<THREE.Mesh>(null);
    useFrame((state) => {
        if (!meshRef.current) return;
        const t = ((state.clock.getElapsedTime() * speed + phase) % 1 + 1) % 1;
        const idx = Math.floor(t * (points.length - 1));
        const frac = t * (points.length - 1) - idx;
        const a = points[Math.min(idx, points.length - 1)];
        const b = points[Math.min(idx + 1, points.length - 1)];
        meshRef.current.position.lerpVectors(a, b, frac);
        const mat = meshRef.current.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = 2 + Math.sin(state.clock.getElapsedTime() * 6 + phase) * 0.5;
    });
    return (
        <mesh ref={meshRef}>
            <sphereGeometry args={[0.05, 12, 12]} />
            <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={2.5}
                roughness={0}
                metalness={0}
            />
        </mesh>
    );
}

// ─── Full DNA scene ────────────────────────────────────────────
function DNAScene() {
    const groupRef = useRef<THREE.Group>(null);
    const dynLight1 = useRef<THREE.PointLight>(null);
    const dynLight2 = useRef<THREE.PointLight>(null);

    const STEPS      = 32;
    const RADIUS     = 0.45;
    const HEIGHT     = 3.6;
    const TURNS      = 2.5;
    const RUNG_EVERY = 4;

    // Build helix point arrays
    const { strand1, strand2, curve1Points, curve2Points } = useMemo(() => {
        const s1: THREE.Vector3[] = [];
        const s2: THREE.Vector3[] = [];
        for (let i = 0; i <= STEPS; i++) {
            const t     = i / STEPS;
            const angle = t * TURNS * Math.PI * 2;
            const y     = (t - 0.5) * HEIGHT;
            s1.push(new THREE.Vector3(RADIUS * Math.cos(angle), y, RADIUS * Math.sin(angle)));
            s2.push(new THREE.Vector3(RADIUS * Math.cos(angle + Math.PI), y, RADIUS * Math.sin(angle + Math.PI)));
        }
        return { strand1: s1, strand2: s2, curve1Points: s1, curve2Points: s2 };
    }, []);

    // Build tube geometries
    const tube1Geo = useMemo(() => {
        const curve = new THREE.CatmullRomCurve3(strand1);
        return new THREE.TubeGeometry(curve, 120, 0.025, 10, false);
    }, [strand1]);
    const tube2Geo = useMemo(() => {
        const curve = new THREE.CatmullRomCurve3(strand2);
        return new THREE.TubeGeometry(curve, 120, 0.025, 10, false);
    }, [strand2]);

    // Sphere positions (every 2nd point)
    const sphereData1 = useMemo(() =>
        strand1.filter((_, i) => i % 2 === 0).map((p, i) => ({
            pos: [p.x, p.y, p.z] as [number, number, number],
            color: ['#0ea5e9', '#38bdf8', '#06d6a0', '#34d399', '#a78bfa'][i % 5],
            phase: i * 0.7,
        })), [strand1]);

    const sphereData2 = useMemo(() =>
        strand2.filter((_, i) => i % 2 === 0).map((p, i) => ({
            pos: [p.x, p.y, p.z] as [number, number, number],
            color: ['#8b5cf6', '#ec4899', '#f59e0b', '#0ea5e9', '#06d6a0'][i % 5],
            phase: i * 0.5,
        })), [strand2]);

    // Rung pairs
    const rungs = useMemo(() =>
        strand1
            .filter((_, i) => i % RUNG_EVERY === 0)
            .map((p1, i) => ({ p1, p2: strand2[i * RUNG_EVERY] }))
            .filter(r => r.p2), [strand1, strand2]);

    useFrame((state) => {
        if (!groupRef.current) return;
        const t = state.clock.getElapsedTime();
        groupRef.current.rotation.y = t * 0.25;
        if (dynLight1.current) {
            dynLight1.current.position.set(Math.cos(t * 1.1) * 2, Math.sin(t * 0.7) * 1.5, Math.sin(t * 1.1) * 2);
        }
        if (dynLight2.current) {
            dynLight2.current.position.set(Math.cos(t * 0.8 + 3) * 2, Math.sin(t * 0.9) * 1.5, Math.sin(t * 0.8 + 3) * 2);
        }
    });

    return (
        <>
            <ambientLight intensity={0.15} />
            <pointLight ref={dynLight1} color="#0ea5e9" intensity={5} distance={7} />
            <pointLight ref={dynLight2} color="#8b5cf6" intensity={4} distance={7} />
            <Stars radius={6} depth={3} count={200} factor={0.5} fade speed={0.4} />

            <Float speed={0.8} rotationIntensity={0.15} floatIntensity={0.3}>
                <group ref={groupRef}>
                    {/* Strand 1 tube */}
                    <mesh geometry={tube1Geo}>
                        <meshStandardMaterial
                            color="#0ea5e9"
                            emissive="#0369a1"
                            emissiveIntensity={0.7}
                            roughness={0.1}
                            metalness={0.6}
                        />
                    </mesh>

                    {/* Strand 2 tube */}
                    <mesh geometry={tube2Geo}>
                        <meshStandardMaterial
                            color="#8b5cf6"
                            emissive="#6d28d9"
                            emissiveIntensity={0.7}
                            roughness={0.1}
                            metalness={0.6}
                        />
                    </mesh>

                    {/* Spheres strand 1 */}
                    {sphereData1.map((d, i) => (
                        <BaseSphere key={`s1-${i}`} position={d.pos} color={d.color} phaseOffset={d.phase} />
                    ))}

                    {/* Spheres strand 2 */}
                    {sphereData2.map((d, i) => (
                        <BaseSphere key={`s2-${i}`} position={d.pos} color={d.color} phaseOffset={d.phase} />
                    ))}

                    {/* Rungs */}
                    {rungs.map((r, i) => (
                        r.p2 && <Rung key={`rung-${i}`} p1={r.p1} p2={r.p2} />
                    ))}

                    {/* Pulse beads traveling along strands */}
                    <PulseBead points={curve1Points} speed={0.18} phase={0}    color="#38bdf8" />
                    <PulseBead points={curve1Points} speed={0.18} phase={0.5}  color="#06d6a0" />
                    <PulseBead points={curve2Points} speed={0.15} phase={0.25} color="#a78bfa" />
                    <PulseBead points={curve2Points} speed={0.15} phase={0.75} color="#f472b6" />
                </group>
            </Float>
        </>
    );
}

export function DNAHelix() {
    return (
        <div className="relative w-full h-[500px]">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-sky-500/6 to-violet-500/6 blur-2xl" />
            <Canvas
                dpr={[1, 2]}
                camera={{ position: [0, 0, 4.2], fov: 44 }}
                gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
            >
                <Suspense fallback={null}>
                    <DNAScene />
                </Suspense>
            </Canvas>
        </div>
    );
}

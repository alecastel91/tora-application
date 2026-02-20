"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, SoftShadows, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

function Room() {
    return (
        <group>
            {/* The Room - A large inverted box */}
            <mesh scale={[20, 20, 20]} position={[0, 0, 0]}>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial
                    color="#050505"
                    roughness={0.2}
                    metalness={0.8}
                    side={THREE.BackSide} // Render inside of the cube
                />
            </mesh>

            {/* Floor Reflection Catcher */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]} receiveShadow>
                <planeGeometry args={[50, 50]} />
                <meshStandardMaterial
                    color="#050505"
                    roughness={0.1}
                    metalness={0.5}
                />
            </mesh>
        </group>
    );
}

function Lighting() {
    return (
        <group>
            <ambientLight intensity={0.5} color="#ffffff" />
        </group>
    );
}

function FloatingLogo() {
    // Placeholder for 3D logo if requested, or just an object to refract light
    // For now, let's keep the room empty as requested, just the environment.
    return null;
}


export function ThreeDBackground() {
    return (
        <div className="absolute inset-0 z-0 bg-charcoal">
            <Canvas shadows camera={{ position: [0, 0, 10], fov: 45 }}>
                <fog attach="fog" args={["#050505", 5, 30]} />
                <Lighting />
                <Room />
                <FloatingLogo />
            </Canvas>

            {/* Texture Overlay for "Screen" feel */}
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('/noise.png')] mix-blend-overlay" />
        </div>
    );
}

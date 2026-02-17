"use client";

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function Background3D() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // --- Scene Setup ---
        const scene = new THREE.Scene();
        scene.fog = new THREE.Fog(0x080808, 10, 50);

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        containerRef.current.appendChild(renderer.domElement);

        // --- Cube Room Geometry ---
        // We create a large box and render the back side
        const roomSize = 25;
        const geometry = new THREE.BoxGeometry(roomSize, roomSize, roomSize);

        // Grid Material Simulation
        const material = new THREE.MeshPhongMaterial({
            color: 0x111111,
            side: THREE.BackSide,
            wireframe: false,
        });

        const room = new THREE.Mesh(geometry, material);
        scene.add(room);

        // Add visible grid lines to the "walls"
        const gridHelper = new THREE.GridHelper(roomSize, 20, 0xff4d00, 0x222222);
        gridHelper.position.y = -roomSize / 2;
        scene.add(gridHelper);

        const gridHelperTop = new THREE.GridHelper(roomSize, 20, 0xff4d00, 0x222222);
        gridHelperTop.position.y = roomSize / 2;
        gridHelperTop.rotation.x = Math.PI;
        scene.add(gridHelperTop);

        const gridHelperLeft = new THREE.GridHelper(roomSize, 20, 0xff4d00, 0x222222);
        gridHelperLeft.position.x = -roomSize / 2;
        gridHelperLeft.rotation.z = Math.PI / 2;
        scene.add(gridHelperLeft);

        const gridHelperRight = new THREE.GridHelper(roomSize, 20, 0xff4d00, 0x222222);
        gridHelperRight.position.x = roomSize / 2;
        gridHelperRight.rotation.z = -Math.PI / 2;
        scene.add(gridHelperRight);

        // --- 120BPM Pulse Lighting ---
        // 120 BPM = 2 Beats per second = 500ms cycle
        const ambientLight = new THREE.AmbientLight(0x080808, 0.5);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xbd2c0f, 0, 40);
        pointLight.position.set(0, 0, 0);
        scene.add(pointLight);

        // --- Animation Loop ---
        let frame = 0;
        const animate = () => {
            frame = requestAnimationFrame(animate);

            const time = Date.now();
            // BPM Logic: 120 bpm = 2Hz. Cycle = 500ms.
            // Use a sharper curve for a "kick drum" feel
            const pulse = Math.pow(Math.sin((time * Math.PI) / 500), 10);

            pointLight.intensity = 5 + pulse * 40;
            pointLight.distance = 30 + pulse * 50;

            // Pulse the grid helper color slightly
            (gridHelper.material as THREE.Material).opacity = 0.2 + pulse * 0.5;
            (gridHelperTop.material as THREE.Material).opacity = 0.2 + pulse * 0.5;
            (gridHelperLeft.material as THREE.Material).opacity = 0.1 + pulse * 0.3;
            (gridHelperRight.material as THREE.Material).opacity = 0.1 + pulse * 0.3;

            // Subtle room movement
            room.rotation.y += 0.0005;
            room.rotation.x = Math.sin(time * 0.0003) * 0.03;

            renderer.render(scene, camera);
        };

        animate();

        // --- Resize Handler ---
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener('resize', handleResize);
            if (containerRef.current) {
                containerRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
            geometry.dispose();
            material.dispose();
        };
    }, []);

    return <div ref={containerRef} className="fixed inset-0 -z-10 pointer-events-none opacity-40" />;
}

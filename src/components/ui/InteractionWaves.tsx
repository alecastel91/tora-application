"use client";

import React, { useEffect, useRef } from 'react';

interface Wave {
    x: number;
    y: number;
    radius: number;
    life: number; // 0 to 1
    opacity: number;
}

export function InteractionWaves() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouse = useRef({ x: 0, y: 0, active: false });
    const waves = useRef<Wave[]>([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const setSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        setSize();
        window.addEventListener('resize', setSize);

        const handleMouseMove = (e: MouseEvent) => {
            mouse.current.x = e.clientX;
            mouse.current.y = e.clientY;
            mouse.current.active = true;
            if (Math.random() > 0.7) spawnWave(e.clientX, e.clientY);
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches[0]) {
                mouse.current.x = e.touches[0].clientX;
                mouse.current.y = e.touches[0].clientY;
                mouse.current.active = true;
                if (Math.random() > 0.7) spawnWave(e.touches[0].clientX, e.touches[0].clientY);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('touchmove', handleTouchMove);

        const spawnWave = (x: number, y: number) => {
            waves.current.push({
                x,
                y,
                radius: 5,
                life: 1.0,
                opacity: Math.random() * 0.3 + 0.1
            });
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Core mouse pulse (vibration)
            if (mouse.current.active) {
                const pulse = Math.sin(Date.now() / 150) * 8;
                ctx.beginPath();
                ctx.arc(mouse.current.x, mouse.current.y, 20 + pulse, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(255, 255, 255, ${0.15 + pulse * 0.005})`;
                ctx.lineWidth = 1.5;
                ctx.stroke();
            }

            // Update and Draw Waves
            waves.current.forEach((w, i) => {
                w.radius += 2.5;
                w.life -= 0.015;

                if (w.life <= 0) {
                    waves.current.splice(i, 1);
                    return;
                }

                ctx.beginPath();
                ctx.arc(w.x, w.y, w.radius, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(255, 255, 255, ${w.opacity * w.life})`;
                ctx.lineWidth = 2 * w.life;
                ctx.stroke();

                // Secondary subtle wave
                ctx.beginPath();
                ctx.arc(w.x, w.y, w.radius * 0.8, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(255, 255, 255, ${w.opacity * 0.5 * w.life})`;
                ctx.lineWidth = 1 * w.life;
                ctx.stroke();
            });

            requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', setSize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchmove', handleTouchMove);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-[60] pointer-events-none mix-blend-screen"
        />
    );
}

"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * WebGLBackground — Subtle starfield
 *
 * Two soft particle layers with mouse + page scroll + restaurant-menu scroll parallax.
 * Near-field particles are kept small so the field stays calm, not noisy.
 */
export default function WebGLBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      2000
    );
    camera.position.z = 500;

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      powerPreference: "high-performance",
    });
    renderer.setClearColor(0x000000, 1);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.inset = "0";
    renderer.domElement.style.pointerEvents = "none";
    container.appendChild(renderer.domElement);

    // Soft glow — smaller bright core, quick falloff (less "blob" when close)
    const c = document.createElement("canvas");
    c.width = 64;
    c.height = 64;
    const ctx = c.getContext("2d")!;
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, "rgba(255,255,255,0.95)");
    grad.addColorStop(0.12, "rgba(255,255,255,0.55)");
    grad.addColorStop(0.4, "rgba(255,255,255,0.12)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    const texture = new THREE.CanvasTexture(c);

    // Keep particles away from the camera so sizeAttenuation never balloons them
    const MIN_Z = -200; // closest (still ~700 units from camera at z=500)
    const MAX_DUST_Z = -1400;
    const MAX_STAR_Z = -1100;

    // ── Layer 1: Dust field ──
    const dustCount = 900;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 2000;
      dustPos[i * 3 + 1] = (Math.random() - 0.5) * 1400;
      // Bias toward mid/far field (sqrt → fewer near particles)
      const t = Math.sqrt(Math.random());
      dustPos[i * 3 + 2] = MIN_Z + t * (MAX_DUST_Z - MIN_Z);
    }
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      size: 2.4,
      map: texture,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: 0xffffff,
      sizeAttenuation: true,
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);

    // ── Layer 2: Sparse accent stars ──
    const starCount = 120;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 1800;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 1200;
      const t = Math.sqrt(Math.random());
      starPos[i * 3 + 2] = MIN_Z + t * (MAX_STAR_Z - MIN_Z);
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      size: 3.6,
      map: texture,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: 0xdde8ff,
      sizeAttenuation: true,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // ── Input tracking ──
    let mouseX = 0;
    let mouseY = 0;
    let smoothMouseX = 0;
    let smoothMouseY = 0;
    let pageScrollY = 0;
    let smoothPageScrollY = 0;
    // Restaurant menu (and other nested scrollers) drive this via CustomEvent
    let overlayScrollY = 0;
    let smoothOverlayScrollY = 0;
    let halfW = window.innerWidth / 2;
    let halfH = window.innerHeight / 2;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX - halfW) / halfW;
      mouseY = (e.clientY - halfH) / halfH;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseX = (e.touches[0].clientX - halfW) / halfW;
        mouseY = (e.touches[0].clientY - halfH) / halfH;
      }
    };
    const onScroll = () => {
      pageScrollY = window.scrollY;
    };
    const onOverlayScroll = (e: Event) => {
      const detail = (e as CustomEvent<{ scrollTop?: number; progress?: number }>).detail;
      // Map menu scrollTop → subtle field shift (keeps motion calm)
      overlayScrollY = (detail?.scrollTop ?? 0) * 0.22;
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("apex-overlay-scroll", onOverlayScroll);

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      halfW = window.innerWidth / 2;
      halfH = window.innerHeight / 2;
    };
    window.addEventListener("resize", onResize);

    const clock = new THREE.Clock();
    let frameId: number;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      smoothMouseX += (mouseX - smoothMouseX) * 0.04;
      smoothMouseY += (mouseY - smoothMouseY) * 0.04;
      smoothPageScrollY += (pageScrollY - smoothPageScrollY) * 0.1;
      smoothOverlayScrollY += (overlayScrollY - smoothOverlayScrollY) * 0.08;

      // Gentle mouse parallax (muted so it never competes with UI)
      camera.position.x = smoothMouseX * 90;
      camera.position.y = -smoothMouseY * 55;
      camera.lookAt(scene.position);

      // Page scroll + nested menu scroll, different layer speeds
      const scrollOffset = smoothPageScrollY * 0.35 + smoothOverlayScrollY;
      dust.position.y = scrollOffset * 0.45;
      stars.position.y = scrollOffset * 0.75;
      // Tiny lateral drift from overlay scroll so motion feels dimensional
      dust.position.x = smoothOverlayScrollY * 0.04;
      stars.position.x = smoothOverlayScrollY * 0.07;

      // Very slow continuous drift
      dust.rotation.y = t * 0.01;
      dust.rotation.x = t * 0.004;
      stars.rotation.y = t * 0.014;
      stars.rotation.x = t * 0.006;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("apex-overlay-scroll", onOverlayScroll);
      window.removeEventListener("resize", onResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      dustGeo.dispose();
      dustMat.dispose();
      starGeo.dispose();
      starMat.dispose();
      texture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="webgl-background"
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}

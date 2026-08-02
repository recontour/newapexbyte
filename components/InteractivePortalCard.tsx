"use client";

import React, { useRef, useState, useEffect } from "react";

interface PortalCardProps {
  id: string;
  category: string;
  title: string;
  imageSrc: string;
  index: number;
  isExpanded: boolean;
  isOtherExpanded: boolean;
  onSelect: (id: string) => void;
}

export default function InteractivePortalCard({
  id,
  category,
  title,
  imageSrc,
  index,
  isExpanded,
  isOtherExpanded,
  onSelect,
}: PortalCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [lightPos, setLightPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Intersection Observer for slow, elegant scroll reveal
  useEffect(() => {
    const cardEl = cardRef.current;
    if (!cardEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(cardEl);
        }
      },
      {
        threshold: 0.05,
        rootMargin: "0px 0px 60px 0px",
      }
    );

    observer.observe(cardEl);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Mouse / Touch motion handler for subtle light shift and tilt
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!cardRef.current || isExpanded || isOtherExpanded) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const px = (x / rect.width) * 100;
    const py = (y / rect.height) * 100;
    setLightPos({ x: px, y: py });

    const tiltX = ((y - rect.height / 2) / (rect.height / 2)) * -6;
    const tiltY = ((x - rect.width / 2) / (rect.width / 2)) * 6;
    setTilt({ x: tiltX, y: tiltY });
  };

  const handlePointerEnter = () => {
    if (!isExpanded && !isOtherExpanded) setIsHovered(true);
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
    setLightPos({ x: 50, y: 50 });
  };

  // WebGL / Canvas ambient light sheen effect on the card
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let alpha = 0;

    const renderCanvas = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      if (isHovered && !isExpanded && !isOtherExpanded) {
        alpha = Math.min(0.25, alpha + 0.02);
      } else {
        alpha = Math.max(0, alpha - 0.02);
      }

      if (alpha > 0) {
        const lx = (lightPos.x / 100) * w;
        const ly = (lightPos.y / 100) * h;
        const radius = Math.max(w, h) * 0.7;

        const grad = ctx.createRadialGradient(lx, ly, 0, lx, ly, radius);
        grad.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
        grad.addColorStop(0.4, `rgba(63, 185, 235, ${alpha * 0.4})`);
        grad.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      }

      animId = requestAnimationFrame(renderCanvas);
    };

    renderCanvas();
    return () => cancelAnimationFrame(animId);
  }, [isHovered, lightPos, isExpanded, isOtherExpanded]);

  // Compute staggered delay:
  // Mobile: Card 0 (450ms), Card 1 (750ms staggered peek), Card 2 (on scroll)
  // Desktop: Staggered row reveal (550ms + index * 260ms)
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const mobileDelay = index === 0 ? 450 : index === 1 ? 750 : 0;
  const desktopDelay = 550 + index * 260;
  const transitionDelay = isVisible
    ? `${isMobile ? mobileDelay : desktopDelay}ms`
    : "0ms";

  return (
    <div
      ref={cardRef}
      className={`portal-card ${isVisible ? "is-visible" : ""} ${
        isExpanded ? "expanded" : ""
      } ${isOtherExpanded ? "receded" : ""} ${isHovered ? "hovered" : ""}`}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onClick={() => !isExpanded && onSelect(id)}
      style={{
        transitionDelay: transitionDelay,
        transform:
          !isExpanded && !isOtherExpanded && isHovered
            ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.02)`
            : undefined,
      }}
    >
      {/* Background Image Container */}
      <div className="portal-card-media">
        <img src={imageSrc} alt={title} className="portal-card-img" />
        <div className="portal-card-overlay" />
      </div>

      {/* Interactive Light Layer Canvas */}
      <canvas
        ref={canvasRef}
        width={300}
        height={400}
        className="portal-card-canvas"
      />

      {/* Card Content Text */}
      <div className="portal-card-content">
        <span className="portal-card-category">{category}</span>
        <h3 className="portal-card-title">{title}</h3>
      </div>

      {/* Indicator Badge */}
      <div className="portal-card-badge">
        <span>EXPLORE PORTAL</span>
      </div>
    </div>
  );
}

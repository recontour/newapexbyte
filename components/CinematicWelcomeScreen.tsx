"use client";

import React, { useRef, useEffect } from "react";

/**
 * Cinematic Welcome Screen
 *
 * Entrance timeline + liquid-damped scroll/swipe snap transition.
 * Features custom 1.4s damped rAF smooth scrolling + 0.045 heavy liquid lerp
 * for a calm, unhurried, spring-cushioned transition into the showcase header.
 */
export default function CinematicWelcomeScreen() {
  const containerRef = useRef<HTMLDivElement>(null);
  const placeholderRef = useRef<HTMLDivElement>(null);

  // Entrance clip-mask inner refs
  const welcomeClipRef = useRef<HTMLDivElement>(null);

  // Floating fixed APEXBYTE + inner clip container
  const apexFixedRef = useRef<HTMLDivElement>(null);
  const apexFixedInnerRef = useRef<HTMLDivElement>(null);

  // Layout refs
  const welcomeRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const dividerLineRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const taglineInnerRef = useRef<HTMLParagraphElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId: number;
    let currentScrollProgress = 0;
    let entranceDone = false;
    let isSnapping = false;

    let startX = 0;
    let startY = 0;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
    const map01 = (v: number, lo: number, hi: number) => clamp01((v - lo) / (hi - lo));
    const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const getVScale = () =>
      parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--vscale") || "1");

    const measure = () => {
      if (placeholderRef.current) {
        const r = placeholderRef.current.getBoundingClientRect();
        startX = r.left;
        startY = r.top;
      }
    };

    measure();
    document.fonts.ready.then(() => {
      measure();
      if (apexFixedRef.current) {
        apexFixedRef.current.style.transform = `translate(${startX}px, ${startY}px) scale(1)`;
      }
    });
    window.addEventListener("resize", measure);

    // ── Entrance Timeline (Total ~2.8s) ──
    const ENTRANCE = {
      welcomeStart: 200,
      welcomeEnd: 1000,
      apexStart: 600,
      apexEnd: 1500,
      dividerStart: 1100,
      dividerEnd: 1700,
      taglineStart: 1400,
      taglineEnd: 2300,
      scrollCueStart: 2000,
      scrollCueEnd: 2800,
      total: 2800,
    };

    const entranceStart = performance.now();

    const runEntrance = (now: number) => {
      const elapsed = now - entranceStart;

      // WELCOME TO
      const wP = easeOutQuart(map01(elapsed, ENTRANCE.welcomeStart, ENTRANCE.welcomeEnd));
      if (welcomeClipRef.current) {
        welcomeClipRef.current.style.transform = `translateY(${(1 - wP) * 110}%)`;
        welcomeClipRef.current.style.opacity = `${wP}`;
      }

      // APEXBYTE
      const aP = easeOutQuart(map01(elapsed, ENTRANCE.apexStart, ENTRANCE.apexEnd));
      if (apexFixedInnerRef.current) {
        apexFixedInnerRef.current.style.transform = `translateY(${(1 - aP) * 110}%)`;
      }
      if (apexFixedRef.current) {
        apexFixedRef.current.style.transform = `translate(${startX}px, ${startY}px) scale(1)`;
        apexFixedRef.current.style.opacity = `${aP}`;
      }

      // Divider
      const dP = easeOutCubic(map01(elapsed, ENTRANCE.dividerStart, ENTRANCE.dividerEnd));
      if (dividerLineRef.current) {
        dividerLineRef.current.style.transform = `scaleX(${dP})`;
      }
      if (dividerRef.current) {
        dividerRef.current.style.opacity = `${dP > 0 ? 1 : 0}`;
      }

      // Tagline
      const tP = easeOutQuart(map01(elapsed, ENTRANCE.taglineStart, ENTRANCE.taglineEnd));
      if (taglineInnerRef.current) {
        taglineInnerRef.current.style.transform = `translateY(${(1 - tP) * 100}%)`;
        taglineInnerRef.current.style.opacity = `${tP}`;
      }

      // Scroll Cue
      const sP = easeOutCubic(map01(elapsed, ENTRANCE.scrollCueStart, ENTRANCE.scrollCueEnd));
      if (scrollCueRef.current) {
        scrollCueRef.current.style.opacity = `${sP}`;
      }

      if (elapsed >= ENTRANCE.total) {
        entranceDone = true;
      }
    };

    // ── Heavy Liquid Damped Scroll Visual Transformation ──
    const applyScroll = (p: number) => {
      const vs = getVScale();
      const isMobile = window.innerWidth < 768;

      const fadeP = 1 - map01(p, 0, 0.45);
      const drift = -p * 60;

      if (welcomeRef.current) {
        welcomeRef.current.style.opacity = `${fadeP}`;
        welcomeRef.current.style.transform = `translateY(${drift * 0.5}px)`;
      }
      if (welcomeClipRef.current) {
        welcomeClipRef.current.style.transform = "translateY(0)";
        welcomeClipRef.current.style.opacity = "1";
      }

      if (dividerRef.current) {
        dividerRef.current.style.opacity = `${fadeP}`;
      }
      if (taglineRef.current) {
        taglineRef.current.style.opacity = `${fadeP}`;
        taglineRef.current.style.transform = `translateY(${drift * 0.35}px)`;
      }
      if (taglineInnerRef.current) {
        taglineInnerRef.current.style.transform = "translateY(0)";
        taglineInnerRef.current.style.opacity = "1";
      }
      if (scrollCueRef.current) {
        scrollCueRef.current.style.opacity = `${1 - map01(p, 0, 0.25)}`;
      }

      // APEXBYTE moves with heavy damped easeOutQuart curve to top-left corner
      const moveP = easeOutQuart(map01(p, 0.02, 0.92));
      const endX = vs * (isMobile ? 20 : 40);
      const endY = vs * (isMobile ? 24 : 36);
      const scaleEnd = isMobile ? 22 / 46 : 36 / 138;

      if (apexFixedRef.current) {
        const curX = lerp(startX, endX, moveP);
        const curY = lerp(startY, endY, moveP);
        const curScale = lerp(1, scaleEnd, moveP);
        apexFixedRef.current.style.transform = `translate(${curX}px, ${curY}px) scale(${curScale})`;
      }
      if (apexFixedInnerRef.current) {
        apexFixedInnerRef.current.style.transform = "translateY(0)";
      }
    };

    // ── Custom Damped Smooth Scroll Engine (1400ms duration) ──
    const scrollToTarget = (targetY: number) => {
      isSnapping = true;
      const startScrollY = window.scrollY;
      const distance = targetY - startScrollY;
      const startTime = performance.now();
      const duration = 1400; // ms — calm, unhurried glide

      const stepScroll = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        const easeP = easeOutQuart(progress);
        window.scrollTo(0, startScrollY + distance * easeP);

        if (progress < 1) {
          requestAnimationFrame(stepScroll);
        } else {
          isSnapping = false;
        }
      };

      requestAnimationFrame(stepScroll);
    };

    // ── Gesture Trigger Handlers ──
    let touchStartY = 0;

    const handleWheel = (e: WheelEvent) => {
      if (document.body.classList.contains("restaurant-active")) return;
      const targetTop = containerRef.current ? containerRef.current.offsetHeight : window.innerHeight;
      if (e.deltaY > 8 && window.scrollY < targetTop * 0.5 && !isSnapping) {
        scrollToTarget(targetTop);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (document.body.classList.contains("restaurant-active")) return;
      if (e.touches.length > 0) {
        touchStartY = e.touches[0].clientY;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (document.body.classList.contains("restaurant-active")) return;
      if (e.changedTouches.length > 0) {
        const touchEndY = e.changedTouches[0].clientY;
        const diff = touchStartY - touchEndY;
        const targetTop = containerRef.current ? containerRef.current.offsetHeight : window.innerHeight;

        if (diff > 25 && window.scrollY < targetTop * 0.5 && !isSnapping) {
          scrollToTarget(targetTop);
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    const tick = (now: number) => {
      if (!document.body.classList.contains("restaurant-active")) {
        if (!entranceDone) {
          runEntrance(now);
        }

        const targetTop = containerRef.current ? containerRef.current.offsetHeight : window.innerHeight;
        const raw = Math.max(0, Math.min(1, window.scrollY / targetTop));
        // Damped liquid lerp coefficient (0.045) for calm visual weight
        currentScrollProgress = lerp(currentScrollProgress, raw, 0.045);

        if (currentScrollProgress > 0.001 || entranceDone) {
          applyScroll(currentScrollProgress);
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", measure);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return (
    <>
      {/* Fixed APEXBYTE header */}
      <div
        ref={apexFixedRef}
        className="apex-fixed-header"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          transformOrigin: "0 0",
          zIndex: 100,
          pointerEvents: "none",
          willChange: "transform",
          opacity: 0,
          overflow: "hidden",
        }}
      >
        <div ref={apexFixedInnerRef} style={{ transform: "translateY(110%)" }}>
          <h1 className="hero-title" style={{ margin: 0, lineHeight: 1 }}>
            <span className="hero-word" style={{ marginRight: 0 }}>
              APEX<span style={{ color: "#3FB9EB" }}>BYTE</span>
            </span>
          </h1>
        </div>
      </div>

      {/* 100vh Landing Container */}
      <div ref={containerRef} className="welcome-container">
        <main className="hero-main" style={{ position: "relative", zIndex: 12 }}>

          {/* WELCOME TO */}
          <div ref={welcomeRef} className="hero-line1-container" style={{ overflow: "hidden" }}>
            <div ref={welcomeClipRef} style={{ transform: "translateY(110%)", opacity: 0 }}>
              <div className="hero-title" style={{ display: "flex", gap: "0.22em", justifyContent: "center" }}>
                <span className="hero-word">WELCOME</span>
                <span className="hero-word">TO</span>
              </div>
            </div>
          </div>

          {/* Placeholder for APEXBYTE */}
          <div ref={placeholderRef} style={{ visibility: "hidden" }}>
            <div className="hero-title" style={{ margin: 0, lineHeight: 1 }}>
              <span className="hero-word" style={{ marginRight: 0 }}>APEXBYTE</span>
            </div>
          </div>

          {/* Divider */}
          <div ref={dividerRef} className="hero-divider" style={{ opacity: 0 }}>
            <div
              ref={dividerLineRef}
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                transform: "scaleX(0)",
                transformOrigin: "center",
              }}
            />
          </div>

          {/* Tagline */}
          <div ref={taglineRef} style={{ overflow: "hidden" }}>
            <p
              ref={taglineInnerRef}
              className="hero-subtitle"
              style={{ transform: "translateY(100%)", opacity: 0 }}
            >
              We shape your ideas
            </p>
          </div>

        </main>

        {/* Scroll Cue */}
        <div ref={scrollCueRef} className="scroll-cue" style={{ opacity: 0 }}>
          <span className="scroll-cue-text">Scroll</span>
          <div className="scroll-cue-line" />
        </div>

      </div>
    </>
  );
}

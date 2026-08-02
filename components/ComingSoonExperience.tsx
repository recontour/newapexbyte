"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";

interface Props {
  category: string;
  title: string;
  details: string;
  imageSrc: string;
  onClose: () => void;
}

export default function ComingSoonExperience({
  category,
  title,
  details,
  imageSrc,
  onClose,
}: Props) {
  // Lock body scroll and suppress APEXBYTE fixed header when open
  useEffect(() => {
    const origOverflow = document.body.style.overflow;
    const origPosition = document.body.style.position;
    const origWidth = document.body.style.width;
    const origHeight = document.body.style.height;

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
    document.body.style.height = "100%";
    document.body.classList.add("restaurant-active");

    const handleTouchMove = (e: TouchEvent) => {
      if (e.cancelable) e.preventDefault();
    };

    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      document.body.style.overflow = origOverflow;
      document.body.style.position = origPosition;
      document.body.style.width = origWidth;
      document.body.style.height = origHeight;
      document.body.classList.remove("restaurant-active");

      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  return (
    <motion.div
      className="restaurant-portrait-wrapper"
      initial={{ opacity: 0, scale: 0.985 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      onWheel={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      onTouchEnd={(e) => e.stopPropagation()}
    >
      <div className="coming-soon-experience-container">
        {/* Top Header with Restrained Close Control */}
        <header className="restaurant-top-header">
          <div className="restaurant-brand-meta">
            <h1 className="restaurant-name">{category}</h1>
            <span className="restaurant-tagline">Experience in Development</span>
          </div>

          <button className="restaurant-close-btn" onClick={onClose} aria-label="Close">
            <span>✕</span>
            <span>CLOSE</span>
          </button>
        </header>

        {/* Center Content */}
        <div className="coming-soon-full-center">
          <motion.div
            className="coming-soon-cover-box"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <img src={imageSrc} alt={title} className="coming-soon-cover-img" />
            <div className="coming-soon-cover-overlay" />
          </motion.div>

          <motion.div
            className="coming-soon-text-group"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="coming-soon-badge-tag">COMING SOON</span>
            <h2 className="coming-soon-full-title">{title}</h2>
            <p className="coming-soon-full-desc">{details}</p>
            <div className="coming-soon-pulse-indicator">
              <span className="pulse-dot" />
              <span className="pulse-text">CRAFTING EXPERIENCE</span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

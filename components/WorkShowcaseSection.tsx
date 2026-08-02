"use client";

import React, { useState, useRef, useEffect } from "react";
import InteractivePortalCard from "./InteractivePortalCard";
import RestaurantMenuExperience from "./RestaurantMenuExperience";
import ComingSoonExperience from "./ComingSoonExperience";



interface CardData {
  id: string;
  category: string;
  title: string;
  imageSrc: string;
  details: string;
}

const CARDS: CardData[] = [
  {
    id: "restaurant",
    category: "RESTAURANT",
    title: "A menu experience that feels considered.",
    imageSrc: "/photos/restaurant.webp",
    details: "Immersive culinary interface & digital menu experience.",
  },
  {
    id: "salon",
    category: "SALON",
    title: "Services presented with the same care as the work itself.",
    imageSrc: "/photos/salon.webp",
    details: "Boutique booking journey & bespoke service showcase.",
  },
  {
    id: "portfolio",
    category: "PORTFOLIO",
    title: "Work that moves the way the eye sees.",
    imageSrc: "/photos/portfolio.webp",
    details: "Fluid digital showcase for forward-thinking creative work.",
  },
];

export default function WorkShowcaseSection() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [headerVisible, setHeaderVisible] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  const selectedCard = CARDS.find((c) => c.id === selectedId);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeaderVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleSelectCard = (id: string) => {
    setSelectedId(id);
  };

  const handleBack = () => {
    setSelectedId(null);
  };

  return (
    <section className={`showcase-section ${selectedId ? "is-selected-view" : ""}`}>
      {!selectedId ? (
        <div className="showcase-frame">
          {/* Section Intro Heading */}
          <div
            ref={headerRef}
            className={`showcase-header ${headerVisible ? "is-visible" : ""}`}
          >
            <h2 className="showcase-intro-text">
              “We shape digital experiences that feel considered, alive, and a little unexpected.”
            </h2>
          </div>

          {/* 3 Cards Grid */}
          <div className="showcase-grid">
            {CARDS.map((card, idx) => (
              <InteractivePortalCard
                key={card.id}
                id={card.id}
                category={card.category}
                title={card.title}
                imageSrc={card.imageSrc}
                index={idx}
                isExpanded={selectedId === card.id}
                isOtherExpanded={selectedId !== null && selectedId !== card.id}
                onSelect={handleSelectCard}
              />
            ))}
          </div>
        </div>
      ) : selectedId === "restaurant" ? (
        <RestaurantMenuExperience onClose={handleBack} />
      ) : (
        <ComingSoonExperience
          category={selectedCard?.category || "EXPERIENCE"}
          title={selectedCard?.title || "Coming Soon"}
          details={selectedCard?.details || "We are crafting every interaction to feel calm, unhurried, and uncompromisingly refined."}
          imageSrc={selectedCard?.imageSrc || "/photos/salon.webp"}
          onClose={handleBack}
        />
      )}
    </section>
  );
}

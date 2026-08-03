"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  category: string;
  quantity: number;
}

interface Props {
  onClose: () => void;
  selectedDishes: OrderItem[];
  totalPrice: number;
  onOpenFloorView?: () => void;
}

export default function KitchenViewExperience({ onClose, selectedDishes, totalPrice, onOpenFloorView }: Props) {
  const [istTime, setIstTime] = useState<string>("");
  const [activeStage, setActiveStage] = useState<"RECEIVED" | "PREPARING" | "READY">("RECEIVED");
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(142); // Starts at 2m 22s for live demo
  const [showNote, setShowNote] = useState<boolean>(true);
  const [waiterSent, setWaiterSent] = useState<boolean>(false);

  // Live ticking elapsed timer for the active order
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatElapsed = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainderSecs = sec % 60;
    return `${mins}m ${remainderSecs < 10 ? "0" : ""}${remainderSecs}s`;
  };

  // Stage change handler that updates instruction prompt dynamically
  const handleStageChange = (newStage: "RECEIVED" | "PREPARING" | "READY") => {
    setActiveStage(newStage);
    setShowNote(true);
  };

  // Live Indian Time clock (IST)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
      setIstTime(`${timeStr} IST`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Quick AI Assistant queries for the kitchen
  const handleAiQuery = (queryType: string) => {
    if (queryType === "biryanis") {
      const biryaniCount = selectedDishes
        .filter((d) => d.name.toLowerCase().includes("biryani"))
        .reduce((sum, d) => sum + d.quantity, 0);
      setAiAnswer(`Currently ${biryaniCount > 0 ? biryaniCount : 1} Biryani order pending for Table 4.`);
    } else if (queryType === "next") {
      setAiAnswer("Next priority order: Table 4 (3 items, 4 mins active preparation).");
    } else if (queryType === "notes") {
      setAiAnswer("Special instruction for Table 4: Extra mild spice requested for Butter Chicken.");
    }
  };

  // Fallback items if array is empty (for demo preview)
  const itemsToDisplay = selectedDishes.length > 0 ? selectedDishes : [
    { id: "m4", name: "Butter Chicken", price: 429, category: "Main Course", quantity: 2 },
    { id: "b2", name: "Garlic Naan", price: 89, category: "Breads", quantity: 4 },
    { id: "r5", name: "Royal Saffron Dum Biryani", price: 419, category: "Rice", quantity: 1 },
  ];

  return (
    <motion.div
      className="kitchen-view-fullscreen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* 1. Fullscreen Header — Simplified & Quiet */}
      <header className="kitchen-view-header">
        <div className="kitchen-header-left">
          <h1 className="kitchen-main-title">Kitchen</h1>
          <span className="kitchen-subtitle">Saffron & Spice</span>
        </div>

        <div className="kitchen-header-right">
          <button className="kitchen-close-btn" onClick={onClose} aria-label="Return to Menu">
            <span>Back</span>
          </button>
        </div>
      </header>

      {/* 2. Main Body Content (Order Card & Quiet Assistant) */}
      <main className="kitchen-view-main">
        {/* Order Card Container */}
        <div className="kitchen-order-card">
          {/* Card Top Metadata Bar */}
          <div className="kitchen-card-header">
            {/* Row 1: Order Text and Number */}
            <div className="order-title-row">
              <span className="order-number">ORDER #142</span>
            </div>

            {/* Row 2: Table Number & Live Ticking Elapsed Timer */}
            <div className="order-sub-row">
              <span className="order-type-badge">TABLE 4 · DINE-IN</span>
              <div className="order-live-timer">
                <span className="timer-dot-pulse" />
                <span className="order-time-val">{formatElapsed(elapsedSeconds)} ago</span>
              </div>
            </div>
          </div>

          {/* Dish List with Prominent Quantities */}
          <div className="kitchen-card-items-list">
            {itemsToDisplay.map((item) => (
              <div key={item.id} className="kitchen-item-row">
                <div className="item-qty-badge">{item.quantity}×</div>
                <div className="item-details">
                  <span className="item-name">{item.name}</span>
                  <span className="item-category">{item.category}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Special Kitchen Notes */}
          <div className="kitchen-special-notes">
            <span className="notes-heading">SPECIAL INSTRUCTIONS</span>
            <p className="notes-text">
              Extra mild spice for Butter Chicken. Serve with fresh mint chutney on the side.
            </p>
          </div>

          {/* Large Touch-Friendly Status Progression Bar with Guided Walkthrough */}
          <div className="kitchen-status-control-section">
            {/* Evident Pulsing Walkthrough Instructional Note */}
            <AnimatePresence mode="wait">
              {showNote && (
                <motion.div
                  key={activeStage}
                  className="kitchen-instruction-banner pulsed-walkthrough-banner"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="walkthrough-note-left">
                    <span className="walkthrough-pulse-dot" />
                    <span className="instruction-text">
                      {activeStage === "RECEIVED" && "Tap Preparing when the kitchen starts working on this order."}
                      {activeStage === "PREPARING" && "Tap Ready when the order is finished."}
                      {activeStage === "READY" && "Order is ready! Send notification to server."}
                    </span>
                  </div>
                  <button className="instruction-dismiss-btn" onClick={() => setShowNote(false)}>
                    Dismiss
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <span className="status-control-label">STATUS</span>
            <div className="kitchen-status-toggle-bar">
              <button
                className={`status-toggle-btn status-btn-received ${activeStage === "RECEIVED" ? "active" : ""}`}
                onClick={() => handleStageChange("RECEIVED")}
              >
                Received
              </button>
              <button
                className={`status-toggle-btn status-btn-preparing ${activeStage === "PREPARING" ? "active" : ""}`}
                onClick={() => handleStageChange("PREPARING")}
              >
                Preparing
              </button>
              <button
                className={`status-toggle-btn status-btn-ready ${activeStage === "READY" ? "active" : ""}`}
                onClick={() => handleStageChange("READY")}
              >
                Ready
              </button>
            </div>

            {/* Populated Action Button when Order is Ready */}
            <AnimatePresence>
              {activeStage === "READY" && (
                <motion.div
                  className="waiter-action-container"
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: 14 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  <button
                    className={`send-waiter-btn ${waiterSent ? "sent" : ""}`}
                    onClick={() => {
                      setWaiterSent(true);
                      if (onOpenFloorView) {
                        setTimeout(() => {
                          onOpenFloorView();
                        }, 500);
                      }
                    }}
                  >
                    {waiterSent ? "Opening Floor View →" : "View Floor View →"}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* 3. Quiet Integrated Kitchen Assistant Panel */}
        <aside className="kitchen-ai-sidebar">
          <div className="kitchen-ai-card">
            <div className="kitchen-ai-header">
              <span className="ai-status-dot" />
              <span className="ai-title">Station Quick Actions</span>
            </div>

            <div className="ai-query-chips">
              <button className="ai-chip-btn" onClick={() => handleAiQuery("biryanis")}>
                Biryani Summary
              </button>
              <button className="ai-chip-btn" onClick={() => handleAiQuery("next")}>
                Next Priority
              </button>
              <button className="ai-chip-btn" onClick={() => handleAiQuery("notes")}>
                Table 4 Notes
              </button>
            </div>

            <AnimatePresence mode="wait">
              {aiAnswer && (
                <motion.div
                  key={aiAnswer}
                  className="ai-answer-box"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="answer-text">{aiAnswer}</span>
                  <button className="answer-clear-btn" onClick={() => setAiAnswer(null)}>
                    DISMISS
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </aside>
      </main>
    </motion.div>
  );
}

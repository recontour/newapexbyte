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
  selectedDishes?: OrderItem[];
  onOpenManagerView?: () => void;
}

export type TableStatus = "Available" | "OTP Requested" | "Placing Order" | "Order Placed" | "Ready" | "Served" | "Occupied";

interface TableData {
  id: number;
  name: string;
  status: TableStatus;
  secondaryInfo?: string;
  orderNumber?: string;
  items?: { name: string; quantity: number }[];
  specialInstructions?: string;
}

export default function FloorViewExperience({ onClose, selectedDishes = [], onOpenManagerView }: Props) {
  // Demo items for Table 4 if none passed
  const demoItems = selectedDishes.length > 0
    ? selectedDishes.map((d) => ({ name: d.name, quantity: d.quantity }))
    : [
        { name: "Butter Chicken", quantity: 2 },
        { name: "Garlic Naan", quantity: 4 },
        { name: "Royal Saffron Dum Biryani", quantity: 1 },
      ];

  const [tables, setTables] = useState<TableData[]>([
    { id: 1, name: "Table 1", status: "OTP Requested", secondaryInfo: "OTP Sent" },
    { id: 2, name: "Table 2", status: "Available" },
    { id: 3, name: "Table 3", status: "Order Placed", secondaryInfo: "3 mins ago" },
    {
      id: 4,
      name: "Table 4",
      status: "Ready",
      secondaryInfo: "Order #142 · Ready to serve",
      orderNumber: "#142",
      items: demoItems,
      specialInstructions: "Extra mild spice for Butter Chicken. Serve with fresh mint chutney on the side.",
    },
    { id: 5, name: "Table 5", status: "Occupied", secondaryInfo: "Seated" },
    { id: 6, name: "Table 6", status: "Order Placed", secondaryInfo: "1 min ago" },
  ]);

  const [selectedTable, setSelectedTable] = useState<TableData | null>(null);

  const [showBottomDashboardBtn, setShowBottomDashboardBtn] = useState<boolean>(false);

  // OTP Demo Modal State Machine for Table 1
  const [otpState, setOtpState] = useState<"idle" | "generated" | "placing" | "placed">("idle");
  const [mockOtp, setMockOtp] = useState<string>("7842");
  const [timerSec, setTimerSec] = useState<number>(45);

  // Live countdown timer when OTP is generated
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpState === "generated") {
      interval = setInterval(() => {
        setTimerSec((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpState]);

  // Handle Generate OTP Click on Table 1
  const handleGenerateOtp = () => {
    const randomOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setMockOtp(randomOtp);
    setOtpState("generated");

    // After 2.5s -> Customer enters OTP -> Table 1 status becomes "Placing Order"
    setTimeout(() => {
      setOtpState("placing");
      setTables((prev) =>
        prev.map((t) =>
          t.id === 1 ? { ...t, status: "Placing Order", secondaryInfo: "Guest selecting dishes..." } : t
        )
      );

      // After 1.5s -> Close modal while keeping Table 1 in "Placing Order" state
      setTimeout(() => {
        setSelectedTable(null);
        setOtpState("idle");
      }, 1500);
    }, 2500);
  };

  // Handle Mark as Served action: close modal, update floor state, hold for 1.5s, then pop bottom button
  const handleMarkAsServed = (tableId: number) => {
    setSelectedTable(null); // Close modal immediately to show served floor grid
    setTables((prev) =>
      prev.map((t) => (t.id === tableId ? { ...t, status: "Served", secondaryInfo: "Just served" } : t))
    );

    // Hold state for 1.5s then pop SEE OWNER DASHBOARD button at bottom
    setTimeout(() => {
      setShowBottomDashboardBtn(true);
    }, 1500);
  };

  return (
    <motion.div
      className="floor-view-fullscreen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* 1. Header */}
      <header className="floor-view-header">
        <div className="floor-header-left">
          <h1 className="floor-main-title">Floor</h1>
          <span className="floor-subtitle">Saffron & Spice</span>
        </div>

        <div className="floor-header-right">
          <button className="floor-close-btn" onClick={onClose} aria-label="Back">
            <span>Back</span>
          </button>
        </div>
      </header>

      {/* 2. Main Floor View Grid */}
      <main className="floor-view-main">
        <div className="floor-summary-bar">
          <span className="floor-summary-tag">TABLE OVERVIEW</span>
          <span className="floor-summary-count">{tables.filter(t => t.status === "Ready").length} Ready to Serve</span>
        </div>

        <div className="floor-table-grid">
          {tables.map((table) => {
            const isReady = table.status === "Ready";
            const isOtp = table.status === "OTP Requested";
            const isPlacing = table.status === "Placing Order";
            const isOrderPlaced = table.status === "Order Placed";

            const highlightClass = isReady
              ? "ready-highlight"
              : isOtp
              ? "otp-highlight"
              : isPlacing
              ? "placing-highlight"
              : isOrderPlaced
              ? "order-placed-highlight"
              : "";

            return (
              <div
                key={table.id}
                className={`floor-table-card ${highlightClass} status-${table.status.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={() => {
                  if (table.id === 1 || table.id === 4 || isReady || table.status === "Served") {
                    setSelectedTable(table);
                  }
                }}
              >
                <div className="table-card-top">
                  <span className="table-name-title">{table.name}</span>
                  <span className={`table-status-pill status-${table.status.toLowerCase().replace(/\s+/g, "-")}`}>
                    {table.status}
                  </span>
                </div>

                {table.secondaryInfo && (
                  <div className="table-card-sub">
                    <span className="table-secondary-info">{table.secondaryInfo}</span>
                  </div>
                )}

                {isReady ? (
                  <div className="table-action-hint">
                    <span>Tap to Serve →</span>
                  </div>
                ) : isOtp ? (
                  <div className="table-action-hint otp-hint">
                    <span>Tap for OTP →</span>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </main>

      {/* 3. Table Detail Modal (Focused Order Review for Waiters) */}
      <AnimatePresence>
        {selectedTable && (
          <motion.div
            className="table-detail-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedTable(null)}
          >
            <motion.div
              className="table-detail-modal"
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.96 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="detail-modal-header">
                <div className="detail-header-left">
                  <h2 className="detail-table-title">{selectedTable.name}</h2>
                  <span className="detail-order-badge">
                    {selectedTable.orderNumber ? `ORDER ${selectedTable.orderNumber}` : "DINE-IN"}
                  </span>
                </div>
                <button
                  className="detail-close-btn"
                  onClick={() => setSelectedTable(null)}
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              {/* Modal Body: Custom OTP Generator View for Table 1 vs Standard Table Review */}
              {selectedTable.id === 1 ? (
                <div className="otp-modal-body">
                  <div className="otp-modal-header">
                    <span className="otp-modal-tag">TABLE 1 · GUEST ACCESS</span>
                    <p className="otp-modal-desc">
                      {otpState === "idle"
                        ? "Guest scanned table QR. Generate OTP to verify guest access."
                        : otpState === "generated"
                        ? "Waiting for customer to enter OTP..."
                        : otpState === "placing"
                        ? "OTP Verified! Placing guest order..."
                        : "Order placed successfully!"}
                    </p>
                  </div>

                  {otpState === "generated" && (
                    <div className="otp-display-card">
                      <span className="otp-card-label">MOCK GUEST OTP</span>
                      <div className="otp-code-digits">
                        {mockOtp.split("").map((digit, i) => (
                          <span key={i} className="otp-digit">{digit}</span>
                        ))}
                      </div>
                      <div className="otp-timer-indicator">
                        <span className="otp-pulse-dot" />
                        <span>Customer entering OTP... 0:{timerSec < 10 ? `0${timerSec}` : timerSec}</span>
                      </div>
                    </div>
                  )}

                  {otpState === "placing" && (
                    <div className="otp-placing-card">
                      <span className="otp-spinner-dot" />
                      <span>VERIFYING OTP · PLACING ORDER...</span>
                    </div>
                  )}

                  {/* Primary Action Button */}
                  <div className="detail-action-section">
                    {otpState === "idle" ? (
                      <button
                        className="generate-otp-btn"
                        onClick={handleGenerateOtp}
                      >
                        GENERATE OTP
                      </button>
                    ) : otpState === "generated" ? (
                      <button className="generate-otp-btn active-state" disabled>
                        OTP SENT · WAITING FOR GUEST...
                      </button>
                    ) : (
                      <button className="generate-otp-btn placing-state" disabled>
                        PLACING ORDER...
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  {/* Order Items Summary */}
                  {selectedTable.items && (
                    <div className="detail-items-section">
                      <span className="detail-section-label">ORDER ITEMS</span>
                      <div className="detail-items-list">
                        {selectedTable.items.map((item, idx) => (
                          <div key={idx} className="detail-item-row">
                            <span className="detail-item-qty">{item.quantity}×</span>
                            <span className="detail-item-name">{item.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Special Instructions */}
                  {selectedTable.specialInstructions && (
                    <div className="detail-notes-section">
                      <span className="detail-notes-label">SPECIAL INSTRUCTIONS</span>
                      <p className="detail-notes-text">{selectedTable.specialInstructions}</p>
                    </div>
                  )}

                  {/* Primary Action Button */}
                  <div className="detail-action-section">
                    {selectedTable.status === "Ready" ? (
                      <button
                        className="mark-served-btn"
                        onClick={() => handleMarkAsServed(selectedTable.id)}
                      >
                        MARK AS SERVED
                      </button>
                    ) : (
                      <div className="already-served-badge">
                        <span>STATUS: {selectedTable.status.toUpperCase()}</span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Populated Bottom Action Bar for Manager / Owner View */}
      <AnimatePresence>
        {showBottomDashboardBtn && onOpenManagerView && (
          <motion.div
            className="floor-bottom-action-bar"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              className="floor-dashboard-pop-btn"
              onClick={onOpenManagerView}
            >
              <span>SEE OWNER DASHBOARD →</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

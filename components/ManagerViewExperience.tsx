"use client";

import React from "react";
import { motion } from "framer-motion";
import { flowSlideProps } from "./restaurantFlowMotion";

interface Props {
  onClose: () => void;
  /** 1 = forward, -1 = back — drives elegant side transition */
  flowDirection?: number;
}

export default function ManagerViewExperience({ onClose, flowDirection = 1 }: Props) {
  return (
    <motion.div
      className="manager-view-fullscreen flow-slide-panel"
      {...flowSlideProps(flowDirection)}
    >
      {/* 1. Header */}
      <header className="manager-view-header">
        <div className="manager-header-left">
          <h1 className="manager-main-title">Manager</h1>
          <span className="manager-subtitle">Saffron & Spice · Overview</span>
        </div>

        <div className="manager-header-right">
          <button className="manager-close-btn" onClick={onClose} aria-label="Back">
            <span>Back</span>
          </button>
        </div>
      </header>

      {/* 2. Main Command Center Content */}
      <main className="manager-view-main">
        {/* Module 1: Today's Snapshot */}
        <section className="manager-section">
          <span className="manager-section-label">TODAY'S SNAPSHOT</span>
          <div className="manager-metrics-grid">
            <div className="metric-card">
              <span className="metric-label">REVENUE TODAY</span>
              <span className="metric-value">₹48,250</span>
              <span className="metric-subtext">+14% vs yesterday</span>
            </div>

            <div className="metric-card">
              <span className="metric-label">ORDERS TODAY</span>
              <span className="metric-value">42</span>
              <span className="metric-subtext">Avg ₹1,148 / order</span>
            </div>

            <div className="metric-card">
              <span className="metric-label">ACTIVE TABLES</span>
              <span className="metric-value">4 / 8</span>
              <span className="metric-subtext">50% Floor Occupancy</span>
            </div>
          </div>
        </section>

        {/* Module 2: Live Status */}
        <section className="manager-section">
          <span className="manager-section-label">LIVE STATUS</span>
          <div className="manager-status-row">
            <div className="status-metric-item">
              <span className="status-metric-num">4</span>
              <span className="status-metric-name">Tables Occupied</span>
            </div>
            <div className="status-metric-item">
              <span className="status-metric-num highlight-amber">1</span>
              <span className="status-metric-name">In Kitchen</span>
            </div>
            <div className="status-metric-item">
              <span className="status-metric-num highlight-green">0</span>
              <span className="status-metric-name">Ready to Serve</span>
            </div>
          </div>
        </section>

        {/* Module 3: Recent Activity (Light Live Feed) */}
        <section className="manager-section">
          <span className="manager-section-label">RECENT ACTIVITY</span>
          <div className="manager-activity-list">
            <div className="activity-item-row">
              <span className="activity-dot-green" />
              <div className="activity-details">
                <span className="activity-title">Table 4 · Order #142 Served</span>
                <span className="activity-time">1 min ago</span>
              </div>
            </div>

            <div className="activity-item-row">
              <span className="activity-dot-indigo" />
              <div className="activity-details">
                <span className="activity-title">Table 3 · Order Sent to Kitchen</span>
                <span className="activity-time">3 mins ago</span>
              </div>
            </div>

            <div className="activity-item-row">
              <span className="activity-dot-amber" />
              <div className="activity-details">
                <span className="activity-title">Table 1 · OTP Verified & Seated</span>
                <span className="activity-time">5 mins ago</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </motion.div>
  );
}

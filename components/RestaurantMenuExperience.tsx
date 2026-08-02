"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";


interface DishItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "Starters" | "Main Course" | "Breads" | "Rice" | "Drinks" | "Desserts";
  icon: string;
}

const MENU_DATA: DishItem[] = [
  // Starters
  { id: "s1", category: "Starters", name: "Paneer Tikka", description: "Cottage cheese grilled with Indian spices.", price: 299, icon: "🧀" },
  { id: "s2", category: "Starters", name: "Hara Bhara Kebab", description: "Spinach and pea patties with herbs.", price: 249, icon: "🍃" },
  { id: "s3", category: "Starters", name: "Veg Spring Rolls", description: "Crispy rolls stuffed with vegetables.", price: 229, icon: "🥢" },
  { id: "s4", category: "Starters", name: "Tandoori Chicken", description: "Charcoal-grilled chicken with smoky flavors.", price: 369, icon: "🍗" },
  { id: "s5", category: "Starters", name: "Chicken Malai Tikka", description: "Creamy marinated chicken bites.", price: 389, icon: "🍢" },
  { id: "s6", category: "Starters", name: "Fish Amritsari", description: "Crispy gram-flour coated fish.", price: 399, icon: "🐟" },
  { id: "s7", category: "Starters", name: "Crispy Corn Chaat", description: "Fried corn tossed in tangy spices.", price: 219, icon: "🌽" },
  { id: "s8", category: "Starters", name: "Mutton Seekh Kebab", description: "Juicy minced lamb skewers.", price: 429, icon: "🍖" },

  // Main Course
  { id: "m1", category: "Main Course", name: "Butter Paneer Masala", description: "Rich tomato gravy with soft paneer.", price: 359, icon: "🍲" },
  { id: "m2", category: "Main Course", name: "Dal Makhani", description: "Slow-cooked black lentils with butter.", price: 299, icon: "🥣" },
  { id: "m3", category: "Main Course", name: "Kadai Vegetables", description: "Seasonal vegetables in spicy masala.", price: 319, icon: "🥘" },
  { id: "m4", category: "Main Course", name: "Butter Chicken", description: "Classic creamy tomato chicken curry.", price: 429, icon: "🍛" },
  { id: "m5", category: "Main Course", name: "Chicken Tikka Masala", description: "Grilled chicken in flavorful curry.", price: 439, icon: "🍲" },
  { id: "m6", category: "Main Course", name: "Rogan Josh", description: "Kashmiri-style lamb curry.", price: 499, icon: "🍖" },
  { id: "m7", category: "Main Course", name: "Palak Paneer", description: "Cottage cheese in spinach gravy.", price: 349, icon: "🥬" },
  { id: "m8", category: "Main Course", name: "Prawn Curry", description: "Coastal-style prawns in coconut gravy.", price: 529, icon: "🍤" },

  // Breads
  { id: "b1", category: "Breads", name: "Butter Naan", description: "Soft tandoor bread with butter.", price: 69, icon: "🫓" },
  { id: "b2", category: "Breads", name: "Garlic Naan", description: "Naan topped with fresh garlic.", price: 89, icon: "🧄" },
  { id: "b3", category: "Breads", name: "Plain Naan", description: "Classic fluffy tandoor bread.", price: 59, icon: "🍞" },
  { id: "b4", category: "Breads", name: "Tandoori Roti", description: "Whole wheat bread from the tandoor.", price: 49, icon: "🫓" },
  { id: "b5", category: "Breads", name: "Lachha Paratha", description: "Flaky layered whole wheat bread.", price: 79, icon: "🥐" },
  { id: "b6", category: "Breads", name: "Stuffed Kulcha", description: "Bread filled with spiced potatoes.", price: 99, icon: "🥔" },
  { id: "b7", category: "Breads", name: "Cheese Naan", description: "Naan stuffed with melted cheese.", price: 139, icon: "🧀" },
  { id: "b8", category: "Breads", name: "Missi Roti", description: "Gram flour flatbread with spices.", price: 69, icon: "🫓" },

  // Rice
  { id: "r1", category: "Rice", name: "Steamed Basmati Rice", description: "Long-grain fragrant rice.", price: 149, icon: "🍚" },
  { id: "r2", category: "Rice", name: "Jeera Rice", description: "Rice tempered with cumin seeds.", price: 179, icon: "🌾" },
  { id: "r3", category: "Rice", name: "Veg Pulao", description: "Mildly spiced vegetable rice.", price: 249, icon: "🥗" },
  { id: "r4", category: "Rice", name: "Veg Biryani", description: "Aromatic rice with vegetables.", price: 329, icon: "🏺" },
  { id: "r5", category: "Rice", name: "Chicken Biryani", description: "Dum-cooked chicken and basmati rice.", price: 419, icon: "🍗" },
  { id: "r6", category: "Rice", name: "Mutton Biryani", description: "Fragrant rice with tender lamb.", price: 489, icon: "🍖" },
  { id: "r7", category: "Rice", name: "Peas Pulao", description: "Rice cooked with green peas.", price: 219, icon: "🫛" },
  { id: "r8", category: "Rice", name: "Lemon Rice", description: "Tangy South Indian rice dish.", price: 199, icon: "🍋" },

  // Drinks
  { id: "d1", category: "Drinks", name: "Sweet Lassi", description: "Chilled yogurt-based drink.", price: 129, icon: "🥛" },
  { id: "d2", category: "Drinks", name: "Mango Lassi", description: "Refreshing mango yogurt blend.", price: 149, icon: "🥭" },
  { id: "d3", category: "Drinks", name: "Fresh Lime Soda", description: "Sweet or salted citrus cooler.", price: 99, icon: "🥤" },
  { id: "d4", category: "Drinks", name: "Masala Chaas", description: "Spiced buttermilk with herbs.", price: 99, icon: "🫗" },
  { id: "d5", category: "Drinks", name: "Masala Chai", description: "Traditional Indian spiced tea.", price: 89, icon: "☕" },
  { id: "d6", category: "Drinks", name: "Cold Coffee", description: "Creamy iced coffee delight.", price: 169, icon: "🧋" },
  { id: "d7", category: "Drinks", name: "Fresh Watermelon Juice", description: "Naturally refreshing fruit juice.", price: 159, icon: "🍉" },
  { id: "d8", category: "Drinks", name: "Mint Mojito", description: "Mint and lime cooler (non-alcoholic).", price: 179, icon: "🍹" },

  // Desserts
  { id: "de1", category: "Desserts", name: "Gulab Jamun", description: "Soft milk dumplings in sugar syrup.", price: 149, icon: "🍯" },
  { id: "de2", category: "Desserts", name: "Rasmalai", description: "Creamy saffron milk dessert.", price: 179, icon: "🥛" },
  { id: "de3", category: "Desserts", name: "Gajar Halwa", description: "Slow-cooked carrot pudding.", price: 189, icon: "🥕" },
  { id: "de4", category: "Desserts", name: "Kulfi Falooda", description: "Traditional kulfi with falooda noodles.", price: 219, icon: "🍨" },
  { id: "de5", category: "Desserts", name: "Kesar Pista Kulfi", description: "Saffron and pistachio frozen delight.", price: 169, icon: "🍦" },
  { id: "de6", category: "Desserts", name: "Chocolate Brownie", description: "Warm brownie with vanilla ice cream.", price: 249, icon: "🍫" },
  { id: "de7", category: "Desserts", name: "Mango Shrikhand", description: "Sweet strained yogurt with mango.", price: 189, icon: "🥭" },
  { id: "de8", category: "Desserts", name: "Vanilla Ice Cream", description: "Classic creamy vanilla scoop.", price: 129, icon: "🍨" },
];

const CATEGORIES = ["Starters", "Main Course", "Breads", "Rice", "Drinks", "Desserts"] as const;

interface Props {
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: "assistant" | "user";
  text: string;
}

export default function RestaurantMenuExperience({ onClose }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>("Starters");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [activeAiDish, setActiveAiDish] = useState<DishItem | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [scrollProgress, setScrollProgress] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const categoryRefs = useRef<Record<string, HTMLElement | null>>({});
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Lock body scroll and prevent overscroll rubber-banding elasticity
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

    let startTouchY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        startTouchY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      const scrollEl = scrollRef.current;
      if (!scrollEl || e.touches.length === 0) return;

      const currentY = e.touches[0].clientY;
      const isDraggingDown = currentY > startTouchY;
      const isDraggingUp = currentY < startTouchY;

      // Prevent rubber-band pulling down when at top of menu
      if (isDraggingDown && scrollEl.scrollTop <= 0) {
        if (e.cancelable) e.preventDefault();
      }

      // Prevent overscroll pull at bottom of menu
      if (
        isDraggingUp &&
        scrollEl.scrollTop + scrollEl.clientHeight >= scrollEl.scrollHeight - 1
      ) {
        if (e.cancelable) e.preventDefault();
      }
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      document.body.style.overflow = origOverflow;
      document.body.style.position = origPosition;
      document.body.style.width = origWidth;
      document.body.style.height = origHeight;
      document.body.classList.remove("restaurant-active");

      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  // WebGL / Canvas ambient subtle lighting & scroll parallax effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const renderCanvas = () => {
      const w = (canvas.width = canvas.parentElement?.clientWidth || 380);
      const h = (canvas.height = canvas.parentElement?.clientHeight || 780);

      ctx.clearRect(0, 0, w, h);

      time += 0.015;

      // Soft light shifts influenced by scroll progress & gentle sine movement
      const gradient = ctx.createRadialGradient(
        w * 0.5 + Math.sin(time * 0.8) * 40,
        120 + scrollProgress * 200 + Math.cos(time) * 30,
        10,
        w * 0.5,
        h * 0.4,
        w * 0.8
      );

      gradient.addColorStop(0, "rgba(234, 179, 8, 0.12)");
      gradient.addColorStop(0.5, "rgba(180, 83, 9, 0.04)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      // Subtle drifting ambient particles for texture
      ctx.fillStyle = "rgba(254, 240, 138, 0.15)";
      for (let i = 0; i < 8; i++) {
        const px = (Math.sin(time * 0.5 + i * 1.5) * 0.4 + 0.5) * w;
        const py = ((time * 20 + i * 90) % h);
        const radius = Math.sin(time + i) * 1.5 + 2;
        ctx.beginPath();
        ctx.arc(px, py, Math.max(0.5, radius), 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(renderCanvas);
    };

    renderCanvas();
    return () => cancelAnimationFrame(animId);
  }, [scrollProgress]);

  // Track scroll position inside menu & sync active category pill via ScrollSpy
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const progress = scrollTop / (scrollHeight - clientHeight || 1);
    setScrollProgress(progress);

    const scrollContainerRect = scrollRef.current.getBoundingClientRect();
    let currentCat: string = CATEGORIES[0];

    for (const cat of CATEGORIES) {
      const el = categoryRefs.current[cat];
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top - scrollContainerRect.top <= 100) {
          currentCat = cat;
        }
      }
    }

    setActiveCategory(currentCat);
  };

  // Scroll smoothly to chosen category section
  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat);
    const targetEl = categoryRefs.current[cat];
    if (targetEl && scrollRef.current) {
      const containerRect = scrollRef.current.getBoundingClientRect();
      const targetRect = targetEl.getBoundingClientRect();
      const offsetTop = targetRect.top - containerRect.top + scrollRef.current.scrollTop - 10;

      scrollRef.current.scrollTo({
        top: Math.max(0, offsetTop),
        behavior: "smooth",
      });
    }
  };

  // Increment item quantity
  const handleAdd = (id: string) => {
    setQuantities((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  // Decrement item quantity
  const handleRemove = (id: string) => {
    setQuantities((prev) => {
      const current = prev[id] || 0;
      if (current <= 1) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return { ...prev, [id]: current - 1 };
    });
  };

  // Calculate totals
  const totalItems = Object.values(quantities).reduce((acc, q) => acc + q, 0);
  const totalPrice = MENU_DATA.reduce((acc, item) => acc + (quantities[item.id] || 0) * item.price, 0);

  // Open AI presence drawer for specific dish
  const handleOpenAi = (dish: DishItem) => {
    setActiveAiDish(dish);
    setChatMessages([
      {
        id: "m1",
        sender: "assistant",
        text: `Namaste! I am your Culinary Curator at Saffron & Spice. Ask me about the flavor profile, spice level, or beverage pairing for ${dish.name}.`,
      },
    ]);
    setAiDrawerOpen(true);
  };

  // Send message in AI drawer
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: "user",
      text: chatInput,
    };

    setChatMessages((prev) => [...prev, userMsg]);
    const query = chatInput.toLowerCase();
    setChatInput("");

    // Generate intelligent contextual response
    setTimeout(() => {
      let replyText = `For ${activeAiDish?.name || "this dish"}, our master chef crafts it with hand-ground aromatic spices. It pairs wonderfully with a refreshing Mango Lassi or Garlic Naan!`;

      if (query.includes("spice") || query.includes("hot")) {
        replyText = `${activeAiDish?.name} carries a balanced, aromatic medium heat. We can customize the spice level from mild to extra fiery upon request.`;
      } else if (query.includes("pair") || query.includes("drink")) {
        replyText = `We highly recommend pairing ${activeAiDish?.name} with our signature Fresh Lime Soda or a chilled Mint Mojito to balance the rich flavors.`;
      } else if (query.includes("vegan") || query.includes("veg")) {
        replyText = `${activeAiDish?.name} is freshly prepared with pure, high-quality ingredients. Let us know any specific dietary preferences when ordering!`;
      }

      setChatMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          sender: "assistant",
          text: replyText,
        },
      ]);
    }, 400);
  };

  const [orderWindowOpen, setOrderWindowOpen] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  // Filter list of items with quantity > 0
  const selectedDishes = MENU_DATA.filter((item) => (quantities[item.id] || 0) > 0);

  const handleConfirmOrder = () => {
    setOrderConfirmed(true);
    setTimeout(() => {
      setOrderConfirmed(false);
      setOrderWindowOpen(false);
    }, 1800);
  };

  return (
    <motion.div
      ref={containerRef}
      className={`restaurant-experience-container ${aiDrawerOpen || orderWindowOpen ? "ai-drawer-open" : ""}`}
      initial={{ opacity: 0, scale: 0.985 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      onWheel={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      onTouchEnd={(e) => e.stopPropagation()}
    >
      {/* WebGL Ambient Depth Canvas Overlay */}
      <canvas ref={canvasRef} className="restaurant-ambient-canvas" />

      {/* Top Restrained Header */}
      <motion.header
        className="restaurant-top-header"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="restaurant-brand-meta">
          <h1 className="restaurant-name">SAFFRON & SPICE</h1>
          <span className="restaurant-tagline">Authentic Indian Flavours, Crafted with Love.</span>
        </div>

        {/* Restrained Close Control */}
        <button className="restaurant-close-btn" onClick={onClose} aria-label="Close menu">
          <span>✕</span>
          <span>CLOSE</span>
        </button>
      </motion.header>

      {/* Soft Category Navigation Bar */}
      <motion.nav
        className="restaurant-cat-nav"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`restaurant-cat-pill ${activeCategory === cat ? "active" : ""}`}
            onClick={() => handleCategoryClick(cat)}
          >
            {cat}
          </button>
        ))}
      </motion.nav>

      {/* Scrollable Menu Area */}
      <div ref={scrollRef} className="restaurant-menu-scroll" onScroll={handleScroll}>
        {CATEGORIES.map((cat) => {
          const categoryDishes = MENU_DATA.filter((d) => d.category === cat);
          return (
            <section
              key={cat}
              ref={(el) => {
                categoryRefs.current[cat] = el;
              }}
              className="restaurant-category-section"
            >
              {/* Soft Section Header */}
              <div className="restaurant-section-header">
                <h2 className="restaurant-section-title">{cat}</h2>
                <div className="restaurant-section-line" />
              </div>

              {/* Dishes Grid */}
              <div className="restaurant-dishes-grid">
                {categoryDishes.map((dish, itemIdx) => {
                  const qty = quantities[dish.id] || 0;
                  return (
                    <motion.div
                      key={dish.id}
                      className="dish-item-card"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.38,
                        delay: 0.18 + itemIdx * 0.04,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      {/* Square Image Placeholder Block */}
                      <div className="dish-square-image">
                        <span className="dish-square-icon">{dish.icon}</span>
                        <span className="dish-square-label">ASSET</span>
                      </div>

                      {/* Dish Details */}
                      <div className="dish-info-main">
                        <div>
                          <div className="dish-header-row">
                            <h3 className="dish-title">{dish.name}</h3>
                            <span className="dish-price">₹{dish.price}</span>
                          </div>
                          <p className="dish-desc">{dish.description}</p>
                        </div>

                        {/* Actions Row */}
                        <div className="dish-actions-row">
                          {/* Quantity Counter */}
                          {qty === 0 ? (
                            <button
                              className="dish-add-btn"
                              onClick={() => handleAdd(dish.id)}
                            >
                              <span>+</span>
                              <span className="dish-add-text">ADD</span>
                            </button>
                          ) : (
                            <div className="dish-counter-box">
                              <button
                                className="counter-btn"
                                onClick={() => handleRemove(dish.id)}
                              >
                                −
                              </button>
                              <span className="counter-num">{qty}</span>
                              <button
                                className="counter-btn"
                                onClick={() => handleAdd(dish.id)}
                              >
                                +
                              </button>
                            </div>
                          )}

                          {/* AI Presence Help Button */}
                          <button
                            className="dish-help-btn"
                            onClick={() => handleOpenAi(dish)}
                          >
                            <span>✨</span>
                            <span>CURATOR AI</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {/* Refined Bottom Order Bar */}
      {totalItems > 0 && !orderWindowOpen && (
        <div className="restaurant-summary-bar" onClick={() => setOrderWindowOpen(true)}>
          <div className="summary-left">
            <span className="summary-count">YOUR ORDER</span>
            <span className="summary-price">{totalItems} {totalItems === 1 ? "item" : "items"} · ₹{totalPrice}</span>
          </div>
          <button
            className="summary-view-btn"
            onClick={(e) => {
              e.stopPropagation();
              setOrderWindowOpen(true);
            }}
          >
            CONFIRM →
          </button>
        </div>
      )}

      {/* Expanded Order Window Modal */}
      {orderWindowOpen && (
        <div className="order-modal-overlay" onClick={() => setOrderWindowOpen(false)}>
          <div className="order-modal-card" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="order-modal-header">
              <div className="order-header-title-group">
                <h2 className="order-modal-title">YOUR ORDER</h2>
                <span className="order-header-subtitle">
                  {totalItems} {totalItems === 1 ? "item" : "items"} selected
                </span>
              </div>
              <button
                className="order-modal-close"
                onClick={() => setOrderWindowOpen(false)}
              >
                ✕
              </button>
            </div>

            {/* Selected Items List */}
            <div className="order-items-scroll">
              {selectedDishes.map((dish) => {
                const qty = quantities[dish.id] || 0;
                return (
                  <div key={dish.id} className="order-item-row">
                    <div className="order-item-left">
                      <span className="order-item-icon">{dish.icon}</span>
                      <div className="order-item-meta">
                        <span className="order-item-name">{dish.name}</span>
                        <span className="order-item-unit">₹{dish.price} each</span>
                      </div>
                    </div>
                    <div className="order-item-right">
                      <div className="dish-counter-box small">
                        <button
                          className="counter-btn"
                          onClick={() => handleRemove(dish.id)}
                        >
                          −
                        </button>
                        <span className="counter-num">{qty}</span>
                        <button
                          className="counter-btn"
                          onClick={() => handleAdd(dish.id)}
                        >
                          +
                        </button>
                      </div>
                      <span className="order-item-total">₹{dish.price * qty}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Price Breakdown */}
            <div className="order-summary-breakdown">
              <div className="breakdown-row">
                <span>Subtotal</span>
                <span>₹{totalPrice}</span>
              </div>
              <div className="breakdown-row">
                <span>Taxes & Service</span>
                <span className="breakdown-included">Included</span>
              </div>
              <div className="breakdown-row total">
                <span>Total Amount</span>
                <span>₹{totalPrice}</span>
              </div>
            </div>

            {/* Bottom Action Button */}
            <button
              className={`order-final-confirm-btn ${orderConfirmed ? "confirmed" : ""}`}
              onClick={handleConfirmOrder}
            >
              {orderConfirmed ? "ORDER CONFIRMED ✨" : "CONFIRM ORDER"}
            </button>
          </div>
        </div>
      )}

      {/* AI Conversation Layer Drawer */}
      {aiDrawerOpen && (
        <div className="ai-drawer-overlay" onClick={() => setAiDrawerOpen(false)}>
          <div className="ai-drawer-card" onClick={(e) => e.stopPropagation()}>
            <div className="ai-drawer-header">
              <div className="ai-drawer-title-group">
                <span className="ai-drawer-sparkle">✨</span>
                <span className="ai-drawer-title">CULINARY CURATOR AI</span>
              </div>
              <button
                className="ai-drawer-close"
                onClick={() => setAiDrawerOpen(false)}
              >
                ✕
              </button>
            </div>

            {/* Messages */}
            <div className="ai-chat-messages">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`ai-msg-bubble ${msg.sender}`}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="ai-chat-input-row">
              <input
                type="text"
                className="ai-chat-input"
                placeholder={`Ask about ${activeAiDish?.name || "this menu"}...`}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
              />
              <button type="submit" className="ai-chat-send">
                ASK
              </button>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
}

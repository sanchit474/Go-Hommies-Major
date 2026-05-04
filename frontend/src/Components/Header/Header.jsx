import React, { useRef, useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, MapPin, Calendar, Users, X, ArrowRight } from "lucide-react";

import HeaderBannerNew1 from "../../assets/HeaderBannerImage1.jpg";
import HeaderBannerNew2 from "../../assets/HeaderBannerImage2.jpg";
import HeaderBannerNew3 from "../../assets/HeaderBannerImage3.jpg";

const images = [
  { src: HeaderBannerNew1, title: "Kerala",    tag: "God's Own Country",    desc: "Serene backwaters, lush greenery, exotic wildlife, and vibrant traditions await you." },
  { src: HeaderBannerNew2, title: "Manali",    tag: "Himalayan Paradise",   desc: "Snow-capped peaks, adventure sports, and breathtaking valleys call your name." },
  { src: HeaderBannerNew3, title: "Rishikesh", tag: "Spiritual Gateway",    desc: "Find your flow with yoga, white-water rafting, and ancient Himalayan culture." },
  { src: HeaderBannerNew1, title: "Jaipur",    tag: "The Pink City",        desc: "Royal palaces, majestic forts, and vibrant bazaars of Rajasthan's crown jewel." },
  { src: HeaderBannerNew2, title: "Agra",      tag: "City of Taj",          desc: "Marvel at the world's greatest monument to love and Mughal grandeur." },
  { src: HeaderBannerNew3, title: "Goa",       tag: "Coastal Paradise",     desc: "Sun-kissed beaches, Portuguese charm, and electric nightlife in one place." },
  { src: HeaderBannerNew1, title: "Shimla",    tag: "Queen of Hills",       desc: "Colonial elegance meets crisp mountain air in this Himalayan hill station." },
  { src: HeaderBannerNew2, title: "Udaipur",   tag: "City of Lakes",        desc: "Palace reflections on shimmering lakes — romance elevated to an art form." },
  { src: HeaderBannerNew3, title: "Ooty",      tag: "Nilgiri Gem",          desc: "Tea plantations, botanical gardens, and cool misty mornings in the Nilgiris." },
  { src: HeaderBannerNew1, title: "Coorg",     tag: "Scotland of India",    desc: "Coffee-scented mist, waterfalls, and jungle trails in Karnataka's highlands." },
];

const locationData = {
  Kerala:    { bestMonth: "Oct – May",              bestPartner: "Nature & Adventure Lovers",     icon: "🌴" },
  Manali:    { bestMonth: "Jun – Sep",               bestPartner: "Trekkers & Thrill Seekers",      icon: "🏔️" },
  Rishikesh: { bestMonth: "Oct – Mar",               bestPartner: "Spiritual & Yoga Enthusiasts",   icon: "🕉️" },
  Jaipur:    { bestMonth: "Oct – Mar",               bestPartner: "Culture & History Lovers",        icon: "🏰" },
  Agra:      { bestMonth: "Oct – Mar",               bestPartner: "Couples & History Buffs",         icon: "🕌" },
  Goa:       { bestMonth: "Nov – Feb",               bestPartner: "Beach & Party Lovers",            icon: "🏖️" },
  Shimla:    { bestMonth: "Apr – Jun, Sep – Oct",    bestPartner: "Mountain & Snow Lovers",          icon: "❄️" },
  Udaipur:   { bestMonth: "Oct – Mar",               bestPartner: "Couples & Romance Seekers",       icon: "🛶" },
  Ooty:      { bestMonth: "Apr – Jun, Sep – Oct",    bestPartner: "Nature & Garden Enthusiasts",     icon: "🌿" },
  Coorg:     { bestMonth: "Sep – Mar",               bestPartner: "Adventure & Coffee Lovers",       icon: "☕" },
};

const Header = () => {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const timerRef = useRef(null);

  const total = images.length;

  const goTo = useCallback((idx) => {
    if (animating) return;
    setAnimating(true);
    setCurrent((idx + total) % total);
    setTimeout(() => setAnimating(false), 700);
  }, [animating, total]);

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    timerRef.current = setInterval(next, 7000);
    return () => clearInterval(timerRef.current);
  }, [next]);

  const resetTimer = (fn) => {
    clearInterval(timerRef.current);
    fn();
    timerRef.current = setInterval(next, 7000);
  };

  const img = images[current];
  const loc = locationData[img.title];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        .hdr-root { font-family: 'DM Sans', sans-serif; }
        .hdr-display { font-family: 'Cormorant Garamond', Georgia, serif; }

        /* ── Slide fade ── */
        .hdr-slide {
          position: absolute; inset: 0;
          background-size: cover; background-position: center;
          transition: opacity 0.7s ease;
        }
        .hdr-slide.entering { opacity: 1; }
        .hdr-slide.exiting  { opacity: 0; }

        /* ── Gradient overlays ── */
        .hdr-overlay-left {
          position: absolute; inset: 0;
          background: linear-gradient(100deg, rgba(5,8,18,0.82) 0%, rgba(5,8,18,0.4) 55%, transparent 100%);
          z-index: 2;
        }
        .hdr-overlay-bottom {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(5,8,18,0.65) 0%, transparent 50%);
          z-index: 2;
        }

        /* ── Tag pill ── */
        .hdr-tag {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 5px 14px;
          background: rgba(110,231,183,0.15);
          border: 1px solid rgba(110,231,183,0.35);
          border-radius: 100px;
          font-size: 11px; font-weight: 600;
          color: #6EE7B7; letter-spacing: 0.08em; text-transform: uppercase;
        }

        /* ── Explore button ── */
        .hdr-cta {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 12px 26px;
          background: linear-gradient(135deg, #6EE7B7, #3B82F6);
          color: #05080f; font-weight: 600; font-size: 14px;
          border: none; border-radius: 100px; cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 4px 20px rgba(110,231,183,0.3);
        }
        .hdr-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(110,231,183,0.45);
        }

        /* ── Nav buttons ── */
        .hdr-nav-btn {
          width: 42px; height: 42px;
          border-radius: 50%;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: white; transition: all 0.25s;
        }
        .hdr-nav-btn:hover {
          background: rgba(110,231,183,0.2);
          border-color: rgba(110,231,183,0.5);
          transform: scale(1.08);
        }

        /* ── Dot indicators ── */
        .hdr-dot {
          width: 6px; height: 6px; border-radius: 100px;
          background: rgba(255,255,255,0.3);
          cursor: pointer; transition: all 0.3s;
          border: none; padding: 0;
        }
        .hdr-dot.active {
          width: 22px;
          background: linear-gradient(90deg, #6EE7B7, #3B82F6);
        }

        /* ── Info bar ── */
        .hdr-infobar {
          background: linear-gradient(135deg, #0d1728 0%, #0f1e32 50%, #0d1728 100%);
          border: 1px solid rgba(110,231,183,0.18);
          border-radius: 18px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.25), 0 1px 0 rgba(110,231,183,0.08) inset;
        }

        /* ── Info cell ── */
        .hdr-cell {
          flex: 1;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          padding: 22px 16px;
          cursor: pointer; border-radius: 14px;
          transition: background 0.2s;
          text-align: center; gap: 5px;
        }
        .hdr-cell:hover { background: rgba(110,231,183,0.06); }

        .hdr-cell-label {
          font-size: 10px; font-weight: 600;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: rgba(110,231,183,0.55);
          display: flex; align-items: center; gap: 5px;
        }
        .hdr-cell-value {
          font-size: 15px; font-weight: 600;
          color: #e8f0ff; line-height: 1.35;
        }

        .hdr-divider {
          width: 1px; height: 40px;
          background: linear-gradient(to bottom, transparent, rgba(110,231,183,0.15), transparent);
          flex-shrink: 0;
        }

        /* ── Location cell ── */
        .hdr-cell-loc .hdr-cell-value {
          background: linear-gradient(135deg, #6EE7B7, #93C5FD);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
          font-size: 18px;
          font-family: 'Cormorant Garamond', serif;
          font-weight: 700;
        }
        .hdr-cell-loc .hdr-cell-hint {
          font-size: 10px;
          color: rgba(110,231,183,0.4);
          letter-spacing: 0.04em;
        }

        /* ── Slide-in animation ── */
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hdr-content > * {
          animation: slideUp 0.55s cubic-bezier(0.4,0,0.2,1) both;
        }
        .hdr-content > *:nth-child(1) { animation-delay: 0.05s; }
        .hdr-content > *:nth-child(2) { animation-delay: 0.13s; }
        .hdr-content > *:nth-child(3) { animation-delay: 0.21s; }
        .hdr-content > *:nth-child(4) { animation-delay: 0.29s; }

        /* ── Modal ── */
        .hdr-modal-overlay {
          position: fixed; inset: 0;
          background: rgba(3,5,14,0.75); backdrop-filter: blur(8px);
          z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 16px;
          animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }

        .hdr-modal {
          background: #0d1220;
          border: 1px solid rgba(110,231,183,0.12);
          border-radius: 24px;
          width: 100%; max-width: 640px;
          max-height: 82vh; overflow: hidden;
          display: flex; flex-direction: column;
          box-shadow: 0 40px 100px rgba(0,0,0,0.7);
          animation: popIn 0.25s cubic-bezier(0.34,1.4,0.64,1);
        }
        @keyframes popIn { from { opacity:0; transform:scale(0.93) } to { opacity:1; transform:scale(1) } }

        .hdr-modal-head {
          padding: 24px 28px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          display: flex; align-items: center; justify-content: space-between;
          flex-shrink: 0;
        }
        .hdr-modal-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 26px; font-weight: 700;
          background: linear-gradient(135deg, #6EE7B7, #93C5FD);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hdr-modal-close {
          width: 34px; height: 34px; border-radius: 10px;
          background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: #94a3b8; transition: all 0.2s;
        }
        .hdr-modal-close:hover { background: rgba(255,255,255,0.12); color: #fff; }

        .hdr-modal-body { overflow-y: auto; padding: 20px 28px 28px; }
        .hdr-modal-body::-webkit-scrollbar { width: 4px; }
        .hdr-modal-body::-webkit-scrollbar-track { background: transparent; }
        .hdr-modal-body::-webkit-scrollbar-thumb { background: rgba(110,231,183,0.3); border-radius: 4px; }

        .hdr-modal-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        @media (max-width: 500px) { .hdr-modal-grid { grid-template-columns: 1fr; } }

        .hdr-modal-card {
          padding: 16px;
          background: rgba(255,255,255,0.03);
          border: 1.5px solid rgba(255,255,255,0.07);
          border-radius: 16px; cursor: pointer;
          transition: all 0.22s;
        }
        .hdr-modal-card:hover {
          background: rgba(110,231,183,0.05);
          border-color: rgba(110,231,183,0.3);
          transform: translateY(-2px);
        }
        .hdr-modal-card.selected {
          background: rgba(110,231,183,0.08);
          border-color: rgba(110,231,183,0.5);
          box-shadow: 0 0 0 3px rgba(110,231,183,0.08);
        }
        .hdr-modal-card-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px; font-weight: 700; color: #e8edf8;
          margin-bottom: 2px;
        }
        .hdr-modal-card-tag {
          font-size: 11px; font-weight: 500; color: #6EE7B7;
          letter-spacing: 0.04em; margin-bottom: 8px;
        }
        .hdr-modal-card-desc {
          font-size: 12px; color: rgba(148,163,184,0.8); line-height: 1.5;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }
        .hdr-modal-card-season {
          margin-top: 10px; padding-top: 10px;
          border-top: 1px solid rgba(255,255,255,0.06);
          font-size: 11px; color: rgba(148,163,184,0.7);
        }
        .hdr-modal-card-season b { color: rgba(200,215,230,0.9); }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .hdr-infobar-row { flex-direction: column; }
          .hdr-divider { width: 100%; height: 1px; }
          .hdr-cell { padding: 14px 16px; }
        }
      `}</style>

      <div className="hdr-root" style={{ paddingTop: "96px", paddingLeft: "16px", paddingRight: "16px", paddingBottom: "32px" }}>

        {/* ── Hero Slider ── */}
        <div style={{
          position: "relative",
          borderRadius: "24px",
          overflow: "hidden",
          height: "clamp(320px, 58vh, 620px)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.55)",
        }}>
          {/* Slide image */}
          <div
            key={current}
            className="hdr-slide entering"
            style={{ backgroundImage: `url(${img.src})` }}
          />

          {/* Overlays */}
          <div className="hdr-overlay-left" />
          <div className="hdr-overlay-bottom" />

          {/* Content */}
          <div
            key={`content-${current}`}
            className="hdr-content"
            style={{
              position: "absolute", inset: 0, zIndex: 3,
              display: "flex", flexDirection: "column",
              justifyContent: "flex-end",
              padding: "clamp(20px, 4vw, 48px)",
              paddingBottom: "clamp(24px, 4vw, 48px)",
            }}
          >
            <div className="hdr-tag">
              <span>{loc.icon}</span>
              {img.tag}
            </div>

            <h1
              className="hdr-display"
              style={{
                fontSize: "clamp(42px, 7vw, 88px)",
                fontWeight: 700,
                color: "#f8faff",
                lineHeight: 1.0,
                marginTop: "12px",
                marginBottom: "8px",
                letterSpacing: "-0.01em",
                textShadow: "0 4px 24px rgba(0,0,0,0.4)",
              }}
            >
              {img.title}
            </h1>

            <p style={{
              fontSize: "clamp(13px, 1.6vw, 16px)",
              color: "rgba(200,215,240,0.85)",
              maxWidth: "440px",
              lineHeight: 1.6,
              marginBottom: "24px",
            }}>
              {img.desc}
            </p>

            <div>
              <button className="hdr-cta">
                Explore Packages
                <ArrowRight size={15} />
              </button>
            </div>
          </div>

          {/* Nav controls */}
          <div style={{
            position: "absolute", bottom: "clamp(16px, 3vw, 32px)", right: "clamp(16px, 3vw, 32px)",
            zIndex: 4, display: "flex", flexDirection: "column", gap: "8px",
          }}>
            <button className="hdr-nav-btn" onClick={() => resetTimer(prev)} aria-label="Previous">
              <ChevronLeft size={18} />
            </button>
            <button className="hdr-nav-btn" onClick={() => resetTimer(next)} aria-label="Next">
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Dot indicators */}
          <div style={{
            position: "absolute", bottom: "clamp(16px, 3vw, 32px)", left: "clamp(16px, 3vw, 32px)",
            zIndex: 4, display: "flex", alignItems: "center", gap: "6px",
          }}>
            {images.map((_, i) => (
              <button
                key={i}
                className={`hdr-dot ${i === current ? "active" : ""}`}
                onClick={() => resetTimer(() => goTo(i))}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Slide counter */}
          <div style={{
            position: "absolute", top: "20px", right: "20px", zIndex: 4,
            fontFamily: "'DM Sans', sans-serif", fontSize: "12px", fontWeight: 600,
            color: "rgba(255,255,255,0.5)",
            background: "rgba(0,0,0,0.3)", backdropFilter: "blur(8px)",
            padding: "4px 10px", borderRadius: "100px",
            border: "1px solid rgba(255,255,255,0.1)",
          }}>
            {String(current + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </div>
        </div>

        {/* ── Info Bar ── */}
        <div
          className="hdr-infobar"
          style={{ marginTop: "16px", padding: "4px" }}
        >
          <div
            className="hdr-infobar-row"
            style={{ display: "flex", alignItems: "center" }}
          >
            {/* Location */}
            <div
              className="hdr-cell hdr-cell-loc"
              onClick={() => setShowModal(true)}
              title="Click to change destination"
            >
              <span className="hdr-cell-label">
                <MapPin size={11} /> Destination
              </span>
              <span className="hdr-cell-value">{img.title}</span>
              <span className="hdr-cell-hint">tap to change ↗</span>
            </div>

            <div className="hdr-divider" />

            {/* Best Season */}
            <div className="hdr-cell">
              <span className="hdr-cell-label">
                <Calendar size={11} /> Best Season
              </span>
              <span className="hdr-cell-value">{loc.bestMonth}</span>
            </div>

            <div className="hdr-divider" />

            {/* Travel Buddy */}
            <div className="hdr-cell">
              <span className="hdr-cell-label">
                <Users size={11} /> Ideal For
              </span>
              <span className="hdr-cell-value">{loc.bestPartner}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Location Selector Modal ── */}
      {showModal && (
        <div className="hdr-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="hdr-modal" onClick={(e) => e.stopPropagation()}>
            <div className="hdr-modal-head">
              <span className="hdr-modal-title">Choose a Destination</span>
              <button className="hdr-modal-close" onClick={() => setShowModal(false)}>
                <X size={16} />
              </button>
            </div>
            <div className="hdr-modal-body">
              <div className="hdr-modal-grid">
                {images.map((loc, i) => (
                  <div
                    key={loc.title}
                    className={`hdr-modal-card ${current === i ? "selected" : ""}`}
                    onClick={() => {
                      resetTimer(() => goTo(i));
                      setShowModal(false);
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <span style={{ fontSize: "18px" }}>{locationData[loc.title].icon}</span>
                      <div>
                        <div className="hdr-modal-card-name">{loc.title}</div>
                        <div className="hdr-modal-card-tag">{loc.tag}</div>
                      </div>
                    </div>
                    <p className="hdr-modal-card-desc">{loc.desc}</p>
                    <div className="hdr-modal-card-season">
                      <b>Best time:</b> {locationData[loc.title].bestMonth}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
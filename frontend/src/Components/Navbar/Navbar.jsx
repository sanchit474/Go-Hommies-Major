import React, { useState, useEffect, useRef } from "react";
import { useScreenResizeValue } from "../../ScreenSizeFunction";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { setUserData } from "../../Store/UserDataSlice";
import { Menu, X, LogOut, User, ChevronDown, Plus, MoreVertical } from "lucide-react";

/* ─── GoHomies Logo SVG ──────────────────────────────────── */
const GoHomiesLogo = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Outer glow ring */}
    <circle cx="20" cy="20" r="19" stroke="url(#ring)" strokeWidth="1.2" strokeDasharray="3 2" opacity="0.6"/>
    {/* House body */}
    <path d="M20 8L32 19H28V32H22V25H18V32H12V19H8L20 8Z" fill="url(#house)" />
    {/* Door */}
    <rect x="17" y="25" width="6" height="7" rx="3" fill="white" opacity="0.9"/>
    {/* Window left */}
    <rect x="13" y="21" width="4" height="4" rx="1" fill="white" opacity="0.7"/>
    {/* Window right */}
    <rect x="23" y="21" width="4" height="4" rx="1" fill="white" opacity="0.7"/>
    {/* Chimney */}
    <rect x="24" y="10" width="3" height="5" rx="0.5" fill="url(#chimney)"/>
    {/* Smoke dots */}
    <circle cx="25.5" cy="8.5" r="1" fill="white" opacity="0.4"/>
    <circle cx="27" cy="7" r="0.7" fill="white" opacity="0.25"/>
    <defs>
      <linearGradient id="house" x1="8" y1="8" x2="32" y2="32" gradientUnits="userSpaceOnUse">
        <stop stopColor="#6EE7B7"/>
        <stop offset="1" stopColor="#3B82F6"/>
      </linearGradient>
      <linearGradient id="chimney" x1="24" y1="10" x2="27" y2="15" gradientUnits="userSpaceOnUse">
        <stop stopColor="#A78BFA"/>
        <stop offset="1" stopColor="#6366F1"/>
      </linearGradient>
      <linearGradient id="ring" x1="1" y1="1" x2="39" y2="39" gradientUnits="userSpaceOnUse">
        <stop stopColor="#6EE7B7"/>
        <stop offset="1" stopColor="#3B82F6"/>
      </linearGradient>
    </defs>
  </svg>
);

/* ─── Navbar ─────────────────────────────────────────────── */
const Navbar = () => {
  const breakpoint = useScreenResizeValue();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("/");
  const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);
  const desktopMenuRef = useRef(null);

  const userData = useSelector((state) => state.UserData);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (desktopMenuRef.current && !desktopMenuRef.current.contains(event.target)) {
        setDesktopMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const Logout = () => {
    Cookies.remove("uid");
    dispatch(setUserData({
      name: "", email: "", username: "", designation: "",
      about: "", title: "", isAuthenticated: false,
    }));
  };

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    Logout();
    navigate("/signin");
  };

  const navLinks = [
    { name: "Explore", path: "/" },
    { name: "Find", path: "/createpost", icon: <Plus size={14} /> },
    { name: "Community", path: "/posts" },
    { name: "Trip Planner", path: "/trip-planner" },
  ];

  const handleNav = (path) => {
    setActiveLink(path);
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');

        .gh-nav * { font-family: 'Outfit', sans-serif; box-sizing: border-box; }

        /* Pill container */
        .gh-pill {
          background: ${scrolled
            ? "rgba(8, 12, 22, 0.92)"
            : "rgba(10, 15, 28, 0.65)"};
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);
          border: 1px solid rgba(110, 231, 183, 0.12);
          box-shadow: ${scrolled
            ? "0 8px 40px rgba(0,0,0,0.5), 0 1px 0 rgba(110,231,183,0.08) inset"
            : "0 4px 24px rgba(0,0,0,0.3)"};
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 20px;
        }

        /* Nav link */
        .gh-link {
          position: relative;
          padding: 7px 14px;
          font-size: 13.5px;
          font-weight: 500;
          color: rgba(200, 215, 230, 0.8);
          border-radius: 10px;
          border: none;
          background: transparent;
          cursor: pointer;
          transition: color 0.2s, background 0.2s;
          letter-spacing: 0.01em;
        }
        .gh-link:hover {
          color: #fff;
          background: rgba(110, 231, 183, 0.07);
        }
        .gh-link.active {
          color: #6EE7B7;
          background: rgba(110, 231, 183, 0.1);
        }
        .gh-link.active::after {
          content: '';
          position: absolute;
          bottom: 4px;
          left: 50%;
          transform: translateX(-50%);
          width: 16px;
          height: 2px;
          border-radius: 2px;
          background: linear-gradient(90deg, #6EE7B7, #3B82F6);
        }

        /* CTA buttons */
        .gh-btn-outline {
          padding: 7px 16px;
          font-size: 13px;
          font-weight: 600;
          color: rgba(200, 215, 230, 0.85);
          background: transparent;
          border: 1px solid rgba(200, 215, 230, 0.2);
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.25s;
          letter-spacing: 0.01em;
        }
        .gh-btn-outline:hover {
          color: #fff;
          border-color: rgba(110, 231, 183, 0.4);
          background: rgba(110, 231, 183, 0.06);
        }

        .gh-btn-primary {
          padding: 7px 20px;
          font-size: 13px;
          font-weight: 600;
          color: #0a0f1a;
          background: linear-gradient(135deg, #6EE7B7 0%, #3B82F6 100%);
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.25s;
          letter-spacing: 0.01em;
          box-shadow: 0 0 0 0 rgba(110,231,183,0);
        }
        .gh-btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(110, 231, 183, 0.35);
        }
        .gh-btn-primary:active { transform: translateY(0); }

        /* User button */
        .gh-user-btn {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 6px 12px;
          font-size: 13px;
          font-weight: 600;
          color: rgba(200, 215, 230, 0.9);
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.25s;
        }
        .gh-user-btn:hover {
          background: rgba(255,255,255,0.09);
          border-color: rgba(110,231,183,0.3);
          color: #fff;
        }
        .gh-avatar {
          width: 24px; height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6EE7B7, #3B82F6);
          display: flex; align-items: center; justify-content: center;
          font-size: 10px; font-weight: 700; color: #0a0f1a;
          flex-shrink: 0;
        }

        /* Logout button */
        .gh-btn-logout {
          display: flex; align-items: center; gap: 6px;
          padding: 7px 14px;
          font-size: 13px; font-weight: 600;
          color: #fca5a5;
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.25s;
        }
        .gh-btn-logout:hover {
          background: rgba(239,68,68,0.15);
          border-color: rgba(239,68,68,0.4);
          color: #f87171;
        }

        .gh-more-wrap { position: relative; }
        .gh-more-btn {
          display: flex; align-items: center; justify-content: center;
          width: 36px; height: 36px;
          border-radius: 10px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.12);
          color: rgba(200,215,230,0.9);
          cursor: pointer;
          transition: all 0.2s;
        }
        .gh-more-btn:hover {
          color: #fff;
          background: rgba(255,255,255,0.1);
          border-color: rgba(110, 231, 183, 0.25);
        }
        .gh-more-menu {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 180px;
          background: rgba(8, 12, 22, 0.97);
          border: 1px solid rgba(110, 231, 183, 0.12);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(0,0,0,0.45);
          z-index: 9999;
        }
        .gh-more-item {
          width: 100%;
          text-align: left;
          padding: 10px 12px;
          border: none;
          background: transparent;
          color: rgba(200,215,230,0.9);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }
        .gh-more-item:hover {
          background: rgba(110,231,183,0.07);
          color: #fff;
        }
        .gh-more-item.danger {
          color: #fca5a5;
          border-top: 1px solid rgba(255,255,255,0.08);
        }
        .gh-more-item.danger:hover {
          background: rgba(239,68,68,0.12);
          color: #f87171;
        }

        /* Hamburger */
        .gh-hamburger {
          display: flex; align-items: center; justify-content: center;
          width: 36px; height: 36px;
          border-radius: 10px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          cursor: pointer;
          transition: background 0.2s;
          color: #d1d5db;
        }
        .gh-hamburger:hover { background: rgba(255,255,255,0.1); color: #fff; }

        /* Mobile drawer */
        .gh-mobile-drawer {
          position: fixed;
          top: 80px;
          left: 12px; right: 12px;
          background: rgba(8, 12, 22, 0.96);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(110, 231, 183, 0.1);
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.6);
          animation: slideDown 0.25s cubic-bezier(0.4,0,0.2,1);
          z-index: 9998;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .gh-mobile-link {
          display: flex; align-items: center;
          width: 100%; padding: 13px 20px;
          font-size: 14px; font-weight: 500;
          color: rgba(200,215,230,0.8);
          background: transparent; border: none;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          cursor: pointer;
          transition: all 0.2s; text-align: left;
          letter-spacing: 0.01em;
        }
        .gh-mobile-link:hover, .gh-mobile-link.active {
          color: #6EE7B7;
          background: rgba(110,231,183,0.05);
          padding-left: 26px;
        }
        .gh-mobile-link:last-of-type { border-bottom: none; }

        .gh-mobile-actions {
          padding: 14px 16px;
          display: flex; gap: 10px; flex-direction: column;
          border-top: 1px solid rgba(255,255,255,0.07);
        }

        /* Logo wordmark */
        .gh-wordmark {
          font-size: 16px;
          font-weight: 700;
          letter-spacing: -0.01em;
          background: linear-gradient(135deg, #6EE7B7, #93C5FD);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Modal overlay */
        .gh-modal-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.65);
          backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center;
          z-index: 9999;
          animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }

        .gh-modal {
          background: linear-gradient(145deg, #0f1724, #0a0f1a);
          border: 1px solid rgba(110,231,183,0.12);
          border-radius: 20px;
          padding: 28px 28px 24px;
          max-width: 340px; width: calc(100% - 32px);
          box-shadow: 0 30px 80px rgba(0,0,0,0.7);
          animation: popIn 0.25s cubic-bezier(0.34,1.56,0.64,1);
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.92) }
          to   { opacity: 1; transform: scale(1) }
        }
        .gh-modal-icon {
          width: 48px; height: 48px; border-radius: 14px;
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.2);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 16px;
        }
        .gh-modal h2 {
          font-size: 18px; font-weight: 700; color: #fff; margin: 0 0 6px;
        }
        .gh-modal p {
          font-size: 13.5px; color: rgba(200,215,230,0.6); margin: 0 0 24px;
        }
        .gh-modal-actions { display: flex; gap: 10px; justify-content: flex-end; }

        .gh-modal-cancel {
          padding: 8px 18px;
          font-size: 13px; font-weight: 600;
          color: rgba(200,215,230,0.7);
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .gh-modal-cancel:hover { background: rgba(255,255,255,0.1); color: #fff; }

        .gh-modal-confirm {
          padding: 8px 18px;
          font-size: 13px; font-weight: 600;
          color: #fff;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 14px rgba(239,68,68,0.3);
        }
        .gh-modal-confirm:hover {
          box-shadow: 0 6px 20px rgba(239,68,68,0.45);
          transform: translateY(-1px);
        }
      `}</style>

      <div className="gh-nav" style={{ position: "fixed", top: 0, width: "100%", zIndex: 50, padding: "14px 12px" }}>
        <div style={{
          maxWidth: breakpoint <= 1440 ? "98%" : "1240px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 20px",
        }} className="gh-pill">

          {/* ── Logo ── */}
          <button
            onClick={() => handleNav("/")}
            style={{ display: "flex", alignItems: "center", gap: "10px", background: "none", border: "none", cursor: "pointer", padding: 0 }}
          >
            <GoHomiesLogo size={36} />
            <span className="gh-wordmark" style={{ display: breakpoint < 480 ? "none" : undefined }}>GoHomies</span>
          </button>

          {/* ── Desktop Nav Links ── */}
          <nav style={{ display: "flex", alignItems: "center", gap: "2px" }} className="gh-desktop-links">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => handleNav(link.path)}
                className={`gh-link ${activeLink === link.path ? "active" : ""}`}
                style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
              >
                {link.icon}
                {link.name}
              </button>
            ))}
          </nav>

          {/* ── Right Actions ── */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {/* Desktop auth */}
            <div className="gh-desktop-auth" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {!userData.isAuthenticated ? (
                <>
                  <button className="gh-btn-outline" onClick={() => navigate("/signup")}>Sign Up</button>
                  <button className="gh-btn-primary" onClick={() => navigate("/signin")}>Log In</button>
                </>
              ) : (
                <>
                  <button className="gh-user-btn" onClick={() => navigate("/userprofile")}>
                    <span className="gh-avatar">{(userData?.name?.[0] || "U").toUpperCase()}</span>
                    {userData?.name?.split(" ")[0] || "User"}
                    <ChevronDown size={13} style={{ opacity: 0.5 }} />
                  </button>
                  <div className="gh-more-wrap" ref={desktopMenuRef}>
                    <button
                      className="gh-more-btn"
                      aria-label="More menu"
                      onClick={() => setDesktopMenuOpen((prev) => !prev)}
                    >
                      <MoreVertical size={16} />
                    </button>
                    {desktopMenuOpen ? (
                      <div className="gh-more-menu">
                        <button className="gh-more-item" onClick={() => { handleNav("/booking"); setDesktopMenuOpen(false); }}>Bookings</button>
                        <button className="gh-more-item" onClick={() => { handleNav("/about_us"); setDesktopMenuOpen(false); }}>About Us</button>
                        <button className="gh-more-item" onClick={() => { handleNav("/contact_us"); setDesktopMenuOpen(false); }}>Contact Us</button>
                        <button className="gh-more-item danger" onClick={() => { setDesktopMenuOpen(false); setShowLogoutModal(true); }}>Logout</button>
                      </div>
                    ) : null}
                  </div>
                </>
              )}
            </div>

            {/* Hamburger */}
            <button
              className="gh-hamburger gh-mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Drawer ── */}
      {mobileMenuOpen && (
        <div className="gh-mobile-drawer">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => handleNav(link.path)}
              className={`gh-mobile-link ${activeLink === link.path ? "active" : ""}`}
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              {link.icon}
              {link.name}
            </button>
          ))}
          <div className="gh-mobile-actions">
            {!userData.isAuthenticated ? (
              <>
                <button className="gh-btn-outline" style={{ width: "100%", padding: "10px" }}
                  onClick={() => { navigate("/signup"); setMobileMenuOpen(false); }}>Sign Up</button>
                <button className="gh-btn-primary" style={{ width: "100%", padding: "10px" }}
                  onClick={() => { navigate("/signin"); setMobileMenuOpen(false); }}>Log In</button>
              </>
            ) : (
              <>
                <button className="gh-user-btn" style={{ justifyContent: "center", padding: "10px" }}
                  onClick={() => { navigate("/userprofile"); setMobileMenuOpen(false); }}>
                  <span className="gh-avatar">{(userData?.name?.[0] || "U").toUpperCase()}</span>
                  {userData?.name?.split(" ")[0] || "User"}
                </button>
                <button className="gh-btn-logout" style={{ justifyContent: "center", padding: "10px" }}
                  onClick={() => { setShowLogoutModal(true); setMobileMenuOpen(false); }}>
                  <LogOut size={14} /> Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Logout Modal ── */}
      {showLogoutModal && (
        <div className="gh-modal-overlay" onClick={() => setShowLogoutModal(false)}>
          <div className="gh-modal" onClick={(e) => e.stopPropagation()}>
            <div className="gh-modal-icon">
              <LogOut size={22} color="#f87171" />
            </div>
            <h2>Log out?</h2>
            <p>You'll need to sign back in to access your account.</p>
            <div className="gh-modal-actions">
              <button className="gh-modal-cancel" onClick={() => setShowLogoutModal(false)}>Cancel</button>
              <button className="gh-modal-confirm" onClick={handleLogoutConfirm}>Log Out</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Responsive visibility ── */}
      <style>{`
        @media (max-width: 1024px) {
          .gh-desktop-links { display: none !important; }
          .gh-desktop-auth  { display: none !important; }
          .gh-mobile-toggle { display: flex !important; }
        }
        @media (min-width: 1025px) {
          .gh-mobile-toggle { display: none !important; }
        }
      `}</style>
    </>
  );
};

export default Navbar;
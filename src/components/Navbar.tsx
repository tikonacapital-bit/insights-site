import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const NAV_LINKS = [
  { label: "Calculators", href: "#calculators" },
  { label: "Posts", href: "/post" },
];

const CTA_HREF = "https://tikonacapital.com/consultation";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 50);
      setHidden(y > 300 && y > lastY.current);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── desktop pill styles ── always opaque white pill ── */
  const pillStyle: React.CSSProperties = {
    maxWidth: "880px",
    borderRadius: "40px",
    background: "rgba(255,255,255,0.92)",
    border: "1px solid rgba(0,0,0,0.08)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
    padding: "10px 0",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
  };

  /* ── mobile bar styles ── always opaque white pill ── */
  const mobileBarStyle: React.CSSProperties = {
    borderRadius: "24px",
    background: "rgba(255,255,255,0.92)",
    border: "1px solid rgba(0,0,0,0.08)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
    padding: "8px 12px",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
  };

  const linkColor = "#1F4690";
  const logoFilter = "none";

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transform: hidden ? "translateY(-100%)" : "translateY(0)",
        transition: "transform 0.3s ease",
      }}
    >
      {/* ── Desktop ── */}
      <div className="hidden md:flex justify-center px-4 pt-4">
        <div
          style={{
            ...pillStyle,
            width: "100%",
            margin: "0 auto",
            transition: "all 0.4s ease",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto 1fr",
              alignItems: "center",
              padding: "0 24px",
              transition: "padding 0.4s ease",
            }}
          >
            {/* Logo */}
            <Link to="/" style={{ justifySelf: "start", display: "flex" }}>
              <img
                src="/tikona-logo.png"
                alt="Tikona Capital"
                style={{
                  height: scrolled ? "34px" : "42px",
                  width: "auto",
                  display: "block",
                  filter: logoFilter,
                  transition: "height 0.4s ease, filter 0.4s ease",
                }}
              />
            </Link>

            {/* Center links */}
            <nav style={{ display: "flex", gap: "36px", alignItems: "center" }}>
              {NAV_LINKS.map((l) => {
                const linkStyle: React.CSSProperties = {
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  color: linkColor,
                  textDecoration: "none",
                  transition: "color 0.2s ease",
                };
                const onEnter = (e: React.MouseEvent<HTMLElement>) =>
                  (e.currentTarget.style.color = "#FFA500");
                const onLeave = (e: React.MouseEvent<HTMLElement>) =>
                  (e.currentTarget.style.color = linkColor);
                return l.href.startsWith("/") ? (
                  <Link key={l.label} to={l.href} style={linkStyle} onMouseEnter={onEnter} onMouseLeave={onLeave}>
                    {l.label}
                  </Link>
                ) : (
                  <a key={l.label} href={l.href} style={linkStyle} onMouseEnter={onEnter} onMouseLeave={onLeave}>
                    {l.label}
                  </a>
                );
              })}
            </nav>

            {/* CTA */}
            <div style={{ justifySelf: "end" }}>
              <a
                href={CTA_HREF}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "10px 22px",
                  borderRadius: "999px",
                  background: "#FFA500",
                  color: "#1F4690",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  textDecoration: "none",
                  boxShadow: "0 4px 16px rgba(255,165,0,0.35)",
                  transition: "background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#FFB733";
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 24px rgba(255,165,0,0.45)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#FFA500";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 16px rgba(255,165,0,0.35)";
                }}
              >
                Book Consultation
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile ── */}
      <div className="md:hidden px-4 pt-4">
        <div style={{ ...mobileBarStyle, transition: "all 0.4s ease" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "4px 0",
              transition: "padding 0.4s ease",
            }}
          >
            <Link to="/" style={{ display: "flex" }}>
              <img
                src="/tikona-logo.png"
                alt="Tikona Capital"
                style={{
                  height: "32px",
                  width: "auto",
                  filter: scrolled ? "none" : "brightness(0) invert(1)",
                  transition: "filter 0.4s ease",
                }}
              />
            </Link>

            <button
              onClick={() => setMenuOpen((o) => !o)}
              style={{
                background: "none",
                border: "none",
                padding: "6px",
                cursor: "pointer",
                color: "#1F4690",
                display: "flex",
                transition: "color 0.4s ease",
              }}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          <AnimatePresence initial={false}>
            {menuOpen && (
              <motion.div
                key="mobile-menu"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.28, ease: "easeInOut" }}
                style={{ overflow: "hidden" }}
              >
                <div
                  style={{
                    marginTop: "8px",
                    padding: "16px",
                    background: "rgba(255,255,255,0.95)",
                    border: "1px solid rgba(0,0,0,0.08)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                    borderRadius: "16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  {NAV_LINKS.map((l) => {
                    const mobileStyle: React.CSSProperties = {
                      padding: "12px 16px",
                      borderRadius: "10px",
                      fontSize: "0.95rem",
                      fontWeight: 500,
                      color: "#1F4690",
                      textDecoration: "none",
                      transition: "background 0.15s ease",
                    };
                    const onEnter = (e: React.MouseEvent<HTMLElement>) =>
                      (e.currentTarget.style.background = "rgba(31,70,144,0.07)");
                    const onLeave = (e: React.MouseEvent<HTMLElement>) =>
                      (e.currentTarget.style.background = "transparent");
                    return l.href.startsWith("/") ? (
                      <Link key={l.label} to={l.href} onClick={() => setMenuOpen(false)} style={mobileStyle} onMouseEnter={onEnter} onMouseLeave={onLeave}>
                        {l.label}
                      </Link>
                    ) : (
                      <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)} style={mobileStyle} onMouseEnter={onEnter} onMouseLeave={onLeave}>
                        {l.label}
                      </a>
                    );
                  })}
                  <a
                    href={CTA_HREF}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      marginTop: "8px",
                      padding: "13px 16px",
                      borderRadius: "10px",
                      background: "#FFA500",
                      color: "#1F4690",
                      fontWeight: 600,
                      fontSize: "0.92rem",
                      textDecoration: "none",
                      textAlign: "center",
                    }}
                  >
                    Book Consultation
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}


import { useState, useEffect } from "react";

const weddingPhoto =
  "https://images.unsplash.com/photo-1519741497674-611481863552?w=900&q=80";

const stats = [
  { value: "500+", label: "Weddings" },
  { value: "12+", label: "Years" },
  { value: "30+", label: "Awards" },
  { value: "98%", label: "Happy Clients" },
];

export default function TKMoments() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="tk-about" style={styles.root}>
      {/* Background large text */}
      <div className="tk-about-bg-text" style={styles.bgText}>
        TK MOMENTS TK MOMENTS TK MOMENTS
      </div>

      {/* Hero Section */}
      <section className="tk-about-hero" style={styles.hero}>
        {/* Left: image */}
        <div
          className="tk-about-image-wrap"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "rotate(-4deg) translateY(0)" : "rotate(-4deg) translateY(40px)",
          }}
        >
          <img
            src={weddingPhoto}
            alt="Wedding couple"
            className="tk-about-image"
            style={styles.heroImg}
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=900&q=80";
            }}
          />
          <div style={styles.imgOverlay} />
          {/* Location badge */}
          <div className="tk-about-badge" style={styles.badge}>
            <span style={styles.badgeDot} />
            BHARUCH City
          </div>
        </div>

        {/* Right: text */}
        <div
          className="tk-about-text"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(30px)",
          }}
        >
          {/* Script logo */}
          <div className="tk-about-logo" style={styles.scriptLogo}>
            <svg viewBox="0 0 300 70" style={{ width: "100%", maxWidth: 260, height: 70 }}>
              <defs>
                <linearGradient id="pg" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#c97d6a" />
                  <stop offset="100%" stopColor="#e8a898" />
                </linearGradient>
              </defs>
              <text
                x="8"
                y="50"
                fontFamily="Georgia, 'Times New Roman', serif"
                fontSize="42"
                fill="url(#pg)"
                fontStyle="italic"
                letterSpacing="-1"
              >
                TK Moments
              </text>
              <line x1="8" y1="58" x2="292" y2="58" stroke="#c97d6a" strokeWidth="1.5" opacity="0.5" />
            </svg>
          </div>

          <h1 style={styles.tagline}>
            Artistic Story Telling
            <br />
            <span style={styles.taglineAccent}>Celebrating YOU!</span>
          </h1>

          <p style={styles.desc}>
            Welcome to TK Moments, where we infuse magic into your wedding
            memories turning them into timeless tales of love and companionship.
          </p>
          <p style={styles.desc}>
            We are an award-winning premium wedding photography and films brand,
            known for our artistic, professional and customer centric approach.
          </p>
          <p style={styles.desc}>
            We believe in and exist to showcase the most beautiful and heartfelt
            stories of your life in their true magnificence.
          </p>

          <div className="tk-about-actions" style={styles.ctaRow}>
            <button className="tk-about-primary" style={styles.primaryBtn}>View Portfolio</button>
            <button className="tk-about-secondary" style={styles.secondaryBtn}>Get in Touch -&gt;</button>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <div
        className="tk-about-stats"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.9s ease 0.6s, transform 0.9s ease 0.6s",
        }}
      >
        {stats.map((s, i) => (
          <div key={i} className="tk-about-stat" style={styles.statItem}>
            <span style={styles.statValue}>{s.value}</span>
            <span style={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  root: {
    fontFamily: "'Georgia', 'Times New Roman', serif",
    background: "#fdf8f6",
    minHeight: "100vh",
    position: "relative",
    overflow: "hidden",
  },
  bgText: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    fontSize: "clamp(60px, 12vw, 140px)",
    fontWeight: 900,
    color: "rgba(201,125,106,0.07)",
    letterSpacing: "0.05em",
    whiteSpace: "nowrap",
    pointerEvents: "none",
    userSelect: "none",
    paddingTop: "10px",
    paddingLeft: "10px",
    lineHeight: 1,
    zIndex: 0,
  },
  hero: {
    display: "flex",
    alignItems: "center",
    gap: "5vw",
    padding: "48px 48px 40px",
    maxWidth: 1300,
    margin: "0 auto",
    position: "relative",
    zIndex: 1,
    minHeight: "82vh",
  },
  imgWrap: {
    position: "relative",
    flexShrink: 0,
    width: "48%",
    maxWidth: 580,
    transition: "opacity 0.9s ease 0.1s, transform 0.9s ease 0.1s",
  },
  heroImg: {
    width: "100%",
    height: 480,
    objectFit: "cover",
    borderRadius: 4,
    display: "block",
    boxShadow: "8px 16px 48px rgba(100,60,40,0.18)",
  },
  imgOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to bottom, transparent 60%, rgba(100,60,40,0.18))",
    borderRadius: 4,
    pointerEvents: "none",
  },
  badge: {
    position: "absolute",
    bottom: 20,
    left: 20,
    background: "rgba(253,248,246,0.92)",
    backdropFilter: "blur(6px)",
    borderRadius: 24,
    padding: "7px 16px",
    fontSize: 13,
    color: "#6b5a54",
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    display: "flex",
    alignItems: "center",
    gap: 8,
    letterSpacing: "0.06em",
    boxShadow: "0 2px 12px rgba(100,60,40,0.1)",
  },
  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#c97d6a",
    display: "inline-block",
  },
  heroText: {
    flex: 1,
    transition: "opacity 0.9s ease 0.35s, transform 0.9s ease 0.35s",
  },
  scriptLogo: {
    marginBottom: 12,
    lineHeight: 1,
  },
  tagline: {
    fontSize: "clamp(26px, 3vw, 38px)",
    fontWeight: 400,
    color: "#3a2820",
    lineHeight: 1.25,
    margin: "0 0 18px",
    letterSpacing: "-0.01em",
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
  },
  taglineAccent: {
    color: "#c97d6a",
  },
  desc: {
    fontSize: 15,
    color: "#7a6560",
    lineHeight: 1.75,
    margin: "0 0 14px",
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    fontWeight: 400,
    maxWidth: 420,
  },
  ctaRow: {
    display: "flex",
    alignItems: "center",
    gap: 20,
    marginTop: 28,
  },
  primaryBtn: {
    background: "#3a2820",
    color: "#fdf8f6",
    border: "none",
    borderRadius: 2,
    padding: "14px 32px",
    fontSize: 14,
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    letterSpacing: "0.1em",
    cursor: "pointer",
    fontWeight: 500,
  },
  secondaryBtn: {
    background: "transparent",
    color: "#c97d6a",
    border: "none",
    padding: "14px 0",
    fontSize: 14,
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    letterSpacing: "0.06em",
    cursor: "pointer",
    fontWeight: 500,
    textDecoration: "underline",
    textDecorationColor: "rgba(201,125,106,0.4)",
  },
  statsBar: {
    display: "flex",
    justifyContent: "center",
    gap: "6vw",
    padding: "28px 48px",
    borderTop: "0.5px solid rgba(201,125,106,0.2)",
    maxWidth: 1300,
    margin: "0 auto",
    transition: "opacity 0.9s ease 0.6s, transform 0.9s ease 0.6s",
    position: "relative",
    zIndex: 1,
  },
  statItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 600,
    color: "#c97d6a",
    fontFamily: "Georgia, serif",
    letterSpacing: "-0.02em",
  },
  statLabel: {
    fontSize: 12,
    color: "#a08880",
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
  },
};


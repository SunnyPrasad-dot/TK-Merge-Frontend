import { useState } from "react";

const films = [
  { id: 1, names: "Dhruv & Pippa", bg: "linear-gradient(135deg,#e8c97a,#c9954a)", image: "https://images.unsplash.com/photo-1665960213508-48f07086d49c?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", textStyle: "italic" },
  { id: 2, names: "Palak & Priya", bg: "linear-gradient(135deg,#f4b8d0,#e07fa0)", image: "https://images.unsplash.com/photo-1727430256509-0f897d6f4765?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", textStyle: "italic" },
  { id: 3, names: "Indu & Sahil", bg: "linear-gradient(135deg,#b8d4c8,#6aaa8e)", image: "https://images.unsplash.com/photo-1633104502699-b2ecf0fee294?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", textStyle: "italic" },
  { id: 4, names: "AVI\nVAI", bg: "linear-gradient(135deg,#f0f0ec,#d8d4c8)", image: "https://images.unsplash.com/photo-1727430334033-d2ffe559bdce?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", textStyle: "logo" },
  { id: 5, names: "Divya & Rohan", bg: "linear-gradient(135deg,#f7d6c4,#e89060)", image: "https://images.unsplash.com/photo-1735052712489-f45220126a0c?q=80&w=680&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", textStyle: "italic" },
];

export default function WeddingCarousel() {
  const [current, setCurrent] = useState(0);
  const visible = 4;

  const prev = () => setCurrent((c) => (c > 0 ? c - 1 : films.length - visible));
  const next = () => setCurrent((c) => (c < films.length - visible ? c + 1 : 0));

  const visibleFilms = films.slice(current, current + visible);

  return (
    <div id="wedding-films" className="wedding-carousel" style={{ background: "#c4b09a", padding: "48px 40px 40px", position: "relative" }}>
      <div className="wedding-carousel-header" style={{ marginBottom: 40, textAlign: "center" }}>
        <h1
          className="wedding-carousel-title"
          style={{
            fontSize: 48,
            fontFamily: "Georgia, serif",
            fontWeight: 700,
            color: "#2c1810",
            textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
            marginBottom: 0,
            letterSpacing: 1,
            background: "linear-gradient(135deg, #3d251a 0%, #2c1810 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Beautiful Weddings, Breathtaking Films
        </h1>
      </div>

      <button onClick={prev} className="wedding-carousel-nav wedding-carousel-nav-left" style={navBtn("left")} aria-label="Previous wedding film">
        {"<"}
      </button>
      <button onClick={next} className="wedding-carousel-nav wedding-carousel-nav-right" style={navBtn("right")} aria-label="Next wedding film">
        {">"}
      </button>

      <div className="wedding-carousel-track" style={{ display: "flex", gap: 16 }}>
        {visibleFilms.map((film) => (
          <div key={film.id} className="wedding-carousel-card" style={cardStyle(film.bg)}>
            <img src={film.image} alt={film.names} style={cardImageStyle} />
            <div style={overlayStyle}>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.9)" }}>TK moments</span>
              <span style={film.textStyle === "logo" ? logoNameStyle : italicNameStyle}>
                {film.names}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="wedding-carousel-actions" style={{ display: "flex", gap: 16, marginTop: 20 }}>
        {visibleFilms.map((film) => (
          <div key={film.id} className="wedding-carousel-action" style={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <button style={watchBtnStyle}>Watch Film</button>
          </div>
        ))}
      </div>
    </div>
  );
}

const navBtn = (side) => ({
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  [side]: 8,
  width: 44,
  height: 44,
  borderRadius: "50%",
  background: "rgba(40,40,40,0.7)",
  color: "#fff",
  border: "none",
  fontSize: 18,
  cursor: "pointer",
  zIndex: 10,
});

const cardStyle = (bg) => ({
  flex: "0 0 calc(25% - 12px)",
  borderRadius: 12,
  overflow: "hidden",
  position: "relative",
  aspectRatio: "3/4",
  cursor: "pointer",
  background: bg,
});

const overlayStyle = {
  position: "absolute",
  inset: 0,
  padding: 16,
  background: "linear-gradient(to bottom, rgba(0,0,0,0.15), transparent 30%, rgba(0,0,0,0.3))",
  display: "flex",
  flexDirection: "column",
};

const italicNameStyle = {
  marginTop: "auto",
  fontSize: 26,
  fontFamily: "Georgia, serif",
  fontStyle: "italic",
  color: "#fff",
  textShadow: "0 1px 6px rgba(0,0,0,0.4)",
};

const logoNameStyle = {
  marginTop: "auto",
  fontSize: 42,
  fontFamily: "sans-serif",
  fontWeight: 700,
  letterSpacing: -2,
  color: "#1a2e1a",
  whiteSpace: "pre",
};

const watchBtnStyle = {
  background: "rgba(40,40,40,0.85)",
  color: "#fff",
  border: "none",
  borderRadius: 999,
  padding: "12px 28px",
  fontSize: 14,
  cursor: "pointer",
};

const cardImageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
};

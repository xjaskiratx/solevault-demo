import { useState } from 'react';
import { Link } from 'react-router-dom';

const T = {
  teal:       "#209aaf",
  tealLight:  "#62eaf4",
  black:      "#000000",
  white:      "#ffffff",
  cardSub:    "#90696a",
  fontBody:   "'DM Sans', sans-serif",
  fontCard:   "'Archivo Black', sans-serif",
};

// Figma asset URLs
const IMG_CARD_BG = "https://www.figma.com/api/mcp/asset/0ac2146f-81f1-439e-b184-f5a1b8974cd7";
const IMG_MASK    = "https://www.figma.com/api/mcp/asset/f23cda89-0ee1-4d1b-939f-59845917b452";
const IMG_ATM     = "https://www.figma.com/api/mcp/asset/de93b5bd-0c69-466b-a905-1a4f9334696d";

function MixedCaps({ text, bigPx, smallPx }) {
  if (!text) return null;
  return (
    <span>
      {text.split("").map((char, i) => {
        const isUpper = char === char.toUpperCase() && char !== char.toLowerCase();
        const isSpace = char === " " || char === "/" || char === "-";
        return (
          <span
            key={i}
            style={{
              fontSize: isUpper || isSpace ? bigPx : smallPx,
              textTransform: "uppercase",
            }}
          >
            {char}
          </span>
        );
      })}
    </span>
  );
}

export default function SneakerCard({ sneaker }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to={`/card/${sneaker?._id}`}
      style={{ 
        flex: 1, 
        minWidth: 0, 
        display: "flex", 
        flexDirection: "column", 
        gap: 10, 
        textDecoration: 'none',
        color: 'inherit'
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Card Thumbnail */}
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "483/277",
          borderRadius: 14,
          overflow: "hidden",
          background: T.white,
          boxShadow: hovered
            ? "0 8px 28px rgba(0,0,0,.32)"
            : "2px 2px 8px rgba(0,0,0,.22)",
          transition: "box-shadow .3s ease, transform .3s ease",
          transform: hovered ? "translateY(-4px)" : "none",
        }}
      >
        <img
          src={sneaker?.imageUrl || "/Frame75.png"}
          alt={sneaker?.primaryName || "Sneaker Card"}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* Metadata */}
      <p style={{ margin: 0, fontFamily: T.fontBody, color: T.black, lineHeight: 1.2 }}>
        <MixedCaps text={sneaker?.primaryName} bigPx={19} smallPx={14} />
      </p>
      <p style={{ margin: 0, fontFamily: T.fontBody, color: T.black, lineHeight: 1.2 }}>
        <MixedCaps text={sneaker?.officialColorway || "Original"} bigPx={14} smallPx={10} />
      </p>
      <p style={{ margin: 0, fontFamily: T.fontBody, fontSize: 13, fontWeight: 400, color: T.black, letterSpacing: 0.5, opacity: 0.8 }}>
        NAME SCORE – {Math.round(sneaker?.nameScore)}
      </p>
    </Link>
  );
}

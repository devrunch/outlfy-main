"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const ACCENT = "#22B573";
const BG = "#0B0B0B";
const BORDER = "#2a2a2a";
const TOOLTIP_BG = "#141414";
const TOOLTIP_BORDER = "#262626";

const FONT_HEAD = "'Archivo', sans-serif";
const FONT_BODY = "'Inter', sans-serif";

/* ---------------------------------------------------------------- */
/*  Card icons — 28x28 inline SVG, white strokes + one green accent  */
/* ---------------------------------------------------------------- */

const PersonIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <circle cx="14" cy="9" r="4" stroke="#ffffff" strokeWidth="1.3" />
    <path
      d="M5 25c0-5.2 4-9 9-9s9 3.8 9 9"
      stroke="#ffffff"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
    <line x1="14" y1="0.5" x2="14" y2="6" stroke={ACCENT} strokeWidth="1.4" strokeLinecap="round" />
    <polygon points="10.8,5.2 17.2,5.2 14,9.4" fill={ACCENT} />
  </svg>
);

const GearIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <circle cx="14" cy="14" r="7.2" stroke="#ffffff" strokeWidth="1.3" />
    <circle cx="14" cy="14" r="2.6" stroke="#ffffff" strokeWidth="1.3" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
      <line
        key={deg}
        x1={14 + 8.3 * Math.cos((deg * Math.PI) / 180)}
        y1={14 + 8.3 * Math.sin((deg * Math.PI) / 180)}
        x2={14 + 11.2 * Math.cos((deg * Math.PI) / 180)}
        y2={14 + 11.2 * Math.sin((deg * Math.PI) / 180)}
        stroke="#ffffff"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    ))}
    <polygon
      points="12,4 17,4 13.5,13 18,13 11,25 13.5,15 9,15"
      fill={ACCENT}
    />
  </svg>
);

const EyeIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <path
      d="M2 14c3-6 8-9 12-9s9 3 12 9c-3 6-8 9-12 9s-9-3-12-9z"
      stroke="#ffffff"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
    <circle cx="14" cy="14" r="3" stroke="#ffffff" strokeWidth="1.3" />
    <line x1="4" y1="4" x2="24" y2="24" stroke={ACCENT} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const FaucetIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <line x1="6" y1="4" x2="6" y2="1.5" stroke="#ffffff" strokeWidth="1.3" strokeLinecap="round" />
    <path
      d="M6 4h13a3 3 0 0 1 3 3v3"
      stroke="#ffffff"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line x1="22" y1="10" x2="22" y2="13.5" stroke="#ffffff" strokeWidth="1.3" strokeLinecap="round" />
    <path
      d="M22 15c-2.6 3-2.6 6.4 0 8.4 2.6-2 2.6-5.4 0-8.4z"
      fill={ACCENT}
    />
  </svg>
);

/* ---------------------------------------------------------------- */
/*  Shared diagram bits                                              */
/* ---------------------------------------------------------------- */

const Caption = ({ children }) => (
  <text
    x="150"
    y="16"
    textAnchor="middle"
    fontFamily={FONT_HEAD}
    fontWeight="800"
    fontSize="11"
    fill="#ffffff"
    letterSpacing="0.4"
  >
    {children}
  </text>
);

const Label = ({ x, y, children, fill = "#ccc", size = 8.5 }) => (
  <text
    x={x}
    y={y}
    textAnchor="middle"
    fontFamily={FONT_BODY}
    fontSize={size}
    fill={fill}
  >
    {children}
  </text>
);

/* ---------------------------------------------------------------- */
/*  Diagram 1 — YOU ARE THE SYSTEM (hub and spoke)                   */
/* ---------------------------------------------------------------- */

const HubSpokeDiagram = () => {
  const cx = 150;
  const cy = 128;
  const R = 72;
  const nodes = [
    { label: "Sales", deg: 0 },
    { label: "Ops", deg: 72 },
    { label: "Finance", deg: 144 },
    { label: "Hiring", deg: 216 },
    { label: "Support", deg: 288 },
  ].map((n) => {
    const rad = (n.deg * Math.PI) / 180;
    return {
      ...n,
      x: cx + R * Math.sin(rad),
      y: cy - R * Math.cos(rad),
    };
  });

  return (
    <svg width="300" height="220" viewBox="0 0 300 220">
      <Caption>YOU ARE THE SYSTEM</Caption>
      {nodes.map((n) => (
        <line
          key={`line-${n.label}`}
          x1={cx}
          y1={cy}
          x2={n.x}
          y2={n.y}
          stroke={ACCENT}
          strokeWidth="1.4"
        />
      ))}
      {nodes.map((n) => (
        <g key={n.label}>
          <circle cx={n.x} cy={n.y} r="14" fill="#0B0B0B" stroke={ACCENT} strokeWidth="1.3" />
          <Label x={n.x} y={n.y + 2.8} size={7.8}>
            {n.label}
          </Label>
        </g>
      ))}
      <circle cx={cx} cy={cy} r="22" fill={ACCENT} />
      <text
        x={cx}
        y={cy + 3}
        textAnchor="middle"
        fontFamily={FONT_HEAD}
        fontWeight="800"
        fontSize="10"
        fill="#0B0B0B"
      >
        YOU
      </text>
    </svg>
  );
};

/* ---------------------------------------------------------------- */
/*  Diagram 2 — AUTOMATING A BROKEN PROCESS (pipeline)                */
/* ---------------------------------------------------------------- */

const CrossGlyph = ({ cx, cy, color }) => (
  <g stroke={color} strokeWidth="1.4" strokeLinecap="round">
    <line x1={cx - 5} y1={cy - 5} x2={cx + 5} y2={cy + 5} />
    <line x1={cx + 5} y1={cy - 5} x2={cx - 5} y2={cy + 5} />
  </g>
);

const BoltGlyph = ({ cx, cy, color }) => (
  <polygon
    points={`${cx - 2},${cy - 8} ${cx + 3},${cy - 8} ${cx - 1},${cy} ${cx + 4},${cy} ${cx - 3},${cy + 8} ${cx},${cy + 1} ${cx - 4},${cy + 1}`}
    fill={color}
  />
);

const PipelineDiagram = () => {
  const axisY = 108;
  const boxes = [
    { x: 70, dark: true, glyph: "cross", lines: ["Broken", "process"] },
    { x: 150, dark: false, glyph: "bolt", lines: ["+", "automation"] },
    { x: 230, dark: true, glyph: "cross", lines: ["Faster,", "still broken"] },
  ];

  return (
    <svg width="300" height="220" viewBox="0 0 300 220">
      <Caption>AUTOMATING A BROKEN PROCESS</Caption>

      <line x1="38" y1={axisY} x2="262" y2={axisY} stroke="#333" strokeWidth="1.2" />
      <polygon points="262,102 274,108 262,114" fill="#555" />

      {boxes.map((b) => (
        <g key={b.x}>
          <rect
            x={b.x - 24}
            y={axisY - 16}
            width="48"
            height="32"
            rx="6"
            fill={b.dark ? "#141414" : ACCENT}
            stroke={b.dark ? BORDER : ACCENT}
            strokeWidth="1.2"
          />
          {b.glyph === "cross" ? (
            <CrossGlyph cx={b.x} cy={axisY} color="#ffffff" />
          ) : (
            <BoltGlyph cx={b.x} cy={axisY} color="#0B0B0B" />
          )}
          <Label x={b.x} y={axisY + 37}>
            {b.lines[0]}
          </Label>
          <Label x={b.x} y={axisY + 48}>
            {b.lines[1]}
          </Label>
        </g>
      ))}
    </svg>
  );
};

/* ---------------------------------------------------------------- */
/*  Diagram 3 — DATA ARRIVING 3 WEEKS LATE (bar chart)                */
/* ---------------------------------------------------------------- */

const BarChartDiagram = () => {
  const baseline = 178;
  const bars = [
    { label: "Wk 1", h: 30, color: "#333" },
    { label: "Wk 2", h: 50, color: "#333" },
    { label: "Wk 3", h: 70, color: "#333" },
    { label: "Today", h: 96, color: ACCENT },
  ];
  const centers = [68, 124, 180, 236];
  const barWidth = 30;

  return (
    <svg width="300" height="220" viewBox="0 0 300 220">
      <Caption>DATA ARRIVING 3 WEEKS LATE</Caption>
      <text
        x="150"
        y="32"
        textAnchor="middle"
        fontFamily={FONT_BODY}
        fontSize="10"
        fill={ACCENT}
      >
        Decisions made on old data ↓
      </text>

      <line x1="34" y1={baseline} x2="266" y2={baseline} stroke="#333" strokeWidth="1.2" />

      {bars.map((b, i) => (
        <g key={b.label}>
          <rect
            x={centers[i] - barWidth / 2}
            y={baseline - b.h}
            width={barWidth}
            height={b.h}
            fill={b.color}
            rx="2"
          />
          <Label x={centers[i]} y={baseline + 14}>
            {b.label}
          </Label>
        </g>
      ))}
    </svg>
  );
};

/* ---------------------------------------------------------------- */
/*  Diagram 4 — MONEY LEAKING QUIETLY                                 */
/* ---------------------------------------------------------------- */

const FaucetDiagram = () => {
  const rectY = 45;
  const rectBottom = rectY + 26;
  const drips = [
    { x: 90, lines: ["Missed", "follow-ups"] },
    { x: 150, lines: ["Unbilled", "work"] },
    { x: 210, lines: ["Repeated", "tasks"] },
  ];
  const dripLen = 70;

  return (
    <svg width="300" height="220" viewBox="0 0 300 220">
      <Caption>MONEY LEAKING QUIETLY</Caption>

      <rect
        x="60"
        y={rectY}
        width="180"
        height="26"
        rx="6"
        fill="none"
        stroke="#ffffff"
        strokeWidth="1.3"
      />
      <text
        x="150"
        y={rectY + 17}
        textAnchor="middle"
        fontFamily={FONT_BODY}
        fontSize="9.5"
        fill="#e5e5e5"
      >
        Revenue flow
      </text>

      {drips.map((d) => (
        <g key={d.x}>
          <line
            x1={d.x}
            y1={rectBottom}
            x2={d.x}
            y2={rectBottom + dripLen}
            stroke={ACCENT}
            strokeWidth="1.3"
            strokeDasharray="3 3"
          />
          <circle cx={d.x} cy={rectBottom + dripLen} r="4" fill={ACCENT} />
          <Label x={d.x} y={rectBottom + dripLen + 15}>
            {d.lines[0]}
          </Label>
          <Label x={d.x} y={rectBottom + dripLen + 26}>
            {d.lines[1]}
          </Label>
        </g>
      ))}
    </svg>
  );
};

/* ---------------------------------------------------------------- */
/*  Card data                                                        */
/* ---------------------------------------------------------------- */

const cards = [
  {
    title: "You are the system",
    body: "Every decision, every number, every follow-up routes through you.",
    Icon: PersonIcon,
    Diagram: HubSpokeDiagram,
  },
  {
    title: "Why your automation failed",
    body: "Dropped onto a broken process, it just makes a faster broken process.",
    Icon: GearIcon,
    Diagram: PipelineDiagram,
  },
  {
    title: "Your numbers arrive late",
    body: "Last month's data, three weeks late.",
    Icon: EyeIcon,
    Diagram: BarChartDiagram,
  },
  {
    title: "Money leaks quietly",
    body: "It never arrives as a single bill.",
    Icon: FaucetIcon,
    Diagram: FaucetDiagram,
  },
];

/* ---------------------------------------------------------------- */
/*  Main section                                                     */
/* ---------------------------------------------------------------- */

const DigitalMarketingAbout = () => {
  const [hoverCapable, setHoverCapable] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [openIndex, setOpenIndex] = useState(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined" && window.matchMedia) {
      setHoverCapable(window.matchMedia("(hover: hover)").matches);
    }
  }, []);

  const handleMouseMove = (e) => {
    if (!hoverCapable) return;
    setMouse({ x: e.clientX, y: e.clientY });
  };

  const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 1200;
  const tooltipLeft = Math.max(12, Math.min(mouse.x + 20, viewportWidth - 340 - 20));
  const tooltipTop = Math.max(12, mouse.y - 110);

  const ActiveDiagram = activeIndex !== null ? cards[activeIndex].Diagram : null;

  return (
    <section ref={sectionRef} style={styles.section}>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Archivo:wght@700;800;900&family=Inter:wght@400;500;600&display=swap"
      />

      <div style={styles.container}>
        <div style={styles.leftCol}>
          <div style={styles.grid}>
            {cards.map((card, i) => (
              <div
                key={card.title}
                style={styles.card}
                onMouseEnter={() => hoverCapable && setActiveIndex(i)}
                onMouseLeave={() => hoverCapable && setActiveIndex((cur) => (cur === i ? null : cur))}
                onMouseMove={handleMouseMove}
                onClick={() => {
                  if (hoverCapable) return;
                  setOpenIndex((cur) => (cur === i ? null : i));
                }}
              >
                <div style={{ marginBottom: 10 }}>
                  <card.Icon />
                </div>
                <div style={styles.cardTitle}>{card.title}</div>
                <div style={styles.cardBody}>{card.body}</div>

                {!hoverCapable && openIndex === i && (
                  <div style={styles.inlineDiagram}>
                    <card.Diagram />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={styles.rightCol}>
          <div style={styles.eyebrow}>START HERE</div>
          <h2 style={styles.heading}>
            It isn&apos;t one problem.
            <br />
            It&apos;s four.
          </h2>
          <p style={styles.body}>
            Most founders feel at least two of these right now. You probably
            recognised one before you finished this sentence. Different
            symptoms — one root cause. And they all cost you the same thing:
            money.
          </p>
          <p style={styles.closer}>
            Most founder-led businesses lose between 8% and 15% of revenue
            every month to this gap — missed follow-ups, work never invoiced,
            the same job done twice.
          </p>
        </div>
      </div>

      {hoverCapable &&
        mounted &&
        createPortal(
          <div
            style={{
              position: "fixed",
              left: tooltipLeft,
              top: tooltipTop,
              width: 340,
              padding: 22,
              boxSizing: "border-box",
              pointerEvents: "none",
              zIndex: 9999,
              backgroundColor: TOOLTIP_BG,
              border: `1px solid ${TOOLTIP_BORDER}`,
              borderRadius: 8,
              boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
              opacity: activeIndex !== null ? 1 : 0,
              transform: `scale(${activeIndex !== null ? 1 : 0.96})`,
              transition: "opacity 0.15s ease, transform 0.15s ease",
            }}
          >
            {ActiveDiagram && <ActiveDiagram />}
          </div>,
          document.body
        )}
    </section>
  );
};

/* ---------------------------------------------------------------- */
/*  Styles                                                           */
/* ---------------------------------------------------------------- */

const styles = {
  section: {
    backgroundColor: BG,
    position: "relative",
    overflow: "hidden",
  },
  container: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    gap: 40,
    maxWidth: 1280,
    margin: "0 auto",
    padding: "96px 56px",
  },
  leftCol: {
    flex: "0 1 560px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 18,
    alignContent: "start",
    maxWidth: 560,
  },
  card: {
    border: `1px solid ${BORDER}`,
    padding: 18,
    boxSizing: "border-box",
    aspectRatio: "1 / 1",
    display: "flex",
    flexDirection: "column",
    cursor: "default",
  },
  cardTitle: {
    fontFamily: FONT_HEAD,
    fontWeight: 800,
    fontSize: 14,
    lineHeight: 1.25,
    color: "#ffffff",
    marginBottom: 6,
  },
  cardBody: {
    fontFamily: FONT_BODY,
    fontSize: 12,
    lineHeight: 1.45,
    color: "#aaaaaa",
  },
  inlineDiagram: {
    marginTop: 16,
    backgroundColor: TOOLTIP_BG,
    border: `1px solid ${TOOLTIP_BORDER}`,
    borderRadius: 8,
    padding: 12,
    overflow: "hidden",
  },
  rightCol: {
    flex: "1 1 380px",
  },
  eyebrow: {
    fontFamily: FONT_HEAD,
    fontWeight: 700,
    fontSize: 14,
    letterSpacing: 1.5,
    color: ACCENT,
    marginBottom: 16,
  },
  heading: {
    fontFamily: FONT_HEAD,
    fontWeight: 900,
    fontSize: "clamp(34px, 4.4vw, 50px)",
    lineHeight: 1.1,
    letterSpacing: -1,
    color: "#ffffff",
    margin: "0 0 24px",
  },
  body: {
    fontFamily: FONT_BODY,
    fontSize: 17,
    lineHeight: 1.7,
    color: "#c9c9c9",
    maxWidth: 470,
    margin: "0 0 20px",
  },
  closer: {
    fontFamily: FONT_BODY,
    fontSize: 17,
    fontWeight: 700,
    lineHeight: 1.7,
    color: "#ffffff",
    maxWidth: 470,
    margin: 0,
  },
};

export default DigitalMarketingAbout;

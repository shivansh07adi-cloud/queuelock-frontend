"use client";

// Text that scrolls infinitely along a shallow arc using SVG textPath,
// rather than a flat marquee - gives the "drop is live" banner some
// physical curvature instead of a straight scrolling ticker. Uses SMIL
// <animate> on startOffset rather than a CSS animation, since browser
// support for CSS-animating SVG geometry properties is inconsistent.
export default function CurvedLoop({ text }: { text: string }) {
  const repeated = Array(6).fill(text).join("   •   ");

  return (
    <div className="relative h-12 w-full overflow-hidden sm:h-20" aria-hidden="true">
      <svg viewBox="0 0 1200 120" className="h-full w-full">
        <defs>
          <path id="curve-path" d="M -100 80 Q 600 10 1300 80" fill="none" />
        </defs>
        <text
          fill="var(--paper-dim)"
          style={{
            fontFamily: "var(--font-flap), monospace",
            fontSize: "15px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          <textPath href="#curve-path" startOffset="0%">
            {repeated}
            <animate
              attributeName="startOffset"
              from="0%"
              to="-100%"
              dur="22s"
              repeatCount="indefinite"
            />
          </textPath>
        </text>
      </svg>
    </div>
  );
}

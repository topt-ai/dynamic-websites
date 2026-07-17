"use client";

import { useEffect, useRef, useState } from "react";

const STATUS_MESSAGES = [
  "Diseñando tu encabezado...",
  "Escribiendo tu contenido...",
  "Acomodando los colores de tu marca...",
  "Redactando tu historia...",
  "Puliendo cada sección...",
  "Ajustando los últimos detalles...",
];

const STATUS_INTERVAL_MS = 4000;

const PIXEL = 3;

function Worker({ flip = false }: { flip?: boolean }) {
  // Coordinates are in an abstract 20x22 pixel grid, scaled by PIXEL.
  const g = PIXEL;
  return (
    <g transform={flip ? "translate(54,0) scale(-1,1)" : undefined}>
      {/* legs */}
      <rect x={5 * g} y={16 * g} width={3 * g} height={5 * g} fill="var(--blueprint-line)" />
      <rect x={9 * g} y={16 * g} width={3 * g} height={5 * g} fill="var(--blueprint-line)" />
      {/* torso / vest */}
      <rect x={4 * g} y={10 * g} width={9 * g} height={7 * g} fill="var(--accent)" />
      <rect x={6 * g} y={11 * g} width={2 * g} height={1 * g} fill="var(--signal)" />
      <rect x={9 * g} y={11 * g} width={2 * g} height={1 * g} fill="var(--signal)" />
      {/* head */}
      <rect x={6 * g} y={6 * g} width={5 * g} height={4 * g} fill="#e7b98f" />
      {/* helmet */}
      <rect x={5 * g} y={3 * g} width={7 * g} height={3 * g} fill="var(--signal)" />
      <rect x={4 * g} y={5 * g} width={9 * g} height={1 * g} fill="var(--signal)" />
      {/* static arm */}
      <rect x={2 * g} y={11 * g} width={2 * g} height={5 * g} fill="#e7b98f" />
      {/* hammer arm, pivots at shoulder */}
      <g className="hammer-arm" style={{ transformOrigin: `${13 * g}px ${11 * g}px` }}>
        <rect x={13 * g} y={10 * g} width={2 * g} height={5 * g} fill="#e7b98f" />
        <rect x={13 * g} y={5 * g} width={2 * g} height={6 * g} fill="#8a5a34" />
        <rect x={11 * g} y={3 * g} width={6 * g} height={3 * g} fill="var(--graphite)" />
      </g>
    </g>
  );
}

function BlockTower() {
  const blocks = [0, 1, 2, 3, 4];
  return (
    <g>
      {/* browser chrome */}
      <rect x={0} y={0} width={54 * PIXEL} height={6 * PIXEL} fill="var(--paper-dim)" />
      <circle cx={2.5 * PIXEL} cy={3 * PIXEL} r={0.8 * PIXEL} fill="var(--accent)" />
      <circle cx={5 * PIXEL} cy={3 * PIXEL} r={0.8 * PIXEL} fill="var(--signal)" />
      <circle cx={7.5 * PIXEL} cy={3 * PIXEL} r={0.8 * PIXEL} fill="#8fd19e" />
      <rect x={0} y={6 * PIXEL} width={54 * PIXEL} height={44 * PIXEL} fill="var(--paper)" fillOpacity={0.08} stroke="var(--paper)" strokeOpacity={0.25} strokeWidth={1} />
      {blocks.map((i) => (
        <rect
          key={i}
          className="build-block"
          x={4 * PIXEL}
          y={(10 + i * 7) * PIXEL}
          width={46 * PIXEL}
          height={5 * PIXEL}
          fill={i % 2 === 0 ? "var(--blueprint-line)" : "var(--graphite)"}
          style={{ animationDelay: `${i * 0.45}s` }}
        />
      ))}
    </g>
  );
}

export default function BuildLoader({ done = false }: { done?: boolean }) {
  const [statusIndex, setStatusIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setStatusIndex((i) => (i + 1) % STATUS_MESSAGES.length);
    }, STATUS_INTERVAL_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <svg
        viewBox="0 0 300 150"
        width="280"
        height="140"
        shapeRendering="crispEdges"
        role="img"
        aria-label="Construyendo tu sitio web"
      >
        <g transform="translate(70,0)">
          <BlockTower />
        </g>
        <g transform="translate(0,60)">
          <Worker />
        </g>
        <g transform="translate(210,60)">
          <Worker flip />
        </g>
      </svg>

      <div className="w-full max-w-xs">
        <div className="h-3 w-full overflow-hidden rounded-sm hazard-stripes progress-shift" />
      </div>

      <p
        key={statusIndex}
        className="font-mono text-xs tracking-wide text-paper/70 status-fade"
        aria-live="polite"
      >
        {done ? "Listo. Redirigiendo..." : STATUS_MESSAGES[statusIndex]}
      </p>

      <style>{`
        .hammer-arm {
          animation: swing 0.6s ease-in-out infinite alternate;
        }
        @keyframes swing {
          from { transform: rotate(-35deg); }
          to { transform: rotate(10deg); }
        }
        .build-block {
          animation: rise 3.6s ease-in-out infinite;
          transform-box: fill-box;
          transform-origin: center;
        }
        @keyframes rise {
          0% { opacity: 0; transform: scaleY(0); }
          15% { opacity: 1; transform: scaleY(1); }
          85% { opacity: 1; transform: scaleY(1); }
          100% { opacity: 0; transform: scaleY(0); }
        }
        .progress-shift {
          background-size: 28px 28px;
          animation: shift 1s linear infinite;
        }
        @keyframes shift {
          from { background-position: 0 0; }
          to { background-position: 28px 0; }
        }
        .status-fade {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(3px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

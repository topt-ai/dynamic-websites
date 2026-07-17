"use client";

import { createElement, useEffect, useMemo, useRef, useState } from "react";
import { matchSectionIcon } from "@/lib/section-icons";

export default function SectionIconAccent({
  title,
  tone,
}: {
  title: string;
  tone: "blueprint" | "paper";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const icon = useMemo(() => matchSectionIcon(title), [title]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const isBlueprint = tone === "blueprint";

  return (
    <div
      ref={ref}
      className={`section-visual flex h-40 w-full flex-shrink-0 items-center justify-center rounded-sm sm:h-52 sm:w-2/5 ${
        visible ? "section-visual-in" : ""
      }`}
      style={{
        background: isBlueprint ? "var(--blueprint)" : "var(--paper-dim)",
      }}
      aria-hidden
    >
      <div
        className={`section-icon-wrap flex items-center justify-center rounded-full ${
          visible ? "section-icon-in" : ""
        }`}
        style={{
          width: "7rem",
          height: "7rem",
          background: isBlueprint
            ? "color-mix(in srgb, var(--accent) 22%, transparent)"
            : "color-mix(in srgb, var(--blueprint) 10%, transparent)",
        }}
      >
        {createElement(icon, {
          size: 64,
          strokeWidth: 1.4,
          color: isBlueprint ? "var(--signal)" : "var(--blueprint)",
        })}
      </div>

      <style>{`
        .section-visual {
          opacity: 0;
          transform: translateY(14px);
          transition: opacity 0.4s ease-out, transform 0.4s ease-out;
        }
        .section-visual-in {
          opacity: 1;
          transform: translateY(0);
        }
        .section-icon-wrap {
          opacity: 0;
          transform: scale(0.85) rotate(-6deg);
          transition: opacity 0.45s ease-out 0.08s, transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) 0.08s;
        }
        .section-icon-in {
          opacity: 1;
          transform: scale(1) rotate(0deg);
        }
        @media (prefers-reduced-motion: reduce) {
          .section-visual,
          .section-icon-wrap {
            transition: none;
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}

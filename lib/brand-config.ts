// Swappable brand theme. Each brand gets a config object here; the rest of
// the app reads from `brand` instead of hardcoding colors/copy/fonts.

export type BrandConfig = {
  id: string;
  name: string;
  webhookUrl: string;
  colors: {
    ink: string;
    blueprint: string;
    accent: string;
    signal: string;
    paper: string;
    graphite: string;
  };
  fonts: {
    display: string;
    body: string;
    mono: string;
  };
  copy: {
    gateHeadline: string;
    gateSubheadline: string;
    submitLabel: string;
    demoBadgePrefix: string;
    conversionBarText: string;
    conversionBarCta: string;
  };
};

export const tuwebsv: BrandConfig = {
  id: "tuwebsv",
  name: "TuWebSV",
  webhookUrl: process.env.NEXT_PUBLIC_LEAD_WEBHOOK_URL ?? "",
  colors: {
    ink: "#12161f",
    blueprint: "#1b3a6b",
    accent: "#ff5a1f",
    signal: "#ffc93c",
    paper: "#fbf7ef",
    graphite: "#4a5361",
  },
  fonts: {
    display: "var(--font-display)",
    body: "var(--font-body)",
    mono: "var(--font-mono)",
  },
  copy: {
    gateHeadline: "Mira cómo se vería tu sitio web",
    gateSubheadline:
      "Escribe el nombre de tu negocio y su rubro. En segundos armamos una vista previa real de tu futuro sitio.",
    submitLabel: "Ver mi sitio",
    demoBadgePrefix: "DEMO",
    conversionBarText: "¿Te gustó tu sitio?",
    conversionBarCta: "Escríbenos",
  },
};

// Active brand for this deployment. When this scaffold is pointed at
// another brand (The Citadl, Nagara HQ), swap this export.
export const brand = tuwebsv;

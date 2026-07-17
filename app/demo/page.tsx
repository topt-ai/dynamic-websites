"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { brand } from "@/lib/brand-config";
import { DEMO_SITE_STORAGE_KEY, type DemoSiteData } from "@/lib/types";
import SectionIconAccent from "@/components/SectionIconAccent";

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function heroGradient(bucket: string): string {
  const hue = hashString(bucket || "tuwebsv") % 360;
  const hue2 = (hue + 46) % 360;
  return `linear-gradient(135deg, hsl(${hue} 55% 34%), hsl(${hue2} 60% 22%))`;
}

function readStoredData(): DemoSiteData | null {
  const raw = sessionStorage.getItem(DEMO_SITE_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as DemoSiteData;
  } catch {
    return null;
  }
}

export default function DemoPage() {
  const router = useRouter();
  const [data, setData] = useState<DemoSiteData | null>(null);

  // sessionStorage only exists in the browser, so this must run in an
  // effect: the server (and the client's first hydration pass) render
  // null either way, which keeps the two in sync and avoids a mismatch.
  useEffect(() => {
    const stored = readStoredData();
    if (!stored) {
      router.replace("/");
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of a browser-only store on mount, not a cascading update
    setData(stored);
  }, [router]);

  if (!data) return null;

  const mailHref = (subject: string) =>
    `mailto:hola@tuwebsv.com?subject=${encodeURIComponent(subject)}`;

  return (
    <div className="relative min-h-screen bg-paper text-ink">
      {/* Demo badge, visually detached from the fake site */}
      <div className="fixed right-4 top-4 z-50">
        <span className="permit-tag block rounded-sm bg-ink/85 px-3 py-1.5 text-[10px] uppercase tracking-wide text-paper shadow-lg backdrop-blur">
          {data.demo_badge || `${brand.copy.demoBadgePrefix} — así se vería su sitio`}
        </span>
      </div>

      {/* Hero */}
      <section
        className="relative flex min-h-[85vh] flex-col justify-center overflow-hidden px-6 py-24 sm:px-12"
        style={
          data.hero_image_url
            ? undefined
            : { background: heroGradient(data.hero_image_bucket) }
        }
      >
        {data.hero_image_url && (
          <>
            <Image
              src={data.hero_image_url}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-ink/55" />
          </>
        )}

        <div className="relative mx-auto w-full max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-paper/60">
            {brand.name}
          </p>
          <h1 className="mt-6 font-[family-name:var(--font-display)] text-5xl leading-[1.05] text-paper sm:text-6xl">
            {data.headline}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-paper/75">
            {data.subheadline}
          </p>
        </div>
      </section>

      {/* Body sections */}
      <section className="mx-auto max-w-5xl px-6 py-20 sm:px-12">
        <div className="flex flex-col gap-16">
          {data.body_sections.map((section, i) => (
            <div
              key={i}
              className={`flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-12 ${
                i % 2 === 1 ? "sm:flex-row-reverse" : ""
              }`}
            >
              <SectionIconAccent
                title={section.title}
                tone={i % 2 === 0 ? "blueprint" : "paper"}
              />
              <div className="sm:w-3/5">
                <span className="font-mono text-xs uppercase tracking-wide text-graphite">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl text-ink">
                  {section.title}
                </h2>
                <p className="mt-3 leading-relaxed text-graphite">{section.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonial */}
      <section className="bg-paper-dim px-6 py-20 sm:px-12">
        <div className="mx-auto max-w-2xl rounded-sm border border-ink/10 bg-paper p-10 text-center shadow-sm">
          <span className="font-[family-name:var(--font-display)] text-5xl leading-none text-accent">
            &ldquo;
          </span>
          <p className="mt-2 font-[family-name:var(--font-display)] text-xl italic leading-snug text-ink">
            {data.testimonial.quote}
          </p>
          <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-ink">
            {data.testimonial.name}
          </p>
          <p className="text-sm text-graphite">{data.testimonial.role}</p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-ink px-6 py-24 text-center sm:px-12">
        <div className="mx-auto max-w-xl">
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-paper">
            {data.cta.primary}
          </h2>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={mailHref(data.cta.primary)}
              className="rounded-sm bg-accent px-8 py-3 font-semibold text-ink transition hover:brightness-110"
            >
              {data.cta.primary}
            </a>
            <a
              href={mailHref(data.cta.secondary)}
              className="rounded-sm border border-paper/25 px-8 py-3 font-semibold text-paper transition hover:bg-paper/10"
            >
              {data.cta.secondary}
            </a>
          </div>
        </div>
      </section>

      {/* TuWebSV's own conversion element, separate from the fake site */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-paper/10 bg-blueprint/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-6 py-4 sm:flex-row sm:px-12">
          <p className="text-sm text-paper/85">
            {brand.copy.conversionBarText}{" "}
            <span className="text-paper/60">Esto es solo una vista previa.</span>
          </p>
          <a
            href={mailHref(`Quiero un sitio como el demo de ${brand.name}`)}
            className="whitespace-nowrap rounded-sm bg-accent px-5 py-2 text-sm font-semibold text-ink transition hover:brightness-110"
          >
            {brand.copy.conversionBarCta}
          </a>
        </div>
      </div>
    </div>
  );
}

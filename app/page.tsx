"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import BuildLoader from "@/components/BuildLoader";
import { brand } from "@/lib/brand-config";
import { DEMO_SITE_STORAGE_KEY, type DemoSiteData } from "@/lib/types";

const INDUSTRIES = [
  { value: "real_estate", label: "Bienes Raíces" },
  { value: "dental_ortho", label: "Dental / Ortodoncia" },
  { value: "law_firm", label: "Bufete Legal" },
  { value: "other", label: "Otro (especifica)" },
];

type ViewState = "form" | "loading" | "error";

const REQUEST_TIMEOUT_MS = 60000;

export default function GatePage() {
  const router = useRouter();
  const [view, setView] = useState<ViewState>("form");
  const [businessName, setBusinessName] = useState("");
  const [industry, setIndustry] = useState("real_estate");
  const [otherIndustry, setOtherIndustry] = useState("");
  const [done, setDone] = useState(false);

  async function submitLead() {
    setView("loading");
    setDone(false);

    const resolvedIndustry = industry === "other" ? otherIndustry.trim() : industry;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const res = await fetch(brand.webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business_name: businessName.trim(),
          industry: resolvedIndustry,
          brand: brand.id,
        }),
        signal: controller.signal,
      });

      if (!res.ok) throw new Error(`Webhook respondió ${res.status}`);

      const data: DemoSiteData = await res.json();
      setDone(true);
      sessionStorage.setItem(DEMO_SITE_STORAGE_KEY, JSON.stringify(data));
      setTimeout(() => router.push("/demo"), 400);
    } catch {
      setView("error");
    } finally {
      clearTimeout(timeout);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!businessName.trim()) return;
    if (industry === "other" && !otherIndustry.trim()) return;
    void submitLead();
  }

  const isFormValid =
    businessName.trim().length > 0 &&
    (industry !== "other" || otherIndustry.trim().length > 0);

  return (
    <main className="relative flex min-h-screen flex-1 items-center justify-center overflow-hidden bg-blueprint-grid px-6 py-16">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 20%, rgba(255,90,31,0.12), transparent 55%)",
        }}
      />

      <div className="relative w-full max-w-md">
        {view === "form" && (
          <div className="rounded-lg border border-paper/10 bg-ink/70 p-8 shadow-2xl backdrop-blur">
            <span className="permit-tag inline-block rounded-sm px-2 py-1 text-[10px] uppercase text-paper/60">
              {brand.name} · vista previa
            </span>

            <h1 className="mt-4 font-[family-name:var(--font-display)] text-3xl leading-tight text-paper">
              {brand.copy.gateHeadline}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-paper/60">
              {brand.copy.gateSubheadline}
            </p>

            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label htmlFor="business_name" className="text-xs font-medium uppercase tracking-wide text-paper/50">
                  Nombre de tu negocio
                </label>
                <input
                  id="business_name"
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Clínica Dental López"
                  className="rounded-sm border border-paper/15 bg-paper/5 px-4 py-3 text-paper placeholder:text-paper/30 outline-none transition focus:border-accent focus:bg-paper/10"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="industry" className="text-xs font-medium uppercase tracking-wide text-paper/50">
                  Rubro
                </label>
                <select
                  id="industry"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="rounded-sm border border-paper/15 bg-paper/5 px-4 py-3 text-paper outline-none transition focus:border-accent focus:bg-paper/10"
                >
                  {INDUSTRIES.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-ink text-paper">
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {industry === "other" && (
                <div className="flex flex-col gap-2">
                  <label htmlFor="other_industry" className="text-xs font-medium uppercase tracking-wide text-paper/50">
                    Especifica tu rubro
                  </label>
                  <input
                    id="other_industry"
                    type="text"
                    required
                    value={otherIndustry}
                    onChange={(e) => setOtherIndustry(e.target.value)}
                    placeholder="Panadería, taller mecánico, etc."
                    className="rounded-sm border border-paper/15 bg-paper/5 px-4 py-3 text-paper placeholder:text-paper/30 outline-none transition focus:border-accent focus:bg-paper/10"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={!isFormValid}
                className="mt-2 rounded-sm bg-accent px-6 py-3 font-semibold text-ink transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {brand.copy.submitLabel}
              </button>
            </form>
          </div>
        )}

        {view === "loading" && (
          <div className="rounded-lg border border-paper/10 bg-ink/70 p-8 shadow-2xl backdrop-blur">
            <BuildLoader done={done} />
          </div>
        )}

        {view === "error" && (
          <div className="rounded-lg border border-paper/10 bg-ink/70 p-8 text-center shadow-2xl backdrop-blur">
            <span className="permit-tag inline-block rounded-sm px-2 py-1 text-[10px] uppercase text-paper/60">
              Algo salió mal
            </span>
            <h2 className="mt-4 font-[family-name:var(--font-display)] text-2xl text-paper">
              No pudimos construir tu vista previa
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-paper/60">
              Puede que la conexión haya tardado demasiado. Intenta de nuevo, solo toma unos segundos.
            </p>
            <button
              onClick={() => setView("form")}
              className="mt-6 rounded-sm bg-accent px-6 py-3 font-semibold text-ink transition hover:brightness-110"
            >
              Intentar de nuevo
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

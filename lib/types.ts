export type BodySection = {
  title: string;
  body: string;
};

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
};

export type Cta = {
  primary: string;
  secondary: string;
};

export type DemoSiteData = {
  headline: string;
  subheadline: string;
  body_sections: BodySection[];
  testimonial: Testimonial;
  cta: Cta;
  demo_badge: string;
  hero_image_bucket: string;
  source: "seed" | "ai_generated" | "fallback";
};

export type LeadPayload = {
  business_name: string;
  industry: string;
  brand: string;
};

export const DEMO_SITE_STORAGE_KEY = "demoSiteData";

import {
  Calendar,
  Clock,
  Cpu,
  Heart,
  MessageCircle,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  Users,
  Wallet,
  Zap,
  type LucideIcon,
} from "lucide-react";

// Ordered keyword buckets: first match wins, so put more specific
// buckets before broader ones.
const KEYWORD_ICON_MAP: Array<{ keywords: string[]; icon: LucideIcon }> = [
  {
    keywords: ["automátic", "whatsapp", "mensaje", "chat", "responde"],
    icon: MessageCircle,
  },
  {
    keywords: ["rápid", "veloc", "instantán", "al momento"],
    icon: Zap,
  },
  {
    keywords: ["encontrar", "buscar", "ubicaci", "dirección", "mapa", "cerca"],
    icon: Search,
  },
  {
    keywords: ["confianza", "seguro", "garantía", "protec", "respald"],
    icon: ShieldCheck,
  },
  {
    keywords: ["celular", "móvil", "movil", "teléfono", "telefono"],
    icon: Smartphone,
  },
  {
    keywords: ["familia", "cercan", "personal", "cálid", "human"],
    icon: Heart,
  },
  {
    keywords: ["equipo", "personal", "colaborador", "profesional"],
    icon: Users,
  },
  {
    keywords: ["tecnología", "tecnologia", "digital", "equipo digital", "sistema"],
    icon: Cpu,
  },
  {
    keywords: ["cita", "agenda", "calendario", "horario", "reserv"],
    icon: Calendar,
  },
  {
    keywords: ["precio", "costo", "tarifa", "factura", "pago", "inversión", "inversion"],
    icon: Wallet,
  },
  {
    keywords: ["calidad", "experiencia", "reconoc", "premio", "destac"],
    icon: Star,
  },
  {
    keywords: ["tiempo", "ahorra", "eficien", "disponib"],
    icon: Clock,
  },
];

export function matchSectionIcon(title: string): LucideIcon {
  const normalized = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

  for (const bucket of KEYWORD_ICON_MAP) {
    if (bucket.keywords.some((keyword) => normalized.includes(keyword))) {
      return bucket.icon;
    }
  }

  return Sparkles;
}

export type Classification = "normal" | "wasted" | "severely_wasted";

export interface ResultData {
  classification: Classification;
  confidence_pct: number;
  message_english: string;
  message_kinyarwanda: string;
  action: string;
  advice_english?: string;
  advice_kinyarwanda?: string;
  childName?: string;
}

export const RESULT_THEME = {
  normal: { title: "#1f9d57", hero: "from-[#e9f8ef] to-[#d8f3e2]", circle: "bg-brand-green", icon: "✓", border: "border-brand-green", btn: "btn-primary" },
  wasted: { title: "#c97f17", hero: "from-[#fdf3e3] to-[#fbe7c9]", circle: "bg-brand-amber", icon: "!", border: "border-brand-amber", btn: "btn-primary" },
  severely_wasted: { title: "#c4392a", hero: "from-[#fdeeea] to-[#fce3dc]", circle: "bg-brand-red", icon: "!", border: "border-brand-red", btn: "btn-red" },
} as const;

// Mirrors the backend's per-class messages so a stored screening can be
// re-rendered later (the texts are deterministic per classification).
const MESSAGES: Record<Classification, { en: string; rw: string; action: string; advice_en: string; advice_rw: string }> = {
  normal: {
    en: "Child's nutritional status is normal.",
    rw: "Imirire y'umwana iri mu buryo bwiza.",
    action: "Continue routine growth monitoring. Next visit in 4 weeks.",
    advice_en:
      "Keep feeding a balanced diet — vegetables, fruits, beans, eggs, milk, and energy foods like sweet potato and rice. Continue breastfeeding where appropriate and keep monitoring growth.",
    advice_rw:
      "Komeza guha umwana indyo yuzuye — imboga, imbuto, ibishyimbo, amagi, amata, n'ibitanga ingufu nk'ibijumba n'umuceri. Komeza konsa bibaye ngombwa, ukomeze ukurikirane imikurire.",
  },
  wasted: {
    en: "Child shows signs of wasting. Nutritional support recommended.",
    rw: "Umwana agaragaza ibimenyetso by'imirire mibi. Gufasha imirire birasabwa.",
    action: "Refer to health centre for supplementary feeding. Follow up in 2 weeks.",
    advice_en:
      "Feed energy- and protein-rich foods more often: porridge enriched with oil or groundnuts, beans, eggs, avocado, milk, fish, and plenty of vegetables. Add a healthy snack between the main meals.",
    advice_rw:
      "Ha umwana ibiribwa bitanga ingufu na poroteyine kenshi: igikoma kivanze n'amavuta cyangwa ubunyobwa, ibishyimbo, amagi, avoka, amata, amafi, n'imboga nyinshi. Wongereho utunyamafunguro hagati y'amafunguro.",
  },
  severely_wasted: {
    en: "Child is severely wasted. Urgent referral required.",
    rw: "Umwana afite ubuzima bubi cyane bw'imirire. Kohereza ku bitaro vuba.",
    action: "URGENT: Refer immediately to health facility for therapeutic feeding.",
    advice_en:
      "Urgent: start therapeutic feeding (RUTF / Plumpy'Nut) under a health worker, keep breastfeeding, and give small energy-dense meals often. Continue giving vegetables, eggs and milk once the child can eat.",
    advice_rw:
      "Byihutirwa: tangira kugaburira umwana ibiribwa bivura (RUTF / Plumpy'Nut) ukurikije inama z'umuganga, komeza konsa, umuhe utunyamafunguro twinshi dutanga ingufu. Komeza umuhe imboga, amagi n'amata igihe ashobora kurya.",
  },
};

export function buildResult(classification: string, confidence: number, childName?: string): ResultData {
  const c = (["normal", "wasted", "severely_wasted"].includes(classification)
    ? classification
    : "severely_wasted") as Classification;
  const m = MESSAGES[c];
  return {
    classification: c,
    confidence_pct: confidence,
    message_english: m.en,
    message_kinyarwanda: m.rw,
    action: m.action,
    advice_english: m.advice_en,
    advice_kinyarwanda: m.advice_rw,
    childName,
  };
}

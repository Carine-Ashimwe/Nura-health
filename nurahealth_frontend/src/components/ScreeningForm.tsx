"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

interface Child {
  id: string;
  name: string;
  sex: number;
  ageMonths: number;
}

export default function ScreeningForm() {
  const t = useTranslations("screening");
  const router = useRouter();
  const params = useSearchParams();
  const [children, setChildren] = useState<Child[]>([]);
  const [childId, setChildId] = useState(params.get("childId") || "");
  const [v, setV] = useState({ weight: "", height: "", muac: "", age: "", sex: "0" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/children")
      .then((r) => r.json())
      .then((d) => setChildren(d.children || []))
      .catch(() => {});
  }, []);

  // Prefill age + sex from the selected child.
  useEffect(() => {
    const c = children.find((c) => c.id === childId);
    if (c) setV((s) => ({ ...s, age: String(c.ageMonths), sex: String(c.sex) }));
  }, [childId, children]);

  function set<K extends keyof typeof v>(k: K, val: string) {
    setV((s) => ({ ...s, [k]: val }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!childId) return setError(t("chooseChild"));
    const payload = {
      weight_kg: parseFloat(v.weight),
      height_cm: parseFloat(v.height),
      muac_mm: parseFloat(v.muac),
      age_months: parseInt(v.age, 10),
      sex: parseInt(v.sex, 10),
    };
    if ([payload.weight_kg, payload.height_cm, payload.muac_mm, payload.age_months].some(Number.isNaN)) {
      return setError(t("invalid"));
    }
    setLoading(true);
    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.detail || `Request failed (${res.status})`);
      }
      const result = await res.json();

      // Persist the screening against the child (best-effort).
      await fetch("/api/screenings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ childId, ...payload, classification: result.classification, confidence_pct: result.confidence_pct }),
      }).catch(() => {});

      const child = children.find((c) => c.id === childId);
      sessionStorage.setItem("nura_result", JSON.stringify({ ...result, childName: child?.name }));
      router.push("/result");
    } catch (err) {
      setError(`${t("error")}: ${err instanceof Error ? err.message : ""}`);
      setLoading(false);
    }
  }

  return (
    <main className="screen bg-mint pb-10">
      <div className="flex items-center gap-3.5 px-[26px] pt-14">
        <button onClick={() => router.push("/home")} className="flex h-[42px] w-[42px] items-center justify-center rounded-[13px] bg-white text-[20px] shadow-[0_8px_18px_rgba(23,70,62,0.08)] dark:bg-[#1d2b28]">←</button>
        <div>
          <div className="text-[22px] font-bold">{t("title")}</div>
          <div className="text-[13px] text-muted">{t("subtitle")}</div>
        </div>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-4 px-[26px] pt-6">
        <div>
          <label className="label block">{t("child")}</label>
          {children.length === 0 ? (
            <Link href="/patients/new" className="flex h-14 items-center justify-between rounded-2xl border border-dashed border-teal-600/50 bg-white px-[18px] text-[14px] font-semibold text-teal-700 dark:bg-[#16221f] dark:text-teal-500">
              {t("noChildren")} <span>＋ {t("addChild")}</span>
            </Link>
          ) : (
            <select className="field" value={childId} onChange={(e) => setChildId(e.target.value)}>
              <option value="">{t("selectChild")}</option>
              {children.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label className="label block">{t("weight")}</label>
          <div className="relative">
            <input className="field" type="number" step="0.1" min="0" value={v.weight} onChange={(e) => set("weight", e.target.value)} placeholder="8.3" required />
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[13px] text-muted">kg</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3.5">
          <div className="min-w-0">
            <label className="label block">{t("height")}</label>
            <div className="relative">
              <input className="field" type="number" step="0.1" min="0" value={v.height} onChange={(e) => set("height", e.target.value)} placeholder="70.6" required />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[13px] text-muted">cm</span>
            </div>
          </div>
          <div className="min-w-0">
            <label className="label block">{t("muac")}</label>
            <div className="relative">
              <input className="field" type="number" step="0.1" min="0" value={v.muac} onChange={(e) => set("muac", e.target.value)} placeholder="10.2" required />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[13px] text-muted">mm</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3.5">
          <div className="min-w-0">
            <label className="label block">{t("age")}</label>
            <div className="relative">
              <input className="field" type="number" step="1" min="0" max="59" value={v.age} onChange={(e) => set("age", e.target.value)} placeholder="18" required />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[13px] text-muted">mo</span>
            </div>
          </div>
          <div className="min-w-0">
            <label className="label block">{t("sex")}</label>
            <select className="field" value={v.sex} onChange={(e) => set("sex", e.target.value)}>
              <option value="0">{t("male")}</option>
              <option value="1">{t("female")}</option>
            </select>
          </div>
        </div>

        <div className="card mt-1 flex items-start gap-3 bg-[#eaf6f2] p-4 shadow-none dark:bg-[#15302b]">
          <span className="text-[18px] text-teal-600">ⓘ</span>
          <span className="text-[13px] leading-relaxed text-teal-900 dark:text-[#bfe3da]">{t("info")}</span>
        </div>

        {error && <div className="rounded-2xl bg-[#fdeeea] px-4 py-3 text-[13px] text-[#c4392a]">{error}</div>}

        <button type="submit" disabled={loading} className="btn btn-primary mt-2 rounded-[20px] disabled:opacity-70">
          {loading ? t("analysing") : `${t("analyse")}  →`}
        </button>
      </form>
    </main>
  );
}

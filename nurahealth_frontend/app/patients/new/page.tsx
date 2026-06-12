"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function NewChildPage() {
  const t = useTranslations("addChild");
  const router = useRouter();
  const [form, setForm] = useState({ name: "", sex: "0", ageMonths: "", caregiver: "", village: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function set<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (form.name.trim().length < 1) return setError(t("nameRequired"));
    setLoading(true);
    try {
      const res = await fetch("/api/children", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          sex: Number(form.sex),
          ageMonths: Number(form.ageMonths || 0),
          caregiver: form.caregiver,
          village: form.village,
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.detail || "Could not save");
      }
      const { child } = await res.json();
      router.push(`/screening?childId=${child.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save");
      setLoading(false);
    }
  }

  return (
    <main className="screen bg-mint pb-10">
      <div className="flex items-center gap-3.5 px-[26px] pt-14">
        <button onClick={() => router.push("/patients")} className="flex h-[42px] w-[42px] items-center justify-center rounded-[13px] bg-white text-[20px] shadow-[0_8px_18px_rgba(23,70,62,0.08)] dark:bg-[#1d2b28]">←</button>
        <div>
          <div className="text-[22px] font-bold">{t("title")}</div>
          <div className="text-[13px] text-muted">{t("subtitle")}</div>
        </div>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-4 px-[26px] pt-6">
        <div>
          <label className="label block">{t("name")}</label>
          <input className="field" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Mugisha Keza" required />
        </div>
        <div className="grid grid-cols-2 gap-3.5">
          <div className="min-w-0">
            <label className="label block">{t("sex")}</label>
            <select className="field" value={form.sex} onChange={(e) => set("sex", e.target.value)}>
              <option value="0">{t("male")}</option>
              <option value="1">{t("female")}</option>
            </select>
          </div>
          <div className="min-w-0">
            <label className="label block">{t("age")}</label>
            <input className="field" type="number" min="0" max="59" value={form.ageMonths} onChange={(e) => set("ageMonths", e.target.value)} placeholder="18" required />
          </div>
        </div>
        <div>
          <label className="label block">{t("caregiver")}</label>
          <input className="field" value={form.caregiver} onChange={(e) => set("caregiver", e.target.value)} placeholder="Uwimana Jeanne" />
        </div>
        <div>
          <label className="label block">{t("village")}</label>
          <input className="field" value={form.village} onChange={(e) => set("village", e.target.value)} placeholder="Gasabo" />
        </div>

        {error && <div className="rounded-2xl bg-[#fdeeea] px-4 py-3 text-[13px] text-[#c4392a]">{error}</div>}

        <button type="submit" disabled={loading} className="btn btn-primary mt-2 rounded-[20px] disabled:opacity-70">
          {loading ? t("saving") : t("save")}
        </button>
      </form>
    </main>
  );
}

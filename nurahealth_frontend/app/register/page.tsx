"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import LocationPicker from "@/components/LocationPicker";

export default function RegisterPage() {
  const t = useTranslations("register");
  const router = useRouter();
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    province: "",
    district: "",
    sector: "",
    cell: "",
    village: "",
    reporting_facility: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (form.full_name.trim().length < 2) return setError("Please enter your full name.");
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.detail || "Registration failed");
      }
      router.push("/home");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
      setLoading(false);
    }
  }

  return (
    <main className="screen bg-teal">
      <div className="pointer-events-none absolute -right-[120px] -top-[120px] h-[360px] w-[360px] rounded-full bg-white/[0.18]" />
      <div className="pointer-events-none absolute -left-[130px] top-[60px] h-[260px] w-[260px] rounded-full bg-white/[0.12]" />

      <div className="px-8 pt-16 text-white">
        <div className="text-[30px] font-bold tracking-tight">{t("title")}</div>
        <div className="mt-1.5 text-[15px] opacity-85">{t("subtitle")}</div>
      </div>

      <form onSubmit={onSubmit} className="sheet mt-auto flex max-h-[72dvh] flex-col gap-3.5 overflow-y-auto px-[30px] pb-8 pt-7">
        <div>
          <label className="label block">{t("fullName")}</label>
          <input className="field" type="text" value={form.full_name} onChange={(e) => set("full_name", e.target.value)} placeholder="Jeanne Uwimana" required />
        </div>
        <div>
          <label className="label block">{t("email")}</label>
          <input className="field" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="jeanne.chw@nura.rw" required />
        </div>

        <LocationPicker
          value={{ province: form.province, district: form.district, sector: form.sector, cell: form.cell, village: form.village }}
          onChange={(loc) => setForm((f) => ({ ...f, ...loc }))}
        />
        <div>
          <label className="label block">{t("reportingFacility")}</label>
          <input className="field" value={form.reporting_facility} onChange={(e) => set("reporting_facility", e.target.value)} placeholder="Kimironko Health Centre" />
        </div>

        <div>
          <label className="label block">{t("password")}</label>
          <input className="field" type="password" value={form.password} onChange={(e) => set("password", e.target.value)} placeholder={t("passwordHint")} required />
        </div>

        {error && <div className="rounded-2xl bg-[#fdeeea] px-4 py-3 text-[13px] text-[#c4392a]">{error}</div>}

        <button type="submit" disabled={loading} className="btn btn-primary mt-1 rounded-full disabled:opacity-70">
          {loading ? t("creating") : t("signup")}
        </button>

        <div className="pb-2 text-center text-[14px] text-muted">
          {t("haveAccount")}{" "}
          <Link href="/login" className="font-bold text-teal-700 dark:text-teal-500">
            {t("login")}
          </Link>
        </div>
      </form>
    </main>
  );
}

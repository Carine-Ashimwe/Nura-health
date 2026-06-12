"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import LocationPicker from "@/components/LocationPicker";
import { useFeedback, setFlash } from "@/components/Feedback";

export interface ProfileInitial {
  fullName: string;
  email: string;
  province: string;
  district: string;
  sector: string;
  cell: string;
  village: string;
  reportingFacility: string;
}

export default function ProfileForm({ initial }: { initial: ProfileInitial }) {
  const t = useTranslations("profile");
  const router = useRouter();
  const { confirm } = useFeedback();
  const [form, setForm] = useState({
    full_name: initial.fullName,
    province: initial.province,
    district: initial.district,
    sector: initial.sector,
    cell: initial.cell,
    village: initial.village,
    reporting_facility: initial.reportingFacility,
    password: "",
  });
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function set<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMsg("");
    setLoading(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.detail || "Could not save");
      }
      setMsg(t("saved"));
      setForm((f) => ({ ...f, password: "" }));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save");
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    const ok = await confirm({
      message: t("confirmLogout"),
      confirmText: t("logout"),
      cancelText: t("cancel"),
      danger: true,
    });
    if (!ok) return;
    await fetch("/api/auth/logout", { method: "POST" });
    setFlash(t("logoutSuccess"));
    router.push("/login");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3.5 px-[26px] pt-6">
      <div>
        <label className="label block">{t("fullName")}</label>
        <input className="field" value={form.full_name} onChange={(e) => set("full_name", e.target.value)} required />
      </div>
      <div>
        <label className="label block">{t("email")}</label>
        <input className="field opacity-70" value={initial.email} readOnly disabled />
      </div>

      <LocationPicker
        value={{ province: form.province, district: form.district, sector: form.sector, cell: form.cell, village: form.village }}
        onChange={(loc) => setForm((f) => ({ ...f, ...loc }))}
      />
      <div>
        <label className="label block">{t("reportingFacility")}</label>
        <input className="field" value={form.reporting_facility} onChange={(e) => set("reporting_facility", e.target.value)} />
      </div>

      <div>
        <label className="label block">{t("newPassword")}</label>
        <input className="field" type="password" value={form.password} onChange={(e) => set("password", e.target.value)} placeholder={t("passwordHint")} />
      </div>

      {error && <div className="rounded-2xl bg-[#fdeeea] px-4 py-3 text-[13px] text-[#c4392a]">{error}</div>}
      {msg && <div className="rounded-2xl bg-[#e9f8ef] px-4 py-3 text-[13px] text-[#1f9d57]">{msg}</div>}

      <button type="submit" disabled={loading} className="btn btn-primary mt-1 rounded-[20px] disabled:opacity-70">
        {loading ? t("saving") : t("save")}
      </button>
      <button type="button" onClick={logout} className="btn btn-ghost rounded-[20px]">
        {t("logout")}
      </button>
    </form>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { setFlash } from "@/components/Feedback";

export default function LoginPage() {
  const t = useTranslations("login");
  const router = useRouter();
  const [email, setEmail] = useState("demo.chw@nura.rw");
  const [password, setPassword] = useState("Demo@12345");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.detail || "Login failed");
      }
      setFlash(t("loginSuccess"));
      router.push("/home");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      setLoading(false);
    }
  }

  return (
    <main className="screen bg-teal">
      <div className="pointer-events-none absolute -right-[120px] -top-[120px] h-[360px] w-[360px] rounded-full bg-white/[0.18]" />
      <div className="pointer-events-none absolute -left-[130px] top-[60px] h-[260px] w-[260px] rounded-full bg-white/[0.12]" />

      <div className="px-8 pt-20 text-white">
        <div className="text-[34px] font-bold tracking-tight">{t("welcome")}</div>
        <div className="mt-2 text-[15px] opacity-85">{t("subtitle")}</div>
      </div>

      <form onSubmit={onSubmit} className="sheet mt-auto px-[30px] pb-8 pt-9">
        <label className="label block">{t("email")}</label>
        <input className="field mb-4" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label className="label block">{t("password")}</label>
        <input className="field mb-4" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <div className="mb-4 flex items-center gap-2.5 text-[13px] text-muted">
          <span className="flex h-5 w-5 items-center justify-center rounded-md border-2 border-teal-600 text-[12px] text-teal-700">✓</span>
          {t("remember")}
        </div>

        {error && <div className="mb-3 rounded-2xl bg-[#fdeeea] px-4 py-3 text-[13px] text-[#c4392a]">{error}</div>}

        <button type="submit" disabled={loading} className="btn btn-primary rounded-full disabled:opacity-70">
          {loading ? t("signingIn") : t("login")}
        </button>

        <div className="mt-5 text-center text-[14px] text-muted">
          {t("noAccount")}{" "}
          <Link href="/register" className="font-bold text-teal-700 dark:text-teal-500">
            {t("signup")}
          </Link>
        </div>
      </form>
    </main>
  );
}

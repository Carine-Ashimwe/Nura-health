"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function SplashPage() {
  const router = useRouter();
  const t = useTranslations("splash");

  useEffect(() => {
    const id = setTimeout(() => router.push("/onboarding"), 1800);
    return () => clearTimeout(id);
  }, [router]);

  return (
    <main
      className="screen bg-mint cursor-pointer items-center justify-center"
      onClick={() => router.push("/onboarding")}
    >
      <div className="flex flex-1 flex-col items-center justify-center">
        <svg width="120" height="146" viewBox="0 0 96 116" fill="none" className="drop-shadow-[0_10px_22px_rgba(47,111,100,0.25)]">
          <defs>
            <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#4ca596" />
              <stop offset="1" stopColor="#2f6f64" />
            </linearGradient>
          </defs>
          <path d="M48 6 C48 6 14 44 14 72 a34 34 0 0 0 68 0 C82 44 48 6 48 6 Z" fill="none" stroke="url(#g)" strokeWidth="6.5" />
          <polyline points="26,74 39,74 45,58 54,90 60,72 72,72" fill="none" stroke="#3c8478" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div className="mt-7 text-[34px] font-bold tracking-tight text-teal-900 dark:text-[#cfeee7]">Nura Health</div>
        <div className="mt-2.5 text-[12px] font-semibold uppercase tracking-[3px] text-teal-600">{t("tagline")}</div>
      </div>
      <div className="pb-24 text-center text-[13px] text-muted">{t("edition")}</div>
    </main>
  );
}

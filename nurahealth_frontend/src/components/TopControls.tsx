"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";

export default function TopControls() {
  const locale = useLocale();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("nura_theme", next ? "dark" : "light");
    } catch {}
  }

  function toggleLang() {
    const next = locale === "rw" ? "en" : "rw";
    // Persist the choice and reload so the server renders the new locale.
    document.cookie = `NURA_LOCALE=${next}; path=/; max-age=${60 * 60 * 24 * 365}`;
    window.location.reload();
  }

  const btn =
    "flex h-9 min-w-9 items-center justify-center rounded-full border border-black/10 bg-white/70 px-3 text-[14px] font-bold text-teal-900 shadow-sm backdrop-blur-md dark:border-white/15 dark:bg-[#16221f]/80 dark:text-[#dcece7]";

  return (
    <div className="fixed right-3 top-3 z-[9999] flex gap-2">
      <button onClick={toggleLang} className={btn} aria-label="Switch language">
        {/* shows the language you will switch TO */}
        {locale === "rw" ? "EN" : "RW"}
      </button>
      <button onClick={toggleTheme} className={btn} aria-label="Switch theme">
        {dark ? "☀️" : "🌙"}
      </button>
    </div>
  );
}

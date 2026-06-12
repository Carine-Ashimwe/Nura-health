"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

function Icon({ name }: { name: "home" | "patients" | "screenings" | "profile" }) {
  const c = "h-6 w-6";
  if (name === "home")
    return (
      <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" />
      </svg>
    );
  if (name === "patients")
    return (
      <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="8" r="3.2" /><path d="M3.5 20a5.5 5.5 0 0 1 11 0" /><path d="M16 6.2a3 3 0 0 1 0 5.6" /><path d="M17.5 20a5.2 5.2 0 0 0-3-4.7" />
      </svg>
    );
  if (name === "screenings")
    return (
      <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="3.5" width="14" height="17" rx="2.5" /><path d="M9 3.5h6v2.4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1z" /><path d="M8.5 12l2 2 4-4.2" />
      </svg>
    );
  return (
    <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="3.6" /><path d="M5 20a7 7 0 0 1 14 0" />
    </svg>
  );
}

export default function BottomNav() {
  const pathname = usePathname();
  const t = useTranslations("nav");
  const active = (href: string) => pathname === href || pathname.startsWith(href + "/");
  const cls = (href: string) =>
    `flex flex-col items-center gap-0.5 text-[10px] font-semibold ${
      active(href) ? "text-teal-700 dark:text-teal-500" : "text-[#9fb3ad] dark:text-[#5f726d]"
    }`;

  return (
    <nav className="fixed bottom-0 left-1/2 z-40 flex h-[84px] w-full max-w-[480px] -translate-x-1/2 items-center justify-around rounded-t-[26px] bg-white px-4 pb-4 shadow-[0_-10px_30px_rgba(20,60,52,0.08)] dark:bg-[#16221f]">
      <Link href="/home" className={cls("/home")}>
        <Icon name="home" />
        {t("home")}
      </Link>
      <Link href="/patients" className={cls("/patients")}>
        <Icon name="patients" />
        {t("patients")}
      </Link>
      <Link
        href="/screening"
        className="-mt-7 flex h-[56px] w-[56px] items-center justify-center rounded-[18px] bg-teal-700 text-white shadow-[0_12px_22px_rgba(47,111,100,0.35)]"
        aria-label={t("screen")}
      >
        <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
      </Link>
      <Link href="/screenings" className={cls("/screenings")}>
        <Icon name="screenings" />
        {t("screenings")}
      </Link>
      <Link href="/profile" className={cls("/profile")}>
        <Icon name="profile" />
        {t("profile")}
      </Link>
    </nav>
  );
}

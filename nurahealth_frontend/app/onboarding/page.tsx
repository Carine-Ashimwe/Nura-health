"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

function Art1() {
  return (
    <svg width="220" height="210" viewBox="0 0 260 250" fill="none">
      <path d="M130 212 C40 150 58 70 110 70 c20 0 28 14 20 28 8-14 16-28 36-28 52 0 70 80 -36 142 Z" fill="#ffffff" opacity="0.96" />
      <polyline points="64,150 104,150 116,118 134,176 146,140 168,140" fill="none" stroke="#3c8478" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Art2() {
  return (
    <svg width="220" height="210" viewBox="0 0 240 230" fill="none">
      <rect x="58" y="42" width="124" height="150" rx="20" fill="#ffffff" opacity="0.96" />
      <rect x="94" y="30" width="52" height="26" rx="9" fill="#cdeee6" />
      <circle cx="120" cy="96" r="19" fill="#4ca596" />
      <path d="M95 146 a25 25 0 0 1 50 0 z" fill="#4ca596" />
      <rect x="82" y="162" width="76" height="9" rx="4.5" fill="#cfe7e2" />
      <rect x="96" y="178" width="48" height="9" rx="4.5" fill="#dcefe9" />
    </svg>
  );
}

function Art3() {
  return (
    <svg width="220" height="210" viewBox="0 0 240 230" fill="none">
      <path d="M52 122 a68 68 0 0 0 136 0 Z" fill="#ffffff" opacity="0.96" />
      <ellipse cx="120" cy="122" rx="68" ry="13" fill="#ffffff" />
      <path d="M122 112 c-7 -30 15 -48 38 -48 c-2 28 -14 48 -38 48 Z" fill="#7fd3c2" />
      <path d="M122 112 c5 -19 -9 -33 -24 -33 c0 19 9 33 24 33 Z" fill="#4ca596" />
    </svg>
  );
}

export default function OnboardingPage() {
  const t = useTranslations("onboarding");
  const router = useRouter();
  const [step, setStep] = useState(0);

  const slides = [
    { title: t("title1"), body: t("body1"), art: <Art1 /> },
    { title: t("title2"), body: t("body2"), art: <Art2 /> },
    { title: t("title3"), body: t("body3"), art: <Art3 /> },
  ];
  const s = slides[step];
  const last = step === slides.length - 1;

  function next() {
    if (last) router.push("/login");
    else setStep((v) => v + 1);
  }

  return (
    <main className="screen bg-teal">
      <div className="pointer-events-none absolute -right-[120px] -top-[120px] h-[360px] w-[360px] rounded-full bg-white/[0.18]" />
      <div className="pointer-events-none absolute -left-[130px] top-[60px] h-[260px] w-[260px] rounded-full bg-white/[0.12]" />

      <button onClick={() => router.push("/login")} className="absolute left-5 top-4 z-20 text-[14px] font-semibold text-white/85">
        {t("skip")}
      </button>

      <div className="mt-20 flex justify-center">{s.art}</div>

      <div className="sheet mt-auto px-[30px] pb-8 pt-10">
        <div className="mb-6 flex justify-center gap-2">
          {slides.map((_, i) => (
            <span
              key={i}
              className={`h-[7px] rounded transition-all duration-300 ${i === step ? "w-[22px] bg-teal-700" : "w-[7px] bg-[#cdd6d2]"}`}
            />
          ))}
        </div>
        <h1 className="text-center text-[26px] font-bold tracking-tight">{s.title}</h1>
        <p className="mx-6 mt-3.5 text-center text-[15px] leading-relaxed text-muted">{s.body}</p>
        <button onClick={next} className="btn btn-primary mt-7 w-full rounded-full">
          {last ? t("getStarted") : t("continue")}
        </button>
      </div>
    </main>
  );
}

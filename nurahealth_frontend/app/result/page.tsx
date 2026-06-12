"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import ResultView from "@/components/ResultView";
import { useFeedback } from "@/components/Feedback";
import { RESULT_THEME, type ResultData } from "@/lib/results";

export default function ResultPage() {
  const t = useTranslations("result");
  const router = useRouter();
  const { toast } = useFeedback();
  const [r, setR] = useState<ResultData | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("nura_result");
    if (!raw) {
      router.replace("/screening");
      return;
    }
    setR(JSON.parse(raw));
  }, [router]);

  if (!r) return <main className="screen bg-mint" />;
  const theme = RESULT_THEME[r.classification] ?? RESULT_THEME.severely_wasted;

  async function save() {
    toast(t("saved"));
    router.push("/home");
  }

  return (
    <main className="screen bg-mint pb-32">
      <div className="flex items-center gap-3.5 px-[26px] pt-14">
        <button onClick={() => router.push("/home")} className="flex h-[42px] w-[42px] items-center justify-center rounded-[13px] bg-white text-[20px] shadow-[0_8px_18px_rgba(23,70,62,0.08)] dark:bg-[#1d2b28]">←</button>
        <div>
          <div className="text-[22px] font-bold">{t("title")}</div>
          {r.childName && <div className="text-[13px] text-muted">{r.childName}</div>}
        </div>
      </div>

      <ResultView result={r} />

      <div className="absolute inset-x-[26px] bottom-10 flex flex-col gap-3">
        <button onClick={save} className={`btn ${theme.btn} rounded-[18px]`}>{t("refer")}</button>
        <button onClick={() => router.push("/screening")} className="btn btn-ghost rounded-[18px]">{t("newScreening")}</button>
      </div>
    </main>
  );
}

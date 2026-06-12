"use client";

import { useTranslations } from "next-intl";
import { RESULT_THEME, type ResultData } from "@/lib/results";

export default function ResultView({ result: r }: { result: ResultData }) {
  const t = useTranslations("result");
  const theme = RESULT_THEME[r.classification] ?? RESULT_THEME.severely_wasted;

  return (
    <>
      <div className="px-[26px] pt-5">
        <div className={`card bg-gradient-to-b ${theme.hero} p-7 text-center`}>
          <div className={`mx-auto mb-4 flex h-[74px] w-[74px] items-center justify-center rounded-full ${theme.circle}`}>
            <span className="text-[38px] font-extrabold text-white">{theme.icon}</span>
          </div>
          <div className="text-[24px] font-extrabold tracking-wide" style={{ color: theme.title }}>
            {t(r.classification)}
          </div>
          <div className="mt-2.5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-[7px] text-[14px] font-bold" style={{ color: theme.title }}>
            {t("confidence")} {r.confidence_pct}%
          </div>
        </div>
      </div>

      <div className="px-[26px] pt-5">
        <div className="mb-2 text-[15px] font-bold">{t("means")}</div>
        <div className="card p-4">
          <div className="text-[14px] leading-relaxed">{r.message_kinyarwanda}</div>
          <div className="mt-2 text-[12.5px] leading-relaxed text-muted">{r.message_english}</div>
        </div>
      </div>

      <div className="px-[26px] pt-4">
        <div className="mb-2 text-[15px] font-bold">{t("action")}</div>
        <div className={`card flex items-start gap-3 border-l-[5px] p-4 ${theme.border}`}>
          <span className="text-[18px]" style={{ color: theme.title }}>⚠</span>
          <span className="text-[14px] leading-relaxed">{r.action}</span>
        </div>
      </div>

      {r.advice_kinyarwanda && (
        <div className="px-[26px] pt-4">
          <div className="mb-2 flex items-center gap-2 text-[15px] font-bold">
            <span>🍲</span> {t("advice")}
          </div>
          <div className="card bg-[#eef7f3] p-4 shadow-none dark:bg-[#15302b]">
            <div className="text-[14px] leading-relaxed">{r.advice_kinyarwanda}</div>
            {r.advice_english && (
              <div className="mt-2 text-[12.5px] leading-relaxed text-muted">{r.advice_english}</div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

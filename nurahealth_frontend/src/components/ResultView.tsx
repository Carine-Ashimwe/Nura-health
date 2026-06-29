"use client";

import { useTranslations } from "next-intl";
import { RESULT_THEME, FOLLOWUP_DAYS, type ResultData } from "@/lib/results";
import {
  ShieldCheckIcon,
  MegaphoneIcon,
  InfoIcon,
  BabyIcon,
  AlertTriangleIcon,
  BowlIcon,
  CalendarIcon,
  ChevronRightIcon,
} from "@/components/icons";

export default function ResultView({ result: r }: { result: ResultData }) {
  const t = useTranslations("result");
  const theme = RESULT_THEME[r.classification] ?? RESULT_THEME.severely_wasted;
  const followupDays = FOLLOWUP_DAYS[r.classification] ?? FOLLOWUP_DAYS.severely_wasted;

  return (
    <>
      {/* Hero: status + confidence + urgent banner */}
      <div className="px-[26px] pt-5">
        <div className={`card overflow-hidden bg-gradient-to-b ${theme.hero}`}>
          <div className="flex items-center gap-5 p-6">
            <div className={`flex h-[74px] w-[74px] shrink-0 items-center justify-center rounded-full ${theme.circle}`}>
              <span className="text-[38px] font-extrabold leading-none text-white">{theme.icon}</span>
            </div>
            <div className="min-w-0">
              <div className="text-[12.5px] font-bold" style={{ color: theme.title }}>
                {t("title")}
              </div>
              <div className="text-[24px] font-extrabold leading-tight tracking-wide" style={{ color: theme.title }}>
                {t(r.classification)}
              </div>
              <div
                className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-[6px] text-[13px] font-bold shadow-sm"
                style={{ color: theme.title }}
              >
                <ShieldCheckIcon className="h-4 w-4" />
                {t("confidence")} {r.confidence_pct}%
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 border-t border-white/60 px-6 py-4 dark:border-white/10">
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${theme.softCircle}`}>
              <MegaphoneIcon className="h-[18px] w-[18px]" style={{ color: theme.title }} />
            </div>
            <div className="text-[13.5px] font-semibold leading-snug" style={{ color: theme.title }}>
              {t(`banner_${r.classification}`)}
            </div>
          </div>
        </div>
      </div>

      {/* What this means */}
      <div className="px-[26px] pt-5">
        <div className="mb-2 flex items-center gap-2 text-[15px] font-bold">
          <InfoIcon className="h-[18px] w-[18px] text-brand-green" /> {t("means")}
        </div>
        <div className="card flex items-start gap-3 p-4">
          <div className="min-w-0 flex-1">
            <div className="text-[14px] leading-relaxed">{r.message_kinyarwanda}</div>
            <div className="mt-2 text-[12.5px] leading-relaxed text-muted">{r.message_english}</div>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#eef7f3] dark:bg-[#15302b]">
            <BabyIcon className="h-6 w-6 text-brand-green" />
          </div>
        </div>
      </div>

      {/* Recommended action */}
      <div className="px-[26px] pt-4">
        <div className="mb-2 flex items-center gap-2 text-[15px] font-bold">
          <AlertTriangleIcon className="h-[18px] w-[18px]" style={{ color: theme.title }} /> {t("action")}
        </div>
        <div className={`card flex items-center gap-3 border-l-[5px] p-4 ${theme.border}`}>
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${theme.softCircle}`}>
            <AlertTriangleIcon className="h-5 w-5" style={{ color: theme.title }} />
          </div>
          <span className="min-w-0 flex-1 text-[14px] leading-relaxed">{r.action}</span>
          <ChevronRightIcon className="h-5 w-5 shrink-0 text-muted" />
        </div>
      </div>

      {/* Nutrition advice */}
      {r.advice_kinyarwanda && (
        <div className="px-[26px] pt-4">
          <div className="mb-2 flex items-center gap-2 text-[15px] font-bold">
            <BowlIcon className="h-[18px] w-[18px] text-brand-green" /> {t("advice")}
          </div>
          <div className="card flex items-start gap-3 bg-[#eef7f3] p-4 shadow-none dark:bg-[#15302b]">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-green">
              <BowlIcon className="h-6 w-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[14px] leading-relaxed">{r.advice_kinyarwanda}</div>
              {r.advice_english && (
                <div className="mt-2 text-[12.5px] leading-relaxed text-muted">{r.advice_english}</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Follow-up footer */}
      <div className="px-[26px] pt-4">
        <div className="card flex items-center gap-3 bg-[#eef7f3] p-4 shadow-none dark:bg-[#15302b]">
          <ShieldCheckIcon className="h-5 w-5 shrink-0 text-brand-green" />
          <span className="min-w-0 flex-1 text-[12.5px] leading-relaxed text-muted">
            {t("followUp", { days: followupDays })}
          </span>
          <CalendarIcon className="h-5 w-5 shrink-0 text-brand-green" />
        </div>
      </div>
    </>
  );
}

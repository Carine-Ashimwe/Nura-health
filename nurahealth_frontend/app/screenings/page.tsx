import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import BottomNav from "@/components/BottomNav";
import SearchBar from "@/components/SearchBar";

const STYLES: Record<string, { letter: string; bg: string; color: string }> = {
  normal: { letter: "N", bg: "bg-[#e9f8ef] dark:bg-[#16302433]", color: "text-[#1f9d57]" },
  wasted: { letter: "W", bg: "bg-[#fdf1e0] dark:bg-[#3a2c1333]", color: "text-[#c97f17]" },
  severely_wasted: { letter: "S", bg: "bg-[#fdeeea] dark:bg-[#3a181333]", color: "text-[#d4452f]" },
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatDate(d: Date): string {
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()} · ${hh}:${mm}`;
}

export default async function ScreeningsPage({ searchParams }: { searchParams: { q?: string } }) {
  const session = await getSession();
  if (!session) redirect("/login");
  const t = await getTranslations("screeningsList");
  const th = await getTranslations("home");

  const q = (searchParams.q ?? "").trim();
  const screenings = await prisma.screening.findMany({
    where: { userId: session.id, ...(q ? { child: { name: { contains: q } } } : {}) },
    orderBy: { createdAt: "desc" },
    include: { child: true },
  });

  return (
    <main className="screen bg-mint pb-28">
      <div className="px-[26px] pt-14">
        <div className="text-[24px] font-bold">{t("title")}</div>
        <div className="text-[13px] text-muted">
          {screenings.length} {screenings.length === 1 ? t("one") : t("many")}
        </div>
      </div>

      <div className="px-[26px] pt-5">
        <SearchBar basePath="/screenings" initial={q} placeholder={t("search")} />
      </div>

      <div className="flex flex-col gap-3 px-[26px] pt-4">
        {screenings.length === 0 && (
          <div className="card p-5 text-center text-[14px] text-muted">{q ? t("noResults") : t("none")}</div>
        )}
        {screenings.map((s) => {
          const st = STYLES[s.classification] ?? STYLES.normal;
          return (
            <Link key={s.id} href={`/screenings/${s.id}`} className="card flex items-center justify-between p-4">
              <div className="flex min-w-0 items-center gap-3.5">
                <div className={`flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-[14px] font-bold ${st.bg} ${st.color}`}>{st.letter}</div>
                <div className="min-w-0">
                  <div className="truncate text-[16px] font-semibold">{s.child?.name ?? th("child")}</div>
                  <div className="text-[12px] text-muted">{formatDate(s.createdAt)}</div>
                  <div className="text-[12px] text-muted">
                    {s.weightKg}kg · {s.heightCm}cm · MUAC {s.muacMm}mm
                  </div>
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <span className={`pill ${st.bg} ${st.color}`}>{th(s.classification as "normal" | "wasted" | "severely_wasted")}</span>
                <span className="text-[12px] font-semibold text-muted">{s.confidence}%</span>
                <span className="text-[12px] text-teal-600">›</span>
              </div>
            </Link>
          );
        })}
      </div>

      <BottomNav />
    </main>
  );
}

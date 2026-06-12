import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import LogoutAvatar from "@/components/LogoutAvatar";
import BottomNav from "@/components/BottomNav";

const STYLES: Record<string, { letter: string; bg: string; color: string }> = {
  normal: { letter: "N", bg: "bg-[#e9f8ef] dark:bg-[#16302433]", color: "text-[#1f9d57]" },
  wasted: { letter: "W", bg: "bg-[#fdf1e0] dark:bg-[#3a2c1333]", color: "text-[#c97f17]" },
  severely_wasted: { letter: "S", bg: "bg-[#fdeeea] dark:bg-[#3a181333]", color: "text-[#d4452f]" },
};

function relativeTime(date: Date): string {
  const mins = Math.max(0, Math.floor((Date.now() - date.getTime()) / 60000));
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default async function HomePage() {
  const session = await getSession();
  if (!session) redirect("/login");
  const t = await getTranslations("home");

  const parts = session.fullName.trim().split(/\s+/);
  const shortName = parts[0] + (parts[1] ? ` ${parts[1][0]}.` : "");
  const initials = (parts[0][0] + (parts[1] ? parts[1][0] : "")).toUpperCase();

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const [user, recent, todayCount, urgentCount] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.id } }),
    prisma.screening.findMany({
      where: { userId: session.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { child: true },
    }),
    prisma.screening.count({ where: { userId: session.id, createdAt: { gte: startOfDay } } }),
    prisma.screening.count({
      where: { userId: session.id, classification: "severely_wasted", createdAt: { gte: startOfDay } },
    }),
  ]);

  const place = [user?.sector, user?.district].filter(Boolean).join(", ");

  return (
    <main className="screen bg-mint pb-28">
      <div className="flex items-center justify-between px-[26px] pt-14">
        <div>
          <div className="text-[14px] text-muted">{t("greeting")}</div>
          <div className="text-[24px] font-bold">{shortName}</div>
        </div>
        <LogoutAvatar initials={initials} />
      </div>
      <div className="px-[26px] pt-1.5 text-[13px] text-muted">
        {t("role")}{place ? ` • ${place}` : ""}
      </div>

      <div className="grid grid-cols-2 gap-3.5 px-[26px] pt-5">
        <div className="card min-w-0 p-[18px]">
          <div className="text-[30px] font-bold text-teal-700 dark:text-teal-500">{todayCount}</div>
          <div className="mt-0.5 text-[12.5px] text-muted">{t("screenedToday")}</div>
        </div>
        <div className="card min-w-0 p-[18px]">
          <div className="text-[30px] font-bold text-brand-red">{urgentCount}</div>
          <div className="mt-0.5 text-[12.5px] text-muted">{t("urgent")}</div>
        </div>
      </div>

      <div className="px-[26px] pt-[18px]">
        <Link href="/screening" className="btn btn-primary rounded-[20px] text-[18px]">
          +&nbsp; {t("newScreening")}
        </Link>
      </div>

      <div className="flex items-center justify-between px-[26px] pt-6">
        <div className="text-[17px] font-bold">{t("recent")}</div>
        <Link href="/patients" className="text-[13px] font-semibold text-teal-600">{t("seeAll")}</Link>
      </div>

      <div className="flex flex-col gap-3 px-[26px] pt-3.5">
        {recent.length === 0 && (
          <div className="card p-4 text-[13px] leading-relaxed text-muted">{t("noRecent")}</div>
        )}
        {recent.map((s) => {
          const st = STYLES[s.classification] ?? STYLES.normal;
          return (
            <Link key={s.id} href={`/screenings/${s.id}`} className="card flex items-center justify-between p-[15px]">
              <div className="flex items-center gap-3.5">
                <div className={`flex h-[42px] w-[42px] items-center justify-center rounded-xl font-bold ${st.bg} ${st.color}`}>{st.letter}</div>
                <div>
                  <div className="text-[15px] font-semibold">{s.child?.name ?? t("child")}</div>
                  <div className="text-[12px] text-muted">{relativeTime(s.createdAt)}</div>
                </div>
              </div>
              <span className={`pill ${st.bg} ${st.color}`}>{t(s.classification as "normal" | "wasted" | "severely_wasted")}</span>
            </Link>
          );
        })}
      </div>

      <BottomNav />
    </main>
  );
}

import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import BottomNav from "@/components/BottomNav";
import SearchBar from "@/components/SearchBar";

export default async function PatientsPage({ searchParams }: { searchParams: { q?: string } }) {
  const session = await getSession();
  if (!session) redirect("/login");
  const t = await getTranslations("patients");

  const q = (searchParams.q ?? "").trim();
  const children = await prisma.child.findMany({
    where: { userId: session.id, ...(q ? { name: { contains: q } } : {}) },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="screen bg-mint pb-28">
      <div className="flex items-center justify-between px-[26px] pt-14">
        <div>
          <div className="text-[24px] font-bold">{t("title")}</div>
          <div className="text-[13px] text-muted">{t("subtitle")}</div>
        </div>
        <Link href="/patients/new" className="flex h-11 items-center gap-1 rounded-full bg-teal-700 px-4 text-[14px] font-semibold text-white shadow-[0_8px_18px_rgba(47,111,100,0.3)]">
          + {t("add")}
        </Link>
      </div>

      <div className="px-[26px] pt-5">
        <SearchBar basePath="/patients" initial={q} placeholder={t("search")} />
      </div>

      <div className="flex flex-col gap-3 px-[26px] pt-4">
        {children.length === 0 && (
          <div className="card p-5 text-center text-[14px] text-muted">{q ? t("noResults") : t("none")}</div>
        )}
        {children.map((c) => {
          const initials = c.name.trim().split(/\s+/).map((p) => p[0]).join("").slice(0, 2).toUpperCase();
          return (
            <div key={c.id} className="card flex items-center justify-between p-4">
              <div className="flex min-w-0 items-center gap-3.5">
                <div className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-[14px] bg-[#e9f6f2] font-bold text-teal-700 dark:bg-[#17302b]">{initials}</div>
                <div className="min-w-0">
                  <div className="truncate text-[16px] font-semibold">{c.name}</div>
                  <div className="text-[12.5px] text-muted">
                    {c.sex === 0 ? t("male") : t("female")} • {t("months", { n: c.ageMonths })}
                  </div>
                </div>
              </div>
              <Link href={`/screening?childId=${c.id}`} className="shrink-0 rounded-full bg-teal-700 px-4 py-2 text-[13px] font-semibold text-white">
                {t("screen")}
              </Link>
            </div>
          );
        })}
      </div>

      <BottomNav />
    </main>
  );
}

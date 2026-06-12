import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import ResultView from "@/components/ResultView";
import { buildResult } from "@/lib/results";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function formatDate(d: Date): string {
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()} · ${hh}:${mm}`;
}

export default async function ScreeningDetailPage({ params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) redirect("/login");
  const t = await getTranslations("result");

  const screening = await prisma.screening.findUnique({
    where: { id: params.id },
    include: { child: true },
  });
  if (!screening || screening.userId !== session.id) notFound();

  const result = buildResult(screening.classification, screening.confidence, screening.child?.name);

  return (
    <main className="screen bg-mint pb-16">
      <div className="flex items-center gap-3.5 px-[26px] pt-14">
        <Link href="/screenings" className="flex h-[42px] w-[42px] items-center justify-center rounded-[13px] bg-white text-[20px] shadow-[0_8px_18px_rgba(23,70,62,0.08)] dark:bg-[#1d2b28]">←</Link>
        <div>
          <div className="text-[22px] font-bold">{t("title")}</div>
          {screening.child?.name && <div className="text-[13px] text-muted">{screening.child.name}</div>}
        </div>
      </div>

      <ResultView result={result} />

      <div className="px-[26px] pt-4">
        <div className="card flex flex-wrap items-center gap-x-4 gap-y-1 p-4 text-[12.5px] text-muted">
          <span>{formatDate(screening.createdAt)}</span>
          <span>·</span>
          <span>{screening.weightKg}kg</span>
          <span>{screening.heightCm}cm</span>
          <span>MUAC {screening.muacMm}mm</span>
          <span>{screening.ageMonths}mo</span>
        </div>
      </div>
    </main>
  );
}

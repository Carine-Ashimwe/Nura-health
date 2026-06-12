import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import ProfileForm from "@/components/ProfileForm";
import BottomNav from "@/components/BottomNav";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect("/login");
  const t = await getTranslations("profile");

  const user = await prisma.user.findUnique({ where: { id: session.id } });
  if (!user) redirect("/login");

  const initials = user.fullName
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <main className="screen bg-mint pb-28">
      <div className="flex flex-col items-center px-[26px] pt-14">
        <div className="flex h-[72px] w-[72px] items-center justify-center rounded-[22px] bg-teal-700 text-[26px] font-bold text-white shadow-[0_12px_24px_rgba(47,111,100,0.3)]">
          {initials}
        </div>
        <div className="mt-3 text-[22px] font-bold">{t("title")}</div>
        <div className="text-[13px] text-muted">{t("subtitle")}</div>
      </div>

      <ProfileForm
        initial={{
          fullName: user.fullName,
          email: user.email,
          province: user.province,
          district: user.district,
          sector: user.sector,
          cell: user.cell,
          village: user.village,
          reportingFacility: user.reportingFacility,
        }}
      />

      <BottomNav />
    </main>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useFeedback, setFlash } from "@/components/Feedback";

export default function LogoutAvatar({ initials }: { initials: string }) {
  const router = useRouter();
  const t = useTranslations("home");
  const { confirm } = useFeedback();

  async function logout() {
    const ok = await confirm({
      message: t("confirmLogout"),
      confirmText: t("logout"),
      cancelText: t("cancel"),
      danger: true,
    });
    if (!ok) return;
    await fetch("/api/auth/logout", { method: "POST" });
    setFlash(t("logoutSuccess"));
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={logout}
      title={t("logout")}
      className="flex h-[50px] w-[50px] items-center justify-center rounded-2xl bg-teal-700 text-[18px] font-bold text-white shadow-[0_10px_20px_rgba(47,111,100,0.3)]"
    >
      {initials}
    </button>
  );
}

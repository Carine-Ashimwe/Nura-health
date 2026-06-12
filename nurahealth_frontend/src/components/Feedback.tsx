"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

type Tone = "success" | "error";
type ToastItem = { id: number; text: string; tone: Tone };

const FLASH_KEY = "nura_flash";

/**
 * Queue a toast to appear on the NEXT page (survives router.push + router.refresh).
 * Use this for success messages shown right before a redirect, e.g. login / logout.
 */
export function setFlash(text: string, tone: Tone = "success") {
  try {
    sessionStorage.setItem(FLASH_KEY, JSON.stringify({ text, tone }));
  } catch {
    /* sessionStorage unavailable — ignore */
  }
}

interface ConfirmOptions {
  message: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
}

interface FeedbackApi {
  /** Show a small in-app toast (replaces window.alert). */
  toast: (text: string, tone?: Tone) => void;
  /** Show an in-app confirm dialog (replaces window.confirm). Resolves true/false. */
  confirm: (opts: ConfirmOptions) => Promise<boolean>;
}

const FeedbackContext = createContext<FeedbackApi | null>(null);

export function useFeedback(): FeedbackApi {
  const ctx = useContext(FeedbackContext);
  if (!ctx) throw new Error("useFeedback must be used inside <FeedbackProvider>");
  return ctx;
}

export default function FeedbackProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [dialog, setDialog] = useState<(ConfirmOptions & { resolve: (v: boolean) => void }) | null>(null);
  const idRef = useRef(0);

  const toast = useCallback((text: string, tone: Tone = "success") => {
    const id = ++idRef.current;
    setToasts((list) => [...list, { id, text, tone }]);
    setTimeout(() => setToasts((list) => list.filter((t) => t.id !== id)), 2800);
  }, []);

  // After any navigation, show a flash queued by setFlash() (e.g. login / logout success).
  const pathname = usePathname();
  useEffect(() => {
    let raw: string | null = null;
    try {
      raw = sessionStorage.getItem(FLASH_KEY);
      if (raw) sessionStorage.removeItem(FLASH_KEY);
    } catch {
      return;
    }
    if (!raw) return;
    try {
      const f = JSON.parse(raw) as { text: string; tone?: Tone };
      if (f?.text) toast(f.text, f.tone ?? "success");
    } catch {
      /* malformed flash — ignore */
    }
  }, [pathname, toast]);

  const confirm = useCallback((opts: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => setDialog({ ...opts, resolve }));
  }, []);

  const closeDialog = useCallback(
    (value: boolean) => {
      dialog?.resolve(value);
      setDialog(null);
    },
    [dialog],
  );

  return (
    <FeedbackContext.Provider value={{ toast, confirm }}>
      {children}

      {/* Toast stack */}
      <div className="pointer-events-none fixed inset-x-0 top-5 z-[100] flex flex-col items-center gap-2 px-4">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`nura-toast-in pointer-events-auto flex w-full max-w-[420px] items-center gap-3 rounded-2xl px-4 py-3.5 text-[14px] font-semibold text-white shadow-[0_16px_34px_rgba(23,70,62,0.28)] ring-1 ring-white/15 ${
              t.tone === "error"
                ? "bg-gradient-to-r from-[#d24a3a] to-[#b5301f]"
                : "bg-gradient-to-r from-[#3d8a7c] to-[#2f6f64]"
            }`}
          >
            <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-white/20 text-[13px]">
              {t.tone === "error" ? "!" : "✓"}
            </span>
            <span className="flex-1">{t.text}</span>
          </div>
        ))}
      </div>

      {/* Confirm dialog */}
      {dialog && (
        <div
          className="nura-fade-in fixed inset-0 z-[110] flex items-end justify-center bg-black/40 px-4 pb-8 sm:items-center sm:pb-0"
          onClick={() => closeDialog(false)}
        >
          <div
            className="nura-pop-in w-full max-w-[420px] rounded-[24px] bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.3)] dark:bg-[#16221f]"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-center text-[16px] font-semibold text-ink dark:text-[#e9f1ef]">{dialog.message}</p>
            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={() => closeDialog(true)}
                className={`btn rounded-[16px] ${dialog.danger ? "btn-red" : "btn-primary"}`}
              >
                {dialog.confirmText ?? "Confirm"}
              </button>
              <button onClick={() => closeDialog(false)} className="btn btn-ghost rounded-[16px]">
                {dialog.cancelText ?? "Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </FeedbackContext.Provider>
  );
}

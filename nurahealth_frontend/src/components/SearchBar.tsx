"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar({
  basePath,
  initial,
  placeholder,
}: {
  basePath: string;
  initial: string;
  placeholder: string;
}) {
  const router = useRouter();
  const [q, setQ] = useState(initial);
  const firstRender = useRef(true);

  // Debounce: push the query into the URL so the server re-renders filtered.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const id = setTimeout(() => {
      const value = q.trim();
      router.replace(value ? `${basePath}?q=${encodeURIComponent(value)}` : basePath, { scroll: false });
    }, 300);
    return () => clearTimeout(id);
  }, [q, basePath, router]);

  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted">
        <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="7" /><path d="m20 20-3.2-3.2" />
        </svg>
      </span>
      <input
        className="field pl-11 pr-10"
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
      />
      {q && (
        <button
          type="button"
          onClick={() => setQ("")}
          aria-label="Clear"
          className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-[#eef0ec] text-muted dark:bg-[#243431]"
        >
          ✕
        </button>
      )}
    </div>
  );
}

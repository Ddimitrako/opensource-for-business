"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "osfb-shortlist";
const CHANGE_EVENT = "osfb-shortlist-change";

function readShortlist() {
  if (typeof window === "undefined") return [];
  try {
    const value = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export function useShortlist() {
  const [slugs, setSlugs] = useState<string[]>([]);

  useEffect(() => {
    const sync = () => setSlugs(readShortlist());
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener(CHANGE_EVENT, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(CHANGE_EVENT, sync);
    };
  }, []);

  const write = useCallback((next: string[]) => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  const toggle = useCallback((slug: string) => {
    const current = readShortlist();
    write(current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug]);
  }, [write]);

  const clear = useCallback(() => write([]), [write]);

  return {
    slugs,
    count: slugs.length,
    has: (slug: string) => slugs.includes(slug),
    toggle,
    clear,
  };
}


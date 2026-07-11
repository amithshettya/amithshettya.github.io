import { create } from "zustand";
import { persist } from "zustand/middleware";

interface DarkModeStore {
  isDark: boolean;
  toggle: () => void;
}

function getInitialDarkMode(): boolean {
  if (typeof window === "undefined") return false;
  const stored = localStorage.getItem("dark-mode");
  if (stored === "true" || stored === "false") {
    return stored === "true";
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export const useDarkMode = create<DarkModeStore>()(
  persist(
    (set) => ({
      isDark: getInitialDarkMode(),
      toggle: () => set((state) => ({ isDark: !state.isDark })),
    }),
    {
      name: "dark-mode",
    }
  )
);

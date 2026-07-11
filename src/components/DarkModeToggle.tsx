import { useDarkMode } from "@/stores/dark-mode";
import { useEffect } from "react";

export function DarkModeToggle() {
  const { isDark, toggle } = useDarkMode();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  return (
    <button
      onClick={toggle}
      className="dark-mode-toggle fixed top-4 right-4 z-50 p-2 rounded hover:bg-grid-line/50 dark:hover:bg-dark-grid-line/50 transition-colors text-ink-soft dark:text-dark-ink-soft"
      aria-label="Toggle dark mode"
      aria-pressed={isDark}
    >
      <svg
        className="w-5 h-5 icon-moon"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
      <svg
        className="w-5 h-5 icon-sun"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
    </button>
  );
}

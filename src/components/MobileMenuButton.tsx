import { useSidebarStore } from "@/stores/sidebar";

export function MobileMenuButton() {
  const toggle = useSidebarStore((s) => s.toggle);

  return (
    <button
      className="mobile-menu-btn"
      onClick={toggle}
      aria-label="Open menu"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    </button>
  );
}

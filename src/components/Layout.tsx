import { Outlet } from "@tanstack/react-router";
import { Sidebar } from "./Sidebar";
import { DarkModeToggle } from "./DarkModeToggle";
import { MobileMenuButton } from "./MobileMenuButton";

export function Layout() {
  return (
    <>
      <a href="#main-content" className="skip-to-content">
        Skip to content
      </a>
      <MobileMenuButton />
      <DarkModeToggle />
      <div className="flex min-h-screen relative">
        <Sidebar />
        <main
          id="main-content"
          className="flex-1 p-8 min-w-0 max-w-[1080px]"
        >
          <Outlet />
        </main>
      </div>
    </>
  );
}

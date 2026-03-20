import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-transparent">
      <div className="min-h-screen">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-8 lg:py-10">
          <Outlet />
        </main>
        <footer className="mt-14 border-t border-black/5 bg-[#eef2ff] px-4 py-14 text-sm text-text-secondary">
          <div className="mx-auto max-w-6xl">
            <div className="space-y-4">
              <div className="text-2xl font-semibold tracking-[0.25em] glam-gradient">GLAMORA</div>
              <p className="max-w-md text-sm leading-7 text-text-secondary">
                Premium fashion discovery, AI styling, and standout looks in one bright, vibrant experience.
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.2em] text-text-secondary">
                <span className="rounded-full border border-black/5 bg-white px-4 py-2 hover:text-[#ff2e63]">Instagram</span>
                <span className="rounded-full border border-black/5 bg-white px-4 py-2 hover:text-[#7c3aed]">Facebook</span>
                <span className="rounded-full border border-black/5 bg-white px-4 py-2 hover:text-[#2563eb]">Pinterest</span>
                <span className="rounded-full border border-black/5 bg-white px-4 py-2 hover:text-[#14b8a6]">Youtube</span>
              </div>
            </div>
          </div>
          <div className="mx-auto mt-8 h-px max-w-6xl bg-gradient-to-r from-transparent via-black/8 to-transparent" />
          <p className="mx-auto mt-6 max-w-6xl text-xs uppercase tracking-[0.24em] text-text-secondary">© 2026 Glamora. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

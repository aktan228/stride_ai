import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Logo } from "../Logo";
import { Icon } from "../Icon";

const LINKS = [
  { key: "pipeline", label: "Панель", to: "/pipeline" },
  { key: "leads", label: "Лиды", to: "/leads" },
  { key: "schedule", label: "Расписание", to: "/leads" },
];

/** Logo + horizontal nav + right icons. Flow screens (pipeline / writer / scheduler). */
export function TopNavShell({ active, children }: { active?: string; children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-surface-white">
      <header className="w-full border-b border-border-subtle bg-surface-white">
        <div className="max-w-container-max mx-auto px-margin-page h-16 flex items-center justify-between">
          <Logo />
          <nav className="hidden md:flex items-center gap-8 h-16">
            {LINKS.map((l) => (
              <Link
                key={l.key}
                to={l.to}
                className={`h-16 flex items-center font-button-text transition-colors ${
                  active === l.key
                    ? "text-primary border-b-2 border-primary"
                    : "text-text-muted hover:text-primary"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-5 text-text-muted">
            <Icon name="notifications" className="cursor-pointer hover:text-primary" />
            <Icon name="settings" className="cursor-pointer hover:text-primary" />
            <div className="w-8 h-8 rounded-full bg-surface-container-high border border-border-subtle" />
          </div>
        </div>
      </header>
      <main className="flex-1 w-full max-w-container-max mx-auto px-margin-page py-stack-xl">
        {children}
      </main>
    </div>
  );
}

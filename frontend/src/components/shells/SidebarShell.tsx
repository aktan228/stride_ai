import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Logo } from "../Logo";
import { Icon } from "../Icon";

const NAV = [
  { key: "dashboard", label: "Панель", icon: "dashboard", to: "/pipeline" },
  { key: "leads", label: "Лиды", icon: "person_search", to: "/leads" },
  { key: "logs", label: "Логи", icon: "list_alt", to: "/leads" },
  { key: "settings", label: "Настройки", icon: "settings", to: "/leads" },
];

/** Fixed left sidebar + top bar. Dashboard screens (leads list / lead detail). */
export function SidebarShell({
  active = "leads",
  showSearch = true,
  children,
}: {
  active?: string;
  showSearch?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface-white">
      <header className="fixed top-0 left-0 right-0 h-16 bg-surface-white border-b border-border-subtle flex justify-between items-center px-8 z-30">
        <Logo />
        <div className="flex items-center gap-6">
          {showSearch && (
            <div className="relative">
              <Icon
                name="search"
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
              />
              <input
                className="pl-10 pr-4 py-2 bg-surface-container-low border border-border-subtle rounded-xl text-body-sm focus:outline-none focus:border-accent-blue w-64"
                placeholder="Поиск лидов..."
              />
            </div>
          )}
          <div className="flex items-center gap-4 text-on-surface-variant">
            <Icon name="notifications" className="cursor-pointer hover:text-primary" />
            <Icon name="help" className="cursor-pointer hover:text-primary" />
            <div className="w-8 h-8 rounded-full border border-border-subtle bg-surface-container" />
          </div>
        </div>
      </header>

      <aside className="fixed left-0 top-0 h-screen flex flex-col pt-24 pb-8 px-4 bg-surface-white border-r border-border-subtle w-64 z-20">
        <nav className="flex flex-col gap-1">
          {NAV.map((n) => (
            <Link
              key={n.key}
              to={n.to}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
                active === n.key
                  ? "text-primary bg-secondary-container font-bold"
                  : "text-on-surface-variant hover:bg-surface-container-highest"
              }`}
            >
              <Icon name={n.icon} />
              <span className="font-body-sm text-body-sm">{n.label}</span>
            </Link>
          ))}
        </nav>
        <div className="mt-auto pt-6 border-t border-border-subtle">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-white font-bold text-xs">
              AI
            </div>
            <div>
              <p className="font-body-sm text-body-sm font-bold">Stride AI</p>
              <p className="text-[11px] text-text-muted">Автоматизация продаж</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="ml-64 pt-24 pb-12 px-margin-page max-w-[1200px]">{children}</main>
    </div>
  );
}

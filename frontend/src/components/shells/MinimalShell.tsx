import type { ReactNode } from "react";
import { Logo } from "../Logo";

/** Logo top-left, optional right slot, centered content. Onboarding / success. */
export function MinimalShell({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-surface-white">
      <header className="w-full px-margin-page py-stack-md flex items-center justify-between border-b border-transparent">
        <Logo />
        {right ?? <span />}
      </header>
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}

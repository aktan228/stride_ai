import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  children: ReactNode;
}

/** Primary = solid brand blue; Secondary = 1px outline. No shadows (per DESIGN.md). */
export function Button({ variant = "primary", className = "", children, ...rest }: ButtonProps) {
  const base =
    "font-button-text text-button-text rounded-lg px-stack-lg py-2.5 inline-flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none";
  const styles =
    variant === "primary"
      ? "bg-primary text-on-primary hover:opacity-90"
      : "bg-white border border-border-subtle text-on-surface hover:bg-surface-container-low";
  return (
    <button className={`${base} ${styles} ${className}`} {...rest}>
      {children}
    </button>
  );
}

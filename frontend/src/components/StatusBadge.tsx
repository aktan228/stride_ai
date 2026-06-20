import type { LeadStatus } from "../types";

const MAP: Record<LeadStatus, { label: string; dot: string }> = {
  attention: { label: "Требует внимания", dot: "bg-orange-500" },
  in_dialog: { label: "В диалоге", dot: "bg-accent-blue" },
  waiting: { label: "Ждём ответа", dot: "bg-gray-400" },
  meeting_set: { label: "Встреча назначена", dot: "bg-green-500" },
  closed: { label: "Закрыт", dot: "bg-gray-400" },
};

export function StatusBadge({ status, pulse = false }: { status: LeadStatus; pulse?: boolean }) {
  const { label, dot } = MAP[status];
  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-surface-container-low rounded-full border border-border-subtle">
      <span className={`w-2 h-2 rounded-full ${dot} ${pulse ? "animate-pulse" : ""}`} />
      <span className="text-[12px] font-medium text-on-surface-variant">{label}</span>
    </div>
  );
}

import type { LeadStatus } from "../types";

const MAP: Record<LeadStatus, { label: string; dot: string; text: string }> = {
  attention: { label: "Требует внимания", dot: "bg-orange-500", text: "text-on-surface-variant" },
  in_dialog:  { label: "В диалоге",        dot: "bg-blue-500",   text: "text-on-surface-variant" },
  waiting:    { label: "Ждём ответа",      dot: "bg-gray-400",   text: "text-on-surface-variant" },
  meeting_set:{ label: "Встреча назначена",dot: "bg-green-500",  text: "text-on-surface-variant" },
  closed:     { label: "Закрыт",           dot: "bg-gray-400",   text: "text-text-muted" },
};

export function StatusBadge({ status, pulse = false }: { status: LeadStatus; pulse?: boolean }) {
  const { label, dot, text } = MAP[status];
  return (
    <div className="flex items-center gap-2">
      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dot} ${pulse ? "animate-pulse" : ""}`} />
      <span className={`text-[13px] font-medium ${text}`}>{label}</span>
    </div>
  );
}

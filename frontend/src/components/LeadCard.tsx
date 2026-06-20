import type { Lead } from "../types";
import { Icon } from "./Icon";
import { StatusBadge } from "./StatusBadge";

const KIND_ICON: Record<string, string> = {
  chat: "chat_bubble_outline",
  schedule: "schedule",
  event: "event_available",
  mail: "mail",
  bolt: "bolt",
  forum: "forum",
};

export function LeadCard({ lead, onClick }: { lead: Lead; onClick?: () => void }) {
  const icon = KIND_ICON[lead.last_kind ?? "chat"] ?? "chat_bubble_outline";
  const scoreText = `скор ${lead.score}/10`;
  const hasMsg = !!lead.last_message;
  const line = hasMsg ? `Последнее: "${lead.last_message}"` : lead.last_activity;
  const lineAccent = lead.last_kind === "bolt";
  const lineStrong = lead.last_kind === "event";

  return (
    <div
      onClick={onClick}
      className={`bg-surface-white border border-border-subtle rounded-xl p-stack-lg hover:border-accent-blue transition-colors cursor-pointer ${
        lead.highlight ? "ring-1 ring-accent-blue/20" : ""
      }`}
    >
      <div className="flex justify-between items-center mb-1">
        <h3 className="font-body-lg text-body-lg font-bold text-on-surface">{lead.company}</h3>
        <StatusBadge status={lead.status} pulse={lead.highlight} />
      </div>
      <p className="font-body-sm text-body-sm text-text-muted mb-3">
        {lead.funding} • {scoreText}
      </p>
      <div
        className={`flex items-center gap-2 ${
          lineAccent ? "text-accent-blue" : "text-on-surface-variant"
        }`}
      >
        <Icon name={icon} size={16} />
        <p
          className={`font-body-md text-body-md ${hasMsg ? "italic" : ""} ${
            lineAccent || lineStrong ? "font-medium" : ""
          }`}
        >
          {line}
        </p>
      </div>
    </div>
  );
}

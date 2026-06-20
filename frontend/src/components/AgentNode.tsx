import { Icon } from "./Icon";

export type AgentState = "waiting" | "active" | "done";

// Maps pipeline agent keys to avatar files in /public/assets.
const AVATAR: Record<string, string> = {
  scout: "scout",
  analyst: "analyst",
  writer: "writer",
  sales_manager: "sales_rep",
  scheduler: "scheduler",
};

export function AgentNode({
  agent,
  label,
  state,
}: {
  agent: string;
  label: string;
  state: AgentState;
}) {
  const file = AVATAR[agent] ?? agent;
  return (
    <div className={`flex flex-col items-center gap-stack-sm w-32 ${state === "waiting" ? "opacity-30" : ""}`}>
      <div
        className={`relative w-20 h-20 rounded-xl bg-surface-white border flex items-center justify-center transition-all duration-300 ${
          state === "active" ? "border-primary" : "border-border-subtle"
        }`}
      >
        <img
          src={`/assets/${file}.jpg`}
          alt={label}
          className={`w-16 h-16 object-contain ${state === "waiting" ? "grayscale" : ""}`}
        />
        {state === "done" && (
          <span className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full">
            <Icon name="check" size={14} fill className="p-0.5" />
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <span className={`font-button-text text-center ${state === "waiting" ? "text-text-muted" : "text-on-surface"}`}>
          {label}
        </span>
        {state === "active" && <span className="w-2 h-2 rounded-full bg-primary animate-pulse-dot" />}
      </div>
    </div>
  );
}

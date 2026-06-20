import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TopNavShell } from "../components/shells/TopNavShell";
import { AgentNode, type AgentState } from "../components/AgentNode";
import { Button } from "../components/ui/Button";
import { Icon } from "../components/Icon";
import { api } from "../lib/api";
import { usePipelineSSE } from "../lib/usePipelineSSE";

const AGENTS = [
  { key: "scout", label: "Скаут" },
  { key: "analyst", label: "Аналитик" },
  { key: "writer", label: "Копирайтер" },
  { key: "sales_manager", label: "Менеджер по продажам" },
  { key: "scheduler", label: "Планировщик" },
];
// Agents the scripted mock pipeline actually drives (scout → analyst → writer).
const DRIVEN = 3;

/** Screen 3 — live orchestration of the agent pipeline (SSE). */
export function Pipeline() {
  const [started, setStarted] = useState(false);
  const nav = useNavigate();

  // Reset to a clean slate, then begin the stream.
  useEffect(() => {
    let cancelled = false;
    api.startPipeline().then(() => !cancelled && setStarted(true));
    return () => {
      cancelled = true;
    };
  }, []);

  const state = usePipelineSSE(started);
  const activeIdx = state.activeAgent
    ? AGENTS.findIndex((a) => a.key === state.activeAgent)
    : -1;

  function stateFor(i: number): AgentState {
    if (state.done) return i < DRIVEN ? "done" : "waiting";
    if (i === activeIdx) return "active";
    if (activeIdx >= 0 && i < activeIdx) return "done";
    return "waiting";
  }

  return (
    <TopNavShell active="pipeline">
      <div className="mb-stack-xl text-center">
        <h1 className="font-display text-display text-on-surface mb-2">Конвейер агентов</h1>
        <p className="font-label-caps text-label-caps text-text-muted uppercase tracking-widest">
          Оркестрация генерации лидов в реальном времени
        </p>
      </div>

      {/* Agent row with connecting line */}
      <div className="relative w-full max-w-4xl mx-auto mb-stack-lg">
        <div className="absolute top-10 left-0 w-full h-px bg-border-subtle z-0" />
        <div className="relative z-10 flex items-start justify-between">
          {AGENTS.map((a, i) => (
            <AgentNode key={a.key} agent={a.key} label={a.label} state={stateFor(i)} />
          ))}
        </div>
      </div>

      <div className="text-center mb-stack-xl min-h-[24px]">
        <p className="text-text-muted font-body-sm transition-opacity duration-500">
          {state.status}
        </p>
      </div>

      {/* Found companies (live) */}
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-stack-md border-b border-border-subtle pb-2">
          <span className="font-label-caps text-label-caps text-text-muted uppercase">
            Найденные компании
          </span>
          <span className="font-label-caps text-label-caps text-primary uppercase flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-dot" /> Прямой эфир
          </span>
        </div>

        <div className="flex flex-col">
          {state.companies.map((c) => {
            const qualified = state.scoredIds.includes(c.id);
            return (
              <div
                key={c.id}
                className="py-stack-md border-b border-border-subtle flex items-center justify-between animate-fade-in"
              >
                <div>
                  <h3 className="font-body-lg text-body-lg text-on-surface font-medium">{c.name}</h3>
                  <p className="font-body-sm text-body-sm text-text-muted">{c.description}</p>
                </div>
                <span
                  className={`text-xs font-medium uppercase whitespace-nowrap ${
                    qualified ? "text-primary" : "text-text-muted"
                  }`}
                >
                  {qualified ? "Квалифицирован" : "В ожидании"}
                </span>
              </div>
            );
          })}
          {state.companies.length === 0 && (
            <p className="text-text-muted font-body-sm py-stack-md text-center">
              Скаут начинает поиск…
            </p>
          )}
        </div>

        {state.draft && (
          <div className="flex justify-center mt-stack-xl animate-fade-in">
            <Button onClick={() => nav(`/email/${state.draft!.lead_id}`)}>
              Проверить черновик письма <Icon name="arrow_forward" size={18} />
            </Button>
          </div>
        )}
      </div>
    </TopNavShell>
  );
}

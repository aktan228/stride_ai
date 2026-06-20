import { useEffect, useRef, useState } from "react";
import type { AgentEvent, Company } from "../types";

export interface DraftReady {
  lead_id: string;
  company: string;
}

export interface PipelineState {
  activeAgent: string | null;
  status: string;
  companies: Company[];
  scoredIds: string[];
  draft: DraftReady | null;
  done: boolean;
}

const INITIAL: PipelineState = {
  activeAgent: null,
  status: "",
  companies: [],
  scoredIds: [],
  draft: null,
  done: false,
};

function reduce(prev: PipelineState, ev: AgentEvent): PipelineState {
  switch (ev.type) {
    case "agent_active":
      return { ...prev, activeAgent: ev.agent ?? null };
    case "status":
      return { ...prev, status: ev.message ?? prev.status };
    case "company_found": {
      const c = ev.payload as Company;
      if (prev.companies.some((x) => x.id === c.id)) return prev;
      return { ...prev, companies: [...prev.companies, c] };
    }
    case "scored": {
      const id = (ev.payload as { id: string }).id;
      if (prev.scoredIds.includes(id)) return prev;
      return { ...prev, scoredIds: [...prev.scoredIds, id] };
    }
    case "draft_ready":
      return { ...prev, draft: ev.payload as DraftReady };
    case "done":
      return { ...prev, done: true, status: ev.message ?? prev.status, activeAgent: null };
    default:
      return prev;
  }
}

/**
 * Subscribes to the scripted live-pipeline SSE stream. Pass `enabled=true`
 * once the run should begin (the caller POSTs /api/pipeline/start first).
 */
export function usePipelineSSE(enabled: boolean): PipelineState {
  const [state, setState] = useState<PipelineState>(INITIAL);
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!enabled) return;
    setState(INITIAL);
    const es = new EventSource("/api/pipeline/stream");
    esRef.current = es;

    es.onmessage = (e) => {
      const ev: AgentEvent = JSON.parse(e.data);
      setState((prev) => reduce(prev, ev));
      if (ev.type === "done") es.close();
    };
    es.onerror = () => es.close();

    return () => es.close();
  }, [enabled]);

  return state;
}

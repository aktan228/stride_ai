import type {
  Conversation,
  EmailDraft,
  Lead,
  Meeting,
  Slot,
} from "../types";

async function http<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} — ${url}`);
  return (await res.json()) as T;
}

export interface ProductInput {
  what: string;
  problem: string;
  pricing?: string;
}

export const api = {
  setICP: (description: string) =>
    http<{ ok: boolean }>("/api/onboarding/icp", {
      method: "POST",
      body: JSON.stringify({ description }),
    }),

  setProduct: (p: ProductInput) =>
    http<{ ok: boolean }>("/api/onboarding/product", {
      method: "POST",
      body: JSON.stringify(p),
    }),

  startPipeline: () =>
    http<{ ok: boolean }>("/api/pipeline/start", { method: "POST" }),

  listLeads: () => http<Lead[]>("/api/leads"),
  getLead: (id: string) => http<Lead>(`/api/leads/${id}`),

  getDraft: (id: string) => http<EmailDraft>(`/api/leads/${id}/draft`),
  editDraft: (id: string, body: { subject?: string; body?: string }) =>
    http<EmailDraft>(`/api/leads/${id}/draft/edit`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  approveDraft: (id: string) =>
    http<{ draft: EmailDraft; lead: Lead }>(`/api/leads/${id}/draft/approve`, {
      method: "POST",
    }),

  getConversation: (id: string) =>
    http<Conversation>(`/api/leads/${id}/conversation`),
  approveReply: (id: string) =>
    http<Conversation>(`/api/leads/${id}/conversation/approve`, {
      method: "POST",
    }),

  getSlots: (id: string) =>
    http<{ slots: Slot[]; timezone: string }>(`/api/leads/${id}/slots`),
  book: (id: string, slot_id: string) =>
    http<Meeting>(`/api/leads/${id}/book`, {
      method: "POST",
      body: JSON.stringify({ slot_id }),
    }),
};

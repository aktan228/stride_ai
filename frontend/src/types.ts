// Mirrors backend/app/models.py.

export type LeadStatus = "attention" | "in_dialog" | "waiting" | "meeting_set" | "closed";
export type DraftStatus = "pending" | "approved" | "sent";
export type MessageSender = "lead" | "stride" | "founder";

export interface Company {
  id: string;
  name: string;
  description: string;
  industry?: string | null;
  funding?: string | null;
  size?: string | null;
  signal?: string | null;
  score?: number | null;
  qualified?: boolean | null;
}

export interface Lead {
  id: string;
  company: string;
  status: LeadStatus;
  score: number;
  funding?: string | null;
  last_activity?: string | null;
  last_message?: string | null;
  last_kind?: string | null;
  highlight?: boolean;
  score_100?: number | null;
  size?: string | null;
}

export interface EmailDraft {
  id: string;
  lead_id: string;
  company: string;
  subject: string;
  body: string;
  status: DraftStatus;
  created_by: string;
}

export interface ConversationMessage {
  id: string;
  lead_id: string;
  sender: MessageSender;
  text: string;
  ts: string;
  needs_approval?: boolean;
}

export interface ProposedReply {
  lead_id: string;
  objection: string;
  proposed_response: string;
  status: DraftStatus;
}

export interface Conversation {
  lead_id: string;
  messages: ConversationMessage[];
  proposed_reply?: ProposedReply | null;
}

export interface Slot {
  id: string;
  day: string;
  time: string;
  available: boolean;
}

export interface Meeting {
  id: string;
  lead_id: string;
  company: string;
  datetime: string;
  timezone: string;
}

export interface AgentEvent {
  type: string;
  agent?: string | null;
  message?: string | null;
  payload?: unknown;
}

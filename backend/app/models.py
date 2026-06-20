"""Pydantic schemas shared across services and the API.

Mirrored on the frontend in ``frontend/src/types.ts``.
"""
from __future__ import annotations

from typing import Any, Literal, Optional

from pydantic import BaseModel

LeadStatus = Literal["attention", "in_dialog", "waiting", "meeting_set", "closed"]
DraftStatus = Literal["pending", "approved", "sent"]
MessageSender = Literal["lead", "stride", "founder"]


class Company(BaseModel):
    """A prospect surfaced by Scout (lives on the live-pipeline screen)."""

    id: str
    name: str
    description: str
    industry: Optional[str] = None
    funding: Optional[str] = None
    size: Optional[str] = None
    signal: Optional[str] = None
    score: Optional[float] = None
    qualified: Optional[bool] = None


class Lead(BaseModel):
    """A qualified prospect being worked through the funnel (Leads screen)."""

    id: str
    company: str
    status: LeadStatus
    score: float
    funding: Optional[str] = None
    last_activity: Optional[str] = None
    last_message: Optional[str] = None
    # Icon hint for the card: chat|schedule|event|mail|bolt|forum
    last_kind: Optional[str] = None
    highlight: bool = False
    # Detail view extras (Acme uses these).
    score_100: Optional[int] = None
    size: Optional[str] = None


class EmailDraft(BaseModel):
    id: str
    lead_id: str
    company: str
    subject: str
    body: str
    status: DraftStatus = "pending"
    created_by: str = "Stride AI Копирайтер"


class ConversationMessage(BaseModel):
    id: str
    lead_id: str
    sender: MessageSender
    text: str
    ts: str
    needs_approval: bool = False


class ProposedReply(BaseModel):
    lead_id: str
    objection: str
    proposed_response: str
    status: DraftStatus = "pending"


class Conversation(BaseModel):
    lead_id: str
    messages: list[ConversationMessage] = []
    proposed_reply: Optional[ProposedReply] = None


class Slot(BaseModel):
    id: str
    day: str
    time: str
    available: bool = True


class Meeting(BaseModel):
    id: str
    lead_id: str
    company: str
    datetime: str
    timezone: str = "UTC -5"


class AgentEvent(BaseModel):
    """One frame of the live pipeline stream (SSE)."""

    # agent_active | status | company_found | scored | draft_ready | done
    type: str
    agent: Optional[str] = None  # scout|analyst|writer|sales_manager|scheduler
    message: Optional[str] = None
    payload: Optional[Any] = None


# ---- request bodies -------------------------------------------------------

class ICPRequest(BaseModel):
    description: str


class ProductRequest(BaseModel):
    what: str
    problem: str
    pricing: Optional[str] = None


class EditDraftRequest(BaseModel):
    subject: Optional[str] = None
    body: Optional[str] = None


class BookRequest(BaseModel):
    slot_id: str

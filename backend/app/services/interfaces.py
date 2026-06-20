"""Service contracts. Mock implementations satisfy these now; real
Claude/Gmail/Calendar implementations will satisfy the same shapes later.
"""
from __future__ import annotations

from typing import AsyncIterator, Optional, Protocol

from ..models import AgentEvent, Company, EmailDraft, Meeting, ProposedReply, Slot


class ScoutDataSource(Protocol):
    def find_companies(self) -> list[Company]: ...


class Analyst(Protocol):
    def score(self, company: Company) -> Company: ...


class Writer(Protocol):
    def draft_email(self, company: Company) -> EmailDraft: ...


class SalesManager(Protocol):
    def propose_reply(self, lead_id: str) -> Optional[ProposedReply]: ...


class EmailService(Protocol):
    def send(self, draft: EmailDraft) -> EmailDraft: ...


class CalendarService(Protocol):
    def get_slots(self) -> tuple[list[Slot], str]: ...
    def book(self, lead_id: str, slot_id: str, company: str) -> Meeting: ...


class Orchestrator(Protocol):
    def run(self) -> AsyncIterator[AgentEvent]: ...

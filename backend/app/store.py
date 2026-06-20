"""In-memory application state, seeded from ``app/data/*.json`` at startup.

No database for the mock stage — state resets on restart, which is fine for a
demo. ``reset()`` lets the pipeline be replayed from a clean slate. When real
persistence is needed later this module is the single place to swap.
"""
from __future__ import annotations

import json
from pathlib import Path

from .models import (
    Company,
    Conversation,
    ConversationMessage,
    EmailDraft,
    Lead,
    Meeting,
    ProposedReply,
    Slot,
)

DATA_DIR = Path(__file__).parent / "data"


def _load(name: str):
    with open(DATA_DIR / name, encoding="utf-8") as fh:
        return json.load(fh)


class Store:
    def __init__(self) -> None:
        self.companies: list[Company] = []
        self.leads: dict[str, Lead] = {}
        self.drafts: dict[str, EmailDraft] = {}            # keyed by lead_id
        self.conversations: dict[str, Conversation] = {}   # keyed by lead_id
        self.meetings: dict[str, Meeting] = {}             # keyed by lead_id
        self.timezone: str = "UTC -5"
        self.slots: list[Slot] = []
        self.onboarding: dict = {}
        self.reset()

    def reset(self) -> None:
        """Re-seed everything from the curated dataset."""
        self.companies = [Company(**c) for c in _load("companies.json")]
        self.leads = {lead["id"]: Lead(**lead) for lead in _load("leads.json")}
        # Original seed order, so freshly promoted leads can surface on top.
        self._seed_order = list(self.leads.keys())
        self.drafts = {d["lead_id"]: EmailDraft(**d) for d in _load("drafts.json")}

        conv_raw = _load("conversations.json")
        self.conversations = {}
        for lead_id, conv in conv_raw.items():
            self.conversations[lead_id] = Conversation(
                lead_id=lead_id,
                messages=[ConversationMessage(**m) for m in conv["messages"]],
                proposed_reply=ProposedReply(**conv["proposed_reply"])
                if conv.get("proposed_reply")
                else None,
            )

        slots_raw = _load("slots.json")
        self.timezone = slots_raw.get("timezone", "UTC -5")
        self.slots = [Slot(**s) for s in slots_raw["slots"]]

        self.meetings = {}
        self.onboarding = {}

    # ---- helpers used by services / routes --------------------------------

    def company(self, company_id: str) -> Company | None:
        return next((c for c in self.companies if c.id == company_id), None)

    def ordered_leads(self) -> list[Lead]:
        """Newly promoted leads first, then the seeded ones in original order."""
        new_ids = [lid for lid in self.leads if lid not in self._seed_order]
        seeded = [lid for lid in self._seed_order if lid in self.leads]
        return [self.leads[lid] for lid in (new_ids + seeded)]

    def build_lead_from_company(self, company: Company, **overrides) -> Lead:
        """Construct a Lead view from a company WITHOUT persisting it."""
        data = {
            "id": company.id,
            "company": company.name,
            "status": "waiting",
            "score": company.score or 0.0,
            "funding": company.funding,
            "size": company.size,
            "score_100": int((company.score or 0) * 10),
        }
        data.update(overrides)
        return Lead(**data)

    def upsert_lead(self, lead: Lead) -> Lead:
        self.leads[lead.id] = lead
        return lead

    def lead_from_company(self, company: Company, **overrides) -> Lead:
        """Promote a Scout-found company into a worked, persisted lead."""
        return self.upsert_lead(self.build_lead_from_company(company, **overrides))


store = Store()

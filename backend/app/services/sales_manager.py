"""Sales Manager — handles the dialogue after a lead replies.

Simple/explicit answers would be auto-sent; ambiguous objections are escalated
to the founder with a ready draft (the human-in-the-loop gate).
"""
from __future__ import annotations

from typing import Optional

from ..models import ProposedReply
from ..store import store


class MockSalesManager:
    """Returns the pre-baked proposed reply. Later: Claude + product knowledge base."""

    def propose_reply(self, lead_id: str) -> Optional[ProposedReply]:
        conv = store.conversations.get(lead_id)
        return conv.proposed_reply if conv else None

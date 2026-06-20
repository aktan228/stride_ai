"""Email sending."""
from __future__ import annotations

import logging

from ..models import EmailDraft

log = logging.getLogger("stride.email")


class MockEmailService:
    """Logs the send and marks the draft as sent. Later: Gmail SMTP / API."""

    def send(self, draft: EmailDraft) -> EmailDraft:
        log.info("MOCK SEND → %s | %s", draft.company, draft.subject)
        draft.status = "sent"
        return draft

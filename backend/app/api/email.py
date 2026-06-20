"""Email draft: review, edit, and the human-in-the-loop approval gate."""
from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException

from ..models import EditDraftRequest, EmailDraft
from ..services import get_email_service
from ..services.interfaces import EmailService
from ..store import store

router = APIRouter(prefix="/api/leads", tags=["email"])


def _get_draft(lead_id: str) -> EmailDraft:
    draft = store.drafts.get(lead_id)
    if not draft:
        raise HTTPException(status_code=404, detail="draft not found")
    return draft


@router.get("/{lead_id}/draft")
def get_draft(lead_id: str) -> EmailDraft:
    return _get_draft(lead_id)


@router.post("/{lead_id}/draft/edit")
def edit_draft(lead_id: str, body: EditDraftRequest) -> EmailDraft:
    draft = _get_draft(lead_id)
    if body.subject is not None:
        draft.subject = body.subject
    if body.body is not None:
        draft.body = body.body
    return draft


@router.post("/{lead_id}/draft/approve")
def approve_draft(lead_id: str, email: EmailService = Depends(get_email_service)):
    """Send the outreach, then promote the company to a lead.

    In the demo the prospect has already replied with an objection, so the new
    lead lands as 'attention' (the next human-in-the-loop step).
    """
    draft = _get_draft(lead_id)
    email.send(draft)

    company = store.company(lead_id)
    conv = store.conversations.get(lead_id)
    last_inbound = next(
        (m.text for m in reversed(conv.messages) if m.sender == "lead"), None
    ) if conv else None

    if company:
        lead = store.lead_from_company(
            company,
            status="attention",
            last_message=last_inbound or "Получен ответ от лида",
            last_kind="chat",
            highlight=True,
        )
    else:
        lead = store.leads.get(lead_id)

    return {"draft": draft, "lead": lead}

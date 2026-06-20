"""Conversation thread + approval of the Sales Manager's proposed reply."""
from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException

from ..models import Conversation, ConversationMessage
from ..services import get_sales_manager
from ..services.interfaces import SalesManager
from ..store import store

router = APIRouter(prefix="/api/leads", tags=["conversation"])


def _get_conversation(lead_id: str) -> Conversation:
    conv = store.conversations.get(lead_id)
    if not conv:
        raise HTTPException(status_code=404, detail="conversation not found")
    return conv


@router.get("/{lead_id}/conversation")
def get_conversation(lead_id: str) -> Conversation:
    return _get_conversation(lead_id)


@router.post("/{lead_id}/conversation/approve")
def approve_reply(lead_id: str, sm: SalesManager = Depends(get_sales_manager)) -> Conversation:
    """Approve the proposed reply: send it, then the lead agrees to a meeting."""
    conv = _get_conversation(lead_id)
    reply = conv.proposed_reply

    if reply:
        reply.status = "sent"
        conv.messages.append(
            ConversationMessage(
                id=f"m{len(conv.messages) + 1}", lead_id=lead_id,
                sender="stride", text=reply.proposed_response, ts="14:12",
            )
        )
    # The lead agrees and asks for slots — moves the demo toward scheduling.
    agree_text = "Отлично, давайте созвонимся. Пришлите удобные слоты."
    conv.messages.append(
        ConversationMessage(
            id=f"m{len(conv.messages) + 1}", lead_id=lead_id,
            sender="lead", text=agree_text, ts="14:15",
        )
    )
    for m in conv.messages:
        m.needs_approval = False
    conv.proposed_reply = None

    lead = store.leads.get(lead_id)
    if lead:
        lead.status = "in_dialog"
        lead.last_message = agree_text
        lead.last_kind = "forum"
        lead.highlight = False

    return conv

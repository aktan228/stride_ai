"""Scheduling: available slots and booking."""
from __future__ import annotations

from fastapi import APIRouter, Depends

from ..models import BookRequest, Meeting, Slot
from ..services import get_calendar_service
from ..services.interfaces import CalendarService
from ..store import store

router = APIRouter(prefix="/api/leads", tags=["scheduler"])


@router.get("/{lead_id}/slots")
def get_slots(lead_id: str, cal: CalendarService = Depends(get_calendar_service)):
    slots, timezone = cal.get_slots()
    return {"slots": slots, "timezone": timezone}


@router.post("/{lead_id}/book")
def book(lead_id: str, body: BookRequest,
         cal: CalendarService = Depends(get_calendar_service)) -> Meeting:
    lead = store.leads.get(lead_id)
    company = store.company(lead_id)
    company_name = lead.company if lead else (company.name if company else lead_id)

    meeting = cal.book(lead_id, body.slot_id, company_name)

    if lead:
        lead.status = "meeting_set"
        lead.last_activity = f"Встреча: {meeting.datetime}"
        lead.last_kind = "event"
        lead.last_message = None

    return meeting

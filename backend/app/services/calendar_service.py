"""Meeting scheduling."""
from __future__ import annotations

import uuid

from ..models import Meeting, Slot
from ..store import store


class MockCalendarService:
    """Slots come from ``slots.json``; booking just records a meeting.

    Later: Google Calendar ``freebusy.query`` to compute real free slots and a
    real event creation.
    """

    def get_slots(self) -> tuple[list[Slot], str]:
        return list(store.slots), store.timezone

    def book(self, lead_id: str, slot_id: str, company: str) -> Meeting:
        slot = next((s for s in store.slots if s.id == slot_id), None)
        when = f"{slot.day} {slot.time}" if slot else "—"
        meeting = Meeting(
            id=str(uuid.uuid4())[:8],
            lead_id=lead_id,
            company=company,
            datetime=when,
            timezone=store.timezone,
        )
        store.meetings[lead_id] = meeting
        return meeting

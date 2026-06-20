"""Leads list + detail."""
from __future__ import annotations

from fastapi import APIRouter, HTTPException

from ..models import Lead
from ..store import store

router = APIRouter(prefix="/api/leads", tags=["leads"])


def resolve_lead(lead_id: str) -> Lead | None:
    """A real lead if it exists, else a synthesized view from a Scout company."""
    lead = store.leads.get(lead_id)
    if lead:
        return lead
    company = store.company(lead_id)
    if company:
        return store.build_lead_from_company(company)
    return None


@router.get("")
def list_leads() -> list[Lead]:
    return store.ordered_leads()


@router.get("/{lead_id}")
def get_lead(lead_id: str) -> Lead:
    lead = resolve_lead(lead_id)
    if not lead:
        raise HTTPException(status_code=404, detail="lead not found")
    return lead

"""Onboarding: capture the ICP and the product knowledge base."""
from __future__ import annotations

from fastapi import APIRouter

from ..models import ICPRequest, ProductRequest
from ..store import store

router = APIRouter(prefix="/api/onboarding", tags=["onboarding"])


@router.post("/icp")
def set_icp(body: ICPRequest):
    store.onboarding["icp"] = body.description
    return {"ok": True}


@router.post("/product")
def set_product(body: ProductRequest):
    store.onboarding["product"] = body.model_dump()
    return {"ok": True}

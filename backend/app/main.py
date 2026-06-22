"""Stride AI backend — FastAPI app entrypoint.

Run: ``uvicorn app.main:app --reload`` from the ``backend/`` directory.
"""
from __future__ import annotations

import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api import conversation, email, leads, onboarding, pipeline, scheduler
from .config import settings

logging.basicConfig(level=logging.INFO)

app = FastAPI(title="Stride AI API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health():
    return {"status": "ok", "use_mocks": settings.USE_MOCKS}


for module in (onboarding, pipeline, leads, email, conversation, scheduler):
    app.include_router(module.router)

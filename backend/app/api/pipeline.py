"""Live agent pipeline: scripted SSE stream (the demo showpiece)."""
from __future__ import annotations

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse

from ..services import get_orchestrator
from ..services.interfaces import Orchestrator
from ..store import store

router = APIRouter(prefix="/api/pipeline", tags=["pipeline"])


@router.post("/start")
def start():
    """Reset to a clean slate so the pipeline can be replayed for each demo."""
    store.reset()
    return {"ok": True}


@router.get("/stream")
async def stream(orchestrator: Orchestrator = Depends(get_orchestrator)):
    async def gen():
        async for event in orchestrator.run():
            yield f"data: {event.model_dump_json()}\n\n"

    return StreamingResponse(
        gen(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
            "Connection": "keep-alive",
        },
    )

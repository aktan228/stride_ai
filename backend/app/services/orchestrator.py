"""Orchestrator — drives the live agent pipeline.

For the mock stage this is a *scripted* async generator: it walks Scout →
Analyst → Writer and yields :class:`AgentEvent` frames with deliberate delays
so the front-end pipeline animation reads well on stage. Later this becomes the
real sequence of agent calls.
"""
from __future__ import annotations

import asyncio
from typing import AsyncIterator

from ..config import settings
from ..models import AgentEvent
from .analyst import MockAnalyst
from .scout import MockScout
from .writer import MockWriter


class MockOrchestrator:
    def __init__(self, scout=None, analyst=None, writer=None) -> None:
        self.scout = scout or MockScout()
        self.analyst = analyst or MockAnalyst()
        self.writer = writer or MockWriter()

    async def run(self) -> AsyncIterator[AgentEvent]:
        d = settings.PIPELINE_STEP_DELAY
        companies = self.scout.find_companies()

        # --- Scout -------------------------------------------------------
        yield AgentEvent(type="agent_active", agent="scout")
        for msg in (
            "Скаут ищет компании, соответствующие вашему профилю...",
            "Скаут фильтрует быстрорастущие компании...",
        ):
            yield AgentEvent(type="status", agent="scout", message=msg)
            await asyncio.sleep(d)

        for c in companies:
            yield AgentEvent(type="company_found", agent="scout", payload=c.model_dump())
            await asyncio.sleep(d * 0.6)

        yield AgentEvent(
            type="status", agent="scout",
            message="Скаут проверяет контактную информацию лидов...",
        )
        await asyncio.sleep(d)

        # --- Analyst -----------------------------------------------------
        yield AgentEvent(type="agent_active", agent="analyst")
        yield AgentEvent(
            type="status", agent="analyst",
            message="Аналитик оценивает релевантность найденных компаний...",
        )
        await asyncio.sleep(d)
        for c in companies:
            scored = self.analyst.score(c)
            if scored.qualified:
                yield AgentEvent(
                    type="scored", agent="analyst",
                    payload={"id": scored.id, "name": scored.name,
                             "score": scored.score, "qualified": True},
                )
                await asyncio.sleep(d * 0.6)

        # --- Writer ------------------------------------------------------
        top = next((c for c in companies if c.qualified), companies[0])
        yield AgentEvent(type="agent_active", agent="writer")
        yield AgentEvent(
            type="status", agent="writer",
            message=f"Копирайтер пишет персонализированное письмо для {top.name}...",
        )
        await asyncio.sleep(d)
        draft = self.writer.draft_email(top)
        yield AgentEvent(
            type="draft_ready", agent="writer",
            message="Черновик письма готов к проверке.",
            payload={"lead_id": draft.lead_id, "company": draft.company},
        )
        await asyncio.sleep(d * 0.5)

        yield AgentEvent(type="done", message="Готово. Проверьте черновик письма.")

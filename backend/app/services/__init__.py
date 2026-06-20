"""Service factories — the single ``USE_MOCKS`` switch point.

FastAPI routes depend on these getters (via ``Depends``), so swapping mocks for
real implementations later is a change confined to this file.
"""
from __future__ import annotations

from ..config import settings
from .analyst import MockAnalyst
from .calendar_service import MockCalendarService
from .email_service import MockEmailService
from .interfaces import (
    Analyst,
    CalendarService,
    EmailService,
    Orchestrator,
    SalesManager,
    ScoutDataSource,
    Writer,
)
from .orchestrator import MockOrchestrator
from .sales_manager import MockSalesManager
from .scout import MockScout
from .writer import MockWriter

_NOT_WIRED = "Real implementation not wired yet (USE_MOCKS=False). See plan §'Дальше'."


def get_scout() -> ScoutDataSource:
    if settings.USE_MOCKS:
        return MockScout()
    raise NotImplementedError(_NOT_WIRED)


def get_analyst() -> Analyst:
    if settings.USE_MOCKS:
        return MockAnalyst()
    raise NotImplementedError(_NOT_WIRED)


def get_writer() -> Writer:
    if settings.USE_MOCKS:
        return MockWriter()
    raise NotImplementedError(_NOT_WIRED)


def get_sales_manager() -> SalesManager:
    if settings.USE_MOCKS:
        return MockSalesManager()
    raise NotImplementedError(_NOT_WIRED)


def get_email_service() -> EmailService:
    if settings.USE_MOCKS:
        return MockEmailService()
    raise NotImplementedError(_NOT_WIRED)


def get_calendar_service() -> CalendarService:
    if settings.USE_MOCKS:
        return MockCalendarService()
    raise NotImplementedError(_NOT_WIRED)


def get_orchestrator() -> Orchestrator:
    if settings.USE_MOCKS:
        return MockOrchestrator()
    raise NotImplementedError(_NOT_WIRED)

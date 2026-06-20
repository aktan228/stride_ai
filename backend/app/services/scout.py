"""Scout — finds companies matching the ICP."""
from __future__ import annotations

from ..models import Company
from ..store import store


class MockScout:
    """Returns the curated dataset. Later: live web search (Tavily / Claude)."""

    def find_companies(self) -> list[Company]:
        return list(store.companies)

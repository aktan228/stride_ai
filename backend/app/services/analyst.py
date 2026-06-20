"""Analyst — scores relevance / buying readiness."""
from __future__ import annotations

from ..models import Company


class MockAnalyst:
    """Uses pre-baked scores from the dataset.

    Later: a single Claude (`claude-sonnet-4-6`) call per company producing a
    score plus a relevance explanation.
    """

    def score(self, company: Company) -> Company:
        if company.score is not None and company.qualified is None:
            company.qualified = company.score >= 7.0
        return company

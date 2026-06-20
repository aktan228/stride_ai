"""Writer — generates the personalized outreach email."""
from __future__ import annotations

from ..models import Company, EmailDraft
from ..store import store


class MockWriter:
    """Returns the pre-written draft for known companies, otherwise a simple
    templated one. Later: Claude (`claude-opus-4-8`).
    """

    def draft_email(self, company: Company) -> EmailDraft:
        existing = store.drafts.get(company.id)
        if existing:
            return existing

        draft = EmailDraft(
            id=f"draft-{company.id}",
            lead_id=company.id,
            company=company.name,
            subject=f"{company.name}: идея по ускорению роста",
            body=(
                "Здравствуйте!\n\n"
                f"Обратил внимание на {company.name} — {company.description} "
                "Похоже, сейчас удачный момент усилить работу с входящими лидами.\n\n"
                "Stride AI берёт на себя поиск, квалификацию и первичный диалог с "
                "клиентами. Будет полезно показать на 15-минутном звонке?\n\n"
                "С наилучшими пожеланиями,\nКоманда Stride AI"
            ),
        )
        store.drafts[company.id] = draft
        return draft

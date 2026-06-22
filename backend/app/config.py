"""Application settings.

The whole backend is built around a single seam: ``USE_MOCKS``. While ``True``
(the hackathon default) every agent/integration is served by a deterministic
mock implementation seeded from ``app/data/*.json``. Flipping it to ``False``
later is where real Claude calls + Gmail/Calendar would plug in.
"""
from __future__ import annotations

import os


class Settings:
    # Master switch: mocks now, real services later.
    USE_MOCKS: bool = os.getenv("USE_MOCKS", "true").lower() != "false"

    # CORS origins for local dev and deployed frontend.
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://stride-65hmgw3xw-aktan228s-projects.vercel.app",
    ]
    if env := os.getenv("CORS_ORIGINS"):
        CORS_ORIGINS = [origin.strip() for origin in env.split(",") if origin.strip()]

    # Pacing (seconds) for the scripted live pipeline so the demo reads well.
    PIPELINE_STEP_DELAY: float = float(os.getenv("PIPELINE_STEP_DELAY", "1.1"))


settings = Settings()

"""Quick end-to-end smoke test of the mock backend (no server needed).

Run from backend/:  .venv\\Scripts\\python.exe smoke_test.py
"""
import asyncio
import json

from fastapi.testclient import TestClient

from app.main import app
from app.services import get_orchestrator

client = TestClient(app)


def check(label, cond):
    print(("PASS" if cond else "FAIL"), "-", label)
    assert cond, label


# health
r = client.get("/api/health")
check("health ok", r.status_code == 200 and r.json()["use_mocks"] is True)

# seeded leads
r = client.get("/api/leads")
leads = r.json()
check("6 seeded leads", len(leads) == 6)
check("DataNexus present", any(l["company"] == "DataNexus Corp" for l in leads))

# pipeline stream yields a scripted run ending in draft_ready + done
async def collect():
    return [e async for e in get_orchestrator().run()]

events = asyncio.run(collect())
types = [e.type for e in events]
check("pipeline finds companies", types.count("company_found") == 5)
check("pipeline scores qualified", types.count("scored") == 3)
check("pipeline draft_ready", "draft_ready" in types)
check("pipeline done last", types[-1] == "done")

# reset for a clean flow
client.post("/api/pipeline/start")

# hero flow: draft -> approve -> conversation -> approve -> slots -> book
r = client.get("/api/leads/acme/draft")
check("acme draft", r.status_code == 200 and "Роадмап" in r.json()["subject"])

r = client.post("/api/leads/acme/draft/approve")
body = r.json()
check("approve sends draft", body["draft"]["status"] == "sent")
check("acme promoted to attention", body["lead"]["status"] == "attention")
check("acme score_100=94", body["lead"]["score_100"] == 94)

r = client.get("/api/leads")
check("acme on top of leads", r.json()[0]["id"] == "acme")

r = client.get("/api/leads/acme/conversation")
conv = r.json()
check("conversation has proposed reply", conv["proposed_reply"] is not None)
check("3 seeded messages", len(conv["messages"]) == 3)

r = client.post("/api/leads/acme/conversation/approve")
conv = r.json()
check("reply cleared after approve", conv["proposed_reply"] is None)
check("messages grew to 5", len(conv["messages"]) == 5)

r = client.get("/api/leads/acme/slots")
slots = r.json()
check("8 slots", len(slots["slots"]) == 8)
check("timezone present", slots["timezone"] == "UTC -5")

r = client.post("/api/leads/acme/book", json={"slot_id": "s2"})
meeting = r.json()
check("booked Пн 14:00", meeting["datetime"] == "Пн 14:00")

r = client.get("/api/leads/acme")
check("acme now meeting_set", r.json()["status"] == "meeting_set")

print("\nALL SMOKE CHECKS PASSED")
